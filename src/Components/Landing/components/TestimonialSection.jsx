import { Card, CardContent } from "../ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "HR Director",
    company: "TechCorp Solutions",
    quote: "Hurevo has transformed our HR operations completely. We've reduced administrative time by 60% and improved employee satisfaction significantly.",
    rating: 5
  },
  {
    name: "Arjun Patel",
    role: "CEO",
    company: "Innovation Labs",
    quote: "The analytics and reporting features give us incredible insights into our workforce. It's like having an HR consultant available 24/7.",
    rating: 5
  },
  {
    name: "Sneha Krishnan",
    role: "Operations Manager",
    company: "Growth Industries",
    quote: "From onboarding to performance reviews, everything is seamless. Our new employees love the digital experience.",
    rating: 5
  }
];

const TestimonialSection = () => {
  return (
    <section className="py-20 bg-[var(--color-bg-secondary)]">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-[var(--color-text-primary)]">
            What Our Clients Say
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Discover how companies are transforming their HR processes with Hurevo
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="border-[var(--color-border-primary)] hover:border-[var(--color-border-focus)] transition-all duration-300 relative overflow-hidden bg-[var(--color-bg-card)]"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[var(--color-warning)] text-[var(--color-warning)]" />
                  ))}
                </div>

                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 w-8 h-8 text-[var(--color-blue-lighter)]" />
                  <p className="text-[var(--color-text-secondary)] leading-relaxed pl-6">
                    "{testimonial.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--color-border-primary)]">
                  <p className="font-semibold text-[var(--color-text-primary)]">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {testimonial.role} at {testimonial.company}
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

export default TestimonialSection;