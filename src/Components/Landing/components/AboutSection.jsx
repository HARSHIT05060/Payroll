import React from "react";
import { motion } from "framer-motion";

const stats = [
  {
    value: "10000+",
    label: "Payrolls Processed",
    desc: "Trusted by businesses to automate and streamline salary, tax, and compliance every month.",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    hasImage: true,
  },
  {
    value: "98%",
    label: "Customer Satisfaction",
    desc: "Our clients appreciate the accuracy, security, and simplicity SyncWage delivers in payroll management.",
    hasImage: false,
  },
  {
    value: "5 Min",
    label: "Setup & Onboard",
    desc: "Get your company up and running with SyncWage in just minutes—no complex setup required.",
    hasImage: false,
  },
  {
    value: "25+",
    label: "Industries Served",
    desc: "From startups to enterprises, SyncWage powers payroll across multiple sectors and business sizes.",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    hasImage: true,
  },
];

const AboutSection = () => {
  return (
    <section className="py-20 bg-[var(--color-bg-secondary)]">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-12 lg:mb-16 space-y-6 lg:space-y-0"
        >
          <div className="lg:w-48 lg:ml-8">
            <div className="px-4 py-2 rounded-3xl inline-block bg-[var(--color-bg-gray-light)]">
              <h2 className="text-sm font-bold text-[var(--color-text-primary)]">
                About SyncWage
              </h2>
            </div>
          </div>
          <div className="flex-1 lg:max-w-4xl flex lg:text-end">
            <h1 className="text-xl md:text-2xl font-bold leading-tight text-[var(--color-text-primary)]">
              At our core, we believe that seamless payroll builds stronger teams. 
              That's why we created{" "}
              <span className="text-[var(--color-text-secondary)]">
                SyncWage — an ultimate payroll software designed to simplify every aspect of workforce pay, 
                from salary and compliance to attendance, leave, and employee benefits.
              </span>
            </h1>
          </div>
        </motion.div>

        {/* Stats Grid - Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3 }
              }}
              className={`relative rounded-3xl overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-xl ${
                stat.hasImage 
                  ? "border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] h-64 md:h-80" 
                  : "bg-[var(--color-blue-darker)] hover:bg-[var(--color-blue-darkest)] h-64 md:h-80"
              }`}
            >
              {/* With image (responsive layout) */}
              {stat.hasImage ? (
                <div className="absolute inset-0 flex flex-col md:flex-row">
                  <div className="flex-1 p-4 md:p-8 flex flex-col justify-center bg-[var(--color-bg-primary)]">
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.6, delay: i * 0.2 + 0.3 }}
                      viewport={{ once: true }}
                      className="text-4xl md:text-7xl font-bold text-[var(--color-text-primary)] mb-2 md:mb-4"
                    >
                      {stat.value}
                    </motion.div>
                    <motion.h3 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: i * 0.2 + 0.4 }}
                      viewport={{ once: true }}
                      className="text-lg md:text-2xl font-bold text-[var(--color-text-primary)] mb-1 md:mb-3"
                    >
                      {stat.label}
                    </motion.h3>
                    <motion.p 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: i * 0.2 + 0.5 }}
                      viewport={{ once: true }}
                      className="text-[var(--color-text-secondary)] text-sm md:text-base leading-relaxed pr-0 md:pr-4 line-clamp-3 md:line-clamp-none"
                    >
                      {stat.desc}
                    </motion.p>
                  </div>
                  <div className="w-full h-32 md:w-72 md:h-full">
                    <motion.img
                      initial={{ scale: 1.1, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.8, delay: i * 0.2 + 0.2 }}
                      viewport={{ once: true }}
                      src={stat.image}
                      alt={stat.label}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </div>
              ) : (
                // Without image (centered content)
                <div className="p-4 md:p-8 flex flex-col justify-center text-center h-full">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: i * 0.2 + 0.3 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-7xl font-bold text-[var(--color-text-white)] mb-2 md:mb-4"
                  >
                    {stat.value}
                  </motion.div>
                  <motion.h3 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.2 + 0.4 }}
                    viewport={{ once: true }}
                    className="text-lg md:text-2xl font-bold text-[var(--color-text-white)] mb-2 md:mb-4"
                  >
                    {stat.label}
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.2 + 0.5 }}
                    viewport={{ once: true }}
                    className="text-[var(--color-text-white-90)] text-sm md:text-base leading-relaxed px-2 md:px-4 line-clamp-4 md:line-clamp-none"
                  >
                    {stat.desc}
                  </motion.p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;