import './styles.css';
import './match3.css';
import { mountMatch3 } from './match3.js';
import { renderGardenScene } from './garden.js';
import { copyFor, localized } from './localization.js';
import { ART } from './art.js';
import { decorationsForArea, getDecoration } from './decorations.js';
import { applyRenovation, initialVariant, isRenovated, tasksForArea } from './progression.js';
import { clampScenePosition, normalizeScenePan, panScene, pointOnScene, VILLA_PAN_LIMIT } from './scene-placement.js';

const SAVE_KEY = 'gertrudes-greinwald-garden-save-v2';
const LEGACY_SAVE_KEY = 'gertrudes-greinwald-garden-save-v1';
const DEFAULT_SAVE = Object.freeze({
  version: 2,
  stars: 0,
  puzzleLevel: 1,
  language: 'de',
  activeScene: 'garden',
  renovations: {},
  decorations: { garden: [], villa: [] },
  scenePan: { garden: { x: 0, y: 0 }, villa: { x: 0, y: 0 } },
  legacyDecor: [],
});

const appRoot = document.querySelector('#gameRoot');
const match3Root = document.querySelector('#match3Root');
let match3 = null;
let renovationFullscreen = false;
let fullscreenTasksCollapsed = false;
let toastTimer = null;
const selectedVariants = new Map();
const expandedTasks = new Set();
let activePlacement = null;

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
    decorations: {
      garden: normalizeDecorations(value.decorations?.garden, 'garden'),
      villa: normalizeDecorations(value.decorations?.villa, 'villa'),
    },
    scenePan: {
      garden: normalizeScenePan(value.scenePan?.garden),
      villa: normalizeScenePan(value.scenePan?.villa, VILLA_PAN_LIMIT),
    },
    legacyDecor: Array.isArray(value.legacyDecor) ? value.legacyDecor : [],
  };
}

function normalizeDecorations(items, area) {
  if (!Array.isArray(items)) return [];
  return items.slice(0, 60).flatMap((item) => {
    if (!item || typeof item !== 'object' || typeof item.instance !== 'string') return [];
    if (!/^[a-z0-9-]{1,96}$/i.test(item.instance) || !getDecoration(item.key, area)) return [];
    return [{ instance: item.instance, key: item.key, x: clampScenePosition(item.x), y: clampScenePosition(item.y) }];
  });
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
    flowers: save.renovations.flowers?.variant === 'sunflower' ? ART.renovatedSunflowers : ART.renovatedWildflowers,
    tree: save.renovations.tree?.variant === 'oak' ? ART.renovatedOak : ART.renovatedCherry,
    bench: ART.renovatedBench,
    fountain: ART.renovatedFountain,
    shed: ART.shovel,
    wallpaper: ART.windowFrame,
    sofa: ART.renovatedSofa,
    fireplace: ART.renovatedFireplace,
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

function renderDecorationTray(copy, area) {
  const items = decorationsForArea(area).map((item) => `
    <button class="decoration-choice" type="button" data-place-decoration="${item.id}" aria-label="${copy[item.label]}">
      <img src="${item.asset}" alt="" draggable="false"><span>${copy[item.label]}</span>
    </button>`).join('');
  const wallpaper = area === 'villa' ? `
    <div class="wallpaper-tools" role="group" aria-label="${copy.wallpaperTool}">
      <strong>${copy.wallpaperTool}</strong>
      <button class="wallpaper-choice${activePlacement?.type === 'wallpaper' && activePlacement.variant === 'sage' ? ' is-selected' : ''}" type="button" data-place-wallpaper="sage" aria-pressed="${activePlacement?.type === 'wallpaper' && activePlacement.variant === 'sage'}">${copy.wallpaperSage}</button>
      <button class="wallpaper-choice${activePlacement?.type === 'wallpaper' && activePlacement.variant === 'rose' ? ' is-selected' : ''}" type="button" data-place-wallpaper="rose" aria-pressed="${activePlacement?.type === 'wallpaper' && activePlacement.variant === 'rose'}">${copy.wallpaperRose}</button>
    </div>` : '';
  return `<section class="placement-tools" aria-labelledby="placementHeading">
    <h3 id="placementHeading">${copy.decorHeading}</h3>
    <p class="placement-help" data-placement-help>${activePlacement?.type === 'wallpaper' ? copy.wallpaperHint : copy.decorHelp}</p>
    ${wallpaper}
    <div class="decoration-tray">${items}</div>
  </section>`;
}

function renderFullscreen(copy, currentIsGarden) {
  appRoot.innerHTML = `
    <section class="renovation-fullscreen" role="dialog" aria-modal="true" aria-labelledby="fullscreenTitle">
      <div id="fullscreenSceneCanvas" class="fullscreen-scene-canvas"></div>
      <header class="fullscreen-topbar">
        <div class="fullscreen-topline">
          <button class="fullscreen-back" type="button" data-exit-fullscreen aria-label="${copy.backToEstate}"><span aria-hidden="true">‹</span><small>${copy.backToEstate}</small></button>
          <div class="fullscreen-title-block"><p class="fullscreen-kicker">${copy.title}</p><h1 id="fullscreenTitle">${currentIsGarden ? copy.gardenScene : copy.villaScene}</h1></div>
          <div class="fullscreen-stars" aria-label="${copy.stars}: ${save.stars}"><span aria-hidden="true">★</span><strong>${save.stars}</strong></div>
        </div>
        <div class="fullscreen-area-tabs" role="group" aria-label="${copy.sceneGarden} / ${copy.sceneVilla}">
          <button type="button" data-scene="garden" aria-pressed="${currentIsGarden}">${copy.garden}</button>
          <button type="button" data-scene="villa" aria-pressed="${!currentIsGarden}">${copy.villa}</button>
        </div>
      </header>
      <section class="fullscreen-task-panel${fullscreenTasksCollapsed ? ' is-collapsed' : ''}" aria-label="${currentIsGarden ? copy.gardenTasks : copy.villaTasks}">
        <button class="fullscreen-panel-toggle" type="button" data-toggle-task-panel aria-controls="fullscreen-task-content" aria-expanded="${!fullscreenTasksCollapsed}"><span aria-hidden="true">${fullscreenTasksCollapsed ? '⌃' : '⌄'}</span>${fullscreenTasksCollapsed ? copy.openTasks : copy.closeTasks}</button>
        <div class="fullscreen-task-content" id="fullscreen-task-content"${fullscreenTasksCollapsed ? ' hidden' : ''}>
          <div class="renovation-heading"><div><p class="section-kicker">${currentIsGarden ? copy.gardenTasks : copy.villaTasks}</p><h2 id="taskHeading">${copy.taskHeading}</h2></div><span class="star-reminder">★ ${save.stars}</span></div>
          <p class="task-hint">${copy.taskHint}</p>
          <div class="task-list" id="taskList"></div>
          ${renderDecorationTray(copy, save.activeScene)}
        </div>
      </section>
      <div class="game-toast" id="gameToast" role="status" aria-live="polite" aria-atomic="true"></div>
    </section>`;
  renderGardenScene(appRoot.querySelector('#fullscreenSceneCanvas'), save, save.language);
  const scene = appRoot.querySelector('.fullscreen-scene-canvas .diorama');
  if (scene) {
    const panLimit = save.activeScene === 'villa' ? VILLA_PAN_LIMIT : undefined;
    const pan = normalizeScenePan(save.scenePan[save.activeScene], panLimit);
    scene.style.setProperty('--scene-pan-x', `${pan.x * window.innerWidth}px`);
    scene.style.setProperty('--scene-pan-y', `${pan.y * window.innerHeight}px`);
    attachSceneGestures(appRoot.querySelector('#fullscreenSceneCanvas'), scene);
  }
  renderTasks(copy);
}

function saveSceneItemPosition(element, area, point) {
  const instance = element.dataset.instance;
  const key = element.dataset.decorationKey;
  if (!instance || !getDecoration(key, area)) return;
  const saved = save.decorations[area].find((item) => item.instance === instance);
  if (saved) Object.assign(saved, point);
  else save.decorations[area].push({ instance, key, x: point.x, y: point.y });
  persist();
}

function applyWallpaperAtWall(variant) {
  const saved = save.renovations.wallpaper;
  if (!saved && !applyRenovation(save, 'wallpaper', variant)) {
    showToast(copyFor(save.language).notEnough);
    return false;
  }
  if (saved) saved.variant = variant;
  activePlacement = null;
  persist();
  renderApp();
  showToast(copyFor(save.language).wallpaperPlaced);
  return true;
}

function attachSceneGestures(canvas, stage) {
  let gesture = null;
  canvas.addEventListener('pointerdown', (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    const movable = event.target.closest?.('[data-scene-movable="true"]');
    const rect = stage.getBoundingClientRect();
    const itemRect = movable?.getBoundingClientRect();
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, mode: movable ? 'item' : 'pan', movable, rect,
      offsetX: itemRect ? event.clientX - (itemRect.left + itemRect.width / 2) : 0,
      offsetY: itemRect ? event.clientY - (itemRect.top + itemRect.height / 2) : 0,
      startPan: { ...save.scenePan[save.activeScene] }, moved: false };
    canvas.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  });
  canvas.addEventListener('pointermove', (event) => {
    if (!gesture || gesture.id !== event.pointerId) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) > 4) gesture.moved = true;
    if (!gesture.moved) return;
    if (gesture.mode === 'item') {
      const point = pointOnScene(event.clientX - gesture.offsetX, event.clientY - gesture.offsetY, gesture.rect);
      Object.assign(gesture.movable.style, { left: `${point.x}%`, top: `${point.y}%`, right: 'auto', bottom: 'auto', transform: 'translate(-50%, -50%)' });
      gesture.movable.classList.add('is-being-moved');
      gesture.point = point;
    } else {
      const panLimit = save.activeScene === 'villa' ? VILLA_PAN_LIMIT : undefined;
      gesture.pan = panScene(gesture.startPan, dx, dy, window.innerWidth, window.innerHeight, panLimit);
      stage.style.setProperty('--scene-pan-x', `${gesture.pan.x * window.innerWidth}px`);
      stage.style.setProperty('--scene-pan-y', `${gesture.pan.y * window.innerHeight}px`);
    }
  });
  const finish = (event) => {
    if (!gesture || gesture.id !== event.pointerId) return;
    const done = gesture;
    gesture = null;
    if (done.mode === 'item' && done.moved && done.point) {
      done.movable.classList.remove('is-being-moved');
      saveSceneItemPosition(done.movable, save.activeScene, done.point);
    } else if (done.mode === 'pan' && done.moved && done.pan) {
      save.scenePan[save.activeScene] = done.pan;
      persist();
    } else if (done.mode === 'pan' && activePlacement?.type === 'wallpaper') {
      const point = pointOnScene(event.clientX, event.clientY, stage.getBoundingClientRect());
      if (save.activeScene === 'villa' && point.x >= 17 && point.x <= 96 && point.y >= 22 && point.y <= 69) applyWallpaperAtWall(activePlacement.variant);
    }
  };
  canvas.addEventListener('pointerup', finish);
  canvas.addEventListener('pointercancel', finish);
}

function renderApp() {
  if (!appRoot) return;
  const copy = copyFor(save.language);
  const currentIsGarden = save.activeScene === 'garden';
  if (renovationFullscreen) {
    document.body.classList.add('is-renovation-fullscreen');
    renderFullscreen(copy, currentIsGarden);
    return;
  }
  document.body.classList.remove('is-renovation-fullscreen');
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
          <div class="scene-preview-footer"><p class="scene-caption">${currentIsGarden ? copy.gardenCaption : copy.villaCaption}</p><button id="openFullscreen" class="scene-open-button" type="button" data-open-fullscreen><span aria-hidden="true">⛶</span>${copy.openRenovation}</button></div>
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
  const exitFullscreen = event.target.closest('[data-exit-fullscreen]');
  if (exitFullscreen) {
    renovationFullscreen = false;
    renderApp();
    appRoot.querySelector('#openFullscreen')?.focus({ preventScroll: true });
    return;
  }

  const taskPanelToggle = event.target.closest('[data-toggle-task-panel]');
  if (taskPanelToggle) {
    fullscreenTasksCollapsed = !fullscreenTasksCollapsed;
    renderApp();
    appRoot.querySelector('[data-toggle-task-panel]')?.focus({ preventScroll: true });
    return;
  }

  const openFullscreen = event.target.closest('[data-open-fullscreen]');
  if (openFullscreen) {
    renovationFullscreen = true;
    renderApp();
    appRoot.querySelector('[data-exit-fullscreen]')?.focus({ preventScroll: true });
    return;
  }

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
      if (sceneButton.matches('[data-nav]')) renovationFullscreen = true;
      persist();
      renderApp();
    }
    return;
  }

  const wallpaperChoice = event.target.closest('[data-place-wallpaper]');
  if (wallpaperChoice) {
    activePlacement = { type: 'wallpaper', variant: wallpaperChoice.dataset.placeWallpaper };
    renderApp();
    return;
  }

  const decorationChoice = event.target.closest('[data-place-decoration]');
  if (decorationChoice) {
    const item = getDecoration(decorationChoice.dataset.placeDecoration, save.activeScene);
    if (!item) return;
    if (save.decorations[save.activeScene].length >= 60) { showToast(copyFor(save.language).decorLimit); return; }
    const offset = (save.decorations[save.activeScene].length % 5) * 3;
    save.decorations[save.activeScene].push({ instance: `placed-${item.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, key: item.id, x: 50 + offset, y: save.activeScene === 'garden' ? 62 - offset : 76 - offset });
    activePlacement = null;
    persist();
    renderApp();
    showToast(copyFor(save.language).decorAdded);
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

appRoot.addEventListener('keydown', (event) => {
  const movable = event.target.closest?.('[data-scene-movable="true"]');
  if (!movable || !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  const rect = movable.closest('.diorama').getBoundingClientRect();
  const x = Number.parseFloat(movable.style.left) || 50;
  const y = Number.parseFloat(movable.style.top) || 50;
  const delta = event.shiftKey ? 5 : 1;
  const next = { x: clampScenePosition(x + (event.key === 'ArrowLeft' ? -delta : event.key === 'ArrowRight' ? delta : 0)), y: clampScenePosition(y + (event.key === 'ArrowUp' ? -delta : event.key === 'ArrowDown' ? delta : 0)) };
  Object.assign(movable.style, { left: `${next.x}%`, top: `${next.y}%`, right: 'auto', bottom: 'auto', transform: 'translate(-50%, -50%)' });
  saveSceneItemPosition(movable, save.activeScene, next);
});

window.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || !renovationFullscreen) return;
  renovationFullscreen = false;
  renderApp();
});

renderApp();
