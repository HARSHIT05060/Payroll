import { Card, CardContent } from "../ui/card";

const aboutStats = [
  {
    number: "500+",
    title: "Active Users",
    description: "Companies across industries rely on our platform to manage their HR operations daily"
  },
  {
    number: "98%",
    title: "Customer Satisfaction",
    description: "Our clients love our intuitive interface, responsive support, and continuous feature updates"
  },
  {
    number: "5",
    title: "Minutes to Onboard",
    description: "Our clients love our intuitive interface, responsive support, and continuous feature updates"
  },
  {
    number: "15+",
    title: "Industries Served",
    description: "Companies across industries rely on our platform to manage their HR operations daily"
  }
];

const AboutSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-[var(--color-bg-primary)] to-[var(--color-bg-secondary-30)]">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-[var(--color-text-primary)]">
            About Hurevo
          </h2>
          <div className="max-w-4xl mx-auto space-y-4">
            <p className="text-xl font-semibold text-[var(--color-text-primary)] leading-relaxed">
              At our core, we believe that great companies are built by empowered people.
              That's why we created a powerful, intuitive HRM SaaS platform designed to
              simplify every stage of the employee lifecycle — from recruitment and onboarding
              to performance tracking and payroll.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {aboutStats.map((stat, index) => (
            <Card key={index} className="text-center border-[var(--color-border-primary)]/50 hover:shadow-lg transition-all duration-300 bg-[var(--color-bg-card)]/80 backdrop-blur-sm">
              <CardContent className="p-8 space-y-4">
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[var(--color-blue)] to-[var(--color-blue-darker)] bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
                    {stat.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;