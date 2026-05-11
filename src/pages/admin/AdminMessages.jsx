// src/pages/admin/AdminMessages.jsx
import { useEffect, useState } from "react";
import { Mail, MailOpen, Clock } from "lucide-react";
import { format } from "date-fns";
import AdminLayout from "../../components/layout/AdminLayout";
import { getMessages, markMessageRead } from "../../firebase/firestore";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => getMessages().then(m => { setMessages(Array.isArray(m) ? m : []); setLoading(false); }).catch(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleOpen = async (msg) => {
    setSelected(msg);
    if (!msg.read) {
      await markMessageRead(msg.id);
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m));
    }
  };

  const unread = messages.filter(m => !m.read).length;

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-[var(--text)]">Messages</h1>
          <p className="text-[var(--subtle)] text-sm mt-1">
            {messages.length} total · <span className="text-[var(--accent)]">{unread} unread</span>
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-[var(--surface)] border border-[var(--border)] animate-pulse" />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20 text-[var(--muted)] font-mono text-sm">No messages yet.</div>
        ) : (
          <div className="grid lg:grid-cols-5 gap-4">
            {/* List */}
            <div className="lg:col-span-2 space-y-2">
              {messages.map(msg => (
                <button
                  key={msg.id}
                  onClick={() => handleOpen(msg)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    selected?.id === msg.id
                      ? "bg-[var(--accent-soft)] border-[var(--accent-soft)]"
                      : msg.read
                      ? "bg-[var(--surface)] border-[var(--border)] hover:border-[var(--border)]/60"
                      : "bg-[var(--surface)] border-[var(--accent-soft)] hover:border-[var(--accent-soft)]"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {msg.read
                      ? <MailOpen size={13} className="text-[var(--muted)] shrink-0" />
                      : <Mail size={13} className="text-[var(--accent)] shrink-0" />
                    }
                    <p className={`text-sm font-medium truncate ${msg.read ? "text-[var(--subtle)]" : "text-[var(--text)]"}`}>
                      {msg.name}
                    </p>
                    {!msg.read && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-accent shrink-0" />
                    )}
                  </div>
                  <p className="text-[var(--subtle)] text-xs truncate pl-5">{msg.subject || msg.message}</p>
                  {msg.createdAt && (
                    <p className="text-[var(--muted)] text-xs font-mono mt-1.5 pl-5 flex items-center gap-1">
                      <Clock size={10} />
                      {(() => { try { return format(msg.createdAt.toDate ? msg.createdAt.toDate() : new Date(msg.createdAt), "MMM d, h:mm a"); } catch { return ""; } })()}
                    </p>
                  )}
                </button>
              ))}
            </div>

            {/* Detail */}
            <div className="lg:col-span-3">
              {selected ? (
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
                  <div className="border-b border-[var(--border)] pb-5 mb-5">
                    <h2 className="font-display font-semibold text-[var(--text)] text-lg mb-2">
                      {selected.subject || "(No subject)"}
                    </h2>
                    <div className="flex flex-col gap-1.5 text-xs font-mono text-[var(--subtle)]">
                      <p><span className="text-[var(--muted)]">From:</span> {selected.name} &lt;{selected.email}&gt;</p>
                      {selected.createdAt && (
                        <p><span className="text-[var(--muted)]">Date:</span> {(() => { try { return format(selected.createdAt.toDate ? selected.createdAt.toDate() : new Date(selected.createdAt), "MMMM d, yyyy 'at' h:mm a"); } catch { return ""; } })()}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-[var(--subtle)] text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                  <div className="mt-6 pt-5 border-t border-[var(--border)]">
                    <a
                      href={`mailto:${selected.email}?subject=Re: ${selected.subject || "Your message"}`}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-bg font-semibold text-sm hover:bg-accent/90 transition-all"
                    >
                      <Mail size={14} /> Reply via Email
                    </a>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-[var(--muted)] text-sm font-mono bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
                  Select a message to read
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}