import { Card, CardContent } from "../ui/card";
import { Users, TrendingUp, Heart, FileText, DollarSign, GraduationCap, Clock, UserMinus } from "lucide-react";

const resourceCategories = [
  {
    icon: Users,
    title: "Recruitment & Onboarding"
  },
  {
    icon: TrendingUp,
    title: "Performance Management"
  },
  {
    icon: Heart,
    title: "Employee Relations"
  },
  {
    icon: FileText,
    title: "HR Policies & Compliance"
  },
  {
    icon: DollarSign,
    title: "Payroll & Compensation"
  },
  {
    icon: GraduationCap,
    title: "Training & Development"
  },
  {
    icon: Clock,
    title: "Time & Attendance"
  },
  {
    icon: UserMinus,
    title: "Offboarding & Management"
  }
];

const ResourceTemplatesSection = () => {
  return (
    <section className="py-20 bg-[var(--color-bg-gradient-start)]">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-[var(--color-text-primary)]">
            Resource Categories Templates
          </h2>
          <h3 className="text-2xl lg:text-4xl font-bold text-[var(--color-text-primary)]">
            Organize HR Workflows with{" "}
            <span className="text-[var(--color-blue)]">
              Ready-to-Use Templates
            </span>
          </h3>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Explore essential HR document categories to streamline every stage of the employee lifecycle
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {resourceCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card 
                key={index} 
                className="border-[var(--color-border-primary)] hover:border-[var(--color-border-focus)] transition-all duration-300 group hover:shadow-lg text-center cursor-pointer bg-[var(--color-bg-card)]"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-[var(--color-icon-blue-bg)] rounded-xl flex items-center justify-center mx-auto group-hover:bg-[var(--color-blue-lighter)] transition-colors">
                    <IconComponent className="h-6 w-6 text-[var(--color-blue)]" />
                  </div>
                  <h3 className="font-semibold text-[var(--color-text-primary)] text-sm">
                    {category.title}
                  </h3>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ResourceTemplatesSection;