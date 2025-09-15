import { useState } from 'react';
import { SCHEMAS } from '../../lib/filters/schemas';

type Props = { onAdd: (type: string) => void };

export default function PrimitivePicker({ onAdd }: Props) {
  const [choice, setChoice] = useState('');
  return (
    <div className="flex items-end gap-2">
      <div>
        <label className="block text-xs font-medium">Add primitive</label>
        <select
          className="select-compact min-w-56"
          value={choice}
          onChange={(e) => {
            const v = e.target.value;
            setChoice('');
            if (v) onAdd(v);
          }}
        >
          <option value="">Select…</option>
          {Object.keys(SCHEMAS).map((k) => (
            <option key={k} value={k}>{SCHEMAS[k].label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
