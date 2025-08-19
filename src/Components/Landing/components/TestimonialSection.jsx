import React from "react";
import { motion } from "framer-motion";
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
        {/* Header Section with Animation */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-[var(--color-text-primary)]">
            What Our Clients Say
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Discover how companies are transforming their HR processes with Hurevo
          </p>
        </motion.div>

        {/* Testimonials Grid with Staggered Animation */}
        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.2,
                ease: "easeOut"
              }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
            >
              <Card 
                className="border-[var(--color-border-primary)] hover:border-[var(--color-border-focus)] transition-all duration-300 relative overflow-hidden bg-[var(--color-bg-card)] h-full"
              >
                <CardContent className="p-6 space-y-4">
                  {/* Star Rating with Sequential Animation */}
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          duration: 0.4, 
                          delay: (index * 0.2) + (i * 0.1) + 0.5
                        }}
                        viewport={{ once: true }}
                        whileHover={{ 
                          scale: 1.2,
                          rotate: 15,
                          transition: { duration: 0.2 }
                        }}
                      >
                        <Star className="w-5 h-5 fill-[var(--color-warning)] text-[var(--color-warning)]" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Quote Section with Animation */}
                  <div className="relative">
                    <motion.div
                      initial={{ opacity: 0, scale: 0, rotate: -180 }}
                      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ 
                        duration: 0.6, 
                        delay: (index * 0.2) + 0.3,
                        type: "spring",
                        stiffness: 100
                      }}
                      viewport={{ once: true }}
                    >
                      <Quote className="absolute -top-2 -left-2 w-8 h-8 text-[var(--color-blue-lighter)]" />
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.6, 
                        delay: (index * 0.2) + 0.4
                      }}
                      viewport={{ once: true }}
                      className="text-[var(--color-text-secondary)] leading-relaxed pl-6"
                    >
                      "{testimonial.quote}"
                    </motion.p>
                  </div>

                  {/* Author Section with Animation */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: (index * 0.2) + 0.6
                    }}
                    viewport={{ once: true }}
                    className="pt-4 border-t border-[var(--color-border-primary)]"
                  >
                    <p className="font-semibold text-[var(--color-text-primary)]">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </motion.div>
                </CardContent>

                {/* Animated Background Gradient on Hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-[var(--color-blue-lighter)] via-transparent to-[var(--color-blue-light)] opacity-0 pointer-events-none"
                  whileHover={{ opacity: 0.05 }}
                  transition={{ duration: 0.3 }}
                />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;