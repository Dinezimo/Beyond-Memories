import { useStore } from '../../lib/store';
import MemoriesPanel from './panels/MemoriesPanel';
import MembersPanel from './panels/MembersPanel';
import MessagesPanel from './panels/MessagesPanel';
import ProfilePanel from './panels/ProfilePanel';
import DecorPanel from './panels/DecorPanel';
import PermissionsPanel from './panels/PermissionsPanel';

export default function DockPanel() {
  const { uiActivePanel } = useStore();
  if (!uiActivePanel) return null;
  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-[360px] max-w-[92vw] bg-base-100/90 rounded-xl shadow-lg p-3">
      {uiActivePanel === 'memories' && <MemoriesPanel />}
      {uiActivePanel === 'members' && <MembersPanel />}
      {uiActivePanel === 'messages' && <MessagesPanel />}
      {uiActivePanel === 'profile' && <ProfilePanel />}
      {uiActivePanel === 'decor' && <DecorPanel />}
      {uiActivePanel === 'permissions' && <PermissionsPanel />}
    </div>
  );
}
