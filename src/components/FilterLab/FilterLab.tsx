import { useEffect, useMemo, useState } from 'react';
import { SAMPLE_CONTENTS, SCHEMAS } from '../../lib/filters/schemas';
import type { FilterLabState, PrimitiveNode } from '../../lib/filters/types';
import { STORAGE, clamp, uid } from '../../lib/filters/utils';
import { buildFilterMarkup } from '../../lib/filters/markup';
import PrimitivePicker from './PrimitivePicker';
import PrimitiveCard from './PrimitiveCard';

export default function FilterLab() {
  const readAutosave = (): Partial<FilterLabState> | null => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE.autosave) : null;
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const getInitialTheme = () => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE.theme) : null;
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {}
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }
    return 'light';
  };

  const initial = readAutosave() || undefined;

  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);
  const [filterId, setFilterId] = useState(() => initial?.filterId || ('filter-' + uid()));
  const [colorSpace, setColorSpace] = useState(() => (initial as any)?.colorSpace || 'sRGB');
  const [prims, setPrims] = useState<PrimitiveNode[]>(() => (initial as any)?.prims || []);
  const [customWidth, setCustomWidth] = useState(() => (initial as any)?.customWidth ?? 300);
  const [customHeight, setCustomHeight] = useState(() => (initial as any)?.customHeight ?? 300);
  const [sample, setSample] = useState(() => (initial as any)?.sample || 'rect');
  const [sampleText, setSampleText] = useState(() => (initial as any)?.sampleText || 'SVG 💖');
  const [sampleSvg, setSampleSvg] = useState(() => (initial as any)?.sampleSvg || '<rect x="40" y="40" width="220" height="220" rx="24" fill="#5b9cf5" />');
  const [bg, setBg] = useState(() => (initial as any)?.bg || '#f3f4f6');
  const [presets, setPresets] = useState<any[]>([]);
  const [presetName, setPresetName] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState('');

  const getCurrentState = (): FilterLabState => ({
    version: 1,
    filterId,
    colorSpace,
    prims,
    customWidth,
    customHeight,
    sample,
    sampleText,
    sampleSvg,
    bg,
  });

  const applyState = (st?: Partial<FilterLabState> | null) => {
    if (!st) return;
    if (st.filterId) setFilterId(st.filterId);
    if (Array.isArray(st.prims)) setPrims(st.prims);
    if (typeof st.colorSpace === 'string') setColorSpace(st.colorSpace);
    if (typeof st.customWidth === 'number') setCustomWidth(st.customWidth);
    if (typeof st.customHeight === 'number') setCustomHeight(st.customHeight);
    if (typeof st.sample === 'string') setSample(st.sample);
    if (typeof st.sampleText === 'string') setSampleText(st.sampleText);
    if (typeof st.sampleSvg === 'string') setSampleSvg(st.sampleSvg);
    if (typeof st.bg === 'string') setBg(st.bg);
  };

  useEffect(() => {
    try {
      const rawPresets = localStorage.getItem(STORAGE.presets);
      if (rawPresets) setPresets(JSON.parse(rawPresets));
    } catch {}
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    try { localStorage.setItem(STORAGE.theme, theme); } catch {}
  }, [theme]);

  useEffect(() => {
    try {
      const state = { version: 1, filterId, prims, customWidth, customHeight, sample, bg };
      localStorage.setItem(STORAGE.autosave, JSON.stringify(state));
    } catch {}
  }, [filterId, colorSpace, prims, customWidth, customHeight, sample, sampleText, sampleSvg, bg]);

  useEffect(() => { try { localStorage.setItem(STORAGE.sampleText, sampleText); } catch {} }, [sampleText]);
  useEffect(() => { try { localStorage.setItem(STORAGE.sampleSvg, sampleSvg); } catch {} }, [sampleSvg]);

  const persistPresets = (next: any[]) => {
    setPresets(next);
    try { localStorage.setItem(STORAGE.presets, JSON.stringify(next)); } catch {}
  };

  const savePreset = () => {
    const name = presetName.trim() || `Preset ${new Date().toLocaleString()}`;
    const item = { id: uid(), name, createdAt: Date.now(), state: getCurrentState() };
    const next = [item, ...presets];
    persistPresets(next);
    setPresetName('');
    setSelectedPresetId(item.id);
  };

  const loadPreset = (id: string) => {
    const p = presets.find((x) => x.id === id);
    if (!p) return;
    applyState(p.state);
  };

  const deletePreset = (id: string) => {
    const next = presets.filter((x) => x.id !== id);
    persistPresets(next);
    if (selectedPresetId === id) setSelectedPresetId('');
  };

  const addPrimitive = (type: string) => {
    if (!type) return;
    const schema = SCHEMAS[type];
    setPrims((p) => {
      const baseAttrs: Record<string, any> = {};
      if (schema?.attrs) {
        for (const [k, v] of Object.entries(schema.attrs)) {
          if (v && (v as any).default !== undefined) baseAttrs[k] = (v as any).default;
        }
      }
      if (schema?.attrs && Object.prototype.hasOwnProperty.call(schema.attrs, 'result') && baseAttrs.result === undefined) {
        const idx = p.length + 1;
        baseAttrs.result = `${type}_${idx}`;
      }

      const node: PrimitiveNode = { id: uid(), type, attrs: baseAttrs, custom: [] };
      if (type === 'feComponentTransfer') {
        node.funcs = {
          feFuncR: { id: uid(), attrs: { type: 'identity' } },
          feFuncG: { id: uid(), attrs: { type: 'identity' } },
          feFuncB: { id: uid(), attrs: { type: 'identity' } },
          feFuncA: { id: uid(), attrs: { type: 'identity' } },
        };
      }
      if (type === 'feMerge') {
        node.mergeNodes = [{ id: uid(), in: 'SourceGraphic' }];
      }
      return [...p, node];
    });
  };

  const move = (idx: number, dir: number) => {
    setPrims((p) => {
      const n = [...p];
      const j = clamp(idx + dir, 0, n.length - 1);
      const [it] = n.splice(idx, 1);
      n.splice(j, 0, it);
      return n;
    });
  };

  const remove = (idx: number) => setPrims((p) => p.filter((_, i) => i !== idx));
  const duplicate = (idx: number) => setPrims((p) => {
    const copy: PrimitiveNode = JSON.parse(JSON.stringify(p[idx]));
    copy.id = uid();
    if (copy.funcs) for (const k of Object.keys(copy.funcs)) copy.funcs[k].id = uid();
    if (copy.mergeNodes) copy.mergeNodes = copy.mergeNodes.map((m) => ({ ...m, id: uid() }));
    const n = [...p];
    n.splice(idx + 1, 0, copy);
    return n;
  });

  const setAttr = (idx: number, key: string, value: any) => {
    setPrims((p) => {
      const n = [...p];
      n[idx] = { ...n[idx], attrs: { ...n[idx].attrs, [key]: value } };
      return n;
    });
  };

  const setFuncAttr = (idx: number, funcKey: string, attrKey: string, value: any) => {
    setPrims((p) => {
      const n = [...p];
      const node = n[idx];
      node.funcs = { ...node.funcs, [funcKey]: { ...node.funcs![funcKey], attrs: { ...node.funcs![funcKey].attrs, [attrKey]: value } } } as any;
      n[idx] = { ...node };
      return n;
    });
  };

  const addMergeNode = (idx: number) => setPrims((p) => {
    const n = [...p];
    n[idx] = { ...n[idx], mergeNodes: [...(n[idx].mergeNodes || []), { id: uid(), in: 'SourceGraphic' }] };
    return n;
  });

  const setMergeIn = (idx: number, mIdx: number, value: string) => setPrims((p) => {
    const n = [...p];
    const mn = [...(n[idx].mergeNodes || [])];
    mn[mIdx] = { ...mn[mIdx], in: value } as any;
    n[idx] = { ...n[idx], mergeNodes: mn } as any;
    return n;
  });

  const removeMergeNode = (idx: number, mIdx: number) => setPrims((p) => {
    const n = [...p];
    const mn = [...(n[idx].mergeNodes || [])];
    mn.splice(mIdx, 1);
    n[idx] = { ...n[idx], mergeNodes: mn } as any;
    return n;
  });

  const addCustomAttr = (idx: number) => setPrims((p) => {
    const n = [...p];
    const node = n[idx];
    const next = [...(node.custom || []), { id: uid(), name: '', value: '' }];
    n[idx] = { ...node, custom: next };
    return n;
  });

  const setCustomAttr = (idx: number, cId: string, field: 'name' | 'value', value: string) => setPrims((p) => {
    const n = [...p];
    const node = n[idx];
    const next = (node.custom || []).map((c) => (c.id === cId ? { ...c, [field]: value } : c));
    n[idx] = { ...node, custom: next };
    return n;
  });

  const removeCustomAttr = (idx: number, cId: string) => setPrims((p) => {
    const n = [...p];
    const node = n[idx];
    const next = (node.custom || []).filter((c) => c.id !== cId);
    n[idx] = { ...node, custom: next };
    return n;
  });

  const filterMarkup = useMemo(() => buildFilterMarkup(prims, filterId, colorSpace), [prims, filterId, colorSpace]);

  const getInputOptions = (uptoIdx: number) => {
    const opts = new Set(['SourceGraphic', 'SourceAlpha']);
    for (let i = 0; i < uptoIdx; i++) {
      const r = (prims[i]?.attrs as any)?.result?.trim?.();
      if (r) opts.add(r);
    }
    return Array.from(opts);
  };

  return (
    <div className="min-h-dvh h-screen w-full bg-gradient-to-b text-gray-900 dark:text-gray-100">
      <div className="mx-auto h-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-2">
        <header className="lg:col-span-2 flex h-fit flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <h1 className="text-xl md:text-2xl font-bold">SVG Filter Lab</h1>
          <div className="flex flex-wrap items-end gap-2">
            <button className="btn btn-secondary btn-compact" title="Toggle theme" onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}>{theme === 'dark' ? '☀️ Light' : '🌙 Dark'}</button>
            <div className="flex items-center gap-2">
              <label className="text-xs">Filter ID</label>
              <input className="input-compact w-44" value={filterId} onChange={(e) => setFilterId(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs">Color Space</label>
              <select className="select-compact w-32" value={colorSpace} onChange={(e) => setColorSpace(e.target.value)}>
                {['auto','sRGB','linearRGB'].map((v) => (<option key={v} value={v}>{v}</option>))}
              </select>
            </div>
            <div className="flex items-end gap-1.5">
              <input className="input-compact w-40" placeholder="Preset name" value={presetName} onChange={(e) => setPresetName(e.target.value)} />
              <button className="btn btn-primary btn-compact" onClick={savePreset}>Save</button>
            </div>
            <div className="flex items-end gap-1.5">
              <select className="select-compact w-48" value={selectedPresetId} onChange={(e) => setSelectedPresetId(e.target.value)}>
                <option value="">Presets…</option>
                {presets.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
              </select>
              <button className="btn btn-secondary btn-compact disabled:opacity-50" disabled={!selectedPresetId} onClick={() => loadPreset(selectedPresetId)}>Load</button>
              <button className="btn btn-danger btn-compact disabled:opacity-50" disabled={!selectedPresetId} onClick={() => deletePreset(selectedPresetId)}>Delete</button>
            </div>
          </div>
        </header>

        <section className="h-fit lg:h-full overflow-hidden space-y-2">
          <div className="rounded-lg h-fit shadow p-2 bg-white dark:bg-gray-800">
            <div className="flex flex-wrap items-end gap-2">
              <PrimitivePicker onAdd={addPrimitive} />
              <button onClick={() => addPrimitive('feDropShadow')} className="btn btn-primary btn-compact">DropShadow</button>
              <button onClick={() => addPrimitive('feGaussianBlur')} className="btn btn-secondary btn-compact">Blur</button>
              <button onClick={() => addPrimitive('feColorMatrix')} className="btn btn-secondary btn-compact">ColorMatrix</button>
            </div>
          </div>

          <div className="rounded-md h-fit lg:h-[calc(100%-80px)] shadow p-2 bg-white dark:bg-gray-800 space-y-2 overflow-auto">
            {prims.length === 0 && (<p className="text-sm text-gray-500 dark:text-gray-400">Add primitives to build your filter. Chain with <code>in</code> / <code>result</code>.</p>)}
            {prims.map((node, idx) => (
              <PrimitiveCard
                key={node.id}
                node={node}
                index={idx}
                inputOptions={getInputOptions(idx)}
                setAttr={(k, v) => setAttr(idx, k, v)}
                moveUp={() => move(idx, -1)}
                moveDown={() => move(idx, +1)}
                remove={() => remove(idx)}
                duplicate={() => duplicate(idx)}
                setFuncAttr={(fk, k, v) => setFuncAttr(idx, fk, k, v)}
                addMergeNode={() => addMergeNode(idx)}
                setMergeIn={(mIdx, v) => setMergeIn(idx, mIdx, v)}
                removeMergeNode={(mIdx) => removeMergeNode(idx, mIdx)}
                addCustomAttr={() => addCustomAttr(idx)}
                setCustomAttr={(cId, field, v) => setCustomAttr(idx, cId, field as any, v)}
                removeCustomAttr={(cId) => removeCustomAttr(idx, cId)}
              />
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <div className="rounded-2xl shadow p-3 bg-white dark:bg-gray-800">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <label className="text-xs">Canvas</label>
              <input type="number" className="input-compact w-20" value={customWidth} onChange={(e) => setCustomWidth(parseInt(e.target.value || '0'))} />
              <span>×</span>
              <input type="number" className="input-compact w-20" value={customHeight} onChange={(e) => setCustomHeight(parseInt(e.target.value || '0'))} />
              <label className="text-xs ml-2">BG</label>
              <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} />
              <label className="text-xs ml-2">Sample</label>
              <select className="select-compact w-36" value={sample} onChange={(e) => setSample(e.target.value)}>
                {SAMPLE_CONTENTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
              {sample === 'text' && (<>
                <label className="text-xs ml-2">Text</label>
                <input className="input-compact w-48" value={sampleText} onChange={(e) => setSampleText(e.target.value)} placeholder="Enter text" />
              </>)}
              {sample === 'custom' && (<>
                <label className="text-xs ml-2">Custom SVG</label>
                <textarea className="input-compact w-[28rem] h-20 font-mono" value={sampleSvg} onChange={(e) => setSampleSvg(e.target.value)} placeholder="Paste SVG elements (e.g., <rect .../>, <circle .../>)" />
              </>)}
            </div>

            <div className="border rounded-xl overflow-hidden border-gray-200 dark:border-gray-700" style={{ background: bg }}>
              <svg width={customWidth} height={customHeight} viewBox={`0 0 ${customWidth} ${customHeight}`}>
                <defs dangerouslySetInnerHTML={{ __html: filterMarkup }} />
                <g filter={`url(#${filterId})`}>
                  {sample === 'rect' && <rect x={40} y={40} width={customWidth - 80} height={customHeight - 80} rx={24} fill="#5b9cf5" />}
                  {sample === 'circle' && <circle cx={customWidth / 2} cy={customHeight / 2} r={Math.min(customWidth, customHeight) / 3} fill="#5b9cf5" />}
                  {sample === 'text' && (
                    <text x={customWidth / 2} y={customHeight / 2} dominantBaseline="middle" textAnchor="middle" fontSize={Math.min(customWidth, customHeight) / 5} fontFamily="ui-sans-serif, system-ui, -apple-system" fill="#111827">{sampleText}</text>
                  )}
                  {sample === 'image' && (
                    <image x={40} y={40} width={customWidth - 80} height={customHeight - 80} preserveAspectRatio="xMidYMid slice" href="/vite.svg" />
                  )}
                  {sample === 'custom' && (
                    <g dangerouslySetInnerHTML={{ __html: sampleSvg }} />
                  )}
                </g>
              </svg>
            </div>
          </div>

          <div className="rounded-2xl shadow p-3 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold">Generated &lt;filter&gt; Markup</h2>
              <button className="btn btn-primary btn-compact" onClick={() => navigator.clipboard.writeText(filterMarkup)}>Copy</button>
            </div>
            <pre className="text-xs bg-gray-900 text-green-200 dark:bg-gray-950 p-3 rounded-lg overflow-auto max-h-[30vh]"><code>{filterMarkup}</code></pre>
          </div>
        </section>
      </div>
    </div>
  );
}
