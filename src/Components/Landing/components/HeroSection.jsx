import { Button } from "../ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "../assets/hero-image.jpg";

const HeroSection = () => {
  return (
    <section className="py-20 lg:py-32 bg-[var(--color-bg-gradient-start)] bg-gradient-to-br from-[var(--color-bg-gradient-start)] to-[var(--color-bg-gradient-end)]">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center px-4 py-2 bg-[var(--color-bg-secondary-20)] text-[var(--color-text-primary)] rounded-full text-sm font-medium border border-[var(--color-border-secondary)]">
              All-in-One Efficiency
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-[var(--color-text-primary)]">
                Optimize Workforce Management with{" "}
                <span className="bg-gradient-to-r from-[var(--color-blue)] via-[var(--color-blue-dark)] to-[var(--color-blue-darker)] bg-clip-text text-transparent">
                  HR Solutions
                </span>
              </h1>

              <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-lg">
                Simplify every aspect of HR — from recruitment and onboarding to payroll,
                performance reviews, and employee analytics — with a secure, scalable,
                and user-friendly cloud platform built for modern teams and businesses.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="px-8 py-6 text-base bg-[var(--color-blue)] hover:bg-[var(--color-blue-dark)] text-[var(--color-text-white)]">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-6 text-base border-[var(--color-border-primary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]">
                <Play className="mr-2 h-5 w-5" />
                Learn More
              </Button>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={heroImage}
                alt="Professional HR team collaborating in modern office environment"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient from-[var(--color-blue)]/20 to-transparent"></div>
            </div>

            {/* Floating Stats */}
            <div className="absolute -bottom-6 -left-6 bg-[var(--color-bg-card)] border border-[var(--color-border-primary)] rounded-xl p-4 shadow-lg backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-[var(--color-blue-lightest)] rounded-full flex items-center justify-center">
                  <span className="text-[var(--color-blue)] font-bold text-lg">80+</span>
                </div>
                <div>
                  <p className="font-semibold text-[var(--color-text-primary)]">Satisfied Clients</p>
                  <p className="text-sm text-[var(--color-text-secondary)]">Across Industries</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;