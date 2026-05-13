// src/pages/Contact.jsx
import { useState, useCallback, memo } from 'react'
import { Send, Mail, MapPin, Github, Linkedin } from 'lucide-react'
import toast from 'react-hot-toast'
import PageLayout from '../components/layout/PageLayout.jsx'
import { addMessage } from '../firebase/firestore.js'
import { sanitizeForm, validateContactForm, checkRateLimit } from '../utils/sanitize.js'

// Memoized — pure display, never re-renders
const ContactInfo = memo(function ContactInfo() {
  return (
    <div className="lg:col-span-2 space-y-8">
      {[
        { icon: Mail,   label: 'Email',    value: 'goharali@email.com' },
        { icon: MapPin, label: 'Location', value: 'Pakistan' },
      ].map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent-soft)] border border-[var(--gold-dim)] flex items-center justify-center shrink-0">
            <Icon size={16} className="text-[var(--accent)]" />
          </div>
          <div>
            <p className="text-[var(--subtle)] text-xs font-mono uppercase tracking-widest mb-1">{label}</p>
            <p className="text-[var(--text)] font-medium">{value}</p>
          </div>
        </div>
      ))}

      <div className="pt-4 flex gap-3">
        {[
          { icon: Github,   href: 'https://github.com',   label: 'GitHub'   },
          { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
        ].map(({ icon: Icon, href, label }) => (
          <a key={label} href={href} target="_blank"
            rel="noopener noreferrer"   // security: prevents tab hijacking
            aria-label={label}
            className="w-10 h-10 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--subtle)] hover:text-[var(--accent)] hover:border-[var(--gold-dim)] transition-all"
          >
            <Icon size={16} />
          </a>
        ))}
      </div>
    </div>
  )
})

const EMPTY = { name: '', email: '', subject: '', message: '' }

export default function Contact() {
  const [form,    setForm]    = useState(EMPTY)
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // Clear error on edit
    setErrors(prev => prev[name] ? { ...prev, [name]: undefined } : prev)
  }, [])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()

    // Client-side validation
    const errs = validateContactForm(form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    // Soft rate limit — prevents accidental spam
    if (!checkRateLimit('contact')) {
      toast.error('Too many submissions. Please try again later.')
      return
    }

    setLoading(true)
    try {
      // Sanitize before sending to Firestore
      const clean = sanitizeForm(form)
      await addMessage(clean)
      toast.success("Message sent! I'll get back to you soon.")
      setForm(EMPTY)
      setErrors({})
      setSent(true)
    } catch (err) {
      console.error('Contact form error:', err)
      toast.error('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [form])

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="gold-line" />
            <span className="text-[var(--accent)] text-xs font-mono uppercase tracking-widest">Contact</span>
          </div>
          <h1 className="font-display font-medium text-5xl text-[var(--text)] mb-4">
            Get in <span style={{ fontStyle: 'italic' }}>Touch</span>
          </h1>
          <p className="text-[var(--subtle)] text-lg max-w-xl font-light">
            Have a project in mind? I&apos;d love to hear about it.
          </p>
        </div>

        {sent ? (
          <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
            <div className="w-16 h-16 rounded-2xl border border-[var(--gold-dim)] bg-[var(--accent-soft)] flex items-center justify-center text-3xl">✦</div>
            <h2 className="font-display font-medium text-2xl text-[var(--text)]">Message Sent</h2>
            <p className="text-[var(--subtle)] max-w-sm font-light">
              Thank you for reaching out. I&apos;ll reply within 24 hours.
            </p>
            <button onClick={() => setSent(false)}
              className="text-[var(--accent)] text-sm hover:underline underline-offset-4">
              Send another →
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-5 gap-12">
            <ContactInfo />
            <form onSubmit={handleSubmit} noValidate className="lg:col-span-3 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Name *" htmlFor="c-name" error={errors.name}>
                  <input id="c-name" type="text" name="name" value={form.name}
                    onChange={handleChange} placeholder="Your Name"
                    maxLength={120} autoComplete="name"
                    className={`input-field ${errors.name ? 'border-red-400/60' : ''}`} />
                </Field>
                <Field label="Email *" htmlFor="c-email" error={errors.email}>
                  <input id="c-email" type="email" name="email" value={form.email}
                    onChange={handleChange} placeholder="youremail@example.com"
                    maxLength={254} autoComplete="email"
                    className={`input-field ${errors.email ? 'border-red-400/60' : ''}`} />
                </Field>
              </div>
              <Field label="Subject" htmlFor="c-subject">
                <input id="c-subject" type="text" name="subject" value={form.subject}
                  onChange={handleChange} placeholder="Project inquiry"
                  maxLength={200}
                  className="input-field" />
              </Field>
              <Field label="Message *" htmlFor="c-message" error={errors.message}>
                <textarea id="c-message" name="message" value={form.message}
                  onChange={handleChange} rows={6}
                  placeholder="Tell me about your project..."
                  maxLength={5000}
                  className={`input-field resize-none ${errors.message ? 'border-red-400/60' : ''}`} />
                <p className="text-[var(--subtle)] text-xs mt-1 text-right font-mono">
                  {form.message.length}/5000
                </p>
              </Field>

              <button type="submit" disabled={loading} className="btn-primary">
                {loading
                  ? <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </span>
                  : <><Send size={14} /> Send Message</>
                }
              </button>
            </form>
          </div>
        )}
      </div>
    </PageLayout>
  )
}

// Pure field wrapper component
const Field = memo(function Field({ label, htmlFor, error, children }) {
  return (
    <div className="min-w-0">
      <label htmlFor={htmlFor}
        className="block text-[var(--subtle)] text-xs font-mono uppercase tracking-widest mb-2">
        {label}
      </label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
})