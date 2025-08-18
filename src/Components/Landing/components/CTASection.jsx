import { Button } from "../ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

const benefits = [
  "Free 30-day trial",
  "No setup fees",
  "24/7 support included",
  "GDPR compliant"
];

const CTASection = () => {
  return (
    <section className="py-20 bg-[var(--color-blue)] text-[var(--color-text-white)] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-5xl font-bold leading-tight text-[var(--color-text-white)]">
              Ready to Transform Your HR Operations?
            </h2>
            <p className="text-xl text-[var(--color-text-white-90)] leading-relaxed max-w-2xl mx-auto">
              Join thousands of companies already using Hurevo to streamline their workforce management.
              Start your free trial today and see the difference.
            </p>
          </div>

          {/* Benefits List */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2 justify-center sm:justify-start">
                <CheckCircle className="w-5 h-5 text-[var(--color-success)] flex-shrink-0" />
                <span className="text-[var(--color-text-white-90)]">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="accent"
              size="lg"
              className="px-8 py-6 text-base font-semibold bg-[var(--color-success)] text-[var(--color-text-white)] hover:bg-[var(--color-success-dark)]"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-6 text-base border-[var(--color-text-white)] border-opacity-30 text-[var(--color-text-white)] hover:bg-[var(--color-text-white)] hover:text-[var(--color-blue)]"
            >
              Schedule Demo
            </Button>
          </div>

          <p className="text-sm text-[var(--color-text-white-90)] opacity-70">
            No credit card required • Setup in under 5 minutes
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;