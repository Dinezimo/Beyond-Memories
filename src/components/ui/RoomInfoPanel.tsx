import { useStore } from '../../lib/store';
import { useState } from 'react';
import PermissionsManager from './PermissionsManager';

const RoomInfoPanel = () => {
  const { rooms, currentRoomId, currentUser } = useStore();
  const [showPermissions, setShowPermissions] = useState(false);
  const currentRoom = rooms.find((room) => room.id === currentRoomId);

  if (!currentRoom) {
    return null;
  }

  return (
    <div className="absolute top-4 left-4 bg-base-100 bg-opacity-75 p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold">{currentRoom.name}</h2>
      <p className="text-sm">{currentRoom.description}</p>
      <div className={`badge ${currentRoom.access === 'private' ? 'badge-secondary' : 'badge-primary'} mt-2`}>
        {currentRoom.access}
      </div>
      {currentUser?.id === currentRoom.ownerId && (
        <button
          className="btn btn-xs btn-outline mt-2"
          onClick={() => setShowPermissions(true)}
        >
          Manage Permissions
        </button>
      )}
      {showPermissions && <PermissionsManager roomId={currentRoom.id} onClose={() => setShowPermissions(false)} />}
    </div>
  );
};

export default RoomInfoPanel;
