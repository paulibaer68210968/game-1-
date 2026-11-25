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

function addSprite(parent, className, src, alt = '') {
  const image = sprite(className, src, alt);
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
    <div class="diorama diorama-garden ${path ? `has-path path-${path}` : ''} ${tree ? 'has-tree' : ''} ${bench ? `has-bench bench-${bench}` : ''} ${fountain ? `has-fountain fountain-${fountain}` : ''} ${shed ? 'has-shed' : ''}" role="img" aria-label="${copy.gardenAlt}">
      <div class="garden-sky"><span class="scene-sun"></span><span class="scene-cloud cloud-one"></span><span class="scene-cloud cloud-two"></span></div>
      <div class="scene-villa" aria-hidden="true"><div class="villa-roof"></div><div class="villa-gable"></div><div class="villa-wall"><span class="villa-window window-left"></span><span class="villa-door"></span><span class="villa-window window-right"></span></div><div class="villa-step"></div></div>
      <div class="garden-hill hill-back"></div><div class="garden-hill hill-front"></div>
      <div class="garden-ground"></div>
      <div class="garden-path" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
      <div class="garden-tree tree-back" aria-hidden="true"></div><div class="garden-tree tree-front" aria-hidden="true"></div>
      <div class="garden-bush bush-left" aria-hidden="true"></div><div class="garden-bush bush-right" aria-hidden="true"></div>
      <div class="garden-bed bed-left" aria-hidden="true"></div><div class="garden-bed bed-right" aria-hidden="true"></div>
      <div class="garden-fountain" aria-hidden="true"><span class="fountain-water"></span></div>
      <div class="garden-bench" aria-hidden="true"><span></span><i></i><i></i></div>
      <div class="garden-shed" aria-hidden="true"><span class="shed-door"></span><span class="shed-tools"></span></div>
      <span class="scene-butterfly butterfly-one" aria-hidden="true">✦</span><span class="scene-butterfly butterfly-two" aria-hidden="true">✦</span>
      <span class="scene-caption-tag">${copy.sceneGarden}</span>
    </div>`;
  const scene = container.querySelector('.diorama-garden');
  addSprite(scene, `scene-sprite tree-sprite tree-main ${tree === 'cherry' ? 'is-blossom' : ''}`, tree === 'cherry' ? ART.cherryTree : ART.oakTree);
  addSprite(scene, 'scene-sprite tree-sprite tree-secondary', tree === 'oak' ? ART.cherryTree : ART.oakTree);
  addSprite(scene, 'scene-sprite bush-sprite bush-one', ART.bush);
  addSprite(scene, 'scene-sprite bush-sprite bush-two', ART.bush);
  if (flowers) {
    const bedArt = flowers === 'sunflower' ? ART.sunflower : ART.flowerBed;
    addSprite(scene, 'scene-sprite flower-sprite flower-one', bedArt);
    addSprite(scene, 'scene-sprite flower-sprite flower-two', flowers === 'sunflower' ? ART.sunflower : ART.flowerBed);
  }
}

function renderVilla(container, save, copy) {
  const wallpaper = ['sage', 'rose'].includes(renovationVariant(save, 'wallpaper')) ? renovationVariant(save, 'wallpaper') : '';
  const sofa = ['blue', 'moss'].includes(renovationVariant(save, 'sofa')) ? renovationVariant(save, 'sofa') : '';
  const fireplace = renovationVariant(save, 'fireplace') === 'warm' ? 'warm' : '';
  container.innerHTML = `
    <div class="diorama diorama-villa ${wallpaper ? `wallpaper-${wallpaper}` : ''} ${sofa ? `sofa-${sofa}` : ''} ${fireplace ? 'has-fireplace' : ''}" role="img" aria-label="${copy.villaAlt}">
      <div class="room-wall"><span class="wall-border"></span><span class="room-picture"></span><span class="room-window-glow"></span></div>
      <div class="room-floor"><span class="floor-rug"></span></div>
      <div class="room-fireplace"><span class="fireplace-glow"></span></div>
      <div class="room-plant-pot"></div>
      <span class="scene-caption-tag">${copy.sceneVilla}</span>
    </div>`;
  const scene = container.querySelector('.diorama-villa');
  addSprite(scene, 'scene-sprite room-window', ART.windowFrame);
  addSprite(scene, 'scene-sprite room-curtains', ART.curtains);
  if (sofa) {
    addSprite(scene, `scene-sprite room-sofa ${sofa === 'moss' ? 'sofa-filter-moss' : ''}`, ART.sofa);
    addSprite(scene, 'scene-sprite room-rug', ART.rugRound);
    addSprite(scene, 'scene-sprite room-plant', ART.sunflower);
  }
}

export function renderGardenScene(container, save, language = 'de') {
  const copy = copyFor(language);
  if (save.activeScene === 'villa') renderVilla(container, save, copy);
  else renderGarden(container, save, copy);
}
