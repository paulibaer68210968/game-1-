import './styles.css';
import './match3.css';
import { mountMatch3 } from './match3.js';
import { renderGardenScene } from './garden.js';
import { copyFor, localized } from './localization.js';
import { ART } from './art.js';
import { applyRenovation, initialVariant, isRenovated, tasksForArea } from './progression.js';

const SAVE_KEY = 'gertrudes-greinwald-garden-save-v2';
const LEGACY_SAVE_KEY = 'gertrudes-greinwald-garden-save-v1';
const DEFAULT_SAVE = Object.freeze({
  version: 2,
  stars: 0,
  puzzleLevel: 1,
  language: 'de',
  activeScene: 'garden',
  renovations: {},
  legacyDecor: [],
});

const appRoot = document.querySelector('#gameRoot');
const match3Root = document.querySelector('#match3Root');
let match3 = null;
let toastTimer = null;
const selectedVariants = new Map();
const expandedTasks = new Set();

function validLanguage(language) {
  return language === 'pt-BR' ? 'pt-BR' : 'de';
}

function normalizedSave(value = {}) {
  const activeScene = value.activeScene === 'villa' ? 'villa' : 'garden';
  const renovations = value.renovations && typeof value.renovations === 'object' ? value.renovations : {};
  return {
    ...DEFAULT_SAVE,
    ...value,
    version: 2,
    stars: Math.max(0, Math.floor(Number(value.stars) || 0)),
    puzzleLevel: Math.max(1, Math.floor(Number(value.puzzleLevel) || Number(value.level) || 1)),
    language: validLanguage(value.language),
    activeScene,
    renovations: { ...renovations },
    legacyDecor: Array.isArray(value.legacyDecor) ? value.legacyDecor : [],
  };
}

function migrateLegacySave(oldSave) {
  const migrated = normalizedSave(oldSave);
  const oldRestored = oldSave.restored || {};
  if (oldRestored.fountain && !migrated.renovations.fountain) migrated.renovations.fountain = { variant: 'blue' };
  if (oldRestored.bench && !migrated.renovations.bench) migrated.renovations.bench = { variant: 'oak' };
  const legacyDecor = [
    ...(Array.isArray(oldSave.owned) ? oldSave.owned : []),
    ...(Array.isArray(oldSave.placedItems) ? oldSave.placedItems.map((item) => item?.key).filter(Boolean) : []),
  ];
  if (legacyDecor.includes('flowerBed') && !migrated.renovations.flowers) migrated.renovations.flowers = { variant: 'wild' };
  migrated.legacyDecor = [...new Set([...migrated.legacyDecor, ...legacyDecor])];
  return migrated;
}

function readSave() {
  try {
    const current = localStorage.getItem(SAVE_KEY);
    if (current) return normalizedSave(JSON.parse(current));
    const old = localStorage.getItem(LEGACY_SAVE_KEY);
    if (old) {
      const migrated = migrateLegacySave(JSON.parse(old));
      localStorage.setItem(SAVE_KEY, JSON.stringify(migrated));
      return migrated;
    }
  } catch (error) {
    console.warn('Der Spielstand konnte nicht gelesen werden.', error);
  }
  return normalizedSave();
}

const save = readSave();

function persist() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  } catch (error) {
    console.warn('Der Spielstand konnte nicht gespeichert werden.', error);
    showToast('Speichern ist auf diesem Gerät gerade nicht verfügbar.');
  }
}

function showToast(message) {
  const toast = appRoot.querySelector('#gameToast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  if (toastTimer) window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2400);
}

function taskImage(id) {
  const sources = {
    path: ART.bush,
    flowers: ART.flowerBed,
    tree: save.renovations.tree?.variant === 'oak' ? ART.oakTree : ART.cherryTree,
    bench: ART.sofa,
    fountain: ART.flowerBed,
    shed: ART.shovel,
    wallpaper: ART.windowFrame,
    sofa: ART.sofa,
    fireplace: ART.fireplace,
  };
  return sources[id] || ART.flowerBed;
}

function renderTaskCard(task, copy) {
  const complete = isRenovated(save, task.id);
  const card = document.createElement('details');
  card.className = `renovation-card${complete ? ' is-complete' : ''}`;
  card.open = !complete && expandedTasks.has(task.id);
  const summary = document.createElement('summary');
  summary.className = 'renovation-summary';
  const icon = document.createElement('img');
  icon.className = 'renovation-icon';
  icon.src = taskImage(task.id);
  icon.alt = '';
  icon.draggable = false;
  const details = document.createElement('div');
  details.className = 'renovation-details';
  const heading = document.createElement('h3');
  heading.textContent = copy[task.title];
  details.append(heading);
  summary.append(icon, details);

  if (complete) {
    const completed = document.createElement('span');
    completed.className = 'renovation-complete';
    completed.textContent = copy.done;
    summary.appendChild(completed);
    card.appendChild(summary);
    return card;
  }

  const cost = document.createElement('span');
  cost.className = 'renovation-cost';
  cost.textContent = `${task.cost} ★`;
  summary.appendChild(cost);
  summary.setAttribute('aria-expanded', String(card.open));
  card.appendChild(summary);

  const panel = document.createElement('div');
  panel.className = 'renovation-panel';
  const description = document.createElement('p');
  description.className = 'renovation-description';
  description.textContent = copy[task.description];
  panel.appendChild(description);

  const selected = selectedVariants.get(task.id) || initialVariant(task);
  if (task.variants.length > 1) {
    const choices = document.createElement('div');
    choices.className = 'renovation-choices';
    choices.setAttribute('role', 'group');
    choices.setAttribute('aria-label', copy.available);
    for (const variant of task.variants) {
      const choice = document.createElement('button');
      choice.type = 'button';
      choice.className = 'variant-chip';
      choice.dataset.variant = variant.id;
      choice.dataset.task = task.id;
      choice.setAttribute('aria-pressed', String(selected === variant.id));
      choice.textContent = copy[variant.label];
      choices.appendChild(choice);
    }
    panel.appendChild(choices);
  }

  const action = document.createElement('button');
  action.type = 'button';
  action.className = 'renovate-button';
  action.dataset.renovate = task.id;
  action.textContent = `${copy.renovate} · ${task.cost} ★`;
  panel.appendChild(action);
  card.appendChild(panel);
  card.addEventListener('toggle', () => {
    if (card.open) expandedTasks.add(task.id);
    else expandedTasks.delete(task.id);
    summary.setAttribute('aria-expanded', String(card.open));
  });
  return card;
}

function renderTasks(copy) {
  const taskList = appRoot.querySelector('#taskList');
  const tasks = tasksForArea(save.activeScene);
  taskList.replaceChildren();
  for (const task of tasks) taskList.appendChild(renderTaskCard(task, copy));
}

function renderApp() {
  if (!appRoot) return;
  const copy = copyFor(save.language);
  const currentIsGarden = save.activeScene === 'garden';
  appRoot.innerHTML = `
    <div class="app-shell">
      <header class="app-header">
        <span class="brand-mark" aria-hidden="true">✿</span>
        <div class="brand-copy"><p class="brand-kicker">${copy.tagline}</p><h1>${copy.title}</h1></div>
        <button class="language-button" id="languageButton" type="button" aria-label="${copy.language}">${save.language === 'de' ? 'DE' : 'PT'}</button>
      </header>
      <section class="status-strip" aria-label="${copy.level}, ${copy.stars}">
        <div class="status-group">
          <div class="status-pill level-pill"><span class="status-symbol" aria-hidden="true">✿</span><span><small>${copy.level}</small><strong>${save.puzzleLevel}</strong></span></div>
          <div class="status-pill star-pill"><span class="status-symbol" aria-hidden="true">★</span><span><small>${copy.stars}</small><strong>${save.stars}</strong></span></div>
        </div>
        <button class="play-button" id="playMatch3" type="button"><span class="play-button-icon" aria-hidden="true">◆</span><span><small>${copy.nextPuzzle} ${save.puzzleLevel}</small><strong>${copy.play}</strong></span><span class="play-arrow" aria-hidden="true">›</span></button>
      </section>
      <main class="home-content">
        <section class="scene-card" aria-labelledby="sceneTitle">
          <div class="scene-heading">
            <div><p class="section-kicker">${currentIsGarden ? copy.garden : copy.villa}</p><h2 id="sceneTitle">${currentIsGarden ? copy.gardenScene : copy.villaScene}</h2></div>
            <div class="scene-tabs" role="group" aria-label="${copy.sceneGarden} / ${copy.sceneVilla}">
              <button type="button" data-scene="garden" aria-pressed="${currentIsGarden}">${copy.garden}</button>
              <button type="button" data-scene="villa" aria-pressed="${!currentIsGarden}">${copy.villa}</button>
            </div>
          </div>
          <div id="sceneCanvas" class="scene-canvas"></div>
          <p class="scene-caption">${currentIsGarden ? copy.gardenCaption : copy.villaCaption}</p>
        </section>
        <section class="renovation-section" aria-labelledby="taskHeading">
          <div class="renovation-heading"><div><p class="section-kicker">${currentIsGarden ? copy.gardenTasks : copy.villaTasks}</p><h2 id="taskHeading">${copy.taskHeading}</h2></div><span class="star-reminder">★ ${save.stars}</span></div>
          <p class="task-hint">${copy.taskHint}</p>
          <div class="task-list" id="taskList"></div>
        </section>
      </main>
      <nav class="bottom-nav" aria-label="${copy.title}">
        <button type="button" data-nav="garden" class="${currentIsGarden ? 'is-active' : ''}" aria-current="${currentIsGarden ? 'page' : 'false'}"><span aria-hidden="true">✿</span><small>${copy.garden}</small></button>
        <button type="button" data-nav="villa" class="${!currentIsGarden ? 'is-active' : ''}" aria-current="${!currentIsGarden ? 'page' : 'false'}"><span aria-hidden="true">⌂</span><small>${copy.villa}</small></button>
        <button type="button" data-nav="puzzle"><span aria-hidden="true">◆</span><small>${copy.puzzle}</small></button>
      </nav>
      <div class="game-toast" id="gameToast" role="status" aria-live="polite" aria-atomic="true"></div>
    </div>`;
  renderGardenScene(appRoot.querySelector('#sceneCanvas'), save, save.language);
  renderTasks(copy);
}

function startMatch3() {
  if (match3) return;
  match3Root.hidden = false;
  match3 = mountMatch3(match3Root, {
    level: save.puzzleLevel,
    language: save.language,
    extraTools: Boolean(save.renovations.shed),
    onReward({ nextLevel }) {
      save.stars += 1;
      save.puzzleLevel = nextLevel;
      persist();
      renderApp();
      showToast(copyFor(save.language).reward);
    },
    onBack() {
      match3?.destroy();
      match3 = null;
      match3Root.hidden = true;
      renderApp();
    },
  });
}

appRoot.addEventListener('click', (event) => {
  const languageButton = event.target.closest('#languageButton');
  if (languageButton) {
    save.language = save.language === 'de' ? 'pt-BR' : 'de';
    persist();
    renderApp();
    match3?.setLanguage(save.language);
    return;
  }

  const sceneButton = event.target.closest('[data-scene], [data-nav]');
  if (sceneButton) {
    const scene = sceneButton.dataset.scene || sceneButton.dataset.nav;
    if (scene === 'puzzle') { startMatch3(); return; }
    if (scene === 'garden' || scene === 'villa') {
      save.activeScene = scene;
      persist();
      renderApp();
    }
    return;
  }

  const playButton = event.target.closest('#playMatch3');
  if (playButton) { startMatch3(); return; }

  const choice = event.target.closest('[data-variant][data-task]');
  if (choice) {
    selectedVariants.set(choice.dataset.task, choice.dataset.variant);
    expandedTasks.add(choice.dataset.task);
    renderApp();
    return;
  }

  const renovateButton = event.target.closest('[data-renovate]');
  if (renovateButton) {
    const taskId = renovateButton.dataset.renovate;
    const task = tasksForArea(save.activeScene).find((candidate) => candidate.id === taskId);
    if (!task) return;
    const variant = selectedVariants.get(task.id) || initialVariant(task);
    if (!applyRenovation(save, task.id, variant)) {
      showToast(copyFor(save.language).notEnough);
      return;
    }
    selectedVariants.delete(taskId);
    expandedTasks.delete(taskId);
    persist();
    renderApp();
    showToast(copyFor(save.language).renovated);
  }
});

renderApp();
