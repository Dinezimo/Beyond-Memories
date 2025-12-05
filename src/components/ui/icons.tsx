import React from 'react';

type Props = { className?: string };

export const IconMemories: React.FC<Props> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
    <rect x="3" y="5" width="18" height="14" rx="2"/>
    <circle cx="9" cy="10" r="2"/>
    <path d="M3 16l5-4 3 3 3-2 5 3" />
  </svg>
);

export const IconMembers: React.FC<Props> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
    <circle cx="9" cy="8" r="3"/>
    <path d="M3 19c0-3.314 2.686-6 6-6"/>
    <circle cx="17" cy="9" r="2.5"/>
    <path d="M14 19c0-2.485 2.015-4.5 4.5-4.5"/>
  </svg>
);

export const IconMessages: React.FC<Props> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
    <path d="M21 12a8 8 0 0 1-8 8H7l-4 3V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8z"/>
  </svg>
);

export const IconProfile: React.FC<Props> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c2-3 6-5 8-5s6 2 8 5"/>
  </svg>
);

export const IconDecor: React.FC<Props> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
    <path d="M12 12c-3 0-5 2-5 5 0 2 2 4 5 4s5-2 5-4c0-3-2-5-5-5z"/>
    <circle cx="6" cy="7" r="2"/>
    <circle cx="12" cy="5" r="2"/>
    <circle cx="18" cy="8" r="2"/>
  </svg>
);

export const IconPermissions: React.FC<Props> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
    <path d="M12 3l7 4v6c0 5-3.5 7.5-7 8-3.5-.5-7-3-7-8V7l7-4z"/>
    <path d="M10 12l2 2 4-4"/>
  </svg>
);

export const iconMap: Record<string, React.FC<Props>> = {
  memories: IconMemories,
  members: IconMembers,
  messages: IconMessages,
  profile: IconProfile,
  decor: IconDecor,
  permissions: IconPermissions,
};

export const DockIcon: React.FC<{ id: keyof typeof iconMap; className?: string }> = ({ id, className }) => {
  const Cmp = iconMap[id];
  return <Cmp className={className} />;
};
