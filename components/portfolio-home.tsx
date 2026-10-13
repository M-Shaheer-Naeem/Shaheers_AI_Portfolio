'use client'

import { useState } from 'react'
import { AboutSection } from '@/components/about-section'
import { ContactSection } from '@/components/contact-section-new'
import { PortfolioSection } from '@/components/portfolio-section'
import { ProfileSidebar } from '@/components/profile-sidebar'
import { ResumeSection } from '@/components/resume-section'
import { SectionReveal } from '@/components/section-reveal'
import type { ChatbotProfileData } from '@/lib/chatbot'

const sections = ['about', 'resume', 'projects', 'contact'] as const
type Section = (typeof sections)[number]

interface PortfolioHomeProps {
  data: ChatbotProfileData
}

export function PortfolioHome({ data }: PortfolioHomeProps) {
  const [activeSection, setActiveSection] = useState<Section>('about')

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-3 sm:gap-4 md:gap-6 lg:flex-row">
        <SectionReveal>
          <ProfileSidebar data={data} />
        </SectionReveal>

        <main className="main-panel min-w-0 flex-1 overflow-hidden rounded-xl border border-border bg-card md:rounded-2xl">
          <nav
            aria-label="Portfolio sections"
            className="scrollbar-hide flex gap-1 overflow-x-auto border-b border-border p-3 sm:gap-2 sm:p-4 md:gap-4 md:p-6"
          >
            {sections.map((section) => (
              <button
                key={section}
                type="button"
                onClick={() => setActiveSection(section)}
                aria-current={activeSection === section ? 'page' : undefined}
                className={`nav-link flex-shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium capitalize transition-colors sm:px-4 sm:text-sm ${
                  activeSection === section
                    ? 'bg-accent/10 text-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                {section}
              </button>
            ))}
          </nav>

          <div key={activeSection} className="content-stage p-4 sm:p-5 md:p-6 lg:p-8">
            {activeSection === 'about' && <AboutSection data={data} />}
            {activeSection === 'resume' && <ResumeSection data={data} />}
            {activeSection === 'projects' && <PortfolioSection data={data} />}
            {activeSection === 'contact' && <ContactSection data={data} />}
          </div>
        </main>
      </div>
    </div>
  )
}
