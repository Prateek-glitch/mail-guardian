import { LoginForm } from "@/components/login-form"
import { SessionProvider } from "@/components/session-provider"
import { FloatingElements } from "@/components/floating-elements"
import { PWAInstall } from "@/app/pwa-install"
import { AppSplash } from "@/components/app-splash"

export default function Home() {
  return (
    <SessionProvider>
      <AppSplash>
        <div className="min-h-screen gradient-bg relative overflow-hidden">
          <FloatingElements />
          <div className="relative z-10 w-full">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
              <div className="text-center mb-8 sm:mb-12">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 text-gradient floating-element">
                  MailGuardian
                </h1>
                <div className="max-w-xs sm:max-w-md lg:max-w-2xl mx-auto">
                  <p className="text-sm sm:text-base lg:text-xl text-white/80 backdrop-blur-sm bg-white/10 rounded-full px-4 sm:px-6 py-2 sm:py-3">
                    Intelligent Gmail-integrated email trust analyzer and notifier
                  </p>
                </div>
              </div>
              <div className="flex justify-center">
                <LoginForm />
              </div>
            </div>
          </div>
          <PWAInstall />
        </div>
      </AppSplash>
    </SessionProvider>
  )
}
