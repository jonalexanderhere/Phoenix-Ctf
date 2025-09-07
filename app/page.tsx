import Navbar from '@/components/Navbar'
import HomePageClient from '@/components/HomePageClient'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <HomePageClient />
    </div>
  )
}