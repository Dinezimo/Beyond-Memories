import { useState } from 'react';
import { useStore } from '../../../lib/store';

const templates = [
  { id: 'classic', name: 'Classic', wall: '#e5e7eb', floor: '#8b5a2b' },
  { id: 'dark', name: 'Dark', wall: '#1f2937', floor: '#111827' },
  { id: 'gallery', name: 'Gallery White', wall: '#ffffff', floor: '#4b5563' },
];

export default function DecorPanel() {
  const store = useStore();
  const currentRoom = store.rooms.find((r) => r.id === store.currentRoomId);
  const isOwner = !!store.currentUser && currentRoom?.ownerId === store.currentUser.id;
  const isAdmin = !!store.currentUser && currentRoom?.members?.some(
    (m) => m.userId === store.currentUser!.id && (m.role === 'admin' || m.role === 'maintainer')
  );
  const canAdmin = isOwner || isAdmin;

  const [preview, setPreview] = useState<string | null>(null);

  const apply = () => {
    if (!canAdmin || !currentRoom || !preview) return;
    const t = templates.find((x) => x.id === preview);
    if (!t) return;
    store.updateRoomMeta(currentRoom.id, { theme: { wallColor: t.wall, floorColor: t.floor } });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold">Decor</div>
        <button className="btn btn-xs" onClick={() => store.setActivePanel(null)}>Close</button>
      </div>
      {!canAdmin && <div className="text-sm opacity-70">Only admins/owner can change decor.</div>}
      <div className="grid gap-2">
        {templates.map((t) => (
          <label key={t.id} className="flex items-center gap-3 p-2 rounded bg-base-200/60">
            <input
              type="radio"
              name="decor"
              className="radio radio-sm"
              checked={preview === t.id}
              onChange={() => setPreview(t.id)}
              disabled={!canAdmin}
            />
            <div className="w-6 h-6 rounded" style={{ background: t.wall }} />
            <div className="w-6 h-6 rounded" style={{ background: t.floor }} />
            <div className="text-sm">{t.name}</div>
          </label>
        ))}
      </div>
      <div className="flex gap-2">
        <button className="btn btn-sm" onClick={apply} disabled={!canAdmin || !preview}>Apply</button>
      </div>
    </div>
  );
}
