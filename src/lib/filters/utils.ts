export const uid = (): string => Math.random().toString(36).slice(2, 9);

export const clamp = (v: number, min: number, max: number): number => Math.max(min, Math.min(max, v));

// Map prop names to proper SVG attribute names.
// Keep camelCase for known SVG camel attributes, hyphenate known hyphen-case.
const keepCamel = new Set(['edgeMode', 'stdDeviation']);
const hyphenateSet = new Set(['floodColor', 'floodOpacity', 'lightingColor']);

export const mapAttrName = (k: string): string => {
  if (keepCamel.has(k)) return k;
  return hyphenateSet.has(k) ? k.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase()) : k;
};

export const STORAGE = {
  autosave: 'sfl.v1.autosave',
  presets: 'sfl.v1.presets',
  theme: 'sfl.v1.theme',
  sampleText: 'sfl.v1.sampleText',
  sampleSvg: 'sfl.v1.sampleSvg',
} as const;

