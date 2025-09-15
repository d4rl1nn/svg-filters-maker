import type { SchemasMap, AttrConf } from './types';

export const SCHEMAS: SchemasMap = {
  feBlend: {
    label: 'feBlend',
    attrs: {
      in: { type: 'text', placeholder: 'SourceGraphic' },
      in2: { type: 'text', placeholder: 'BackgroundImage' },
      mode: {
        type: 'select',
        options: ['normal','multiply','screen','darken','lighten','overlay','color-dodge','color-burn','hard-light','soft-light','difference','exclusion','hue','saturation','color','luminosity'],
        default: 'multiply',
      },
      result: { type: 'text' },
    },
  },
  feColorMatrix: {
    label: 'feColorMatrix',
    attrs: {
      in: { type: 'text', placeholder: 'SourceGraphic' },
      type: { type: 'select', options: ['matrix','saturate','hueRotate','luminanceToAlpha'], default: 'saturate' },
      values: { type: 'text', placeholder: 'e.g. 0.5 or 20 or 20 0 0 0 0 ...' },
      result: { type: 'text' },
    },
  },
  feComponentTransfer: {
    label: 'feComponentTransfer',
    attrs: {
      in: { type: 'text', placeholder: 'SourceGraphic' },
      result: { type: 'text' },
    },
    childFuncs: ['feFuncR','feFuncG','feFuncB','feFuncA'],
  },
  feComposite: {
    label: 'feComposite',
    attrs: {
      in: { type: 'text', placeholder: 'SourceGraphic' },
      in2: { type: 'text', placeholder: 'SourceAlpha' },
      operator: { type: 'select', options: ['over','in','out','atop','xor','arithmetic'], default: 'over' },
      k1: { type: 'number', step: 0.1 },
      k2: { type: 'number', step: 0.1 },
      k3: { type: 'number', step: 0.1 },
      k4: { type: 'number', step: 0.1 },
      result: { type: 'text' },
    },
  },
  feConvolveMatrix: {
    label: 'feConvolveMatrix',
    attrs: {
      in: { type: 'text', placeholder: 'SourceGraphic' },
      order: { type: 'text', placeholder: 'e.g. 3 or 3 3' },
      kernelMatrix: { type: 'text', placeholder: 'e.g. 0 -1 0 -1 5 -1 0 -1 0' },
      divisor: { type: 'number', step: 0.1 },
      bias: { type: 'number', step: 0.1 },
      targetX: { type: 'number' },
      targetY: { type: 'number' },
      edgeMode: { type: 'select', options: ['duplicate','wrap','none'], default: 'duplicate' },
      kernelUnitLength: { type: 'text', placeholder: 'e.g. 1 1' },
      preserveAlpha: { type: 'checkbox' },
      result: { type: 'text' },
    },
  },
  feDiffuseLighting: {
    label: 'feDiffuseLighting',
    attrs: {
      in: { type: 'text', placeholder: 'SourceAlpha' },
      surfaceScale: { type: 'number', step: 0.1, default: 1 },
      diffuseConstant: { type: 'number', step: 0.1, default: 1 },
      kernelUnitLength: { type: 'text' },
      lightingColor: { type: 'color', default: '#ffffff' },
      result: { type: 'text' },
    },
  },
  feDisplacementMap: {
    label: 'feDisplacementMap',
    attrs: {
      in: { type: 'text', placeholder: 'SourceGraphic' },
      in2: { type: 'text', placeholder: 'displacement map' },
      scale: { type: 'number', step: 1, default: 20 },
      xChannelSelector: { type: 'select', options: ['R','G','B','A'], default: 'R' },
      yChannelSelector: { type: 'select', options: ['R','G','B','A'], default: 'G' },
      result: { type: 'text' },
    },
  },
  feDropShadow: {
    label: 'feDropShadow',
    attrs: {
      dx: { type: 'number', step: 0.5, default: 4 },
      dy: { type: 'number', step: 0.5, default: 4 },
      stdDeviation: { type: 'number', step: 0.5, default: 3 },
      floodColor: { type: 'color', default: '#000000' },
      floodOpacity: { type: 'number', step: 0.05, default: 0.5 },
      result: { type: 'text' },
    },
  },
  feFlood: {
    label: 'feFlood',
    attrs: {
      floodColor: { type: 'color', default: '#000000' },
      floodOpacity: { type: 'number', step: 0.05, default: 1 },
      result: { type: 'text' },
    },
  },
  feGaussianBlur: {
    label: 'feGaussianBlur',
    attrs: {
      in: { type: 'text', placeholder: 'SourceGraphic' },
      stdDeviation: { type: 'text', placeholder: 'e.g. 3 or 3 2' },
      edgeMode: { type: 'select', options: ['duplicate','wrap','none'] },
      result: { type: 'text' },
    },
  },
  feImage: {
    label: 'feImage',
    attrs: {
      href: { type: 'text', placeholder: 'https://... or data:image/...' },
      preserveAspectRatio: { type: 'text', placeholder: 'xMidYMid meet' },
      crossOrigin: { type: 'text', placeholder: 'anonymous' },
      result: { type: 'text' },
    },
  },
  feMerge: {
    label: 'feMerge',
    attrs: { result: { type: 'text' } },
    childNodes: true,
  },
  feMorphology: {
    label: 'feMorphology',
    attrs: {
      in: { type: 'text', placeholder: 'SourceGraphic' },
      operator: { type: 'select', options: ['erode','dilate'], default: 'erode' },
      radius: { type: 'text', placeholder: 'e.g. 1 or 2 3' },
      result: { type: 'text' },
    },
  },
  feOffset: {
    label: 'feOffset',
    attrs: {
      in: { type: 'text', placeholder: 'SourceGraphic' },
      dx: { type: 'number', step: 0.5, default: 5 },
      dy: { type: 'number', step: 0.5, default: 5 },
      result: { type: 'text' },
    },
  },
  feSpecularLighting: {
    label: 'feSpecularLighting',
    attrs: {
      in: { type: 'text', placeholder: 'SourceAlpha' },
      surfaceScale: { type: 'number', step: 0.1, default: 1 },
      specularConstant: { type: 'number', step: 0.1, default: 1 },
      specularExponent: { type: 'number', step: 1, default: 20 },
      lightingColor: { type: 'color', default: '#ffffff' },
      result: { type: 'text' },
    },
  },
  feTile: {
    label: 'feTile',
    attrs: {
      in: { type: 'text', placeholder: 'SourceGraphic' },
      x: { type: 'text', placeholder: 'e.g. 0%', default: '0%' },
      y: { type: 'text', placeholder: 'e.g. 0%', default: '0%' },
      width: { type: 'text', placeholder: 'e.g. 100%', default: '100%' },
      height: { type: 'text', placeholder: 'e.g. 100%', default: '100%' },
      result: { type: 'text' },
    },
  },
  feTurbulence: {
    label: 'feTurbulence',
    attrs: {
      baseFrequency: { type: 'text', placeholder: '0.02 or 0.02 0.05' },
      numOctaves: { type: 'number', step: 1, default: 2 },
      seed: { type: 'number', step: 1, default: 1 },
      stitchTiles: { type: 'select', options: ['stitch','noStitch'] },
      type: { type: 'select', options: ['turbulence','fractalNoise'], default: 'fractalNoise' },
      result: { type: 'text' },
    },
  },
};

export const FUNC_SCHEMA: Record<string, AttrConf> = {
  type: { type: 'select', options: ['identity','table','discrete','linear','gamma'], default: 'identity' },
  tableValues: { type: 'text', placeholder: 'e.g. 0 0.5 1' },
  slope: { type: 'number', step: 0.1 },
  intercept: { type: 'number', step: 0.1 },
  amplitude: { type: 'number', step: 0.1 },
  exponent: { type: 'number', step: 0.1 },
  offset: { type: 'number', step: 0.1 },
};

export const SAMPLE_CONTENTS = [
  { key: 'rect', label: 'Rectangle' },
  { key: 'text', label: 'Text' },
  { key: 'image', label: 'Image' },
  { key: 'circle', label: 'Circle' },
  { key: 'custom', label: 'Custom SVG' },
];

