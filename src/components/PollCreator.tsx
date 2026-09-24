import React from 'react';
import { Plus, Trash2, BarChart3 } from 'lucide-react';

export interface PollData {
  question: string;
  options: string[];
  closesAt?: string;
}

export const PollCreator: React.FC<{
  value: PollData;
  onChange: (data: PollData) => void;
}> = ({ value, onChange }) => {

  const addOption = () => {
    if (value.options.length >= 6) return;
    onChange({ ...value, options: [...value.options, ''] });
  };

  const removeOption = (index: number) => {
    if (value.options.length <= 2) return;
    onChange({ ...value, options: value.options.filter((_, i) => i !== index) });
  };

  const updateOption = (index: number, text: string) => {
    const updated = [...value.options];
    updated[index] = text;
    onChange({ ...value, options: updated });
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        padding: '16px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <BarChart3 size={18} color="var(--color-action-blue)" />
        <h4 style={{ fontSize: '14px', margin: 0 }}>Create Poll</h4>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
          Poll Question
        </label>
        <input
          type="text"
          placeholder="Ask your circle a question..."
          value={value.question}
          onChange={e => onChange({ ...value, question: e.target.value })}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
        <label style={{ fontSize: '12px', fontWeight: 600 }}>
          Options ({value.options.length}/6)
        </label>
        {value.options.map((opt, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-action-blue)', width: '20px', flexShrink: 0 }}>
              {String.fromCharCode(65 + idx)}.
            </span>
            <input
              type="text"
              placeholder={`Option ${idx + 1}`}
              value={opt}
              onChange={e => updateOption(idx, e.target.value)}
              style={{ flex: 1, padding: '8px 12px', fontSize: '13px' }}
            />
            {value.options.length > 2 && (
              <button
                type="button"
                onClick={() => removeOption(idx)}
                style={{ color: 'var(--color-text-muted)', padding: '4px' }}
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      {value.options.length < 6 && (
        <button
          type="button"
          onClick={addOption}
          className="btn-secondary"
          style={{ fontSize: '12px', padding: '6px 12px' }}
        >
          <Plus size={14} /> Add Option
        </button>
      )}

      <div style={{ marginTop: '12px' }}>
        <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
          Closes at (optional)
        </label>
        <input
          type="datetime-local"
          value={value.closesAt || ''}
          onChange={e => onChange({ ...value, closesAt: e.target.value })}
          style={{ width: '100%', padding: '8px 12px', fontSize: '13px' }}
        />
      </div>
    </div>
  );
};
