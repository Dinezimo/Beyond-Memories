import { useRef, useState } from 'react';
import { Frame, useStore } from '../../lib/store';

const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result));
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

const CustomizationPanel = () => {
  const { rooms, currentRoomId, addFrame, updateFrame, removeFrame, currentUser } = useStore();
  const room = rooms.find(r => r.id === currentRoomId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState<string | null>(null);

  if (!room || !currentRoomId) return null;

  const onPickFile = () => fileInputRef.current?.click();

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentRoomId) return;
    const f = e.target.files?.[0];
    if (!f) return;
    const isVideo = f.type.startsWith('video/');
    // Use data URL for images; for videos attempt data URL but may be large.
    let url = '';
    try {
      url = await toBase64(f);
    } catch {
      url = URL.createObjectURL(f);
    }
    const newFrame: Frame = {
      uuid: `frame-${Date.now()}`,
      img: url,
      mediaType: isVideo ? 'video' : 'image',
      title: f.name,
      description: '',
      position: [Math.random() * 6 - 3, 4, 14],
      rotation: [0, 0, 0],
      scale: [0.6, 0.6, 0.2],
    };
    addFrame(currentRoomId, newFrame);
    e.currentTarget.value = '';
  };

  const handleUpdate = (id: string, patch: Partial<Frame>) => {
    if (!currentRoomId) return;
    updateFrame(currentRoomId, { uuid: id, ...patch });
  };

  const handleReplaceMedia = async (id: string, file?: File | null) => {
    if (!currentRoomId || !file) return;
    const isVideo = file.type.startsWith('video/');
    let url = '';
    try {
      url = await toBase64(file);
    } catch {
      url = URL.createObjectURL(file);
    }
    updateFrame(currentRoomId, { uuid: id, img: url, mediaType: isVideo ? 'video' : 'image' });
  };

  const isOwner = currentUser && room.ownerId === currentUser.id;
  const header = isOwner ? 'Manage Your Memories' : 'Manage Room Memories';

  return (
    <div className="absolute bottom-20 right-4 bg-base-100 bg-opacity-90 p-4 rounded-lg shadow-lg flex flex-col gap-3 max-w-md w-[90vw]">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">{header}</h3>
        <button className="btn btn-secondary btn-sm" onClick={onPickFile}>Add Photo/Video</button>
        <input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFiles} />
      </div>

      <div className="max-h-[40vh] overflow-auto flex flex-col gap-3 pr-1">
        {room.frames.length === 0 && (
          <div className="text-sm opacity-70">No memories yet. Click “Add Photo/Video”.</div>
        )}
        {room.frames.map((f) => (
          <div key={f.uuid} className="p-2 rounded border border-base-300 bg-base-200/60">
            <div className="flex items-start gap-3">
              <div className="w-20 h-14 bg-base-300 rounded overflow-hidden flex items-center justify-center">
                {f.mediaType === 'video' || (f.img?.toLowerCase?.().match(/\.(mp4|webm|ogg)$/)) ? (
                  <video src={f.img} className="w-full h-full object-cover" muted playsInline />
                ) : (
                  <img src={f.img} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <input
                    className="input input-sm input-bordered w-full"
                    value={f.title ?? ''}
                    placeholder="Title"
                    onChange={(e) => handleUpdate(f.uuid, { title: e.target.value })}
                  />
                  <button className="btn btn-xs" onClick={() => { setEditing(editing === f.uuid ? null : f.uuid); }}>Edit</button>
                  <label className="btn btn-xs">
                    Replace
                    <input type="file" accept="image/*,video/*" className="hidden" onChange={(e) => handleReplaceMedia(f.uuid, e.target.files?.[0])} />
                  </label>
                  <button className="btn btn-xs btn-error" onClick={() => removeFrame(currentRoomId, f.uuid)}>Delete</button>
                </div>
                {editing === f.uuid && (
                  <div className="mt-2 grid gap-2">
                    <textarea
                      className="textarea textarea-bordered textarea-sm"
                      placeholder="Description"
                      value={f.description ?? ''}
                      onChange={(e) => handleUpdate(f.uuid, { description: e.target.value })}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input className="input input-sm input-bordered" placeholder="Date" value={f.date ?? ''} onChange={(e) => handleUpdate(f.uuid, { date: e.target.value })} />
                      <input className="input input-sm input-bordered" placeholder="Location" value={f.location ?? ''} onChange={(e) => handleUpdate(f.uuid, { location: e.target.value })} />
                    </div>
                    <input
                      className="input input-sm input-bordered"
                      placeholder="People (comma separated)"
                      value={(f.people ?? []).join(', ')}
                      onChange={(e) => handleUpdate(f.uuid, { people: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomizationPanel;
