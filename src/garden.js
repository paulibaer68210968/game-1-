import { ART } from './art.js';
import { DECORATIONS } from './decorations.js';
import { copyFor } from './localization.js';
import { renovationVariant } from './progression.js';
import { clampScenePosition } from './scene-placement.js';

function sprite(className, src, alt = '') {
  const image = document.createElement('img');
  image.className = className;
  image.src = src;
  image.alt = alt;
  image.draggable = false;
  image.decoding = 'async';
  return image;
}

function addSprite(parent, className, src, alt = '') {
  const image = sprite(className, src, alt);
  parent.appendChild(image);
  return image;
}

function savedPosition(save, area, instance) {
  return save.decorations?.[area]?.find((item) => item.instance === instance) || null;
}

function makeMovable(element, save, area, instance, label, point = null, key = instance) {
  element.classList.add('scene-movable');
  element.dataset.sceneMovable = 'true';
  element.dataset.instance = instance;
  element.dataset.decorationKey = key;
  element.setAttribute('role', 'button');
  element.setAttribute('tabindex', '0');
  element.setAttribute('aria-label', `${label}. ${save.language === 'de' ? 'Zum Verschieben antippen und ziehen.' : 'Toque e arraste para mover.'}`);
  const placement = savedPosition(save, area, instance);
  const x = placement ? clampScenePosition(placement.x) : point?.x;
  const y = placement ? clampScenePosition(placement.y) : point?.y;
  if (x !== undefined && y !== undefined) {
    element.style.left = `${x}%`;
    element.style.top = `${y}%`;
    element.style.right = 'auto';
    element.style.bottom = 'auto';
    element.style.transform = 'translate(-50%, -50%)';
  }
  return element;
}

function renderPlacedDecorations(scene, save, area, copy) {
  for (const placement of save.decorations?.[area] || []) {
    if (!placement.instance.startsWith('placed-')) continue;
    const decoration = DECORATIONS[placement.key];
    if (!decoration || decoration.area !== area) continue;
    const image = sprite(`renovation-sprite placed-decoration ${decoration.className}`, decoration.asset, copy[decoration.label]);
    makeMovable(image, save, area, placement.instance, copy[decoration.label], null, placement.key);
    scene.appendChild(image);
  }
}

function renderGarden(container, save, copy, interactive) {
  const path = ['moss', 'amber'].includes(renovationVariant(save, 'path')) ? renovationVariant(save, 'path') : '';
  const flowers = ['sunflower', 'wild'].includes(renovationVariant(save, 'flowers')) ? renovationVariant(save, 'flowers') : '';
  const tree = ['cherry', 'oak'].includes(renovationVariant(save, 'tree')) ? renovationVariant(save, 'tree') : '';
  const bench = ['oak', 'sage'].includes(renovationVariant(save, 'bench')) ? renovationVariant(save, 'bench') : '';
  const fountain = ['blue', 'rose'].includes(renovationVariant(save, 'fountain')) ? renovationVariant(save, 'fountain') : '';
  const shed = renovationVariant(save, 'shed') === 'neat' ? 'neat' : '';
  container.innerHTML = `
    <div class="diorama diorama-garden ${interactive ? 'is-pannable' : ''} ${path ? `has-path path-${path}` : ''} ${tree ? 'has-tree' : ''} ${flowers ? 'has-flowers' : ''} ${bench ? `has-bench bench-${bench}` : ''} ${fountain ? `has-fountain fountain-${fountain}` : ''} ${shed ? 'has-shed' : ''}" role="${interactive ? 'group' : 'img'}" aria-label="${copy.gardenAlt}">
      <div class="scene-garden-path" aria-hidden="true"></div>
      <div class="scene-shed" aria-hidden="true"><span class="shed-roof"></span><span class="shed-door"></span><span class="shed-tools"></span></div>
      <span class="scene-caption-tag">${copy.sceneGarden}</span>
    </div>`;

  const scene = container.querySelector('.diorama-garden');
  scene.style.setProperty('--scene-art', `url("${ART.gardenScene}")`);
  const place = (element, instance, label, key) => interactive && makeMovable(element, save, 'garden', instance, label, null, key);
  if (tree) place(addSprite(scene, `renovation-sprite garden-tree tree-${tree}`, tree === 'cherry' ? ART.renovatedCherry : ART.renovatedOak, copy[tree === 'cherry' ? 'decorCherry' : 'decorOak']), 'renovation-tree', copy[tree === 'cherry' ? 'decorCherry' : 'decorOak'], `garden-${tree}`);
  if (flowers) place(addSprite(scene, 'renovation-sprite garden-flowers', flowers === 'sunflower' ? ART.renovatedSunflowers : ART.renovatedWildflowers, copy[flowers === 'sunflower' ? 'decorSunflowers' : 'decorFlowers']), 'renovation-flowers', copy[flowers === 'sunflower' ? 'decorSunflowers' : 'decorFlowers'], `garden-${flowers}`);
  if (bench) place(addSprite(scene, `renovation-sprite garden-bench ${bench === 'sage' ? 'bench-sage' : ''}`, ART.renovatedBench, copy.decorBench), 'renovation-bench', copy.decorBench, 'garden-bench');
  if (fountain) place(addSprite(scene, `renovation-sprite garden-fountain ${fountain === 'rose' ? 'fountain-rose' : ''}`, ART.renovatedFountain, copy.decorFountain), 'renovation-fountain', copy.decorFountain, 'garden-fountain');
  if (interactive) renderPlacedDecorations(scene, save, 'garden', copy);
}

function renderVilla(container, save, copy, interactive) {
  const wallpaper = ['sage', 'rose'].includes(renovationVariant(save, 'wallpaper')) ? renovationVariant(save, 'wallpaper') : '';
  const sofa = ['blue', 'moss'].includes(renovationVariant(save, 'sofa')) ? renovationVariant(save, 'sofa') : '';
  const fireplace = renovationVariant(save, 'fireplace') === 'warm' ? 'warm' : '';
  container.innerHTML = `
    <div class="diorama diorama-villa ${interactive ? 'is-pannable' : ''} ${wallpaper ? `wallpaper-${wallpaper}` : ''} ${sofa ? `has-sofa sofa-${sofa}` : ''} ${fireplace ? 'has-fireplace' : ''}" role="${interactive ? 'group' : 'img'}" aria-label="${copy.villaAlt}">
      <div class="renovated-wallpaper" aria-hidden="true"></div>
      <div class="renovated-rug" aria-hidden="true"></div>
      <span class="scene-caption-tag">${copy.sceneVilla}</span>
    </div>`;

  const scene = container.querySelector('.diorama-villa');
  scene.style.setProperty('--scene-art', `url("${ART.villaScene}")`);
  if (interactive && wallpaper) scene.dataset.wallpaper = wallpaper;
  const place = (element, instance, label, key) => interactive && makeMovable(element, save, 'villa', instance, label, null, key);
  if (fireplace) place(addSprite(scene, 'renovation-sprite villa-fireplace', ART.renovatedFireplace, copy.decorFireplace), 'renovation-fireplace', copy.decorFireplace, 'villa-fireplace');
  if (sofa) place(addSprite(scene, `renovation-sprite villa-sofa ${sofa === 'blue' ? 'sofa-blue' : ''}`, ART.renovatedSofa, copy.decorSofa), 'renovation-sofa', copy.decorSofa, `villa-sofa-${sofa}`);
  if (interactive) renderPlacedDecorations(scene, save, 'villa', copy);
}

export function renderGardenScene(container, save, language = 'de') {
  const copy = copyFor(language);
  const interactive = Boolean(container.closest('.fullscreen-scene-canvas'));
  if (save.activeScene === 'villa') renderVilla(container, save, copy, interactive);
  else renderGarden(container, save, copy, interactive);
}
