import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Mail, Phone, MapPin, Clock, ArrowRight } from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    value: "hello@hurevo.com",
    description: "We'll respond within 24 hours"
  },
  {
    icon: Phone,
    title: "Call Us",
    value: "+1 (555) 123-4567", 
    description: "Mon-Fri from 8am to 6pm"
  },
  {
    icon: MapPin,
    title: "Visit Us",
    value: "123 Business Ave, Suite 100",
    description: "San Francisco, CA 94107"
  },
  {
    icon: Clock,
    title: "Support Hours",
    value: "24/7 Available",
    description: "Round-the-clock assistance"
  }
];

const faqData = [
  {
    question: "How quickly can we get set up?",
    answer: "Most organizations are up and running within 5 minutes. Our intuitive setup process guides you through each step."
  },
  {
    question: "Do you offer customer support?",
    answer: "Yes! We provide 24/7 customer support through chat, email, and phone. Our team is always ready to help."
  },
  {
    question: "Is there a free trial available?",
    answer: "Absolutely! We offer a 30-day free trial with full access to all features. No credit card required."
  },
  {
    question: "Can we integrate with existing tools?",
    answer: "Yes, we support 200+ integrations with popular HR, accounting, and business tools to streamline your workflow."
  }
];

const processSteps = [
  {
    number: "1",
    title: "Send us your details",
    description: "Fill out the form with your information"
  },
  {
    number: "2",
    title: "We'll reach out to you",
    description: "Our team will contact you within 24 hours"
  },
  {
    number: "3",
    title: "Start your free trial",
    description: "Get set up in under 5 minutes"
  }
];

const Contact = () => {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <main>
        {/* Hero Section with Animation */}
        <section className="py-20 lg:py-32 bg-[var(--color-bg-gradient-start)]">
          <div className="container mx-auto px-4 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-6xl font-bold leading-tight mb-6 text-[var(--color-text-primary)]"
            >
              Get In{" "}
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-[var(--color-blue)]"
              >
                Touch
              </motion.span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto leading-relaxed"
            >
              Ready to transform your HR operations? We're here to help you get started 
              and answer any questions you might have.
            </motion.p>
          </div>
        </section>

        {/* Contact Information with Staggered Animation */}
        <section className="py-20 bg-[var(--color-bg-secondary)]">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: index * 0.1,
                      ease: "easeOut"
                    }}
                    viewport={{ once: true }}
                    whileHover={{ 
                      y: -10,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <Card className="border-[var(--color-border-primary)] hover:border-[var(--color-border-focus)] transition-all duration-300 group hover:shadow-lg text-center bg-[var(--color-bg-card)] h-full">
                      <CardContent className="p-8 space-y-4">
                        <motion.div
                          className="w-16 h-16 bg-[var(--color-icon-blue-bg)] rounded-xl flex items-center justify-center mx-auto group-hover:bg-[var(--color-blue-lighter)] transition-colors"
                          whileHover={{ 
                            scale: 1.1,
                            rotate: 10,
                            transition: { duration: 0.3 }
                          }}
                        >
                          <IconComponent className="h-8 w-8 text-[var(--color-blue)]" />
                        </motion.div>
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                            {info.title}
                          </h3>
                          <p className="font-medium text-[var(--color-text-primary)]">
                            {info.value}
                          </p>
                          <p className="text-sm text-[var(--color-text-secondary)]">
                            {info.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact Form Section with Split Animation */}
        <section className="py-20 bg-[var(--color-bg-gradient-start)]">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left Side - Process Steps */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-3xl lg:text-4xl font-bold text-[var(--color-text-primary)]"
                >
                  Ready to Get Started?
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="text-lg text-[var(--color-text-secondary)] leading-relaxed"
                >
                  Send us a message and we'll get back to you as soon as possible. 
                  Our team is ready to help you transform your HR operations.
                </motion.p>
                
                <div className="space-y-4">
                  {processSteps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ 
                        duration: 0.6, 
                        delay: 0.6 + (index * 0.2)
                      }}
                      viewport={{ once: true }}
                      className="flex items-center space-x-3"
                    >
                      <motion.div
                        className="w-8 h-8 bg-[var(--color-icon-blue-bg)] rounded-full flex items-center justify-center"
                        whileHover={{ 
                          scale: 1.2,
                          rotate: 360,
                          transition: { duration: 0.5 }
                        }}
                      >
                        <span className="text-[var(--color-blue)] font-semibold text-sm">{step.number}</span>
                      </motion.div>
                      <div>
                        <h4 className="font-semibold text-[var(--color-text-primary)]">{step.title}</h4>
                        <p className="text-sm text-[var(--color-text-secondary)]">{step.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Right Side - Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Card className="border-[var(--color-border-primary)] bg-[var(--color-bg-card)]">
                  <CardContent className="p-8">
                    <form className="space-y-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        viewport={{ once: true }}
                        className="grid sm:grid-cols-2 gap-4"
                      >
                        <div className="space-y-2">
                          <label htmlFor="firstName" className="text-sm font-medium text-[var(--color-text-primary)]">
                            First Name
                          </label>
                          <Input id="firstName" placeholder="Enter your first name" className="border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]" />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="lastName" className="text-sm font-medium text-[var(--color-text-primary)]">
                            Last Name
                          </label>
                          <Input id="lastName" placeholder="Enter your last name" className="border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]" />
                        </div>
                      </motion.div>
                      
                      {[
                        { id: "email", label: "Email Address", type: "email", placeholder: "Enter your email" },
                        { id: "company", label: "Company Name", type: "text", placeholder: "Enter your company name" },
                        { id: "phone", label: "Phone Number", type: "text", placeholder: "Enter your phone number" }
                      ].map((field, index) => (
                        <motion.div
                          key={field.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.6 + (index * 0.1) }}
                          viewport={{ once: true }}
                          className="space-y-2"
                        >
                          <label htmlFor={field.id} className="text-sm font-medium text-[var(--color-text-primary)]">
                            {field.label}
                          </label>
                          <Input 
                            id={field.id} 
                            type={field.type}
                            placeholder={field.placeholder} 
                            className="border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]" 
                          />
                        </motion.div>
                      ))}
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.9 }}
                        viewport={{ once: true }}
                        className="space-y-2"
                      >
                        <label htmlFor="message" className="text-sm font-medium text-[var(--color-text-primary)]">
                          Message
                        </label>
                        <Textarea 
                          id="message" 
                          placeholder="Tell us about your HR needs and how we can help" 
                          rows={4}
                          className="border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]"
                        />
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.0 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button variant="hero" size="lg" className="w-full group">
                          Send Message
                          <motion.div
                            className="ml-2"
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ArrowRight className="h-5 w-5" />
                          </motion.div>
                        </Button>
                      </motion.div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section with Accordion-like Animation */}
        <section className="py-20 bg-[var(--color-bg-secondary)]">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center space-y-4 mb-16"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-[var(--color-text-primary)]">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                Quick answers to common questions about our platform
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto space-y-6">
              {faqData.map((faq, index) => (
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
                    y: -5,
                    transition: { duration: 0.3 }
                  }}
                >
                  <Card className="border-[var(--color-border-primary)] bg-[var(--color-bg-card)] hover:border-[var(--color-border-focus)] transition-all duration-300">
                    <CardContent className="p-6">
                      <h4 className="font-semibold text-[var(--color-text-primary)] mb-2">{faq.question}</h4>
                      <p className="text-[var(--color-text-secondary)]">{faq.answer}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Contact;