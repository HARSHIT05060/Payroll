import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { Users, TrendingUp, Heart, FileText, DollarSign, GraduationCap, Clock, UserMinus } from "lucide-react";

const resourceCategories = [
  {
    icon: Users,
    title: "Recruitment & Onboarding",
    description: "Hire the right talent and onboard employees seamlessly with structured workflows and checklists.",
    iconBg: "bg-[var(--color-blue-dark)]"
  },
  {
    icon: TrendingUp,
    title: "Performance Management",
    description: "Set goals, track progress, and run performance reviews to boost employee productivity.",
    iconBg: "bg-[var(--color-blue-dark)]"
  },
  {
    icon: Heart,
    title: "Employee Relations",
    description: "Build a positive workplace culture and resolve employee concerns with transparency.",
    iconBg: "bg-[var(--color-blue-dark)]"
  },
  {
    icon: FileText,
    title: "HR Policies & Compliance",
    description: "Maintain updated policies and ensure your business stays compliant with labor regulations.",
    iconBg: "bg-[var(--color-blue-dark)]"
  },
  {
    icon: DollarSign,
    title: "Payroll & Compensation",
    description: "Automate payroll processing, manage benefits, and ensure accurate salary disbursement.",
    iconBg: "bg-[var(--color-blue-dark)]"
  },
  {
    icon: GraduationCap,
    title: "Training & Development",
    description: "Empower employees with skill development programs and track learning progress.",
    iconBg: "bg-[var(--color-blue-dark)]"
  },
  {
    icon: Clock,
    title: "Time & Attendance",
    description: "Track employee working hours, leaves, and shifts with accurate time management tools.",
    iconBg: "bg-[var(--color-blue-dark)]"
  },
  {
    icon: UserMinus,
    title: "Offboarding Management",
    description: "Handle resignations and exits smoothly with structured offboarding checklists.",
    iconBg: "bg-[var(--color-blue-dark)]"
  }
];

const ResourceTemplatesSection = () => {
  return (
    <section className="py-20 bg-[var(--color-bg-secondary)]">
      <div className="container mx-auto px-4">
        {/* Header Section with Animation */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex justify-between items-start mb-16"
        >
          <div className="text-left max-w-2xl">
            <p className="text-[var(--color-text-secondary)] text-sm font-medium mb-2">Resource Categories</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
              Organize HR Workflows with<br />Ready-to-Use Templates
            </h2>
            <p className="text-[var(--color-text-secondary)]">
              Access essential HR categories to streamline every stage of the employee lifecycle — from hiring to exit.
            </p>
          </div>
        </motion.div>

        {/* Resource Categories Grid with Staggered Animation */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {resourceCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 }
                }}
              >
                <Card
                  className="border-[var(--color-border-primary)] hover:shadow-lg transition-all duration-300 group cursor-pointer bg-[var(--color-bg-card)] h-full"
                >
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-start space-x-4">
                      <motion.div 
                        className={`w-12 h-12 ${category.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}
                        whileHover={{ 
                          scale: 1.1,
                          rotate: 10,
                          transition: { duration: 0.3 }
                        }}
                      >
                        <IconComponent className="h-6 w-6 text-[var(--color-text-white)]" />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[var(--color-text-primary)] text-sm leading-snug mb-2">
                          {category.title}
                        </h3>
                        <p className="text-[var(--color-text-secondary)] text-xs leading-relaxed">
                          {category.description}
                        </p>
                      </div>
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

export default ResourceTemplatesSection;