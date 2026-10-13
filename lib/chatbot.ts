import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export interface ChatbotProfileData {
  profile: {
    name: string
    age: string
    location: string
    email: string
    github: string
  }
  education: Record<string, string>
  headline: string
  skills: string[]
  interests: string[]
  services: string[]
  portfolioProjects: string[]
  background: string[]
  portfolioContext: string[]
}

function getSectionLines(markdown: string, heading: string): string[] {
  const lines = markdown.split(/\r?\n/)
  const headingIndex = lines.findIndex(
    (line) => line.trim().toLowerCase() === `## ${heading.toLowerCase()}`,
  )

  if (headingIndex === -1) {
    throw new Error(`Required section "## ${heading}" was not found in my_data.md`)
  }

  const endIndex = lines.findIndex(
    (line, index) => index > headingIndex && /^##\s/.test(line),
  )

  return lines.slice(headingIndex + 1, endIndex === -1 ? undefined : endIndex)
}

function getKeyValueEntries(lines: string[]): Record<string, string> {
  return Object.fromEntries(
    lines.flatMap((line) => {
      const match = line.match(/^\s*-\s+([^:]+):\s*(.+?)\s*$/)
      return match ? [[match[1].trim(), match[2].trim()]] : []
    }),
  )
}

function getRequiredValue(
  entries: Record<string, string>,
  key: string,
  section: string,
): string {
  const value = entries[key]
  if (!value) {
    throw new Error(`Required "${key}" value was not found in the ${section} section of my_data.md`)
  }
  return value
}

function parseList(value: string): string[] {
  return value
    .split(/[;,]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function getAdditionalListItems(lines: string[], excludedPatterns: RegExp[]): string[] {
  return lines.flatMap((line) => {
    const match = line.match(/^\s*-\s+(.+?)\s*$/)
    if (!match || excludedPatterns.some((pattern) => pattern.test(match[1]))) {
      return []
    }
    return [match[1]]
  })
}

export function parseChatbotProfileData(markdown: string): ChatbotProfileData {
  const profileLines = getSectionLines(markdown, 'Profile')
  const profileEntries = getKeyValueEntries(profileLines)
  const educationLines = getSectionLines(markdown, 'Education')
  const educationEntries = getKeyValueEntries(educationLines)
  const learningLines = getSectionLines(markdown, 'Learning and Goals')
  const projectLines = getSectionLines(markdown, 'Portfolio Project')
  const learningEntries = getKeyValueEntries(learningLines)
  const projectEntries = getKeyValueEntries(projectLines)

  const skillEntries = learningLines.flatMap((line) => {
    const match = line.match(/^\s*-\s+Skills\/interests:\s*(.+?)\s*$/i)
    return match ? parseList(match[1]) : []
  })
  const familiarSkills = learningLines.flatMap((line) => {
    const match = line.match(/^\s*-\s+Familiar with\s+(.+?)\s*$/i)
    return match ? parseList(match[1]) : []
  })
  const interests = learningLines.flatMap((line) => {
    const match = line.match(/^\s*-\s+(Interested in .+?)\s*$/i)
    return match ? [match[1]] : []
  })
  const stackEntries = projectLines.flatMap((line) => {
    const match = line.match(/^\s*-\s+Stack:\s*(.+?)\s*$/i)
    return match ? parseList(match[1]) : []
  })
  const desiredServices = projectEntries['Desired portfolio services']
    ? parseList(projectEntries['Desired portfolio services'])
    : []
  const portfolioProjects = projectLines.flatMap((line) => {
    const match = line.match(/^\s*-\s+(https?:\/\/\S+)\s*$/)
    return match ? [match[1]] : []
  })

  return {
    profile: {
      name: getRequiredValue(profileEntries, 'Name', 'Profile'),
      age: getRequiredValue(profileEntries, 'Age', 'Profile'),
      location: getRequiredValue(profileEntries, 'Location context', 'Profile'),
      email: getRequiredValue(profileEntries, 'Portfolio email', 'Profile'),
      github: getRequiredValue(profileEntries, 'GitHub', 'Profile'),
    },
    education: educationEntries,
    headline: getRequiredValue(learningEntries, 'Portfolio headline', 'Learning and Goals'),
    skills: [...new Set([...skillEntries, ...familiarSkills, ...stackEntries])],
    interests,
    services: desiredServices,
    portfolioProjects: [...new Set(portfolioProjects)],
    background: getAdditionalListItems(learningLines, [
      /^Skills\/interests:/i,
      /^Familiar with/i,
    ]),
    portfolioContext: getAdditionalListItems(projectLines, [/^https?:\/\//]),
  }
}

export async function getChatbotProfileData(): Promise<ChatbotProfileData> {
  const markdown = await readFile(join(process.cwd(), 'my_data.md'), 'utf8')
  return parseChatbotProfileData(markdown)
}

export async function getChatbotSystemInstructions(): Promise<string> {
  const data = await getChatbotProfileData()

  return [
    "You are Shaheer Naeem's professional portfolio assistant. Answer questions about him and his work using only the verified details below. Do not invent personal, education, skill, or project details. Reply in the same language as the user's message.",
    '',
    'Profile',
    `- Name: ${data.profile.name}`,
    `- Age: ${data.profile.age}`,
    `- Location: ${data.profile.location}`,
    `- Email: ${data.profile.email}`,
    `- GitHub: ${data.profile.github}`,
    `- Portfolio headline: ${data.headline}`,
    '',
    'Education',
    ...Object.entries(data.education).map(([label, value]) => `- ${label}: ${value}`),
    '',
    'Skills',
    ...data.skills.map((skill) => `- ${skill}`),
    '',
    'Interests',
    ...data.interests.map((interest) => `- ${interest}`),
    '',
    'Desired services',
    ...data.services.map((service) => `- ${service}`),
    '',
    'Portfolio projects',
    ...data.portfolioProjects.map((project) => `- ${project}`),
    '',
    'Background and preferences',
    ...data.background.map((detail) => `- ${detail}`),
    '',
    'Portfolio context',
    ...data.portfolioContext.map((detail) => `- ${detail}`),
  ].join('\n')
}
