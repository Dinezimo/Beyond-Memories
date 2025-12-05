import { useStore } from '../../../lib/store';

export default function ProfilePanel() {
  const store = useStore();
  const user = store.currentUser;
  if (!user) return (
    <div className="space-y-3">
      <div className="text-lg font-bold">Profile</div>
      <div className="text-sm opacity-70">You are not logged in.</div>
    </div>
  );
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold">Profile</div>
        <button className="btn btn-xs" onClick={() => store.setActivePanel(null)}>Close</button>
      </div>
      <div className="p-2 rounded bg-base-200/60">
        <div className="font-semibold mb-1">{user.name}</div>
        <div className="text-sm opacity-70">id: {user.id}</div>
      </div>
    </div>
  );
}
