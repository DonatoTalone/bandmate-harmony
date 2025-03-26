
import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GlassCard } from "@/components/shared/GlassCard";
import { AnimatedTransition } from "@/components/shared/AnimatedTransition";
import { ChevronRight, Music, MapPin, Bell, Star, Users } from "lucide-react";

const features = [
  {
    title: "Find musicians near you",
    description:
      "Connect with marching band musicians in your area for performances and events.",
    icon: MapPin,
    delay: 0.1,
  },
  {
    title: "Create band events",
    description:
      "Organize performances and invite the right musicians with the instruments you need.",
    icon: Music,
    delay: 0.2,
  },
  {
    title: "Get notified",
    description:
      "Receive alerts when events matching your instruments are happening nearby.",
    icon: Bell,
    delay: 0.3,
  },
  {
    title: "Build your reputation",
    description:
      "Earn reliability ratings by participating in events and showcasing your commitment.",
    icon: Star,
    delay: 0.4,
  },
];

export default function Index() {
  const [activeSection, setActiveSection] = useState<string>("hero");

  const handleScroll = () => {
    const sections = ["hero", "features", "cta"];
    
    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        const threshold = window.innerHeight * 0.3;
        
        if (rect.top <= threshold && rect.bottom >= threshold) {
          if (activeSection !== section) {
            setActiveSection(section);
          }
          break;
        }
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen" onScroll={handleScroll}>
      <Header />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section id="hero" className="relative pt-16 pb-20 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-radial from-accent/10 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent"></div>
          </div>
          
          <div className="container px-4 mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <AnimatedTransition 
                variant="slide-up" 
                className="max-w-2xl"
              >
                <div className="text-center lg:text-left space-y-6">
                  <div className="inline-block bg-primary/10 px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-primary">Find Marching Band Musicians</span>
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                    Connect and Play with{" "}
                    <span className="text-primary">Local Musicians</span>
                  </h1>
                  
                  <p className="text-lg text-muted-foreground">
                    Join Bandmate Harmony and connect with fellow marching band musicians. 
                    Create events, find performers, and build your musical community.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                    <Link to="/register" className="btn-primary w-full sm:w-auto">
                      Get Started
                    </Link>
                    <Link to="/dashboard" className="btn-outline w-full sm:w-auto">
                      Explore Events
                    </Link>
                  </div>
                </div>
              </AnimatedTransition>
              
              <AnimatedTransition
                variant="scale"
                delay={0.2}
                className="w-full lg:w-1/2 max-w-lg"
              >
                <GlassCard className="p-6 w-full aspect-square max-w-md mx-auto">
                  <div className="relative w-full h-full rounded-lg bg-gradient-to-tr from-primary/20 to-accent/20 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-8xl">🎺</div>
                    </div>
                    
                    {/* Decorative elements */}
                    <div className="absolute -top-3 -right-3 h-16 w-16 bg-secondary/70 rounded-lg rotate-12 backdrop-blur-sm"></div>
                    <div className="absolute -bottom-5 -left-5 h-20 w-20 bg-primary/70 rounded-full backdrop-blur-sm"></div>
                    <div className="absolute top-1/2 right-0 h-12 w-12 bg-accent/70 rounded-full -translate-y-1/2 translate-x-1/2 backdrop-blur-sm"></div>
                  </div>
                </GlassCard>
              </AnimatedTransition>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="container px-4 mx-auto">
            <AnimatedTransition variant="slide-up" className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything You Need for Your Marching Band
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Our platform simplifies the process of finding the right musicians 
                and organizing performances in your community.
              </p>
            </AnimatedTransition>
            
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              {features.map((feature, index) => (
                <AnimatedTransition 
                  key={feature.title} 
                  variant="slide-up" 
                  delay={feature.delay}
                >
                  <GlassCard className="p-6 h-full" hoverable>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="text-primary" size={24} />
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </GlassCard>
                </AnimatedTransition>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section id="cta" className="py-20 relative">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-radial from-secondary/10 to-transparent"></div>
          </div>
          
          <div className="container px-4 mx-auto">
            <AnimatedTransition variant="scale" className="max-w-4xl mx-auto">
              <GlassCard className="p-8 md:p-12">
                <div className="text-center space-y-6">
                  <h2 className="text-3xl md:text-4xl font-bold">
                    Ready to Join Your Local Marching Band Community?
                  </h2>
                  
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Register now to connect with musicians, create events, and build your reputation 
                    in the marching band community.
                  </p>
                  
                  <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to="/register" className="btn-primary w-full sm:w-auto">
                      Create Account
                    </Link>
                    
                    <Link to="/events" className="group flex items-center justify-center gap-2 w-full sm:w-auto">
                      <span className="text-primary">Browse Events</span>
                      <ChevronRight size={16} className="text-primary transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
                
                <div className="mt-12 pt-8 border-t border-border">
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex -space-x-2">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="h-10 w-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-sm font-medium"
                        >
                          <Users size={16} className="text-foreground/70" />
                        </div>
                      ))}
                    </div>
                    <p className="text-muted-foreground">
                      Join 2,000+ musicians already on the platform
                    </p>
                  </div>
                </div>
              </GlassCard>
            </AnimatedTransition>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
