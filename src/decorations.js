import { ART } from './art.js';

export const DECORATIONS = Object.freeze({
  'garden-oak': { area: 'garden', asset: ART.renovatedOak, label: 'decorOak', className: 'decor-oak' },
  'garden-cherry': { area: 'garden', asset: ART.renovatedCherry, label: 'decorCherry', className: 'decor-cherry' },
  'garden-flowers': { area: 'garden', asset: ART.renovatedWildflowers, label: 'decorFlowers', className: 'decor-flowers' },
  'garden-sunflowers': { area: 'garden', asset: ART.renovatedSunflowers, label: 'decorSunflowers', className: 'decor-sunflowers' },
  'garden-bush': { area: 'garden', asset: ART.bush, label: 'decorBush', className: 'decor-bush' },
  'garden-bench': { area: 'garden', asset: ART.renovatedBench, label: 'decorBench', className: 'decor-bench' },
  'garden-fountain': { area: 'garden', asset: ART.renovatedFountain, label: 'decorFountain', className: 'decor-fountain' },
  'villa-sofa': { area: 'villa', asset: ART.sofa, label: 'decorSofa', className: 'decor-sofa' },
  'villa-rug': { area: 'villa', asset: ART.rugRound, label: 'decorRug', className: 'decor-rug' },
  'villa-curtains': { area: 'villa', asset: ART.curtains, label: 'decorCurtains', className: 'decor-curtains' },
  'villa-fireplace': { area: 'villa', asset: ART.renovatedFireplace, label: 'decorFireplace', className: 'decor-fireplace' },
  'villa-plant': { area: 'villa', asset: ART.flowerBed, label: 'decorPlant', className: 'decor-plant' },
  'villa-frame': { area: 'villa', asset: ART.windowFrame, label: 'decorFrame', className: 'decor-frame' },
});

export function decorationsForArea(area) {
  return Object.entries(DECORATIONS)
    .filter(([, item]) => item.area === area)
    .map(([id, item]) => ({ id, ...item }));
}

export function getDecoration(id, area = null) {
  const item = DECORATIONS[id];
  if (!item || (area && item.area !== area)) return null;
  return { id, ...item };
}
