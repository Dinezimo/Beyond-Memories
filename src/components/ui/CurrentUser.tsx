import { useStore } from '../../lib/store';
import { mockUsers } from '../../lib/mockData';

const CurrentUser = () => {
  const { currentUser, setCurrentUser } = useStore();

  return (
    <div className="absolute top-20 right-4 bg-base-100 bg-opacity-75 p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold">Current User</h2>
      <p>{currentUser ? currentUser.name : 'Not logged in'}</p>
      <div className="mt-4 flex flex-col gap-2">
        {mockUsers.map((user) => (
          <button
            key={user.id}
            className={`btn btn-sm ${currentUser?.id === user.id ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setCurrentUser(user)}
          >
            Login as {user.name}
          </button>
        ))}
        <button
          className="btn btn-sm btn-error"
          onClick={() => setCurrentUser(null)}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default CurrentUser;
