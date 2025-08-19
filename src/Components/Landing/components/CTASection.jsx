import React from "react";
import { motion } from "framer-motion";
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
    <section className="py-20 bg-[var(--color-blue-darker)] text-[var(--color-text-white)] relative overflow-hidden">
      {/* Animated Background Pattern */}
      <motion.div
        className="absolute inset-0 opacity-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }} />
      </motion.div>

      {/* Floating Background Elements */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 bg-white rounded-full opacity-5"
        animate={{
          y: [-10, 10, -10],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-16 h-16 bg-white rounded-full opacity-5"
        animate={{
          y: [10, -10, 10],
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Header Section with Animation */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-3xl lg:text-5xl font-bold leading-tight text-[var(--color-text-white)]"
            >
              Ready to Transform Your HR Operations?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-xl text-[var(--color-text-white-90)] leading-relaxed max-w-2xl mx-auto"
            >
              Join thousands of companies already using Hurevo to streamline their workforce management.
              Start your free trial today and see the difference.
            </motion.p>
          </motion.div>

          {/* Benefits List with Staggered Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20, scale: 0.8 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.8 + (index * 0.1),
                  ease: "easeOut"
                }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                className="flex items-center space-x-2 justify-center sm:justify-start"
              >
                <motion.div
                  whileHover={{ 
                    rotate: 360,
                    scale: 1.2,
                    transition: { duration: 0.5 }
                  }}
                >
                  <CheckCircle className="w-5 h-5 text-[var(--color-text-white)] flex-shrink-0" />
                </motion.div>
                <span className="text-[var(--color-text-white-90)]">{benefit}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons with Animation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="accent"
                size="lg"
                className="px-8 py-6 text-base font-semibold bg-[var(--color-success)] text-[var(--color-text-white)] hover:bg-[var(--color-success-dark)] group"
              >
                Start Free Trial
                <motion.div
                  className="ml-2"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.div>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-base border-[var(--color-border-primary)] text-[var(--color-text-white)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-blue)]"
              >
                Schedule Demo
              </Button>
            </motion.div>
          </motion.div>

          {/* Footer Text with Animation */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.7 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            viewport={{ once: true }}
            className="text-sm text-[var(--color-text-white-90)]"
          >
            No credit card required • Setup in under 5 minutes
          </motion.p>
        </div>
      </div>

      {/* Animated Bottom Accent */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        viewport={{ once: true }}
      />
    </section>
  );
};

export default CTASection;