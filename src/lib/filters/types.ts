export type AttrInputType = 'text' | 'select' | 'number' | 'color' | 'checkbox';

export type AttrConf = {
  type: AttrInputType;
  options?: string[];
  step?: number;
  default?: string | number | boolean;
  placeholder?: string;
  // UI-only hint
  compact?: boolean;
};

export type Schema = {
  label: string;
  attrs: Record<string, AttrConf>;
  childFuncs?: string[];
  childNodes?: boolean;
};

export type FuncNode = {
  id: string;
  attrs: Record<string, string | number | boolean>;
};

export type MergeNode = {
  id: string;
  in: string;
};

export type CustomAttr = {
  id: string;
  name: string;
  value: string;
};

export type PrimitiveNode = {
  id: string;
  type: string;
  attrs: Record<string, any>;
  custom?: CustomAttr[];
  funcs?: Record<string, FuncNode>;
  mergeNodes?: MergeNode[];
};

export type FilterLabState = {
  version: number;
  filterId: string;
  colorSpace: string;
  prims: PrimitiveNode[];
  customWidth: number;
  customHeight: number;
  sample: string;
  sampleText: string;
  sampleSvg: string;
  bg: string;
};

export type SchemasMap = Record<string, Schema>;

