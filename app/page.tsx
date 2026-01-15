import { Navbar } from "@/components/navbar"
import { PricingCardsSection } from "@/components/pricing-cards-section"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PricingCardsSection />
    </div>
  )
}
