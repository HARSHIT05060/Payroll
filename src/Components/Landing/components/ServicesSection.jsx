import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Users, UserCheck, BarChart3 } from "lucide-react";

const services = [
  {
    icon: Users,
    title: "Automated Payroll Management",
    description: "Process salaries, deductions, and taxes accurately with just a few clicks — reducing errors and saving time.",
    iconBg: "bg-[var(--color-blue)]",
    link: "#"
  },
  {
    icon: UserCheck,
    title: "Leave & Attendance Integration",
    description: "Seamlessly sync employee attendance and leave records to ensure payroll is always accurate and compliant.",
    iconBg: "bg-[var(--color-blue-dark)]",
    link: "#"
  },
  {
    icon: BarChart3,
    title: "Real-Time Payroll Insights",
    description: "Track expenses, monitor compliance, and generate payroll reports with actionable insights in real time.",
    iconBg: "bg-[var(--color-success)]",
    link: "#"
  }
];

const ServicesSection = () => {
  return (
    <section className="py-20" style={{ backgroundColor: "var(--color-bg-primary)" }}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-start mb-16">
          <div className="text-left">
            <p className="text-[var(--color-text-secondary)] text-sm font-medium mb-2">Our Services</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--color-text-primary)]">
              Future-Ready Payroll<br />Management Platform
            </h2>
          </div>
          <Button 
            className="bg-[var(--color-text-primary)] text-[var(--color-text-white)] hover:bg-[var(--color-blue-dark)] rounded-full px-6 py-2 text-sm transition-colors duration-300"
          >
            See More →
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card 
                key={index} 
                className="border-[var(--color-border-primary)] hover:shadow-lg transition-all duration-300 group text-left bg-[var(--color-bg-card)]"
              >
                <CardContent className="p-8 space-y-6">
                  <div className={`w-16 h-16 ${service.iconBg} rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-105`}>
                    <IconComponent className="h-8 w-8 text-[var(--color-text-white)]" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
                      {service.title}
                    </h3>
                    <p className="text-[var(--color-text-secondary)] leading-relaxed text-sm">
                      {service.description}
                    </p>
                    <Button 
                      className="bg-[var(--color-blue)] text-[var(--color-text-white)] hover:bg-[var(--color-blue-dark)] text-sm px-6 py-2 rounded-full transition-all duration-300 group-hover:scale-105"
                    >
                      See Detail →
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
