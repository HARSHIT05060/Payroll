import { Users, Calendar, DollarSign, BarChart3, Shield, Zap } from "lucide-react";
import { Card, CardContent } from "../ui/card";

const features = [
  {
    icon: Users,
    title: "Recruitment & Onboarding",
    description: "Streamline your hiring process with automated workflows and digital onboarding experiences."
  },
  {
    icon: Calendar,
    title: "Performance Management",
    description: "Conduct effective performance reviews and track employee goals with our comprehensive tools."
  },
  {
    icon: DollarSign,
    title: "Payroll Processing",
    description: "Automate payroll calculations, tax deductions, and compliance reporting with accuracy."
  },
  {
    icon: BarChart3,
    title: "Employee Analytics",
    description: "Gain insights into workforce trends, engagement metrics, and productivity analytics."
  },
  {
    icon: Shield,
    title: "Secure & Compliant",
    description: "Enterprise-grade security with GDPR compliance and data protection standards."
  },
  {
    icon: Zap,
    title: "Cloud Integration",
    description: "Seamless integration with existing tools and scalable cloud infrastructure."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-[var(--color-bg-secondary)]">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-[var(--color-text-primary)]">
            Complete HR Solutions for{" "}
            <span className="text-[var(--color-blue)]">
              Modern Businesses
            </span>
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Everything you need to manage your workforce efficiently, all in one powerful platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index} 
                className="border-[var(--color-border-primary)] hover:border-[var(--color-border-focus)] transition-all duration-300 group hover:shadow-md bg-[var(--color-bg-card)]"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-[var(--color-icon-blue-bg)] rounded-xl flex items-center justify-center group-hover:bg-[var(--color-blue-lighter)] transition-colors">
                    <IconComponent className="h-6 w-6 text-[var(--color-blue)]" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
                      {feature.title}
                    </h3>
                    <p className="text-[var(--color-text-secondary)] leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;