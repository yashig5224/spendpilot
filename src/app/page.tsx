import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { CtaSection } from "@/components/landing/CtaSection";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <HeroSection />
      <FeaturesSection />
      <CtaSection />
    </div>
  );
}
