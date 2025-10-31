
import Hero from '@/components/dashboard/Hero'
import Features from '@/components/dashboard/Features'
import Testimonials from '@/components/dashboard/Testimonials'
import Pricing from '@/components/dashboard/Pricing'
import Footer from '@/components/dashboard/Footer'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Hero />
      <Features />
      <Testimonials />
      <Pricing />
      <Footer />
    </main>
  )
}
