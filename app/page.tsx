import { ChatWidget } from '@/components/ChatWidget'
import { CinematicIntro } from '@/components/cinematic-intro'
import { PortfolioHome } from '@/components/portfolio-home'
import { ThemeToggle } from '@/components/theme-toggle'
import { getChatbotProfileData } from '@/lib/chatbot'

export default async function Home() {
  const profileData = await getChatbotProfileData()

  return (
    <>
      <CinematicIntro />
      <div className="page-shell min-h-screen bg-background p-3 selection:bg-accent selection:text-accent-foreground sm:p-4 md:p-6 lg:p-12">
        <div className="fixed right-4 top-4 z-50 md:right-6 md:top-6">
          <ThemeToggle />
        </div>
        <ChatWidget />
        <PortfolioHome data={profileData} />
      </div>
    </>
  )
}
