import React, { useState } from 'react';
import { useOrbit } from '../context/OrbitContext';
import { useAuth } from '../context/AuthContext';
import { OrbitLogo } from './OrbitLogo';
import { NotificationCenter } from './NotificationCenter';
import { Bell, PlusCircle, LogOut } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentUser, unreadNotificationsCount, setIsIntakeOpen, setSelectedItemId, setSelectedRoomId, activeTab, setActiveTab } = useOrbit();
  const { signOut } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'var(--color-surface-card)',
          borderBottom: '1px solid var(--color-border)',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => {
              setSelectedItemId(null);
              setSelectedRoomId(null);
            }}
            style={{ padding: 0, textAlign: 'left' }}
          >
            <OrbitLogo size={32} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Quick share action button */}
          <button
            className="btn-primary"
            onClick={() => setIsIntakeOpen(true)}
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            <PlusCircle size={16} />
            <span>Share Link</span>
          </button>

          {/* Notifications Icon */}
          <button
            onClick={() => setShowNotifications(true)}
            style={{
              position: 'relative',
              padding: '8px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'transparent',
              color: 'var(--color-ink)'
            }}
            title="Notifications"
          >
            <Bell size={20} />
            {unreadNotificationsCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  backgroundColor: 'var(--color-signal-orange)',
                  color: '#FFF',
                  fontSize: '10px',
                  fontWeight: 800,
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* User profile avatar */}
          <button
            onClick={() => {
              setSelectedItemId(null);
              setSelectedRoomId(null);
              setActiveTab('profile');
            }}
            style={{
              padding: 0,
              borderRadius: '50%',
              backgroundColor: 'transparent',
              border: activeTab === 'profile' ? '2px solid var(--color-signal-orange)' : '2px solid var(--color-action-blue)',
              display: 'flex',
              cursor: 'pointer',
              transition: 'border-color var(--transition-fast)'
            }}
            title="Your Profile & Settings"
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.displayName}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
          </button>

          {/* Sign Out */}
          <button
            onClick={() => signOut()}
            title="Sign Out"
            style={{
              padding: '8px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'transparent',
              color: 'var(--color-text-secondary)',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              border: 'none',
            }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Full Notification Center Panel */}
      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  );
};
