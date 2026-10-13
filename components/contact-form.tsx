'use client'

import { FormEvent, useState } from 'react'
import { ArrowUpRight, CheckCircle2, Send } from 'lucide-react'

const formEndpoint = 'https://formspree.io/f/xdealrrz'

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    setIsSubmitting(true)
    setStatus(null)

    try {
      const response = await fetch(formEndpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as
          | { errors?: Array<{ message?: string }> }
          | null
        throw new Error(
          result?.errors?.[0]?.message ??
            'Your message could not be sent. Please try again.',
        )
      }

      form.reset()
      setStatus({ type: 'success', message: 'Thanks — your message has been sent.' })
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Your message could not be sent. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      action={formEndpoint}
      method="POST"
      onSubmit={handleSubmit}
      className="contact-form rounded-2xl border border-border bg-card p-5 shadow-[0_18px_60px_color-mix(in_oklch,var(--foreground)_5%,transparent)] sm:p-7"
    >
      <input type="hidden" name="_subject" value="Portfolio contact message" />
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.17em] text-accent">
            MESSAGE / SHAHEER
          </p>
          <h3 className="mt-2 text-xl font-semibold text-foreground">
            Tell me what you&apos;re building.
          </h3>
        </div>
        <span className="hidden size-10 place-items-center rounded-xl border border-accent/20 bg-accent/10 text-accent sm:grid">
          <ArrowUpRight aria-hidden="true" className="size-5" />
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="contact-name" className="text-xs font-medium text-foreground">
            Your name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={120}
            placeholder="Name"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-accent/70 focus:ring-2 focus:ring-accent/15"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="contact-email" className="text-xs font-medium text-foreground">
            Email address
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-accent/70 focus:ring-2 focus:ring-accent/15"
          />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <label htmlFor="contact-message" className="text-xs font-medium text-foreground">
          Project or message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={5}
          placeholder="A little context about what you have in mind..."
          className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm leading-relaxed text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-accent/70 focus:ring-2 focus:ring-accent/15"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-emerald-500/50 bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-emerald-950 shadow-[0_8px_28px_rgba(16,185,129,0.18)] transition-all hover:-translate-y-0.5 hover:bg-emerald-400 hover:shadow-[0_12px_36px_rgba(16,185,129,0.28)] disabled:cursor-wait disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
            Sending...
          </>
        ) : status?.type === 'success' ? (
          <>
            <CheckCircle2 aria-hidden="true" className="size-4" />
            Message sent
          </>
        ) : (
          <>
            <Send aria-hidden="true" className="size-4" />
            Send message
          </>
        )}
      </button>
      {status && (
        <p
          role={status.type === 'error' ? 'alert' : 'status'}
          className={`mt-4 text-sm ${
            status.type === 'success' ? 'text-emerald-600 dark:text-emerald-300' : 'text-destructive'
          }`}
        >
          {status.message}
        </p>
      )}
    </form>
  )
}
