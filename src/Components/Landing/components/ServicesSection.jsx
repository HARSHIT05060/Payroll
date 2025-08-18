import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Users, UserCheck, BarChart3 } from "lucide-react";

const services = [
  {
    icon: Users,
    title: "Automated Payroll Management",
    description: "Streamline salary calculations, tax compliance, and payslip distribution — all in just a few clicks.",
    link: "#"
  },
  {
    icon: UserCheck,
    title: "Recruitment & Applicant Tracking",
    description: "Streamline salary calculations, tax compliance, and payslip distribution — all in just a few clicks.",
    link: "#"
  },
  {
    icon: BarChart3,
    title: "Employee Performance Monitoring",
    description: "Streamline salary calculations, tax compliance, and payslip distribution — all in just a few clicks.",
    link: "#"
  }
];

const ServicesSection = () => {
  return (
    <section className="py-20 bg-[var(--color-bg-primary)]">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-[var(--color-text-primary)]">
            Our Service
          </h2>
          <h3 className="text-2xl lg:text-4xl font-bold text-[var(--color-text-primary)]">
            Future-Ready{" "}
            <span className="bg-gradient-to-r from-[var(--color-blue)] to-[var(--color-blue-darker)] bg-clip-text text-transparent">
              HR Services Platform
            </span>
          </h3>
          <div className="pt-4">
            <Button variant="outline" size="lg" className="border-[var(--color-border-primary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]">
              See More
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card key={index} className="border-[var(--color-border-primary)]/50 hover:border-[var(--color-blue)]/30 transition-all duration-300 group hover:shadow-lg text-center bg-[var(--color-bg-card)]">
                <CardContent className="p-8 space-y-6">
                  <div className="w-16 h-16 bg-[var(--color-blue-lightest)] rounded-xl flex items-center justify-center mx-auto group-hover:bg-[var(--color-blue-lighter)] transition-colors">
                    <IconComponent className="h-8 w-8 text-[var(--color-blue)]" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
                      {service.title}
                    </h3>
                    <p className="text-[var(--color-text-secondary)] leading-relaxed">
                      {service.description}
                    </p>
                    <Button variant="link" className="text-[var(--color-blue)] p-0">
                      See Detail
                    </Button>
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

export default ServicesSection;