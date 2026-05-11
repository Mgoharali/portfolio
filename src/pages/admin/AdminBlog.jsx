// src/pages/admin/AdminBlog.jsx
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Save, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import AdminLayout from "../../components/layout/AdminLayout";
import { getPosts, addPost, updatePost, deletePost } from "../../firebase/firestore";

const empty = { title: "", excerpt: "", content: "", tags: "", readTime: "5" };

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [view, setView] = useState("list"); // list | editor
  const [loading, setLoading] = useState(false);

  const load = () => getPosts().then(setPosts);
  useEffect(() => { load(); }, []);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content) { toast.error("Title and content are required"); return; }
    setLoading(true);
    try {
      const data = { ...form, tags: form.tags.split(",").map(t => t.trim()).filter(Boolean), readTime: Number(form.readTime) };
      if (editId) { await updatePost(editId, data); toast.success("Post updated!"); }
      else { await addPost(data); toast.success("Post published!"); }
      setForm(empty); setEditId(null); setView("list"); load();
    } catch { toast.error("Something went wrong"); }
    finally { setLoading(false); }
  };

  const handleEdit = (p) => {
    setForm({ ...p, tags: Array.isArray(p.tags) ? p.tags.join(", ") : "", readTime: String(p.readTime || 5) });
    setEditId(p.id); setView("editor");
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this post?")) return;
    await deletePost(id); toast.success("Deleted"); load();
  };

  if (view === "editor") {
    return (
      <AdminLayout>
        <div className="max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => setView("list")} className="text-[var(--subtle)] hover:text-[var(--text)] transition-colors flex items-center gap-2 text-sm">
              <ArrowLeft size={16} /> Back to posts
            </button>
            <h1 className="font-display font-bold text-2xl text-[var(--text)]">
              {editId ? "Edit Post" : "New Post"}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[var(--subtle)] text-xs font-mono uppercase tracking-widest mb-2">Title *</label>
                <input name="title" value={form.title} onChange={handleChange}
                  placeholder="My Blog Post Title"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--muted)] text-sm focus:outline-none focus:border-[var(--accent-soft)] transition-colors" />
              </div>
              <div>
                <label className="block text-[var(--subtle)] text-xs font-mono uppercase tracking-widest mb-2">Read Time (min)</label>
                <input name="readTime" type="number" value={form.readTime} onChange={handleChange} min="1"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] text-sm focus:outline-none focus:border-[var(--accent-soft)] transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-[var(--subtle)] text-xs font-mono uppercase tracking-widest mb-2">Excerpt</label>
              <input name="excerpt" value={form.excerpt} onChange={handleChange}
                placeholder="Short summary shown in blog listing..."
                className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--muted)] text-sm focus:outline-none focus:border-[var(--accent-soft)] transition-colors" />
            </div>

            <div>
              <label className="block text-[var(--subtle)] text-xs font-mono uppercase tracking-widest mb-2">Tags (comma separated)</label>
              <input name="tags" value={form.tags} onChange={handleChange} placeholder="React, Tutorial, CSS"
                className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--muted)] text-sm focus:outline-none focus:border-[var(--accent-soft)] transition-colors" />
            </div>

            <div>
              <label className="block text-[var(--subtle)] text-xs font-mono uppercase tracking-widest mb-2">
                Content * <span className="text-[var(--muted)] normal-case">(Markdown supported)</span>
              </label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                rows={20}
                placeholder={`# My Post Title\n\nWrite your content here in **Markdown**...\n\n## Section\n\nParagraph text...\n\n\`\`\`js\nconst code = 'works too!';\n\`\`\``}
                className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--muted)] text-sm font-mono focus:outline-none focus:border-[var(--accent-soft)] transition-colors resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-bg font-semibold text-sm hover:bg-accent/90 transition-all disabled:opacity-50">
                <Save size={14} /> {loading ? "Saving..." : "Publish Post"}
              </button>
              <button type="button" onClick={() => setView("list")}
                className="px-4 py-3 rounded-xl bg-[var(--border)]/50 text-[var(--subtle)] hover:text-[var(--text)] transition-colors text-sm">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl text-[var(--text)]">Blog Posts</h1>
            <p className="text-[var(--subtle)] text-sm mt-1">{posts.length} posts total</p>
          </div>
          <button
            onClick={() => { setForm(empty); setEditId(null); setView("editor"); }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-bg font-semibold text-sm hover:bg-accent/90 transition-all"
          >
            <Plus size={16} /> New Post
          </button>
        </div>

        <div className="space-y-3">
          {posts.length === 0 ? (
            <div className="text-center py-20 text-[var(--muted)] font-mono text-sm">No posts yet. Write your first one!</div>
          ) : (
            posts.map(p => (
              <div key={p.id} className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border)]/80 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--text)] text-sm">{p.title}</p>
                  <p className="text-[var(--subtle)] text-xs mt-0.5 truncate">{p.excerpt}</p>
                  <div className="flex items-center gap-3 mt-2">
                    {p.tags?.slice(0,3).map(t => <span key={t} className="tag">{t}</span>)}
                    {p.createdAt && (
                      <span className="text-[var(--muted)] text-xs font-mono">
                        {format(p.createdAt.toDate?.() || new Date(p.createdAt), "MMM d, yyyy")}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleEdit(p)}
                    className="w-8 h-8 rounded-lg bg-[var(--border)]/50 flex items-center justify-center text-[var(--subtle)] hover:text-[var(--text)] transition-colors">
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => handleDelete(p.id)}
                    className="w-8 h-8 rounded-lg bg-[var(--border)]/50 flex items-center justify-center text-[var(--subtle)] hover:text-red-400 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
