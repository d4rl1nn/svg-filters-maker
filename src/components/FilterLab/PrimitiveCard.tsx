import { SCHEMAS, FUNC_SCHEMA } from '../../lib/filters/schemas';
import type { PrimitiveNode } from '../../lib/filters/types';
import AttrInput from './AttrInput';

type Props = {
  node: PrimitiveNode;
  index: number;
  inputOptions: string[];
  setAttr: (k: string, v: any) => void;
  moveUp: () => void;
  moveDown: () => void;
  remove: () => void;
  duplicate: () => void;
  setFuncAttr: (fk: string, k: string, v: any) => void;
  addMergeNode: () => void;
  setMergeIn: (mIdx: number, v: string) => void;
  removeMergeNode: (mIdx: number) => void;
  addCustomAttr: () => void;
  setCustomAttr: (cId: string, field: 'name' | 'value', v: string) => void;
  removeCustomAttr: (cId: string) => void;
};

export default function PrimitiveCard(props: Props) {
  const { node, index, inputOptions, setAttr, moveUp, moveDown, remove, duplicate, setFuncAttr, addMergeNode, setMergeIn, removeMergeNode, addCustomAttr, setCustomAttr, removeCustomAttr } = props;
  const schema = SCHEMAS[node.type];
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-2">
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-bold">{index + 1}</span>
          <h3 className="font-semibold truncate">{schema?.label || node.type}</h3>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button className="btn btn-secondary btn-compact" onClick={moveUp}>↑</button>
          <button className="btn btn-secondary btn-compact" onClick={moveDown}>↓</button>
          <button className="btn btn-secondary btn-compact" onClick={duplicate}>Duplicate</button>
          <button className="btn btn-danger btn-compact" onClick={remove}>Delete</button>
        </div>
      </div>

      {schema?.attrs && (
        <div className="mt-2 space-y-2">
          {('in' in schema.attrs || 'in2' in schema.attrs) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {'in' in schema.attrs && (
                <label className="block">
                  <span className="block text-[11px] font-medium mb-0.5">in</span>
                  <select className="select-compact" value={node.attrs?.in ?? 'SourceGraphic'} onChange={(e) => setAttr('in', e.target.value)}>
                    {inputOptions.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </label>
              )}
              {'in2' in schema.attrs && (
                <AttrInput label="in2" conf={schema.attrs.in2} value={node.attrs?.in2 ?? ''} onChange={(v) => setAttr('in2', v)} />
              )}
            </div>
          )}

          {('dx' in (schema.attrs || {})) && ('dy' in (schema.attrs || {})) && (
            <div className="grid grid-cols-2 gap-2">
              <AttrInput label="dx" conf={{ ...schema.attrs.dx, compact: true }} value={node.attrs?.dx ?? ''} onChange={(v) => setAttr('dx', v)} />
              <AttrInput label="dy" conf={{ ...schema.attrs.dy, compact: true }} value={node.attrs?.dy ?? ''} onChange={(v) => setAttr('dy', v)} />
            </div>
          )}

          {'k1' in (schema.attrs || {}) && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['k1','k2','k3','k4'].filter((k) => k in (schema.attrs || {})).map((k) => (
                <AttrInput key={k} label={k} conf={{ ...schema.attrs[k], compact: true }} value={node.attrs?.[k] ?? ''} onChange={(v) => setAttr(k, v)} />
              ))}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-2">
            {Object.entries(schema.attrs)
              .filter(([k]) => !['in','in2','dx','dy','k1','k2','k3','k4','result'].includes(k))
              .map(([k, conf]) => (
                <AttrInput key={k} label={k} conf={{ ...conf, compact: true }} value={node.attrs?.[k] ?? ''} onChange={(v) => setAttr(k, v)} />
              ))}
          </div>

          {'result' in schema.attrs && (
            <div className="grid grid-cols-1">
              <AttrInput label="result" conf={{ ...schema.attrs.result, compact: true }} value={node.attrs?.result ?? ''} onChange={(v) => setAttr('result', v)} />
            </div>
          )}
        </div>
      )}

      {node.type === 'feComponentTransfer' && (
        <div className="mt-3 border-t pt-2 space-y-2">
          <h4 className="font-medium text-sm">Channel Functions</h4>
          {Object.entries(node.funcs || {}).map(([fk, fnode]) => (
            <div key={(fnode as any).id} className="rounded-lg border border-gray-200 dark:border-gray-700 p-2">
              <div className="mb-1 font-mono text-xs">&lt;{fk} /&gt;</div>
              <div className="grid md:grid-cols-2 gap-2">
                {Object.entries(FUNC_SCHEMA).map(([k, conf]) => (
                  <AttrInput key={k} label={k} conf={{ ...conf, compact: true }} value={(fnode as any).attrs?.[k] ?? ''} onChange={(v) => setFuncAttr(fk, k, v)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {node.type === 'feMerge' && (
        <div className="mt-3 border-t pt-2 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Merge Nodes</h4>
            <button className="btn btn-secondary btn-compact" onClick={addMergeNode}>+ Add feMergeNode</button>
          </div>
          {(node.mergeNodes || []).map((mn, i) => (
            <div key={mn.id} className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">{i + 1}.</span>
              <select className="select-compact flex-1 min-w-0 basis-44" value={mn.in || 'SourceGraphic'} onChange={(e) => setMergeIn(i, e.target.value)}>
                {inputOptions.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              <button className="btn btn-danger btn-compact" onClick={() => removeMergeNode(i)}>✕</button>
            </div>
          ))}
        </div>
      )}

      <details className="mt-2 border-t pt-2">
        <summary className="cursor-pointer text-sm select-none flex items-center justify-between">
          <span>Custom attributes ({(node.custom || []).length})</span>
          <button type="button" className="btn btn-secondary btn-compact" onClick={(e) => (e.preventDefault(), addCustomAttr())}>+ Add</button>
        </summary>
        <div className="mt-2 space-y-2">
          {(node.custom || []).map((c) => (
            <div key={c.id} className="grid grid-cols-1 sm:grid-cols-[1fr,1fr,auto] gap-2">
              <input className="input-compact" placeholder="name (e.g. primitiveUnits)" value={c.name} onChange={(e) => setCustomAttr(c.id, 'name', e.target.value)} />
              <input className="input-compact" placeholder="value" value={c.value} onChange={(e) => setCustomAttr(c.id, 'value', e.target.value)} />
              <button className="btn btn-danger btn-compact" onClick={() => removeCustomAttr(c.id)}>✕</button>
            </div>
          ))}
          <p className="text-xs text-gray-500 dark:text-gray-400">Tip: use hyphen-case names (e.g., primitiveUnits, color-interpolation-filters, x, y, width, height, etc.).</p>
        </div>
      </details>
    </div>
  );
}
