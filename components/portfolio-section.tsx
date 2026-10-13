import { ArrowUpRight } from 'lucide-react'
import type { ChatbotProfileData } from '@/lib/chatbot'
import { SectionReveal } from '@/components/section-reveal'

interface PortfolioSectionProps {
  data: ChatbotProfileData
}

function getProjectLabel(link: string): string {
  return new URL(link).hostname.replace(/^www\./, '')
}

export function PortfolioSection({ data }: PortfolioSectionProps) {
  return (
    <div className="space-y-6 md:space-y-8">
      <SectionReveal direction="up">
        <div className="editorial-kicker">
          <span>06</span>
          <span>SELECTED WORK</span>
        </div>
        <h2 className="editorial-display mt-4">
          Portfolio
          <br />
          <em>projects.</em>
        </h2>
        <p className="resume-heading__copy">
          Project links from Shaheer&apos;s portfolio profile.
        </p>
      </SectionReveal>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {data.portfolioProjects.map((link, index) => (
          <SectionReveal key={link} delay={index * 60} direction="up">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="interactive-card group flex h-full items-center justify-between gap-4 rounded-xl border border-border bg-secondary p-4 md:p-5"
            >
              <span className="min-w-0">
                <span className="mb-1 block font-mono text-[10px] text-muted-foreground">
                  PROJECT {String(index + 1).padStart(2, '0')}
                </span>
                <span className="block break-all text-sm font-medium text-foreground">
                  {getProjectLabel(link)}
                </span>
              </span>
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 shrink-0 text-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </SectionReveal>
        ))}
      </div>
    </div>
  )
}
