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
    <section className="py-20" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex items-start justify-between mb-16"
        >
          <div className="w-48 ml-8">
            <div 
              className="px-4 py-2 rounded-3xl inline-block"
              style={{ backgroundColor: 'var(--color-bg-gray-light)' }}
            >
              <h2 
                className="text-sm font-bold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                About SyncWage
              </h2>
            </div>
          </div>
          <div className="flex-1 max-w-4xl flex text-end">
            <h1 
              className="text-2xl font-bold leading-tight"
              style={{ color: 'var(--color-text-primary)' }}
            >
              At our core, we believe that seamless payroll builds stronger teams. 
              That’s why we created{" "}
              <span style={{ color: 'var(--color-text-secondary)' }}>
                SyncWage — an ultimate payroll software designed to simplify every aspect of workforce pay, 
                from salary and compliance to attendance, leave, and employee benefits.
              </span>
            </h1>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-8 max-w-7xl mx-auto">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              viewport={{ once: true }}
              className={`relative rounded-3xl overflow-hidden h-80 shadow-lg ${
                stat.hasImage ? "border border-[var(--color-border-primary)]" : ""
              } ${stat.hasImage ? "bg-[var(--color-bg-secondary)]" : "bg-[var(--color-blue)]"}`}
            >
              {/* With image (split layout) */}
              {stat.hasImage ? (
                <div className="absolute inset-0 flex">
                  <div className="flex-1 p-8 flex flex-col justify-center bg-[var(--color-bg-primary)]">
                    <div className="text-7xl font-bold text-[var(--color-text-primary)] mb-4">
                      {stat.value}
                    </div>
                    <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">
                      {stat.label}
                    </h3>
                    <p className="text-[var(--color-text-secondary)] text-base leading-relaxed pr-4">
                      {stat.desc}
                    </p>
                  </div>
                  <div className="w-72 h-full">
                    <img
                      src={stat.image}
                      alt={stat.label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ) : (
                // Without image (centered content)
                <div className="p-8 flex flex-col justify-center text-center h-full">
                  <div className="text-7xl font-bold text-[var(--color-text-white)] mb-4">
                    {stat.value}
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--color-text-white)] mb-4">
                    {stat.label}
                  </h3>
                  <p className="text-[var(--color-text-white-90)] text-base leading-relaxed px-4">
                    {stat.desc}
                  </p>
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
