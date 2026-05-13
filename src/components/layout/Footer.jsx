// src/components/layout/Footer.jsx
import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Github, Linkedin, Twitter, Mail } from 'lucide-react'

const SOCIAL_LINKS = [
  { icon: Github,   href: 'https://github.com/Mgoharali',            label: 'GitHub'   },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/gohar-ali-336834334/',          label: 'LinkedIn' },
  { icon: Mail,     href: 'm.gohar.dev@gmail.com',     label: 'Email'    },
]

const Footer = memo(function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-24">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-10 sm:py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

          <div className="text-center sm:text-left">
            <Link to="/" className="font-display font-medium text-[var(--text)] text-lg">
              Gohar<span className="text-[var(--accent)]">.</span>
            </Link>
            <p className="text-[var(--subtle)] text-sm mt-1 font-light">
              Crafting digital experiences with intent.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--gold-dim)] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>

          <p className="text-[var(--subtle)] text-xs font-mono text-center sm:text-right">
            © {new Date().getFullYear()} Gohar Ali
          </p>
        </div>
      </div>
    </footer>
  )
})

export default Footer