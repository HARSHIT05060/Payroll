import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

const coreFeatures = [
  {
    title: "Automated Payroll Calculation",
    description: "Accurately process salaries, deductions, and taxes with minimal manual input",
    image: "https://kit.createbigsupply.com/hurevo/wp-content/uploads/sites/56/2025/06/business-people-with-laptop-in-modern-office-build-2024-10-30-23-05-48-utc-1024x665.jpg"
  },
  {
    title: "Digital Payslip Distribution",
    description: "Accurately process salaries, deductions, and taxes with minimal manual input",
    image: "https://kit.createbigsupply.com/hurevo/wp-content/uploads/sites/56/2025/06/young-couple-with-a-problem-consult-with-psycholog-2024-10-14-17-10-31-utc-1024x683.jpg"
  },
  {
    title: "Tax Compliance Management",
    description: "Accurately process salaries, deductions, and taxes with minimal manual input",
    image: "https://kit.createbigsupply.com/hurevo/wp-content/uploads/sites/56/2025/06/professional-businessman-partner-person-success-te-2025-03-25-14-27-48-utc-1024x681.jpg"
  }
];

const CoreFeaturesSection = () => {
  return (
    <section className="py-20 bg-[var(--color-bg-secondary)]">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-5xl font-bold text-[var(--color-text-primary)]">
              Core Features
            </h2>
            <h3 className="text-2xl lg:text-4xl font-bold leading-tight text-[var(--color-text-primary)]">
              Automate Payroll, Simplify Benefits, Empower{" "}
              <span className="text-[var(--color-blue)]">
                Your People
              </span>
            </h3>
            <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
              Key features designed to streamline pay, manage benefits, and ensure total compliance every cycle.
              Key features designed to streamline pay, manage benefits, and ensure total compliance every cycle.
            </p>
            <Button variant="hero" size="lg" className="px-8">
              Get Started Now
            </Button>
          </div>

          <div className="text-center">
            <div className="text-4xl lg:text-6xl font-bold mb-4">
              <span className="text-[var(--color-blue)]">
                $0
              </span>{" "}
              <span className="text-[var(--color-text-primary)] text-2xl lg:text-3xl">
                in Payroll Errors
              </span>
            </div>
            <p className="text-lg text-[var(--color-text-secondary)]">Last 12 Months</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {coreFeatures.map((feature, index) => (
            <Card 
              key={index} 
              className="border-[var(--color-border-primary)] hover:border-[var(--color-border-focus)] transition-all duration-300 group hover:shadow-lg overflow-hidden bg-[var(--color-bg-card)]"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6 space-y-3">
                <h4 className="text-lg font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-blue)] transition-colors cursor-pointer">
                  {feature.title}
                </h4>
                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreFeaturesSection;