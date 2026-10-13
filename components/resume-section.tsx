import { motion, useReducedMotion } from 'framer-motion'
import type { ChatbotProfileData } from '@/lib/chatbot'
import { SectionReveal } from '@/components/section-reveal'

interface ResumeSectionProps {
  data: ChatbotProfileData
}

export function ResumeSection({ data }: ResumeSectionProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="resume-editorial">
      <SectionReveal direction="mask" className="resume-heading">
        <div className="editorial-kicker">
          <span>04</span>
          <span>EDUCATION / SKILLS</span>
        </div>
        <h2 className="editorial-display">
          Learning and
          <br />
          <em>building.</em>
        </h2>
        <p className="resume-heading__copy">
          Education, current study, and skills listed in my portfolio profile.
        </p>
      </SectionReveal>

      <SectionReveal direction="up" delay={120} className="resume-timeline">
        <div className="resume-group">
          <div className="resume-group__heading">
            <span className="editorial-kicker">EDUCATION</span>
            <span className="resume-group__line" />
          </div>
          <motion.dl
            className="mt-6 grid gap-3 sm:grid-cols-2"
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, amount: 0.16 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.075 } },
            }}
          >
            {Object.entries(data.education).map(([label, value]) => (
              <motion.div
                className="rounded-xl border border-border bg-secondary p-4"
                key={label}
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
                whileHover={
                  prefersReducedMotion
                    ? undefined
                    : {
                        y: -3,
                        scale: 1.01,
                        boxShadow: '0 12px 36px rgba(16,185,129,0.12)',
                      }
                }
              >
                <dt className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                  {label}
                </dt>
                <dd className="text-sm leading-relaxed text-foreground">{value}</dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </SectionReveal>

      <SectionReveal direction="up" delay={180} className="resume-skills">
        <div className="editorial-kicker">
          <span>05</span>
          <span>SKILLS &amp; TECHNOLOGY</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill) => (
            <motion.span
              className="rounded-full border border-border bg-secondary px-3 py-2 text-xs leading-relaxed text-foreground transition-colors hover:border-accent/50 hover:shadow-[0_0_18px_color-mix(in_oklch,var(--accent)_15%,transparent)]"
              key={skill}
              whileHover={prefersReducedMotion ? undefined : { y: -2, scale: 1.025 }}
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </SectionReveal>
    </div>
  )
}
