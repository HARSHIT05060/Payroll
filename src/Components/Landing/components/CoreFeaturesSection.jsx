import React from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

const coreFeatures = [
  {
    title: "Automated Payroll Processing",
    description: "Eliminate manual errors with precise salary, deduction, and compliance calculations.",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80"
  },
  {
    title: "Digital Payslip Distribution",
    description: "Deliver payslips instantly and securely to employees with one-click access.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80"
  },
  {
    title: "Leave & Attendance Integration",
    description: "Seamlessly sync attendance and leave data for accurate payroll every cycle.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80"
  }
];

const CoreFeaturesSection = () => {
  return (
    <section className="py-20 bg-[var(--color-blue-darker)] text-[var(--color-text-white)]">
      <div className="container mx-auto px-4">
        {/* Main Header Section with Animation */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-block bg-[var(--color-blue-dark)] px-4 py-2 rounded-full text-sm font-medium"
            >
              Core Features
            </motion.div>
            <h2 className="text-3xl lg:text-4xl font-bold leading-tight">
              Smart Payroll. Zero Hassle. Maximum Accuracy.
            </h2>
            <p className="text-[var(--color-text-white-90)] leading-relaxed">
              Explore the powerful features of SyncWage designed to automate payroll, 
              ensure compliance, and give employees a seamless experience every pay cycle.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button className="bg-[var(--color-bg-secondary)] text-[var(--color-blue-darker)] hover:bg-[var(--color-bg-hover)] px-6 py-3 rounded-full font-medium">
                Get Started Now
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: -15 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <motion.div
              whileHover={{ 
                scale: 1.02,
                rotateY: 5,
                transition: { duration: 0.4 }
              }}
              className="bg-[var(--color-bg-secondary-10)] backdrop-blur-sm rounded-2xl p-8 text-center border border-[var(--color-bg-secondary-20)]"
            >
              <motion.img
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80"
                alt="Payroll automation dashboard"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Stats Section with Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.h3
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-2xl font-bold mb-8"
          >
            Zero Payroll Errors in the Last 12 Months
          </motion.h3>
        </motion.div>

        {/* Feature Cards with Staggered Animation */}
        <div className="grid md:grid-cols-3 gap-6">
          {coreFeatures.map((feature, index) => (
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
                className="bg-[var(--color-bg-secondary-10)] backdrop-blur-sm border border-[var(--color-bg-secondary-20)] hover:bg-[var(--color-bg-secondary-15)] transition-all duration-300 group overflow-hidden h-full"
              >
                <div className="aspect-video overflow-hidden">
                  <motion.img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                <CardContent className="p-6 space-y-3">
                  <h4 className="text-lg font-semibold text-[var(--color-text-white)] group-hover:text-[var(--color-blue-lighter)] transition-colors">
                    {feature.title}
                  </h4>
                  <p className="text-[var(--color-text-white-90)] text-sm leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="flex justify-end pt-2">
                    <motion.svg 
                      className="w-5 h-5 text-[var(--color-blue-lighter)]" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      whileHover={{ 
                        x: 5,
                        transition: { duration: 0.3 }
                      }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </motion.svg>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreFeaturesSection;