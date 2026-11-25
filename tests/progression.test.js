import test from 'node:test';
import assert from 'node:assert/strict';
import {
  RENOVATIONS,
  applyRenovation,
  findTask,
  initialVariant,
  isRenovated,
  renovationVariant,
  tasksForArea,
} from '../src/progression.js';
import {
  SCENE_PAN_LIMIT,
  clampScenePosition,
  normalizeScenePan,
  panScene,
  pointOnScene,
} from '../src/scene-placement.js';

function makeSave(stars = 10) {
  return { stars, renovations: {} };
}

test('renovations are grouped by garden and villa area', () => {
  assert.deepEqual(tasksForArea('garden').map(({ id }) => id), ['path', 'flowers', 'tree', 'bench', 'fountain', 'shed']);
  assert.deepEqual(tasksForArea('villa').map(({ id }) => id), ['wallpaper', 'sofa', 'fireplace']);
  assert.deepEqual(tasksForArea('unknown'), []);
});

test('findTask returns a renovation or null for an unknown id', () => {
  assert.equal(findTask('tree')?.cost, 3);
  assert.equal(findTask('missing'), null);
});

test('initialVariant selects the first available option', () => {
  assert.equal(initialVariant(findTask('path')), 'moss');
  assert.equal(initialVariant({ variants: [] }), '');
});

test('renovationVariant returns the saved choice or the supplied fallback', () => {
  assert.equal(renovationVariant({ renovations: { path: { variant: 'amber' } } }, 'path', 'moss'), 'amber');
  assert.equal(renovationVariant({ renovations: {} }, 'path', 'moss'), 'moss');
  assert.equal(renovationVariant({ renovations: {} }, 'path'), '');
});

test('applyRenovation deducts the configured cost and saves a valid variant', () => {
  const save = makeSave(5);
  assert.equal(applyRenovation(save, 'flowers', 'wild'), true);
  assert.equal(save.stars, 3);
  assert.deepEqual(save.renovations.flowers, { variant: 'wild' });
  assert.equal(isRenovated(save, 'flowers'), true);
});

test('applyRenovation falls back to the first variant when the choice is invalid', () => {
  const save = makeSave(1);
  assert.equal(applyRenovation(save, 'path', 'invalid-choice'), true);
  assert.deepEqual(save.renovations.path, { variant: 'moss' });
});

test('applyRenovation rejects unknown ids, insufficient stars and completed tasks without mutation', () => {
  const save = makeSave(1);
  assert.equal(applyRenovation(save, 'missing', 'anything'), false);
  assert.equal(applyRenovation(save, 'flowers', 'wild'), false);
  assert.equal(save.stars, 1);
  assert.deepEqual(save.renovations, {});

  assert.equal(applyRenovation(save, 'path', 'moss'), true);
  assert.equal(applyRenovation(save, 'path', 'amber'), false);
  assert.equal(save.stars, 0);
  assert.deepEqual(save.renovations.path, { variant: 'moss' });
});

test('the renovation catalogue exposes positive whole-star costs', () => {
  assert.ok(RENOVATIONS.length > 0);
  for (const task of RENOVATIONS) assert.ok(Number.isInteger(task.cost) && task.cost > 0);
});

test('scene item positions are finite and stay inside the visible world', () => {
  assert.equal(clampScenePosition(-20), 4);
  assert.equal(clampScenePosition(140), 96);
  assert.equal(clampScenePosition(Number.NaN), 50);
  assert.deepEqual(pointOnScene(250, 150, { left: 100, top: 50, width: 200, height: 200 }), { x: 75, y: 50 });
});

test('scene panning is normalized and clamped to a reachable range', () => {
  assert.deepEqual(panScene({ x: 0, y: 0 }, 100, -50, 1000, 500), { x: 0.1, y: -0.1 });
  assert.deepEqual(panScene({ x: 0.14, y: -0.14 }, 500, -500, 1000, 1000), { x: SCENE_PAN_LIMIT, y: -SCENE_PAN_LIMIT });
  assert.deepEqual(normalizeScenePan({ x: 4, y: -4 }), { x: SCENE_PAN_LIMIT, y: -SCENE_PAN_LIMIT });
});
