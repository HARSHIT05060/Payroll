import { Button } from "../ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "../assets/hero-image.jpg";
import React from "react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-[var(--color-bg-gradient-start)] via-[var(--color-blue-lightest)] to-[var(--color-blue-lighter)]">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-4 py-2 bg-[var(--color-bg-secondary-30)] text-[var(--color-text-primary)] rounded-full text-sm font-medium border border-[var(--color-border-primary)] backdrop-blur-sm"
            >
              Payroll Made Simple
            </motion.div>

            <div className="space-y-6">
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl lg:text-6xl font-bold leading-tight text-[var(--color-text-primary)]"
              >
                SyncWage –{" "}
                <span className="bg-[var(--color-blue-darker)] bg-clip-text text-transparent">
                  An Ultimate Payroll Software
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-lg"
              >
                Automate and simplify payroll — from salary calculations and tax compliance
                to attendance, leave, and employee benefits — with a secure, scalable, and
                user-friendly cloud platform built for modern businesses and growing teams.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Button
                  variant="hero"
                  size="lg"
                  className="px-8 py-6 text-base bg-[var(--color-blue-darker)] hover:bg-[var(--color-blue-darkest)] text-[var(--color-text-white)] shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Started Now
                  <motion.div
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </motion.div>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-6 text-base border-[var(--color-border-primary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] hover:border-[var(--color-border-focus)] hover:text-[var(--color-text-blue)] transition-all duration-300"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Learn More
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Content - Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300"
            >
              <img
                src={heroImage}
                alt="Payroll software dashboard showcasing salary, compliance, and workforce insights"
                className="w-full h-auto object-cover"
              />
            </motion.div>

            {/* Floating Stats */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.8,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{
                y: -5,
                transition: { duration: 0.3 }
              }}
              className="absolute -bottom-6 -left-6 bg-[var(--color-bg-card)] border border-[var(--color-border-primary)] rounded-xl p-4 shadow-lg backdrop-blur-sm"
            >
              <div className="flex items-center space-x-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 1,
                    type: "spring",
                    stiffness: 200
                  }}
                  className="w-12 h-12 bg-[var(--color-blue-lightest)] rounded-full flex items-center justify-center"
                >
                  <span className="text-[var(--color-blue)] font-bold text-lg">100+</span>
                </motion.div>
                <div>
                  <motion.p
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.1 }}
                    className="font-semibold text-[var(--color-text-primary)]"
                  >
                    Businesses Empowered
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                    className="text-sm text-[var(--color-text-secondary)]"
                  >
                    With Smarter Payroll
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;