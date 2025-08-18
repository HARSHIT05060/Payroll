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

const Contact = () => {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <main>
        {/* Hero Section */}
        <section className="py-20 lg:py-32 bg-[var(--color-bg-gradient-start)]">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6 text-[var(--color-text-primary)]">
              Get In{" "}
              <span className="text-[var(--color-blue)]">
                Touch
              </span>
            </h1>
            <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto leading-relaxed">
              Ready to transform your HR operations? We're here to help you get started 
              and answer any questions you might have.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-20 bg-[var(--color-bg-secondary)]">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <Card key={index} className="border-[var(--color-border-primary)] hover:border-[var(--color-border-focus)] transition-all duration-300 group hover:shadow-lg text-center bg-[var(--color-bg-card)]">
                    <CardContent className="p-8 space-y-4">
                      <div className="w-16 h-16 bg-[var(--color-icon-blue-bg)] rounded-xl flex items-center justify-center mx-auto group-hover:bg-[var(--color-blue-lighter)] transition-colors">
                        <IconComponent className="h-8 w-8 text-[var(--color-blue)]" />
                      </div>
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
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-20 bg-[var(--color-bg-gradient-start)]">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-6">
                <h2 className="text-3xl lg:text-4xl font-bold text-[var(--color-text-primary)]">
                  Ready to Get Started?
                </h2>
                <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
                  Send us a message and we'll get back to you as soon as possible. 
                  Our team is ready to help you transform your HR operations.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[var(--color-icon-blue-bg)] rounded-full flex items-center justify-center">
                      <span className="text-[var(--color-blue)] font-semibold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[var(--color-text-primary)]">Send us your details</h4>
                      <p className="text-sm text-[var(--color-text-secondary)]">Fill out the form with your information</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[var(--color-icon-blue-bg)] rounded-full flex items-center justify-center">
                      <span className="text-[var(--color-blue)] font-semibold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[var(--color-text-primary)]">We'll reach out to you</h4>
                      <p className="text-sm text-[var(--color-text-secondary)]">Our team will contact you within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[var(--color-icon-blue-bg)] rounded-full flex items-center justify-center">
                      <span className="text-[var(--color-blue)] font-semibold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[var(--color-text-primary)]">Start your free trial</h4>
                      <p className="text-sm text-[var(--color-text-secondary)]">Get set up in under 5 minutes</p>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="border-[var(--color-border-primary)] bg-[var(--color-bg-card)]">
                <CardContent className="p-8">
                  <form className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
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
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-[var(--color-text-primary)]">
                        Email Address
                      </label>
                      <Input id="email" type="email" placeholder="Enter your email" className="border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]" />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="company" className="text-sm font-medium text-[var(--color-text-primary)]">
                        Company Name
                      </label>
                      <Input id="company" placeholder="Enter your company name" className="border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]" />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium text-[var(--color-text-primary)]">
                        Phone Number
                      </label>
                      <Input id="phone" placeholder="Enter your phone number" className="border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]" />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium text-[var(--color-text-primary)]">
                        Message
                      </label>
                      <Textarea 
                        id="message" 
                        placeholder="Tell us about your HR needs and how we can help" 
                        rows={4}
                        className="border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]"
                      />
                    </div>
                    
                    <Button variant="hero" size="lg" className="w-full">
                      Send Message
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-[var(--color-bg-secondary)]">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-[var(--color-text-primary)]">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                Quick answers to common questions about our platform
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              {[
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
              ].map((faq, index) => (
                <Card key={index} className="border-[var(--color-border-primary)] bg-[var(--color-bg-card)]">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-[var(--color-text-primary)] mb-2">{faq.question}</h4>
                    <p className="text-[var(--color-text-secondary)]">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Contact;