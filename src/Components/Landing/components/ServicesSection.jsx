import React from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Users, UserCheck, BarChart3 } from "lucide-react";

const services = [
  {
    icon: Users,
    title: "Automated Payroll Management",
    description: "Process salaries, deductions, and taxes accurately with just a few clicks — reducing errors and saving time.",
    iconBg: "bg-[var(--color-blue-darker)]",
    link: "#"
  },
  {
    icon: UserCheck,
    title: "Leave & Attendance Integration",
    description: "Seamlessly sync employee attendance and leave records to ensure payroll is always accurate and compliant.",
    iconBg: "bg-[var(--color-blue-darker)]",
    link: "#"
  },
  {
    icon: BarChart3,
    title: "Real-Time Payroll Insights",
    description: "Track expenses, monitor compliance, and generate payroll reports with actionable insights in real time.",
    iconBg: "bg-[var(--color-blue-darker)]",
    link: "#"
  }
];

const ServicesSection = () => {
  return (
    <section className="py-20" style={{ backgroundColor: "var(--color-bg-primary)" }}>
      <div className="container mx-auto px-4">
        {/* Header Section with Animation */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex justify-between items-start mb-16"
        >
          <div className="text-left">
            <p className="text-[var(--color-text-secondary)] text-sm font-medium mb-2">Our Services</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--color-text-primary)]">
              Future-Ready Payroll<br />Management Platform
            </h2>
          </div>
        </motion.div>

        {/* Services Grid with Staggered Animation */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
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
                  className="border-[var(--color-border-primary)] hover:shadow-lg transition-all duration-300 group text-left bg-[var(--color-bg-card)] h-full"
                >
                  <CardContent className="p-8 space-y-6">
                    <motion.div 
                      className={`w-16 h-16 ${service.iconBg} rounded-full flex items-center justify-center transition-all duration-300`}
                      whileHover={{ 
                        scale: 1.1,
                        rotate: 5,
                        transition: { duration: 0.3 }
                      }}
                    >
                      <IconComponent className="h-8 w-8 text-[var(--color-text-white)]" />
                    </motion.div>
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
                        {service.title}
                      </h3>
                      <p className="text-[var(--color-text-secondary)] leading-relaxed text-sm">
                        {service.description}
                      </p>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button 
                          className="bg-[var(--color-blue-darker)] text-[var(--color-text-white)] hover:bg-[var(--color-blue-darkest)] text-sm px-6 py-2 rounded-full transition-all duration-300"
                        >
                          See Detail →
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;