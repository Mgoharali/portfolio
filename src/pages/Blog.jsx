// src/pages/Blog.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { format } from "date-fns";
import PageLayout from "../components/layout/PageLayout.jsx";
import { getPosts } from "../firebase/firestore.js";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    getPosts()
      .then(p => { if (alive) { setPosts(Array.isArray(p) ? p : []); setLoading(false); } })
      .catch(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="accent-line"></span>
            <span className="text-[var(--accent)] text-xs font-mono uppercase tracking-widest">Writing</span>
          </div>
          <h1 className="font-display font-bold text-5xl text-[var(--text)] mb-4">Blog</h1>
          <p className="text-[var(--subtle)] text-lg">
            Thoughts on code, design, and building things on the internet.
          </p>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 rounded-2xl bg-[var(--surface)] border border-[var(--border)] animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-[var(--subtle)] font-mono text-sm">No posts yet. Check back soon.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post, i) => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="card-glow block rounded-2xl bg-[var(--surface)] p-6 group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {post.tags?.[0] && (
                      <span className="tag mb-3 inline-block">{post.tags[0]}</span>
                    )}
                    <h2 className="font-display font-semibold text-[var(--text)] text-xl mb-2 group-hover:text-[var(--accent)] transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-[var(--subtle)] text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-4 mt-4 text-[var(--subtle)] text-xs font-mono">
                      {post.createdAt && (
                        <span>
                          {(() => { try { return format(post.createdAt.toDate ? post.createdAt.toDate() : new Date(post.createdAt), "MMM d, yyyy"); } catch { return ""; } })()}
                        </span>
                      )}
                      {post.readTime && (
                        <span className="flex items-center gap-1">
                          <Clock size={11} /> {post.readTime} min read
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-[var(--muted)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all mt-1 shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}