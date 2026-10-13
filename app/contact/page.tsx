import type { Metadata } from 'next'
import Link from 'next/link'
import { ContactForm } from '@/components/contact-form'
import { getChatbotProfileData } from '@/lib/chatbot'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact Shaheer Naeem about full-stack development, AI agents, and digital projects.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Shaheer Naeem',
    description:
      'Get in touch with Shaheer about full-stack development and agentic AI projects.',
    url: '/contact',
  },
}

export default async function ContactPage() {
  const profile = await getChatbotProfileData()

  return (
    <main className="min-h-screen bg-background px-4 py-12 text-foreground transition-colors duration-300 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs text-accent transition-colors hover:text-foreground"
        >
          <span aria-hidden="true">&lt;-</span>
          BACK TO PORTFOLIO
        </Link>
        <div className="mt-14 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="editorial-kicker">
              <span>08</span>
              <span>CONTACT / {profile.profile.name.toUpperCase()}</span>
            </p>
            <h1 className="editorial-display mt-6">
              Let&apos;s make
              <br />
              <em>something useful.</em>
            </h1>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              Have a project, an automation idea, or a question? Send a note and
              I&apos;ll get back to you.
            </p>
            <a
              href={`mailto:${profile.profile.email}`}
              className="mt-6 inline-block break-all text-sm text-accent transition-colors hover:text-foreground"
            >
              {profile.profile.email}
            </a>
          </div>
          <ContactForm />
        </div>
      </div>
    </main>
  )
}
