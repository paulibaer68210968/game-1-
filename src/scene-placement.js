export const SCENE_POSITION_MIN = 4;
export const SCENE_POSITION_MAX = 96;
export const SCENE_PAN_LIMIT = 0.15;
export const VILLA_PAN_LIMIT = 0.42;

export function clampScenePosition(value, fallback = 50) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(SCENE_POSITION_MAX, Math.max(SCENE_POSITION_MIN, number));
}

export function pointOnScene(clientX, clientY, rect) {
  if (!rect || rect.width <= 0 || rect.height <= 0) return { x: 50, y: 50 };
  return {
    x: clampScenePosition(((clientX - rect.left) / rect.width) * 100),
    y: clampScenePosition(((clientY - rect.top) / rect.height) * 100),
  };
}

export function panScene(startPan, deltaX, deltaY, width, height, limit = SCENE_PAN_LIMIT) {
  const safeWidth = Math.max(1, Number(width) || 1);
  const safeHeight = Math.max(1, Number(height) || 1);
  const range = Math.max(0, Math.abs(Number(limit) || SCENE_PAN_LIMIT));
  const startX = Math.max(-range, Math.min(range, Number(startPan?.x) || 0));
  const startY = Math.max(-range, Math.min(range, Number(startPan?.y) || 0));
  return {
    x: Math.max(-range, Math.min(range, startX + deltaX / safeWidth)),
    y: Math.max(-range, Math.min(range, startY + deltaY / safeHeight)),
  };
}

export function normalizeScenePan(value = {}, limit = SCENE_PAN_LIMIT) {
  const range = Math.max(0, Math.abs(Number(limit) || SCENE_PAN_LIMIT));
  const clamp = (entry) => {
    const number = Number(entry);
    if (!Number.isFinite(number)) return 0;
    return Math.max(-range, Math.min(range, number));
  };
  return { x: clamp(value.x), y: clamp(value.y) };
}
