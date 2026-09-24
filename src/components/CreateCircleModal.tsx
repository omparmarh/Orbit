import React, { useState } from 'react';
import { useOrbit } from '../context/OrbitContext';
import { X, Users, Plus, Trash2 } from 'lucide-react';
import type { Circle } from '../types/orbit';

export const CreateCircleModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { addCircle, currentUser } = useOrbit();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'private' | 'invite_only' | 'discoverable'>('discoverable');
  const [rules, setRules] = useState<string[]>(['Be respectful to all circle members', 'Share relevant short videos & ideas']);
  const [newRule, setNewRule] = useState('');
  const avatarUrl = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=200&q=80';

  if (!isOpen) return null;

  const handleAddRule = () => {
    if (newRule.trim()) {
      setRules(prev => [...prev, newRule.trim()]);
      setNewRule('');
    }
  };

  const handleRemoveRule = (index: number) => {
    setRules(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCircle: Circle = {
      id: `circle_${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      visibility,
      ownerId: currentUser.id,
      rules,
      avatarUrl,
      memberCount: 1,
      activeStreakDays: 1,
      streakPaused: false
    };

    addCircle(newCircle);
    onClose();
    // Reset form
    setName('');
    setDescription('');
    setRules(['Be respectful to all circle members', 'Share relevant short videos & ideas']);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(19, 34, 56, 0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div
        className="orbit-card"
        style={{
          width: '100%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: 'var(--color-surface-card)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={20} color="var(--color-action-blue)" />
            Create a New Circle
          </h3>
          <button onClick={onClose} style={{ color: 'var(--color-text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              Circle Name
            </label>
            <input
              type="text"
              placeholder="e.g. Sunday Cooking Club, AI Research Circle..."
              value={name}
              onChange={e => setName(e.target.value)}
              required
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              Description
            </label>
            <textarea
              rows={2}
              placeholder="What is the shared purpose of this circle?"
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              Privacy & Visibility
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {(['discoverable', 'invite_only', 'private'] as const).map(v => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVisibility(v)}
                  style={{
                    padding: '8px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'capitalize',
                    backgroundColor: visibility === v ? 'var(--color-action-blue-light)' : 'var(--color-surface)',
                    color: visibility === v ? 'var(--color-action-blue)' : 'var(--color-text-secondary)',
                    borderColor: visibility === v ? 'var(--color-action-blue)' : 'var(--color-border)'
                  }}
                >
                  {v.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Circle Rules list */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              Circle Guidelines & Rules
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px' }}>
              {rules.map((rule, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'var(--color-surface)',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '12px'
                  }}
                >
                  <span>• {rule}</span>
                  <button type="button" onClick={() => handleRemoveRule(idx)} style={{ color: 'var(--color-text-muted)' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Add a new rule..."
                value={newRule}
                onChange={e => setNewRule(e.target.value)}
                style={{ flex: 1, padding: '8px 12px', fontSize: '12px' }}
              />
              <button type="button" className="btn-secondary" onClick={handleAddRule} style={{ padding: '8px 12px', fontSize: '12px' }}>
                <Plus size={14} /> Add
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Circle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
