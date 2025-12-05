import { useStore } from '../../../lib/store';

export default function PermissionsPanel() {
  const store = useStore();
  const currentRoom = store.rooms.find((r) => r.id === store.currentRoomId);
  const isOwner = !!store.currentUser && currentRoom?.ownerId === store.currentUser.id;
  const isAdmin = !!store.currentUser && currentRoom?.members?.some(
    (m) => m.userId === store.currentUser!.id && (m.role === 'admin' || m.role === 'maintainer')
  );
  const canAdmin = isOwner || isAdmin;

  const setAccess = (access: 'public' | 'private') => {
    if (!currentRoom || !canAdmin) return;
    store.updateRoomMeta(currentRoom.id, { access });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold">Permissions</div>
        <button className="btn btn-xs" onClick={() => store.setActivePanel(null)}>Close</button>
      </div>
      {!canAdmin && (
        <div className="text-sm opacity-70">Only admins/owner can update permissions.</div>
      )}
      <div className="p-2 rounded bg-base-200/60">
        <div className="font-semibold mb-2">Room access</div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2">
            <input type="radio" className="radio radio-sm" name="access" checked={currentRoom?.access==='public'} onChange={() => setAccess('public')} disabled={!canAdmin} />
            Public
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" className="radio radio-sm" name="access" checked={currentRoom?.access==='private'} onChange={() => setAccess('private')} disabled={!canAdmin} />
            Private
          </label>
        </div>
      </div>
      <div className="text-xs opacity-60">Advanced rules (e.g., per-action permissions) can be added later.</div>
    </div>
  );
}
