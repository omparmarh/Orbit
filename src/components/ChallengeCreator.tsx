import React from 'react';
import { Trophy, Plus, Trash2 } from 'lucide-react';

export interface ChallengeData {
  title: string;
  description: string;
  type: 'try_it' | 'vote' | 'predict' | 'remix';
  rules: string[];
  closesAt: string;
}

export const ChallengeCreator: React.FC<{
  value: ChallengeData;
  onChange: (data: ChallengeData) => void;
}> = ({ value, onChange }) => {

  const addRule = () => {
    onChange({ ...value, rules: [...value.rules, ''] });
  };

  const removeRule = (index: number) => {
    onChange({ ...value, rules: value.rules.filter((_, i) => i !== index) });
  };

  const updateRule = (index: number, text: string) => {
    const updated = [...value.rules];
    updated[index] = text;
    onChange({ ...value, rules: updated });
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
        <Trophy size={18} color="var(--color-signal-orange)" />
        <h4 style={{ fontSize: '14px', margin: 0 }}>Create Challenge</h4>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
          Challenge Title
        </label>
        <input
          type="text"
          placeholder="e.g. 3-Day AI Prompting Challenge"
          value={value.title}
          onChange={e => onChange({ ...value, title: e.target.value })}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
          Description
        </label>
        <textarea
          rows={2}
          placeholder="What should participants do?"
          value={value.description}
          onChange={e => onChange({ ...value, description: e.target.value })}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
          Challenge Type
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
          {([
            { id: 'try_it', label: '🎯 Try It' },
            { id: 'vote', label: '🗳️ Vote' },
            { id: 'predict', label: '🔮 Predict' },
            { id: 'remix', label: '🎨 Remix' },
          ] as const).map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange({ ...value, type: t.id })}
              style={{
                padding: '8px 4px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                fontSize: '11px',
                fontWeight: 600,
                backgroundColor: value.type === t.id ? 'var(--color-signal-orange-light)' : 'var(--color-surface-card)',
                color: value.type === t.id ? 'var(--color-signal-orange)' : 'var(--color-text-secondary)',
                borderColor: value.type === t.id ? 'var(--color-signal-orange)' : 'var(--color-border)',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rules */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
          Rules
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {value.rules.map((rule, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder={`Rule ${idx + 1}`}
                value={rule}
                onChange={e => updateRule(idx, e.target.value)}
                style={{ flex: 1, padding: '6px 10px', fontSize: '12px' }}
              />
              <button
                type="button"
                onClick={() => removeRule(idx)}
                style={{ color: 'var(--color-text-muted)', padding: '4px' }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addRule}
          className="btn-secondary"
          style={{ fontSize: '11px', padding: '4px 10px', marginTop: '6px' }}
        >
          <Plus size={12} /> Add Rule
        </button>
      </div>

      <div>
        <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
          Deadline
        </label>
        <input
          type="datetime-local"
          value={value.closesAt}
          onChange={e => onChange({ ...value, closesAt: e.target.value })}
          style={{ width: '100%', padding: '8px 12px', fontSize: '13px' }}
        />
      </div>
    </div>
  );
};
