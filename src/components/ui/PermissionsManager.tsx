import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { mockUsers } from '../../lib/mockData';

interface PermissionsManagerProps {
  roomId: string;
  onClose: () => void;
}

const PermissionsManager: React.FC<PermissionsManagerProps> = ({ roomId, onClose }) => {
  const { rooms, updateRoomMembers } = useStore();
  const room = rooms.find((r) => r.id === roomId);
  const [members, setMembers] = useState(room?.members || []);

  const handleAddMember = () => {
    // In a real app, this would involve a user search
    const newUser = mockUsers.find(u => !members.some(m => m.userId === u.id));
    if (newUser) {
      setMembers([...members, { userId: newUser.id, role: 'viewer' }]);
    }
  };

  const handleRoleChange = (userId: string, role: 'admin' | 'maintainer' | 'viewer') => {
    setMembers(members.map(m => m.userId === userId ? { ...m, role } : m));
  };

  const handleRemoveMember = (userId: string) => {
    setMembers(members.filter(m => m.userId !== userId));
  };

  const handleSave = () => {
    updateRoomMembers(roomId, members);
    onClose();
  };

  if (!room) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-base-100 p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Manage Permissions for {room.name}</h2>
        <div className="space-y-4">
          {members.map(member => (
            <div key={member.userId} className="flex items-center justify-between">
              <span>{mockUsers.find(u => u.id === member.userId)?.name}</span>
              <div className="flex items-center gap-2">
                <select
                  value={member.role}
                  onChange={(e) => handleRoleChange(member.userId, e.target.value as any)}
                  className="select select-bordered select-sm"
                  disabled={room.ownerId === member.userId}
                >
                  <option value="viewer">Viewer</option>
                  <option value="maintainer">Maintainer</option>
                  <option value="admin">Admin</option>
                </select>
                <button
                  onClick={() => handleRemoveMember(member.userId)}
                  className="btn btn-error btn-sm"
                  disabled={room.ownerId === member.userId}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-between">
          <button onClick={handleAddMember} className="btn btn-secondary">Add Member</button>
          <div className="flex gap-4">
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionsManager;
