
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GlassCard } from "@/components/shared/GlassCard";
import { AnimatedTransition } from "@/components/shared/AnimatedTransition";
import { InstrumentSelector } from "@/components/ui/InstrumentSelector";
import { LocationPicker } from "@/components/ui/LocationPicker";
import { Calendar, Clock, ChevronLeft, Plus, Info } from "lucide-react";
import { toast } from "sonner";

export default function CreateEvent() {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: {
      address: "",
      latitude: 0,
      longitude: 0,
    },
    requiredInstruments: [] as string[],
    maxParticipants: 10,
  });
  
  const updateEventData = (key: string, value: any) => {
    setEventData(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!eventData.title) {
      toast.error("Please enter an event title");
      return;
    }
    if (!eventData.date || !eventData.time) {
      toast.error("Please select a date and time");
      return;
    }
    if (!eventData.location.address) {
      toast.error("Please enter a location");
      return;
    }
    if (eventData.requiredInstruments.length === 0) {
      toast.error("Please select at least one required instrument");
      return;
    }
    
    // Simulate event creation
    toast.success("Event created successfully!");
    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 pt-20">
        <div className="container px-4 mx-auto py-8">
          <AnimatedTransition variant="slide-down" className="mb-6">
            <div className="flex items-center mb-4">
              <Link
                to="/dashboard"
                className="mr-4 p-2 rounded-full hover:bg-muted transition-colors"
              >
                <ChevronLeft size={20} />
              </Link>
              <h1 className="text-3xl font-bold">Create New Event</h1>
            </div>
            <p className="text-muted-foreground">
              Fill in the details below to create a new marching band event
            </p>
          </AnimatedTransition>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <AnimatedTransition variant="slide-up" className="space-y-6">
                  <GlassCard className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Event Details</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium mb-1">
                          Event Title
                        </label>
                        <input
                          id="title"
                          type="text"
                          value={eventData.title}
                          onChange={(e) => updateEventData("title", e.target.value)}
                          className="glass-input w-full"
                          placeholder="Enter event title"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium mb-1">
                          Description
                        </label>
                        <textarea
                          id="description"
                          value={eventData.description}
                          onChange={(e) => updateEventData("description", e.target.value)}
                          className="glass-input w-full min-h-[120px]"
                          placeholder="Describe your event, purpose, additional requirements, etc."
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="date" className="block text-sm font-medium mb-1">
                            Date
                          </label>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                              <Calendar size={16} />
                            </div>
                            <input
                              id="date"
                              type="date"
                              value={eventData.date}
                              onChange={(e) => updateEventData("date", e.target.value)}
                              className="glass-input pl-10 w-full"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="time" className="block text-sm font-medium mb-1">
                            Time
                          </label>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                              <Clock size={16} />
                            </div>
                            <input
                              id="time"
                              type="time"
                              value={eventData.time}
                              onChange={(e) => updateEventData("time", e.target.value)}
                              className="glass-input pl-10 w-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </AnimatedTransition>
                
                <AnimatedTransition variant="slide-up" delay={0.1}>
                  <GlassCard className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Location</h2>
                    <LocationPicker
                      onSelectLocation={(location) => updateEventData("location", location)}
                      defaultAddress={eventData.location.address}
                    />
                  </GlassCard>
                </AnimatedTransition>
                
                <AnimatedTransition variant="slide-up" delay={0.2}>
                  <GlassCard className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Required Instruments</h2>
                    <p className="text-muted-foreground mb-4">
                      Select the instruments needed for your event. Musicians with these instruments
                      will be notified about your event.
                    </p>
                    
                    <InstrumentSelector
                      selectedInstruments={eventData.requiredInstruments}
                      onChange={(instruments) => updateEventData("requiredInstruments", instruments)}
                    />
                  </GlassCard>
                </AnimatedTransition>
              </div>
              
              <div className="space-y-6">
                <AnimatedTransition variant="slide-up" delay={0.1}>
                  <GlassCard className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Event Settings</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="maxParticipants" className="block text-sm font-medium mb-1">
                          Maximum Participants
                        </label>
                        <input
                          id="maxParticipants"
                          type="number"
                          min="1"
                          max="100"
                          value={eventData.maxParticipants}
                          onChange={(e) => updateEventData("maxParticipants", parseInt(e.target.value))}
                          className="glass-input w-full"
                        />
                      </div>
                      
                      <div className="mt-6 p-4 bg-primary/5 rounded-lg flex gap-3">
                        <Info size={20} className="text-primary shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-medium mb-1">How notifications work</h3>
                          <p className="text-sm text-muted-foreground">
                            Once you create this event, musicians with matching instruments in your area
                            will receive a notification about your event. They can choose to accept or
                            decline your invitation.
                          </p>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </AnimatedTransition>
                
                <AnimatedTransition variant="slide-up" delay={0.2}>
                  <GlassCard className="p-6">
                    <button
                      type="submit"
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      <Plus size={18} />
                      Create Event
                    </button>
                  </GlassCard>
                </AnimatedTransition>
              </div>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
