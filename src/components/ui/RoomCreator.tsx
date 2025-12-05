import React, { useState } from 'react';
import { useStore } from '../../lib/store';

interface RoomCreatorProps {
  onClose: () => void;
}

const RoomCreator: React.FC<RoomCreatorProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [access, setAccess] = useState<'public' | 'private'>('private');
  const { addRoom, currentUser } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !currentUser) return;

    addRoom({
      id: `room-${Date.now()}`,
      name,
      description,
      ownerId: currentUser.id,
      theme: { wallColor: '#f5f5dc', floorColor: '#d2b48c' },
      frames: [],
      avatars: [],
      access,
      members: [{ userId: currentUser.id, role: 'admin' }],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-base-100 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Create a New Room</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Room Name</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Family Memories"
              className="input input-bordered"
            />
          </div>
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short description of the room"
              className="textarea textarea-bordered"
            />
          </div>
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Access</span>
            </label>
            <select
              value={access}
              onChange={(e) => setAccess(e.target.value as 'public' | 'private')}
              className="select select-bordered"
            >
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create Room</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomCreator;
