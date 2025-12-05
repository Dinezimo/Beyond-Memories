import { useStore } from '../../lib/store';

const RoomSwitcher = () => {
  const { rooms, currentRoomId, setCurrentRoomId } = useStore();
  const inAlley = currentRoomId === null;

  return (
    <div className="absolute bottom-4 left-4 flex flex-col gap-2">
      {!inAlley && (
        <button
          className="btn btn-accent"
          onClick={() => setCurrentRoomId(null)}
        >
          Return to Alley
        </button>
      )}
      {inAlley && rooms.map((room) => (
        <button
          key={room.id}
          className={`btn ${currentRoomId === room.id ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setCurrentRoomId(room.id)}
        >
          {room.name}
        </button>
      ))}
    </div>
  );
};

export default RoomSwitcher;
