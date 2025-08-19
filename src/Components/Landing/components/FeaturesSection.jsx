import React from "react";
import { motion } from "framer-motion";
import { Users, Calendar, DollarSign, BarChart3, Shield, Zap } from "lucide-react";

const benefits = [
  {
    icon: DollarSign,
    title: "Accurate Payroll Processing",
    description: "Eliminate manual errors with automated salary calculations, tax deductions, and compliance-ready reports."
  },
  {
    icon: Calendar,
    title: "Leave & Attendance Integration", 
    description: "Sync employee attendance and leave records directly into payroll for seamless payouts every cycle."
  },
  {
    icon: BarChart3,
    title: "Real-Time Insights & Analytics",
    description: "Access dashboards and reports to track payroll expenses, employee costs, and financial trends instantly."
  },
  {
    icon: Shield,
    title: "Compliance & Data Security",
    description: "Stay compliant with statutory regulations while ensuring sensitive employee payroll data remains secure."
  },
  {
    icon: Users,
    title: "Employee Self-Service", 
    description: "Enable employees to view payslips, tax documents, and payroll history anytime through a secure portal."
  },
  {
    icon: Zap,
    title: "Faster & Scalable Operations",
    description: "Process payroll in minutes and scale effortlessly as your workforce grows, without added complexity."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-[var(--color-bg-gradient-start)]">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header with Animation */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm text-[var(--color-text-blue)] uppercase tracking-wider mb-3 font-medium">Benefits</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-[var(--color-text-primary)] mb-4">
            Smarter Payroll, Better Business Outcomes
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-3xl mx-auto">
            Drive efficiency, compliance, and employee satisfaction with intelligent, automated payroll management tools.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* Left Column - Benefits 1-3 */}
          <div className="space-y-8">
            {benefits.slice(0, 3).map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.2,
                    ease: "easeOut"
                  }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 group"
                >
                  <div className="flex-shrink-0 mt-1">
                    <motion.div 
                      className="w-12 h-12 bg-[var(--color-blue)] hover:bg-[var(--color-blue-dark)] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 border border-[var(--color-border-primary)]"
                      whileHover={{ 
                        scale: 1.15,
                        rotate: 10,
                        transition: { duration: 0.3 }
                      }}
                    >
                      <IconComponent className="h-5 w-5 text-[var(--color-text-white)]" />
                    </motion.div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-text-blue)] transition-colors duration-300">
                      {benefit.title}
                    </h3>
                    <p className="text-[var(--color-text-secondary)] leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Center Column - Professional Photo with Animation */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="relative">
              {/* Background decorative elements with animation */}
              <motion.div 
                className="absolute -top-4 -left-4 w-24 h-24 bg-[var(--color-blue-lighter)] rounded-full opacity-60"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.6, 0.8, 0.6]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div 
                className="absolute -bottom-6 -right-6 w-16 h-16 bg-[var(--color-blue-light)] rounded-full opacity-60"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 0.9, 0.6]
                }}
                transition={{ 
                  duration: 3,
                  delay: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Main image container */}
              <motion.div 
                className="relative w-80 h-96 bg-[var(--color-bg-card)] rounded-2xl overflow-hidden shadow-2xl border border-[var(--color-border-primary)]"
                whileHover={{ 
                  scale: 1.02,
                  rotateY: 5,
                  transition: { duration: 0.4 }
                }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80"
                  alt="Payroll software professional dashboard"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-blue-darkest)] via-transparent to-transparent opacity-30"></div>
              </motion.div>
              
              {/* Floating elements with animation */}
              <motion.div 
                className="absolute top-12 -right-8 w-6 h-6 bg-[var(--color-blue)] rounded opacity-70"
                animate={{ 
                  y: [-5, 5, -5],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div 
                className="absolute bottom-20 -left-6 w-4 h-4 bg-[var(--color-blue-light)] rounded opacity-70"
                animate={{ 
                  y: [5, -5, 5],
                  x: [-2, 2, -2]
                }}
                transition={{ 
                  duration: 3,
                  delay: 0.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
          </motion.div>

          {/* Right Column - Benefits 4-6 */}
          <div className="space-y-8">
            {benefits.slice(3, 6).map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <motion.div
                  key={index + 3}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.2,
                    ease: "easeOut"
                  }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 group"
                >
                  <div className="flex-shrink-0 mt-1">
                    <motion.div 
                      className="w-12 h-12 bg-[var(--color-blue)] hover:bg-[var(--color-blue-dark)] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 border border-[var(--color-border-primary)]"
                      whileHover={{ 
                        scale: 1.15,
                        rotate: -10,
                        transition: { duration: 0.3 }
                      }}
                    >
                      <IconComponent className="h-5 w-5 text-[var(--color-text-white)]" />
                    </motion.div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-text-blue)] transition-colors duration-300">
                      {benefit.title}
                    </h3>
                    <p className="text-[var(--color-text-secondary)] leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;