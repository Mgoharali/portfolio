// src/pages/admin/AdminSkills.jsx
import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import AdminLayout from "../../components/layout/AdminLayout";
import { getSkills, addSkill, deleteSkill } from "../../firebase/firestore";

const CATEGORIES = ["Frontend", "Backend", "Database", "DevOps", "Tools", "Languages", "Design", "Other"];

export default function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Frontend");
  const [loading, setLoading] = useState(false);

  const load = () => getSkills().then(setSkills);
  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!name.trim()) { toast.error("Skill name is required"); return; }
    setLoading(true);
    try {
      await addSkill({ name: name.trim(), category });
      toast.success("Skill added!");
      setName(""); load();
    } catch { toast.error("Failed to add skill"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    await deleteSkill(id); toast.success("Removed"); load();
  };

  // Group by category
  const grouped = CATEGORIES.reduce((acc, cat) => {
    const catSkills = skills.filter(s => s.category === cat);
    if (catSkills.length > 0) acc[cat] = catSkills;
    return acc;
  }, {});

  return (
    <AdminLayout>
      <div className="max-w-3xl">
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-[var(--text)]">Skills</h1>
          <p className="text-[var(--subtle)] text-sm mt-1">{skills.length} skills total</p>
        </div>

        {/* Add Form */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 mb-8">
          <h2 className="font-display font-semibold text-[var(--text)] mb-4">Add Skill</h2>
          <div className="flex gap-3 flex-wrap">
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAdd()}
              placeholder="Skill name (e.g. React)"
              className="flex-1 min-w-48 px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--muted)] text-sm focus:outline-none focus:border-[var(--accent-soft)] transition-colors"
            />
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] text-sm focus:outline-none focus:border-[var(--accent-soft)] transition-colors"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button
              onClick={handleAdd}
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent text-bg font-semibold text-sm hover:bg-accent/90 transition-all disabled:opacity-50"
            >
              <Plus size={16} /> Add
            </button>
          </div>
        </div>

        {/* Skills by Category */}
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-20 text-[var(--muted)] font-mono text-sm">
            No skills yet. Add your first one!
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([cat, catSkills]) => (
              <div key={cat}>
                <h3 className="text-[var(--subtle)] text-xs font-mono uppercase tracking-widest mb-3">{cat}</h3>
                <div className="flex flex-wrap gap-2">
                  {catSkills.map(skill => (
                    <div
                      key={skill.id}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] text-sm font-medium group"
                    >
                      {skill.name}
                      <button
                        onClick={() => handleDelete(skill.id)}
                        className="text-[var(--muted)] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
