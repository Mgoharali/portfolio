// src/pages/BlogPost.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import PageLayout from "../components/layout/PageLayout";
import { getPost } from "../firebase/firestore";

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    let alive = true;
    getPost(id)
      .then(p => { if (alive) { setPost(p || null); setLoading(false); } })
      .catch(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [id]);

  if (loading) {
    return (
      <PageLayout>
        <div className="max-w-3xl mx-auto px-6 py-12 space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-5 rounded-lg bg-[var(--surface)] animate-pulse" style={{ width: `${60 + i * 5}%` }} />
          ))}
        </div>
      </PageLayout>
    );
  }

  if (!post) {
    return (
      <PageLayout>
        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
          <p className="text-[var(--muted)] font-mono">Post not found.</p>
          <Link to="/blog" className="text-[var(--accent)] text-sm mt-4 inline-block hover:underline">
            ← Back to Blog
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <article className="max-w-3xl mx-auto px-6 py-12">
        {/* Back */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-[var(--subtle)] text-sm hover:text-[var(--accent)] transition-colors mb-12"
        >
          <ArrowLeft size={14} /> Back to Blog
        </Link>

        {/* Tags */}
        {post.tags && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map(t => <span key={t} className="tag">{t}</span>)}
          </div>
        )}

        {/* Title */}
        <h1 className="font-display font-bold text-4xl md:text-5xl text-[var(--text)] leading-tight mb-6">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-6 text-[var(--subtle)] text-sm font-mono border-b border-[var(--border)] pb-8 mb-10">
          {post.createdAt && (
            <span className="flex items-center gap-1.5">
              <Calendar size={13} />
              {(() => { try { return format(post.createdAt.toDate ? post.createdAt.toDate() : new Date(post.createdAt), "MMMM d, yyyy"); } catch { return ""; } })()}
            </span>
          )}
          {post.readTime && (
            <span className="flex items-center gap-1.5">
              <Clock size={13} /> {post.readTime} min read
            </span>
          )}
        </div>

        {/* Content */}
        <div className="prose-custom">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content || ""}
          </ReactMarkdown>
        </div>
      </article>
    </PageLayout>
  );
}