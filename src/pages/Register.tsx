
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GlassCard } from "@/components/shared/GlassCard";
import { AnimatedTransition } from "@/components/shared/AnimatedTransition";
import { InstrumentSelector } from "@/components/ui/InstrumentSelector";
import { LocationPicker } from "@/components/ui/LocationPicker";
import { ChevronLeft, ChevronRight, User, Mail, Lock, Music, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    instruments: [] as string[],
    location: {
      address: "",
      latitude: 0,
      longitude: 0,
    },
  });
  
  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };
  
  const handleNext = () => {
    if (step === 1) {
      // Validate first step
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        toast.error("Please fill in all fields");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
    } else if (step === 2) {
      // Validate second step
      if (formData.instruments.length === 0) {
        toast.error("Please select at least one instrument");
        return;
      }
    } else if (step === 3) {
      // Validate third step and submit
      if (!formData.location.address) {
        toast.error("Please enter your location");
        return;
      }
      
      // Simulate account creation
      toast.success("Account created successfully!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
      return;
    }
    
    setStep(prev => prev + 1);
  };
  
  const handleBack = () => {
    setStep(prev => prev - 1);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 pt-20">
        <div className="container px-4 mx-auto py-12">
          <AnimatedTransition variant="slide-down" className="max-w-md mx-auto mb-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
              <p className="text-muted-foreground">
                Join the Bandmate Harmony community today
              </p>
            </div>
          </AnimatedTransition>
          
          <AnimatedTransition variant="scale" className="max-w-md mx-auto">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                {[1, 2, 3].map((stepNumber) => (
                  <div
                    key={stepNumber}
                    className="flex items-center"
                  >
                    <div
                      className={`
                        h-10 w-10 rounded-full flex items-center justify-center
                        ${step >= stepNumber 
                          ? 'bg-primary text-white' 
                          : 'bg-muted text-muted-foreground'
                        }
                      `}
                    >
                      {stepNumber === 1 && <User size={16} />}
                      {stepNumber === 2 && <Music size={16} />}
                      {stepNumber === 3 && <MapPin size={16} />}
                    </div>
                    
                    {stepNumber < 3 && (
                      <div 
                        className={`
                          h-1 w-14 sm:w-20
                          ${step > stepNumber ? 'bg-primary' : 'bg-muted'}
                        `}
                      />
                    )}
                  </div>
                ))}
              </div>
              
              {step === 1 && (
                <AnimatedTransition variant="fade" className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <User size={16} />
                      </div>
                      <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => updateFormData("name", e.target.value)}
                        className="glass-input pl-10 w-full"
                        placeholder="Enter your name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Mail size={16} />
                      </div>
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData("email", e.target.value)}
                        className="glass-input pl-10 w-full"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Lock size={16} />
                      </div>
                      <input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => updateFormData("password", e.target.value)}
                        className="glass-input pl-10 w-full"
                        placeholder="Create a password"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Lock size={16} />
                      </div>
                      <input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                        className="glass-input pl-10 w-full"
                        placeholder="Confirm your password"
                      />
                    </div>
                  </div>
                </AnimatedTransition>
              )}
              
              {step === 2 && (
                <AnimatedTransition variant="fade" className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Select Your Instruments
                    </label>
                    <p className="text-sm text-muted-foreground mb-4">
                      Choose the instruments you play in marching bands
                    </p>
                    <InstrumentSelector
                      selectedInstruments={formData.instruments}
                      onChange={(instruments) => updateFormData("instruments", instruments)}
                      maxSelections={3}
                    />
                  </div>
                </AnimatedTransition>
              )}
              
              {step === 3 && (
                <AnimatedTransition variant="fade" className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Your Location
                    </label>
                    <p className="text-sm text-muted-foreground mb-4">
                      This helps us find events and musicians near you
                    </p>
                    <LocationPicker
                      onSelectLocation={(location) => updateFormData("location", location)}
                      defaultAddress={formData.location.address}
                    />
                  </div>
                </AnimatedTransition>
              )}
              
              <div className="flex justify-between mt-8">
                {step > 1 ? (
                  <button
                    onClick={handleBack}
                    className="btn-outline flex items-center gap-1"
                  >
                    <ChevronLeft size={16} />
                    Back
                  </button>
                ) : (
                  <Link to="/" className="btn-outline flex items-center gap-1">
                    <ChevronLeft size={16} />
                    Home
                  </Link>
                )}
                
                <button
                  onClick={handleNext}
                  className="btn-primary flex items-center gap-1"
                >
                  {step === 3 ? "Create Account" : "Next"}
                  {step < 3 && <ChevronRight size={16} />}
                </button>
              </div>
            </GlassCard>
          </AnimatedTransition>
          
          <div className="text-center mt-6">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
