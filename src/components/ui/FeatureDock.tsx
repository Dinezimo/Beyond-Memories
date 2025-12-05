import { useMemo } from 'react';
import { useStore } from '../../lib/store';
import { DockIcon } from './icons';

export default function FeatureDock() {
  const store = useStore();
  const currentRoom = store.rooms.find((r) => r.id === store.currentRoomId);
  const isOwner = !!store.currentUser && currentRoom?.ownerId === store.currentUser.id;
  const isAdmin = !!store.currentUser && currentRoom?.members?.some(
    (m) => m.userId === store.currentUser!.id && (m.role === 'admin' || m.role === 'maintainer')
  );
  const canAdmin = isOwner || isAdmin;

  const items = useMemo(() => (
    [
      { id: 'memories', title: 'Memories Tools', enabled: true },
      { id: 'members', title: 'Members', enabled: true },
      { id: 'messages', title: 'Messages', enabled: true },
      { id: 'profile', title: 'Profile', enabled: !!store.currentUser },
      { id: 'decor', title: 'Decor', enabled: !!canAdmin },
      { id: 'permissions', title: 'Permissions', enabled: !!canAdmin },
    ] as const
  ), [store.currentUser, canAdmin]);

  if (store.currentRoomId === null) return null; // hide in alley for now

  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3 p-2 rounded-xl bg-base-100/80 shadow-lg">
      <button className="btn btn-xs mb-1" onClick={() => store.toggleDock()}>
        {store.uiDockOpen ? '⟨' : '⟩'}
      </button>
      {store.uiDockOpen && items.map((it) => (
        <button
          key={it.id}
          disabled={!it.enabled}
          onClick={() => store.setActivePanel(it.id)}
          className={`flex items-center justify-center ${store.uiActivePanel === it.id ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
          title={it.title}
        >
          <DockIcon id={it.id as any} className="w-7 h-7" />
        </button>
      ))}
    </div>
  );
}
