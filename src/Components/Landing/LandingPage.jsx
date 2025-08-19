import HeroSection from "../Landing/components/HeroSection";
import FeaturesSection from "../Landing/components/FeaturesSection";
import StatsSection from "../Landing/components/StatsSection";
import AboutSection from "../Landing/components/AboutSection";
import ServicesSection from "../Landing/components/ServicesSection";
import ResourceTemplatesSection from "../Landing/components/ResourceTemplatesSection";
import CoreFeaturesSection from "../Landing/components/CoreFeaturesSection";
import TestimonialSection from "../Landing/components/TestimonialSection";
import CTASection from "../Landing/components/CTASection";

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-background">
            <main>
                <HeroSection />
                {/* <StatsSection /> */}
                <AboutSection />
                <ServicesSection />
                <ResourceTemplatesSection />
                <FeaturesSection />
                <CoreFeaturesSection />
                <TestimonialSection />
                <CTASection />
            </main>
        </div>
    );
};

export default LandingPage;
