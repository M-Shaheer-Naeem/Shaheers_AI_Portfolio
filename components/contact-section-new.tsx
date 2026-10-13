import { ArrowUpRight, Github, Mail } from 'lucide-react'
import Link from 'next/link'
import type { ChatbotProfileData } from '@/lib/chatbot'
import { ContactForm } from '@/components/contact-form'

interface ContactSectionProps {
  data: ChatbotProfileData
}

export function ContactSection({ data }: ContactSectionProps) {
  return (
    <section className="space-y-6">
      <div className="editorial-kicker">
        <span>07</span>
        <span>CONTACT</span>
      </div>
      <h2 className="editorial-display">
        Let&apos;s
        <br />
        <em>connect.</em>
      </h2>
      <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
        Reach {data.profile.name} using the email or GitHub profile listed in the
        portfolio.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <a
          href={`mailto:${data.profile.email}`}
          className="interactive-card group flex items-center justify-between gap-4 rounded-xl border border-border bg-secondary p-4"
        >
          <span className="flex min-w-0 items-center gap-3">
            <Mail aria-hidden="true" className="size-5 shrink-0 text-accent" />
            <span className="min-w-0">
              <span className="mb-1 block text-[10px] uppercase tracking-wider text-muted-foreground">
                Email
              </span>
              <span className="block break-all text-sm text-foreground">
                {data.profile.email}
              </span>
            </span>
          </span>
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 shrink-0 text-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </a>
        <a
          href={data.profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="interactive-card group flex items-center justify-between gap-4 rounded-xl border border-border bg-secondary p-4"
        >
          <span className="flex min-w-0 items-center gap-3">
            <Github aria-hidden="true" className="size-5 shrink-0 text-accent" />
            <span className="min-w-0">
              <span className="mb-1 block text-[10px] uppercase tracking-wider text-muted-foreground">
                GitHub
              </span>
              <span className="block break-all text-sm text-foreground">
                {data.profile.github.replace(/^https?:\/\//, '')}
              </span>
            </span>
          </span>
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 shrink-0 text-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </a>
      </div>
      <ContactForm />
      <Link
        href="/contact"
        className="inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-foreground"
      >
        Open the dedicated contact page
        <ArrowUpRight aria-hidden="true" className="size-4" />
      </Link>
    </section>
  )
}
