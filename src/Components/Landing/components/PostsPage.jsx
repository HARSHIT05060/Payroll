import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Calendar, User, ArrowRight, Tag } from "lucide-react";

const blogPosts = [
  {
    title: "How Automation Is Reshaping the Role of HR Management",
    excerpt: "Discover how AI and automation are transforming traditional HR processes and what it means for the future of workplace management.",
    author: "HR Admin",
    date: "June 24, 2025",
    image: "https://kit.createbigsupply.com/hurevo/wp-content/uploads/sites/56/2025/06/business-people-with-laptop-in-modern-office-build-2024-10-30-23-05-48-utc-1024x665.jpg",
    category: "Automation"
  },
  {
    title: "Building Better Employee Retention Strategies",
    excerpt: "Learn proven techniques to improve employee satisfaction and reduce turnover rates in your organization.",
    author: "HR Admin", 
    date: "June 24, 2025",
    image: "https://kit.createbigsupply.com/hurevo/wp-content/uploads/sites/56/2025/06/young-business-people-meeting-office-teamwork-grou-2025-02-01-15-31-06-utc-1024x741.jpg",
    category: "Retention"
  },
  {
    title: "The Future of Performance Management Systems",
    excerpt: "Explore modern approaches to performance reviews and continuous feedback in the digital workplace.",
    author: "HR Admin",
    date: "June 24, 2025", 
    image: "https://kit.createbigsupply.com/hurevo/wp-content/uploads/sites/56/2025/06/young-couple-with-a-problem-consult-with-psycholog-2024-10-14-17-10-31-utc-1024x683.jpg",
    category: "Feedback"
  },
  {
    title: "Streamlining Your Hiring Process with Technology",
    excerpt: "Best practices for leveraging HR technology to attract, evaluate, and onboard top talent efficiently.",
    author: "HR Admin",
    date: "June 24, 2025",
    image: "https://kit.createbigsupply.com/hurevo/wp-content/uploads/sites/56/2025/06/professional-diverse-business-people-having-collab-2025-03-25-03-18-10-utc-1024x683.jpg", 
    category: "Hiring"
  }
];

const popularTopics = ["Retention", "Automation", "Feedback", "Hiring"];

const Posts = () => {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <main>
        {/* Hero Section */}
        <section className="py-20 lg:py-32 bg-[var(--color-bg-gradient-start)]">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6 text-[var(--color-text-primary)]">
              HR{" "}
              <span className="text-[var(--color-blue)]">
                Insights
              </span>
            </h1>
            <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto leading-relaxed">
              Stay ahead with the latest trends, best practices, and insights from 
              HR industry experts and thought leaders.
            </p>
          </div>
        </section>

        {/* Popular Topics */}
        <section className="py-12 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border-primary)]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[var(--color-text-primary)]">Popular Topics</h2>
              <div className="flex flex-wrap justify-center gap-4">
                {popularTopics.map((topic, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="rounded-full border-[var(--color-border-primary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]"
                  >
                    <Tag className="w-4 h-4 mr-2" />
                    {topic}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-20 bg-[var(--color-bg-primary)]">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
              {blogPosts.map((post, index) => (
                <Card key={index} className="border-[var(--color-border-primary)] hover:border-[var(--color-border-focus)] transition-all duration-300 group hover:shadow-lg overflow-hidden bg-[var(--color-bg-card)]">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center space-x-4 text-sm text-[var(--color-text-secondary)]">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-blue)] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-icon-blue-bg)] text-[var(--color-blue)]">
                        {post.category}
                      </span>
                      <Button variant="link" className="text-[var(--color-blue)] p-0 hover:no-underline">
                        See More
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="px-8 border-[var(--color-border-primary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]">
                Load More Posts
              </Button>
            </div>
          </div>
        </section>

        {/* Newsletter Subscription */}
        <section className="py-20 bg-[var(--color-bg-gradient-start)]">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-[var(--color-text-primary)]">
              Stay Updated with HR Trends
            </h2>
            <p className="text-lg text-[var(--color-text-secondary)] mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and get the latest insights, tips, and best practices delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-4 py-3 rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] text-[var(--color-text-primary)]"
              />
              <Button variant="hero" className="px-6">
                Subscribe
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Posts;