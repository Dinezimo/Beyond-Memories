import { useState } from 'react';
import { useStore } from '../../../lib/store';

export default function MessagesPanel() {
  const store = useStore();
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState<{ id: string; from: string; text: string; t: number }[]>([]);

  const send = () => {
    if (!msg.trim()) return;
    const from = store.currentUser?.name || 'Guest';
    setMessages((m) => [...m, { id: String(Date.now()), from, text: msg.trim(), t: Date.now() }]);
    setMsg('');
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold">Messages</div>
        <button className="btn btn-xs" onClick={() => store.setActivePanel(null)}>Close</button>
      </div>
      <div className="h-64 overflow-auto bg-base-200/60 rounded p-2 space-y-2">
        {messages.length === 0 && <div className="text-sm opacity-60">Aucun message pour l’instant.</div>}
        {messages.map((m) => (
          <div key={m.id} className="text-sm"><b>{m.from}:</b> {m.text}</div>
        ))}
      </div>
      <div className="flex gap-2">
        <input className="input input-bordered input-sm flex-1" placeholder="Votre message…" value={msg} onChange={(e) => setMsg(e.target.value)} onKeyDown={(e) => e.key==='Enter' && send()} />
        <button className="btn btn-sm" onClick={send}>Envoyer</button>
      </div>
    </div>
  );
}
