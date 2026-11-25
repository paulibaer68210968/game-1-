export const RENOVATIONS = [
  { id: 'path', area: 'garden', cost: 1, title: 'pathTitle', description: 'pathDesc', variants: [{ id: 'moss', label: 'pathMoss' }, { id: 'amber', label: 'pathAmber' }] },
  { id: 'flowers', area: 'garden', cost: 2, title: 'flowersTitle', description: 'flowersDesc', variants: [{ id: 'sunflower', label: 'flowersSunflower' }, { id: 'wild', label: 'flowersWild' }] },
  { id: 'tree', area: 'garden', cost: 3, title: 'treeTitle', description: 'treeDesc', variants: [{ id: 'cherry', label: 'treeCherry' }, { id: 'oak', label: 'treeOak' }] },
  { id: 'bench', area: 'garden', cost: 2, title: 'benchTitle', description: 'benchDesc', variants: [{ id: 'oak', label: 'benchOak' }, { id: 'sage', label: 'benchSage' }] },
  { id: 'fountain', area: 'garden', cost: 3, title: 'fountainTitle', description: 'fountainDesc', variants: [{ id: 'blue', label: 'fountainBlue' }, { id: 'rose', label: 'fountainRose' }] },
  { id: 'shed', area: 'garden', cost: 3, title: 'shedTitle', description: 'shedDesc', variants: [{ id: 'neat', label: 'shedNeat' }] },
  { id: 'wallpaper', area: 'villa', cost: 1, title: 'wallpaperTitle', description: 'wallpaperDesc', variants: [{ id: 'sage', label: 'wallpaperSage' }, { id: 'rose', label: 'wallpaperRose' }] },
  { id: 'sofa', area: 'villa', cost: 2, title: 'sofaTitle', description: 'sofaDesc', variants: [{ id: 'blue', label: 'sofaBlue' }, { id: 'moss', label: 'sofaMoss' }] },
  { id: 'fireplace', area: 'villa', cost: 2, title: 'fireplaceTitle', description: 'fireplaceDesc', variants: [{ id: 'warm', label: 'fireplaceWarm' }] },
];

export function tasksForArea(area) {
  return RENOVATIONS.filter((task) => task.area === area);
}

export function findTask(id) {
  return RENOVATIONS.find((task) => task.id === id) || null;
}

export function isRenovated(save, id) {
  return Boolean(save.renovations?.[id]);
}

export function renovationVariant(save, id, fallback = '') {
  return save.renovations?.[id]?.variant || fallback;
}

export function applyRenovation(save, taskId, variantId) {
  const task = findTask(taskId);
  if (!task || isRenovated(save, taskId) || save.stars < task.cost) return false;
  const variant = task.variants.find((option) => option.id === variantId) || task.variants[0];
  save.stars -= task.cost;
  save.renovations[task.id] = { variant: variant.id };
  return true;
}

export function initialVariant(task) {
  return task.variants[0]?.id || '';
}
