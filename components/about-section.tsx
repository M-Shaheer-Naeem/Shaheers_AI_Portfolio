import { ArrowUpRight, Sparkles } from 'lucide-react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { ChatbotProfileData } from '@/lib/chatbot'
import { SectionReveal } from '@/components/section-reveal'

const staggeredText: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.06 },
  },
}

const textReveal: Variants = {
  hidden: { opacity: 0, y: 22, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.72, ease: [0.16, 1, 0.3, 1] as const },
  },
}

interface AboutSectionProps {
  data: ChatbotProfileData
}

export function AboutSection({ data }: AboutSectionProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="about-editorial">
      <SectionReveal direction="mask">
        <motion.div
          className="about-intro"
          variants={staggeredText}
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
        <motion.div className="editorial-kicker" variants={textReveal}>
          <span>01</span>
          <span>ABOUT ME</span>
        </motion.div>
        <motion.div className="about-intro-grid" variants={staggeredText}>
          <motion.h2 className="editorial-display" variants={textReveal}>
            {data.profile.name.split(' ').map((part) => (
              <motion.span key={part} className="inline-block" variants={textReveal}>
                {part}&nbsp;
              </motion.span>
            ))}
          </motion.h2>
          <motion.div className="about-lede" variants={staggeredText}>
            <motion.p className="about-lede__lead" variants={textReveal}>
              {data.headline}
            </motion.p>
            <motion.div className="editorial-rule" variants={textReveal} />
            <motion.p className="editorial-copy" variants={textReveal}>
              I&apos;m {data.profile.name}, based in {data.profile.location}. I&apos;m
              focused on full-stack development and agentic AI, and currently
              studying {data.education['Current study']} through{' '}
              {data.education.Program}.
            </motion.p>
          </motion.div>
        </motion.div>
        </motion.div>
      </SectionReveal>

      <SectionReveal direction="up" delay={100} className="about-story">
        <div className="about-story__index">A / 02</div>
        <div className="about-story__content">
          <p className="editorial-copy editorial-copy--large">
            {data.interests.join(' ')}. My current toolkit includes{' '}
            {data.skills.slice(0, 5).join(', ')}; see my resume for the complete
            skills list.
          </p>
          <div className="about-focus">
            <span className="editorial-kicker">CURRENT FOCUS</span>
            <p>
              {data.services.slice(0, 3).join(' · ')}
              {data.services.length > 3 ? ' · and more' : ''}
            </p>
          </div>
        </div>
      </SectionReveal>

      <SectionReveal direction="up" delay={160}>
        <motion.div
          className="about-services"
          variants={staggeredText}
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
        >
        <motion.div className="editorial-kicker" variants={textReveal}>
          <span>03</span>
          <span>AREAS OF INTEREST</span>
        </motion.div>
        <div className="service-list">
          {data.services.map((service, index) => (
            <motion.article
              key={service}
              className="service-row"
              variants={textReveal}
              whileHover={prefersReducedMotion ? undefined : { x: 5, transition: { duration: 0.2 } }}
            >
              <span className="service-row__number">
                {String(index + 1).padStart(2, '0')}
              </span>
              <Sparkles
                aria-hidden="true"
                className="service-row__icon"
                strokeWidth={1.5}
              />
              <div className="service-row__body">
                <h3>{service}</h3>
              </div>
              <ArrowUpRight
                aria-hidden="true"
                className="service-row__arrow"
              />
            </motion.article>
          ))}
        </div>
        </motion.div>
      </SectionReveal>
    </div>
  )
}
