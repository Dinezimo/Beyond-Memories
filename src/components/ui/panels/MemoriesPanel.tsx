import { useMemo, useState } from 'react';
import { Member, useStore } from '../../../lib/store';

export default function MemoriesPanel() {
  const store = useStore();
  const currentRoom = store.rooms.find((r) => r.id === store.currentRoomId);
  const isOwner = !!store.currentUser && currentRoom?.ownerId === store.currentUser.id;
  const isAdmin = !!store.currentUser && currentRoom?.members?.some(
    (m) => m.userId === store.currentUser!.id && (m.role === 'admin' || m.role === 'maintainer')
  );
  const canAdmin = isOwner || isAdmin;
  const roomId = currentRoom?.id!;

  const [meta, setMeta] = useState(() => ({
    name: currentRoom?.name ?? '',
    description: currentRoom?.description ?? '',
    wallColor: currentRoom?.theme.wallColor ?? '#dddddd',
    floorColor: currentRoom?.theme.floorColor ?? '#8b5a2b',
    access: currentRoom?.access ?? 'public',
  }));
  const [newMember, setNewMember] = useState<{ userId: string; role: Member['role'] }>({ userId: '', role: 'viewer' });

  const memberList = useMemo(() => currentRoom?.members ?? [], [currentRoom?.members]);

  const saveMeta = () => {
    if (!canAdmin || !roomId) return;
    store.updateRoomMeta(roomId, {
      name: meta.name,
      description: meta.description,
      access: meta.access as any,
      theme: { wallColor: meta.wallColor, floorColor: meta.floorColor },
    });
  };

  const changeMemberRole = (userId: string, role: Member['role']) => {
    if (!canAdmin || !roomId) return;
    const next = memberList.map((m) => (m.userId === userId ? { ...m, role } : m));
    store.updateRoomMembers(roomId, next);
  };

  const addMember = () => {
    if (!canAdmin || !roomId || !newMember.userId.trim()) return;
    store.addMember(roomId, { userId: newMember.userId.trim(), role: newMember.role });
    setNewMember({ userId: '', role: 'viewer' });
  };

  const removeMember = (userId: string) => {
    if (!canAdmin || !roomId) return;
    store.removeMember(roomId, userId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold">Memories Tools</div>
        <button className="btn btn-xs" onClick={() => store.setActivePanel(null)}>Close</button>
      </div>

      {/* About Room */}
      <div className="p-2 rounded bg-base-200/60">
        <div className="font-semibold mb-2">About {currentRoom?.name}</div>
        {!canAdmin && (
          <div className="text-sm opacity-80">
            <div><b>Name:</b> {currentRoom?.name}</div>
            <div><b>Access:</b> {currentRoom?.access}</div>
            <div className="mt-1">{currentRoom?.description}</div>
          </div>
        )}
        {canAdmin && (
          <div className="grid gap-2">
            <input className="input input-bordered input-sm" placeholder="Room name" value={meta.name} onChange={(e) => setMeta({ ...meta, name: e.target.value })} />
            <textarea className="textarea textarea-bordered textarea-sm" placeholder="Description" value={meta.description} onChange={(e) => setMeta({ ...meta, description: e.target.value })} />
            <div className="grid grid-cols-2 gap-2 items-center">
              <label className="text-sm">Wall</label>
              <input type="color" className="input input-sm" value={meta.wallColor} onChange={(e) => setMeta({ ...meta, wallColor: e.target.value })} />
              <label className="text-sm">Floor</label>
              <input type="color" className="input input-sm" value={meta.floorColor} onChange={(e) => setMeta({ ...meta, floorColor: e.target.value })} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm">Access</label>
              <select className="select select-sm select-bordered" value={meta.access} onChange={(e) => setMeta({ ...meta, access: e.target.value as any })}>
                <option value="public">public</option>
                <option value="private">private</option>
              </select>
              <button className="btn btn-sm ml-auto" onClick={saveMeta}>Save</button>
            </div>
          </div>
        )}
      </div>

      {/* Shortcuts */}
      <div className="flex gap-2">
        <button
          className="btn btn-sm"
          onClick={() => store.setUiShowCustomize(true)}
          disabled={!canAdmin}
          title={canAdmin ? '' : 'Admins/Owner only'}
        >
          Customize your room
        </button>
        <button className="btn btn-sm" onClick={() => store.setUiShowCustomize(true)} disabled={!canAdmin}>Upload/Replace media</button>
      </div>

      {/* Member handling */}
      <div className="p-2 rounded bg-base-200/60">
        <div className="font-semibold mb-2">Members</div>
        {!canAdmin && <div className="text-sm opacity-70">Only admins/owner can manage members.</div>}
        {canAdmin && (
          <div className="grid gap-2">
            {memberList.length === 0 && <div className="text-sm opacity-70">No members yet.</div>}
            {memberList.map((m) => (
              <div key={m.userId} className="flex items-center gap-2">
                <div className="badge badge-ghost">{m.userId}</div>
                <select className="select select-xs select-bordered" value={m.role} onChange={(e) => changeMemberRole(m.userId, e.target.value as any)}>
                  <option value="viewer">viewer</option>
                  <option value="maintainer">maintainer</option>
                  <option value="admin">admin</option>
                </select>
                <button className="btn btn-xs btn-error ml-auto" onClick={() => removeMember(m.userId)}>Remove</button>
              </div>
            ))}
            <div className="flex items-center gap-2 mt-2">
              <input className="input input-sm input-bordered" placeholder="userId" value={newMember.userId} onChange={(e) => setNewMember({ ...newMember, userId: e.target.value })} />
              <select className="select select-sm select-bordered" value={newMember.role} onChange={(e) => setNewMember({ ...newMember, role: e.target.value as any })}>
                <option value="viewer">viewer</option>
                <option value="maintainer">maintainer</option>
                <option value="admin">admin</option>
              </select>
              <button className="btn btn-sm" onClick={addMember}>Add</button>
            </div>
          </div>
        )}
      </div>

      <div className="text-xs opacity-60">
        Astuce: cliquez sur une image dans la salle pour voir la fiche mémoire.
      </div>
    </div>
  );
}
