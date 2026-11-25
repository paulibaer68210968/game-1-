import { ART } from './art.js';
import { copyFor } from './localization.js';
import { renovationVariant } from './progression.js';

function sprite(className, src, alt = '') {
  const image = document.createElement('img');
  image.className = className;
  image.src = src;
  image.alt = alt;
  image.draggable = false;
  image.decoding = 'async';
  return image;
}

function addSprite(parent, className, src) {
  const image = sprite(className, src);
  parent.appendChild(image);
  return image;
}

function renderGarden(container, save, copy) {
  const path = ['moss', 'amber'].includes(renovationVariant(save, 'path')) ? renovationVariant(save, 'path') : '';
  const flowers = ['sunflower', 'wild'].includes(renovationVariant(save, 'flowers')) ? renovationVariant(save, 'flowers') : '';
  const tree = ['cherry', 'oak'].includes(renovationVariant(save, 'tree')) ? renovationVariant(save, 'tree') : '';
  const bench = ['oak', 'sage'].includes(renovationVariant(save, 'bench')) ? renovationVariant(save, 'bench') : '';
  const fountain = ['blue', 'rose'].includes(renovationVariant(save, 'fountain')) ? renovationVariant(save, 'fountain') : '';
  const shed = renovationVariant(save, 'shed') === 'neat' ? 'neat' : '';
  container.innerHTML = `
    <div class="diorama diorama-garden ${path ? `has-path path-${path}` : ''} ${tree ? 'has-tree' : ''} ${flowers ? 'has-flowers' : ''} ${bench ? `has-bench bench-${bench}` : ''} ${fountain ? `has-fountain fountain-${fountain}` : ''} ${shed ? 'has-shed' : ''}" role="img" aria-label="${copy.gardenAlt}">
      <div class="scene-garden-path" aria-hidden="true"></div>
      <div class="scene-shed" aria-hidden="true"><span class="shed-roof"></span><span class="shed-door"></span><span class="shed-tools"></span></div>
      <span class="scene-caption-tag">${copy.sceneGarden}</span>
    </div>`;

  const scene = container.querySelector('.diorama-garden');
  scene.style.setProperty('--scene-art', `url("${ART.gardenScene}")`);
  if (tree) addSprite(scene, `renovation-sprite garden-tree tree-${tree}`, tree === 'cherry' ? ART.renovatedCherry : ART.renovatedOak);
  if (flowers) addSprite(scene, 'renovation-sprite garden-flowers', flowers === 'sunflower' ? ART.renovatedSunflowers : ART.renovatedWildflowers);
  if (bench) addSprite(scene, `renovation-sprite garden-bench ${bench === 'sage' ? 'bench-sage' : ''}`, ART.renovatedBench);
  if (fountain) addSprite(scene, `renovation-sprite garden-fountain ${fountain === 'rose' ? 'fountain-rose' : ''}`, ART.renovatedFountain);
}

function renderVilla(container, save, copy) {
  const wallpaper = ['sage', 'rose'].includes(renovationVariant(save, 'wallpaper')) ? renovationVariant(save, 'wallpaper') : '';
  const sofa = ['blue', 'moss'].includes(renovationVariant(save, 'sofa')) ? renovationVariant(save, 'sofa') : '';
  const fireplace = renovationVariant(save, 'fireplace') === 'warm' ? 'warm' : '';
  container.innerHTML = `
    <div class="diorama diorama-villa ${wallpaper ? `wallpaper-${wallpaper}` : ''} ${sofa ? `has-sofa sofa-${sofa}` : ''} ${fireplace ? 'has-fireplace' : ''}" role="img" aria-label="${copy.villaAlt}">
      <div class="renovated-wallpaper" aria-hidden="true"></div>
      <div class="renovated-rug" aria-hidden="true"></div>
      <span class="scene-caption-tag">${copy.sceneVilla}</span>
    </div>`;

  const scene = container.querySelector('.diorama-villa');
  scene.style.setProperty('--scene-art', `url("${ART.villaScene}")`);
  if (fireplace) addSprite(scene, 'renovation-sprite villa-fireplace', ART.renovatedFireplace);
  if (sofa) addSprite(scene, `renovation-sprite villa-sofa ${sofa === 'blue' ? 'sofa-blue' : ''}`, ART.renovatedSofa);
}

export function renderGardenScene(container, save, language = 'de') {
  const copy = copyFor(language);
  if (save.activeScene === 'villa') renderVilla(container, save, copy);
  else renderGarden(container, save, copy);
}
