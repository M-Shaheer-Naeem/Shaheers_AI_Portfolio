import { Cake, Github, Mail, MapPin } from 'lucide-react'
import Image from 'next/image'
import type { ChatbotProfileData } from '@/lib/chatbot'

interface ProfileSidebarProps {
  data: ChatbotProfileData
}

export function ProfileSidebar({ data }: ProfileSidebarProps) {
  return (
    <aside className="profile-card h-fit w-full rounded-2xl border border-border bg-card p-5 md:p-6 lg:sticky lg:top-8 lg:w-80">
      <div className="flex flex-col items-center text-center">
        <Image
          src="/shaheer-naeem.png"
          alt={`Portrait of ${data.profile.name}`}
          width={112}
          height={112}
          priority
          className="mb-4 size-24 rounded-3xl border border-accent/30 object-cover shadow-[0_0_28px_color-mix(in_oklch,var(--accent)_16%,transparent)] md:size-28"
        />
        <h1 className="mb-2 text-xl font-bold text-foreground md:text-2xl">
          {data.profile.name}
        </h1>
        <p className="rounded-lg bg-secondary px-3 py-1 text-xs leading-relaxed text-muted-foreground md:text-sm">
          {data.headline}
        </p>
      </div>

      <div className="my-5 h-px bg-border" />

      <dl className="space-y-4">
        <div className="flex items-start gap-3">
          <Cake aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" />
          <div>
            <dt className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              Age
            </dt>
            <dd className="text-sm text-foreground">{data.profile.age}</dd>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Mail aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" />
          <div className="min-w-0">
            <dt className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              Email
            </dt>
            <dd>
              <a
                href={`mailto:${data.profile.email}`}
                className="break-all text-sm text-foreground transition-colors hover:text-accent"
              >
                {data.profile.email}
              </a>
            </dd>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" />
          <div>
            <dt className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              Location
            </dt>
            <dd className="text-sm leading-relaxed text-foreground">
              {data.profile.location}
            </dd>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Github aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" />
          <div>
            <dt className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              GitHub
            </dt>
            <dd>
              <a
                href={data.profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-sm text-foreground transition-colors hover:text-accent"
              >
                {data.profile.github.replace(/^https?:\/\//, '')}
              </a>
            </dd>
          </div>
        </div>
      </dl>
    </aside>
  )
}
