import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import './styles.css';
import './match3.css';
import { gardenData, scatterData } from './data/gardenData.js';
import { createWorld } from './world.js';
import { createUI } from './ui.js';
import { mountMatch3 } from './match3.js';

const SAVE_KEY = 'gertrudes-greinwald-garden-save-v1';
const DEFAULT_SAVE = { stars: 0, gardenLevel: 1, puzzleLevel: 1, restored: { fountain: false, bench: false }, owned: [], placedItems: [], collectedCoins: [], language: 'de' };
const canvas = document.querySelector('#gameCanvas');
const uiRoot = document.querySelector('#gameUi');
const loading = document.querySelector('#loadingScreen');
const loadingMessage = document.querySelector('#loadingMessage');
const match3Container = document.querySelector('#match3Root');
const root = document.querySelector('#gameRoot');

function readSave() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
    return { ...DEFAULT_SAVE, ...parsed, restored: { ...DEFAULT_SAVE.restored, ...(parsed.restored || {}) }, owned: Array.isArray(parsed.owned) ? parsed.owned : [], placedItems: Array.isArray(parsed.placedItems) ? parsed.placedItems : [], collectedCoins: Array.isArray(parsed.collectedCoins) ? parsed.collectedCoins : [] };
  } catch { return { ...DEFAULT_SAVE, restored: { ...DEFAULT_SAVE.restored }, owned: [], placedItems: [], collectedCoins: [] }; }
}

const save = readSave();
let world;
let match3 = null;
let placementKey = null;
let cameraYaw = Math.PI * 0.22;
let cameraPitch = 0.28;
let cameraDistance = 8.2;
let pointerLook = null;
let lastInteract = 0;
let lastSaveToast = 0;
let toastTimeout = null;
let gamePaused = false;
let joystick = { x: 0, y: 0 };
let touchMode = matchMedia('(pointer: coarse)').matches;
const keys = new Set();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const clock = new THREE.Clock();
const audio = new Audio('./CoinPickUp.wav');
audio.preload = 'auto';

function persist() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (error) { console.warn('Could not save garden progress', error); }
}

function translate(key) { return ui.languageText()[key]; }
function stats() { return { stars: save.stars, level: save.gardenLevel, coins: 45 - save.collectedCoins.length, totalCoins: 45 }; }
function refreshUI() { ui.renderStats(stats()); }
function notify(text = translate('saved')) { ui.toast(text); }

function assetUrl(path) { return new URL(`./${path.split('/').map(encodeURIComponent).join('/')}`, import.meta.url).href; }

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.8));
renderer.setSize(innerWidth, innerHeight, false);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(56, innerWidth / innerHeight, 0.08, 240);
camera.up.set(0, 0, 1);
camera.position.set(5, -8, 5);

const loader = new GLTFLoader();
const ui = createUI({ root: uiRoot, language: save.language, callbacks: {
  onBuy: buyItem,
  onRestore: restoreFeature,
  onShopChange(open) { gamePaused = open || Boolean(match3) || Boolean(placementKey); },
  isRestored(key) { return save.restored[key]; },
  onLanguageToggle() {
    save.language = save.language === 'de' ? 'pt-BR' : 'de';
    ui.setLanguage(save.language);
    match3?.setLanguage(save.language);
    persist();
  },
  onControlModeChange(enabled) { touchMode = enabled; },
  onJoystick(x, y) { joystick = { x, y }; },
  onInteract() { interact(); },
  onJump() { player.jumpQueued = true; },
} });
ui.setTouchControls(touchMode);

const player = { velocityZ: 0, grounded: true, jumpQueued: false, moveSpeed: 4.1, radius: 0.23, moving: false, walkPhase: 0 };

function buyItem(key, price) {
  if (save.stars < price) { notify(translate('noStars')); return; }
  save.stars -= price;
  save.owned.push(key);
  placementKey = key;
  gamePaused = true;
  ui.toggleShop(false);
  ui.setPlacementMode(true);
  ui.setPrompt(translate('placePrompt'));
  refreshUI();
  persist();
}

function restoreFeature(key, price) {
  if (save.restored[key]) return;
  if (save.stars < price) { notify(translate('noStars')); return; }
  save.stars -= price;
  save.restored[key] = true;
  const prop = world?.props[key];
  if (prop) prop.root.visible = true;
  refreshUI();
  ui.toast(translate('restored'));
  persist();
}

function openMatch3() {
  if (match3) return;
  gamePaused = true;
  ui.setPrompt('');
  match3Container.hidden = false;
  match3 = mountMatch3(match3Container, {
    level: save.puzzleLevel,
    language: save.language,
    onReward({ nextLevel }) {
      save.stars += 1;
      save.gardenLevel = Math.max(save.gardenLevel, nextLevel);
      save.puzzleLevel = nextLevel;
      refreshUI();
      persist();
    },
    onBack() {
      match3?.destroy();
      match3 = null;
      match3Container.hidden = true;
      gamePaused = Boolean(placementKey) || ui.isShopOpen();
      ui.setPrompt(translate('controls'));
    },
  });
}

function cameraDirection() { return new THREE.Vector3(Math.cos(cameraYaw), Math.sin(cameraYaw), 0); }
function updateCamera(dt) {
  const focus = world.playerRoot.position.clone().add(new THREE.Vector3(0, 0, 0.72));
  const horizontal = cameraDistance * Math.cos(cameraPitch);
  const desired = focus.clone().add(new THREE.Vector3(-Math.cos(cameraYaw) * horizontal, -Math.sin(cameraYaw) * horizontal, cameraDistance * Math.sin(cameraPitch) + 1.1));
  camera.position.lerp(desired, 1 - Math.exp(-dt * 7));
  camera.lookAt(focus);
}

function currentInteraction() {
  const p = world.playerRoot.position;
  const sign = world.props.sign.root.position.distanceTo(p);
  const fountain = world.props.fountain.root.position.distanceTo(p);
  const bench = world.props.bench.root.position.distanceTo(p);
  if (sign < 2.25) return { key: 'sign', distance: sign, prompt: translate('signPrompt') };
  if (!save.restored.fountain && fountain < 2.8) return { key: 'fountain', distance: fountain, prompt: translate('fountainPrompt') };
  if (!save.restored.bench && bench < 2.5) return { key: 'bench', distance: bench, prompt: translate('benchPrompt') };
  return null;
}

function interact() {
  if (match3 || ui.isShopOpen() || placementKey) return;
  const target = currentInteraction();
  if (!target) return;
  if (target.key === 'sign') openMatch3();
  else restoreFeature(target.key, target.key === 'fountain' ? 3 : 2);
}

function collectCoins(time) {
  const playerPosition = world.playerRoot.position;
  for (let index = 0; index < world.coins.length; index += 1) {
    const coin = world.coins[index];
    if (coin.userData.collected) continue;
    coin.rotation.z += 0.018;
    coin.position.z = coin.userData.baseZ + Math.sin(time * 2.2 + coin.userData.phase) * 0.1;
    coin.scale.setScalar(coin.userData.baseScale * (0.93 + Math.sin(time * 3.3 + coin.userData.phase) * 0.07));
    if (coin.position.distanceTo(playerPosition.clone().add(new THREE.Vector3(0, 0, 0.6))) < 0.7) {
      coin.userData.collected = true;
      coin.visible = false;
      save.collectedCoins.push(index);
      if (audio.readyState >= 2) { audio.currentTime = 0; audio.play().catch(() => {}); }
      refreshUI();
      persist();
      ui.toast(translate('collected'), 1000);
    }
  }
}

function placeItem(event) {
  if (!placementKey) return false;
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hit = new THREE.Plane(new THREE.Vector3(0, 0, 1), -world.heightAt(world.playerRoot.position.x, world.playerRoot.position.y));
  const point = new THREE.Vector3();
  if (!raycaster.ray.intersectPlane(hit, point)) return true;
  const bounds = world.worldBounds;
  point.x = THREE.MathUtils.clamp(point.x, bounds.minX, bounds.maxX);
  point.y = THREE.MathUtils.clamp(point.y, bounds.minY, bounds.maxY);
  point.z = world.heightAt(point.x, point.y);
  world.createPlacedItem(placementKey, point.x, point.y);
  save.placedItems.push({ key: placementKey, x: point.x, y: point.y });
  placementKey = null;
  gamePaused = false;
  ui.setPlacementMode(false);
  ui.setPrompt(translate('controls'));
  notify(translate('bought'));
  persist();
  return true;
}

function isBlocked(x, y, nextZ) {
  for (const collider of world.colliders) {
    if (nextZ > collider.top + 0.4) continue;
    if (Math.abs(x - collider.x) < collider.halfX + player.radius && Math.abs(y - collider.y) < collider.halfY + player.radius) return collider;
  }
  return null;
}

function pushCollider(collider, dx, dy) {
  if (collider.kind !== 'pushable') return false;
  const x = collider.x + dx;
  const y = collider.y + dy;
  if (isBlocked(x, y, world.playerRoot.position.z) !== collider) return false;
  if (world.colliders.some((other) => other !== collider && Math.abs(x - other.x) < other.halfX + collider.halfX && Math.abs(y - other.y) < other.halfY + collider.halfY)) return false;
  collider.x = x;
  collider.y = y;
  collider.mesh.position.x = x;
  collider.mesh.position.y = y;
  collider.mesh.position.z = world.heightAt(x, y) + collider.mesh.geometry.parameters.depth * 0.5;
  return true;
}

function updatePlayer(dt) {
  if (gamePaused || match3 || ui.isShopOpen() || placementKey) {
    player.moving = false;
    player.jumpQueued = false;
    return;
  }
  const forward = Number(keys.has('KeyW') || keys.has('ArrowUp')) - Number(keys.has('KeyS') || keys.has('ArrowDown'));
  const strafe = Number(keys.has('KeyD') || keys.has('ArrowRight')) - Number(keys.has('KeyA') || keys.has('ArrowLeft'));
  let inputX = strafe + joystick.x;
  let inputY = forward + joystick.y;
  const magnitude = Math.hypot(inputX, inputY);
  if (magnitude > 1) { inputX /= magnitude; inputY /= magnitude; }
  const direction = cameraDirection();
  const side = new THREE.Vector3(-direction.y, direction.x, 0);
  const move = direction.multiplyScalar(inputY).add(side.multiplyScalar(inputX));
  player.moving = move.lengthSq() > 0.008;
  if (player.moving) {
    move.normalize();
    world.heading.rotation.z = Math.atan2(move.y, move.x) - Math.PI / 2;
    const dx = move.x * player.moveSpeed * dt;
    const dy = move.y * player.moveSpeed * dt;
    const bounds = world.worldBounds;
    const nextX = THREE.MathUtils.clamp(world.playerRoot.position.x + dx, bounds.minX, bounds.maxX);
    const nextY = THREE.MathUtils.clamp(world.playerRoot.position.y + dy, bounds.minY, bounds.maxY);
    let blocked = isBlocked(nextX, world.playerRoot.position.y, world.playerRoot.position.z);
    if (blocked && pushCollider(blocked, dx, 0)) blocked = null;
    if (!blocked) world.playerRoot.position.x = nextX;
    blocked = isBlocked(world.playerRoot.position.x, nextY, world.playerRoot.position.z);
    if (blocked && pushCollider(blocked, 0, dy)) blocked = null;
    if (!blocked) world.playerRoot.position.y = nextY;
    const targetGround = world.heightAt(world.playerRoot.position.x, world.playerRoot.position.y);
    if (player.grounded) world.playerRoot.position.z = THREE.MathUtils.damp(world.playerRoot.position.z, targetGround, 10, dt);
  }
  if (player.jumpQueued && player.grounded) {
    player.velocityZ = 5.1;
    player.grounded = false;
  }
  player.jumpQueued = false;
  player.velocityZ -= 12.8 * dt;
  world.playerRoot.position.z += player.velocityZ * dt;
  const ground = world.heightAt(world.playerRoot.position.x, world.playerRoot.position.y);
  if (world.playerRoot.position.z <= ground) {
    world.playerRoot.position.z = ground;
    player.velocityZ = 0;
    player.grounded = true;
  }
  const walking = player.moving && player.grounded;
  const targetLean = walking ? Math.sin(performance.now() * 0.012) * 0.095 : 0;
  const targetLift = walking ? Math.abs(Math.sin(performance.now() * 0.014)) * 0.045 : 0;
  player.walkPhase = THREE.MathUtils.damp(player.walkPhase, walking ? 1 : 0, walking ? 9 : 6, dt);
  world.playerModel.rotation.x = THREE.MathUtils.damp(world.playerModel.rotation.x, targetLean * player.walkPhase, 9, dt);
  world.playerModel.position.z = THREE.MathUtils.damp(world.playerModel.position.z, targetLift * player.walkPhase, 9, dt);
}

function onResize() {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.8));
  renderer.setSize(innerWidth, innerHeight, false);
}

window.addEventListener('resize', onResize);
window.addEventListener('keydown', (event) => {
  if (event.code === 'Escape') {
    if (placementKey) {
      placementKey = null;
      save.stars += ({ flowerBed: 2, statue: 4, lantern: 3, gnome: 1 })[save.owned.at(-1)] || 0;
      save.owned.pop();
      ui.setPlacementMode(false);
      gamePaused = false;
      ui.setPrompt(translate('controls'));
      refreshUI();
      persist();
    } else if (ui.isShopOpen()) ui.toggleShop(false);
  }
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) event.preventDefault();
  keys.add(event.code);
  if (event.code === 'Space') player.jumpQueued = true;
  if (event.code === 'KeyE' && !event.repeat) interact();
  if (event.code === 'KeyB' && !event.repeat) ui.toggleShop();
});
window.addEventListener('keyup', (event) => keys.delete(event.code));
canvas.addEventListener('pointerdown', (event) => {
  if (placementKey) { placeItem(event); return; }
  pointerLook = { id: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
  canvas.setPointerCapture(event.pointerId);
});
canvas.addEventListener('pointermove', (event) => {
  if (!pointerLook || pointerLook.id !== event.pointerId) return;
  const dx = event.clientX - pointerLook.x;
  const dy = event.clientY - pointerLook.y;
  pointerLook.moved ||= Math.abs(dx) + Math.abs(dy) > 5;
  pointerLook.x = event.clientX;
  pointerLook.y = event.clientY;
  cameraYaw -= dx * 0.006;
  cameraPitch = THREE.MathUtils.clamp(cameraPitch + dy * 0.004, -0.12, 0.85);
});
canvas.addEventListener('pointerup', () => { pointerLook = null; });
canvas.addEventListener('wheel', (event) => { cameraDistance = THREE.MathUtils.clamp(cameraDistance + event.deltaY * 0.004, 5, 13); }, { passive: true });
canvas.addEventListener('dblclick', interact);

function frame() {
  requestAnimationFrame(frame);
  const dt = Math.min(clock.getDelta(), 0.04);
  const time = clock.elapsedTime;
  if (world) {
    updatePlayer(dt);
    updateCamera(dt);
    collectCoins(time);
    world.water.position.z = world.water.userData.baseZ + Math.sin(time * 1.1) * 0.012;
    const target = currentInteraction();
    if (!gamePaused && !match3 && !ui.isShopOpen() && !placementKey) ui.setPrompt(target?.prompt || translate('controls'));
    if (target && performance.now() - lastInteract > 950 && keys.has('KeyE')) { lastInteract = performance.now(); interact(); }
    if (performance.now() - lastSaveToast > 45000) { persist(); lastSaveToast = performance.now(); }
    renderer.render(scene, camera);
  }
}

async function start() {
  try {
    loadingMessage.textContent = 'Garten und Wichtel werden geladen …';
    world = await createWorld(THREE, { scene, data: gardenData, scatterData, loader, assetUrl, saved: save, onStatus(message) { loadingMessage.textContent = message; } });
    for (const index of save.collectedCoins) if (world.coins[index]) { world.coins[index].visible = false; world.coins[index].userData.collected = true; }
    ui.renderStats(stats());
    loading.classList.add('is-hidden');
    gamePaused = false;
    frame();
    window.setTimeout(() => loading.remove(), 350);
  } catch (error) {
    console.error('Garden failed to start', error);
    loadingMessage.textContent = `Der Garten konnte nicht geladen werden: ${error.message}`;
  }
}

start();
