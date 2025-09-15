import type { AttrConf } from '../../lib/filters/types';

type Props = {
  label: string;
  conf: AttrConf & { compact?: boolean };
  value: any;
  onChange: (v: any) => void;
};

export default function AttrInput({ label, conf, value, onChange }: Props) {
  return (
    <label className="block">
      <span className="block text-[11px] font-medium mb-0.5">{label}</span>
      {conf.type === 'select' ? (
        <select className={conf.compact ? 'select-compact' : 'select'} value={(value ?? conf.default ?? '') as any} onChange={(e) => onChange(e.target.value)}>
          {(conf.options || []).map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      ) : conf.type === 'checkbox' ? (
        <input type="checkbox" className="h-4 w-4" checked={!!value} onChange={(e) => onChange(e.target.checked ? 'true' : 'false')} />
      ) : (
        <input
          type={conf.type || 'text'}
          step={conf.step as number | undefined}
          placeholder={conf.placeholder}
          className={conf.compact ? 'input-compact' : 'input'}
          value={(value ?? '') as any}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}
