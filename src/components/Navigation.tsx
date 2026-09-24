import React from 'react';
import { useOrbit } from '../context/OrbitContext';
import { Home, Compass, PlusCircle, MessageSquare, Users } from 'lucide-react';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, setIsIntakeOpen, setSelectedItemId, setSelectedRoomId } = useOrbit();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'create', label: 'Create', icon: PlusCircle, isAction: true },
    { id: 'rooms', label: 'Rooms', icon: MessageSquare },
    { id: 'circles', label: 'Circles', icon: Users },
  ];

  const handleNavClick = (id: string, isAction?: boolean) => {
    setSelectedItemId(null);
    setSelectedRoomId(null);
    if (isAction) {
      setIsIntakeOpen(true);
    } else {
      setActiveTab(id as any);
    }
  };

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        backgroundColor: 'var(--color-surface-card)',
        borderTop: '1px solid var(--color-border)',
        padding: '8px 16px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        boxShadow: '0 -4px 20px rgba(19, 34, 56, 0.06)'
      }}
    >
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id && !item.isAction;

        if (item.isAction) {
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id, true)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-action-blue)',
                transform: 'translateY(-8px)'
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-action-blue)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-blue)'
                }}
              >
                <PlusCircle size={26} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, marginTop: '2px', color: 'var(--color-action-blue)' }}>
                {item.label}
              </span>
            </button>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: '6px 12px',
              color: isActive ? 'var(--color-action-blue)' : 'var(--color-text-secondary)',
              transition: 'color var(--transition-fast)'
            }}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
            <span style={{ fontSize: '11px', fontWeight: isActive ? 700 : 500 }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
