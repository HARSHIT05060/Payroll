import { Button } from "../ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "../assets/hero-image.jpg";
import React from "react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-4 py-2 bg-white/70 text-gray-800 rounded-full text-sm font-medium border border-gray-200 backdrop-blur-sm"
            >
              Payroll Made Simple
            </motion.div>

            <div className="space-y-6">
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl lg:text-6xl font-bold leading-tight text-gray-800"
              >
                SyncWage –{" "}
                <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
                  An Ultimate Payroll Software
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg text-gray-600 leading-relaxed max-w-lg"
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
                  className="px-8 py-6 text-base bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
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
                  className="px-8 py-6 text-base border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-blue-600 hover:text-blue-600"
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
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent"></div>
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
              className="absolute -bottom-6 -left-6 bg-white/90 border border-gray-200 rounded-xl p-4 shadow-lg backdrop-blur-sm"
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
                  className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center"
                >
                  <span className="text-blue-600 font-bold text-lg">100+</span>
                </motion.div>
                <div>
                  <motion.p
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.1 }}
                    className="font-semibold text-gray-800"
                  >
                    Businesses Empowered
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                    className="text-sm text-gray-600"
                  >
                    With Smarter Payroll
                  </motion.p>
                </div>
              </div>
            </motion.div>

            {/* Additional floating element for visual interest */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              transition={{
                duration: 0.6,
                delay: 1.3,
                type: "spring",
                stiffness: 150
              }}
              animate={{
                y: [0, -10, 0],
                transition: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="absolute top-6 right-6 w-4 h-4 bg-blue-500 rounded-full opacity-60"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              transition={{
                duration: 0.6,
                delay: 1.5,
                type: "spring",
                stiffness: 150
              }}
              animate={{
                y: [0, -15, 0],
                transition: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }
              }}
              className="absolute top-20 right-20 w-3 h-3 bg-purple-400 rounded-full opacity-40"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;