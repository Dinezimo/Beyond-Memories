import { useMemo } from 'react';
import { useStore } from '../../../lib/store';

export default function MembersPanel() {
  const store = useStore();
  const currentRoom = store.rooms.find((r) => r.id === store.currentRoomId);
  const isPublic = currentRoom?.access === 'public';

  const members = useMemo(() => currentRoom?.members ?? [], [currentRoom?.members]);
  const connected = useMemo(() => {
    const list: { id: string; label: string }[] = [];
    if (store.currentUser) list.push({ id: store.currentUser.id, label: `${store.currentUser.name} (you)` });
    // Reuse avatars as placeholders for presence
    (currentRoom?.avatars ?? []).forEach((a, idx) => list.push({ id: `a-${idx}`, label: a.name }));
    return list;
  }, [store.currentUser, currentRoom?.avatars]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold">Members</div>
        <button className="btn btn-xs" onClick={() => store.setActivePanel(null)}>Close</button>
      </div>

      <div className="p-2 rounded bg-base-200/60">
        <div className="font-semibold mb-2">Current members {isPublic && <span className="badge badge-ghost ml-2">public room</span>}</div>
        <div className="grid gap-2 text-sm">
          {members.length === 0 && <div className="opacity-70">No members</div>}
          {members.map((m) => (
            <div key={m.userId} className="flex items-center gap-2">
              <span className="badge badge-ghost">{m.userId}</span>
              <span className="badge badge-outline">{m.role}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-2 rounded bg-base-200/60">
        <div className="font-semibold mb-2">Connected people</div>
        <div className="grid gap-2 text-sm">
          {connected.length === 0 && <div className="opacity-70">Nobody online</div>}
          {connected.map((p) => (
            <div key={p.id} className="flex items-center gap-2">
              <span className="badge badge-primary" />
              <span>{p.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
