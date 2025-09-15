import type { PrimitiveNode } from './types';
import { mapAttrName } from './utils';

export function buildFilterMarkup(prims: PrimitiveNode[], filterId: string, colorSpace: string): string {
  const open = `<filter id="${filterId}" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="${colorSpace}">`;
  const lines: string[] = [open];

  for (const node of prims) {
    const attrs = { ...(node.attrs || {}) } as Record<string, any>;
    const customAttrs = (node.custom || []).filter((c) => c.name);
    const attrStr = [
      ...Object.entries(attrs)
        .filter(([, v]) => v !== undefined && v !== '')
        .map(([k, v]) => `${mapAttrName(k)}="${v}"`),
      ...customAttrs.map((c) => `${c.name}="${c.value}` + '"'),
    ].join(' ');

    if (node.type === 'feComponentTransfer') {
      lines.push(`  <feComponentTransfer ${attrStr}>`);
      const order = ['feFuncR', 'feFuncG', 'feFuncB', 'feFuncA'];
      for (const fk of order) {
        const f = node.funcs?.[fk];
        if (!f) continue;
        const fStr = Object.entries(f.attrs || {})
          .filter(([, v]) => v !== undefined && v !== '')
          .map(([k, v]) => `${mapAttrName(k)}="${v}` + '"')
          .join(' ');
        lines.push(`    <${fk} ${fStr} />`);
      }
      lines.push('  </feComponentTransfer>');
      continue;
    }

    if (node.type === 'feMerge') {
      lines.push(`  <feMerge ${attrStr}>`);
      for (const mn of node.mergeNodes || []) {
        lines.push(`    <feMergeNode in="${mn.in || 'SourceGraphic'}" />`);
      }
      lines.push('  </feMerge>');
      continue;
    }

    if (node.type === 'feDiffuseLighting' || node.type === 'feSpecularLighting') {
      lines.push(`  <${node.type} ${attrStr}>`);
      lines.push('    <feDistantLight azimuth="45" elevation="55" />');
      lines.push(`  </${node.type}>`);
      continue;
    }

    lines.push(`  <${node.type} ${attrStr} />`);
  }

  lines.push('</filter>');
  return lines.join('\n');
}

