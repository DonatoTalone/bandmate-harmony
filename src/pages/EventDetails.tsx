
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GlassCard } from "@/components/shared/GlassCard";
import { AnimatedTransition } from "@/components/shared/AnimatedTransition";
import { UserRating } from "@/components/ui/UserRating";
import { Calendar, Check, ChevronLeft, Clock, MapPin, Music, User, Users, X } from "lucide-react";
import { toast } from "sonner";

// Mock event data
const eventData = {
  id: "1",
  title: "Downtown Performance",
  description: "Join us for a vibrant performance in the heart of the city! We'll be playing a mix of classic and contemporary pieces for the public. This is a great opportunity to showcase your skills and connect with other musicians.",
  date: "2023-06-15T14:00:00Z",
  location: {
    address: "Central Park, New York",
    latitude: 40.7812,
    longitude: -73.9665,
  },
  organizer: {
    id: "org1",
    name: "City Music Group",
    rating: 4.8,
  },
  status: "upcoming",
  requiredInstruments: ["Trumpet", "Saxophone", "Drums", "Flute", "Trombone"],
  participants: [
    {
      id: "user1",
      name: "John Davis",
      instrument: "Trumpet",
      status: "confirmed",
      rating: 4.5,
    },
    {
      id: "user2",
      name: "Sarah Miller",
      instrument: "Saxophone",
      status: "confirmed",
      rating: 4.2,
    },
    {
      id: "user3",
      name: "Michael Brown",
      instrument: "Drums",
      status: "pending",
      rating: 3.8,
    },
  ],
};

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState(eventData);
  const [isJoining, setIsJoining] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState("");
  
  const handleJoinEvent = () => {
    if (!selectedInstrument) {
      toast.error("Please select an instrument");
      return;
    }
    
    toast.success("Join request sent!");
    setIsJoining(false);
  };
  
  const handleConfirmAttendance = (userId: string) => {
    setEvent({
      ...event,
      participants: event.participants.map(p => 
        p.id === userId ? { ...p, status: "confirmed" } : p
      ),
    });
    toast.success("Attendance confirmed");
  };
  
  const handleRejectAttendance = (userId: string) => {
    setEvent({
      ...event,
      participants: event.participants.filter(p => p.id !== userId),
    });
    toast.info("Participant removed");
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
              <h1 className="text-3xl font-bold">Event Details</h1>
            </div>
          </AnimatedTransition>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <AnimatedTransition variant="slide-up">
                <GlassCard className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-2xl font-bold">{event.title}</h2>
                      <div className="flex items-center mt-2">
                        <div className="flex items-center text-sm">
                          <User className="h-4 w-4 mr-1.5 text-muted-foreground" />
                          <span>Organized by {event.organizer.name}</span>
                        </div>
                        <div className="mx-2 text-muted-foreground">•</div>
                        <UserRating rating={event.organizer.rating} size="sm" />
                      </div>
                    </div>
                    
                    <div className="bg-primary/10 text-primary text-sm rounded-full px-4 py-1.5 font-medium">
                      {event.status === "upcoming" ? "Upcoming" : event.status}
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    {event.description}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Calendar className="h-5 w-5 mr-2 text-primary" />
                        <span className="font-medium">Date</span>
                      </div>
                      <p>
                        {new Date(event.date).toLocaleDateString(undefined, {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Clock className="h-5 w-5 mr-2 text-primary" />
                        <span className="font-medium">Time</span>
                      </div>
                      <p>
                        {new Date(event.date).toLocaleTimeString(undefined, {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <MapPin className="h-5 w-5 mr-2 text-primary" />
                        <span className="font-medium">Location</span>
                      </div>
                      <p>{event.location.address}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">Required Instruments</h3>
                    <div className="flex flex-wrap gap-2">
                      {event.requiredInstruments.map(instrument => (
                        <div
                          key={instrument}
                          className="bg-muted px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5"
                        >
                          <Music className="h-3.5 w-3.5 text-primary" />
                          {instrument}
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </AnimatedTransition>
              
              <AnimatedTransition variant="slide-up" delay={0.1}>
                <GlassCard className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Participants</h3>
                  
                  <div className="space-y-4">
                    {event.participants.map(participant => (
                      <div
                        key={participant.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <h4 className="font-medium">{participant.name}</h4>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                {participant.instrument}
                              </span>
                              <UserRating rating={participant.rating} size="sm" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          {participant.status === "pending" ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleConfirmAttendance(participant.id)}
                                className="p-1.5 bg-green-50 text-green-600 rounded-full hover:bg-green-100"
                              >
                                <Check size={16} />
                              </button>
                              <button
                                onClick={() => handleRejectAttendance(participant.id)}
                                className="p-1.5 bg-red-50 text-red-600 rounded-full hover:bg-red-100"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <div className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">
                              Confirmed
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {event.participants.length === 0 && (
                      <div className="text-center py-6">
                        <Users className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No participants yet</p>
                      </div>
                    )}
                  </div>
                </GlassCard>
              </AnimatedTransition>
            </div>
            
            <div className="space-y-6">
              <AnimatedTransition variant="slide-up" delay={0.1}>
                <GlassCard className="p-6">
                  {!isJoining ? (
                    <button
                      onClick={() => setIsJoining(true)}
                      className="btn-primary w-full"
                    >
                      Join This Event
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="font-semibold">Select Your Instrument</h3>
                      <div className="space-y-2">
                        {event.requiredInstruments.map(instrument => (
                          <div
                            key={instrument}
                            className="flex items-center"
                          >
                            <input
                              type="radio"
                              id={`instrument-${instrument}`}
                              name="instrument"
                              value={instrument}
                              checked={selectedInstrument === instrument}
                              onChange={() => setSelectedInstrument(instrument)}
                              className="mr-2"
                            />
                            <label htmlFor={`instrument-${instrument}`}>
                              {instrument}
                            </label>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={handleJoinEvent}
                          className="btn-primary flex-1"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setIsJoining(false)}
                          className="btn-outline flex-1"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </GlassCard>
              </AnimatedTransition>
              
              <AnimatedTransition variant="slide-up" delay={0.2}>
                <GlassCard className="p-6">
                  <h3 className="font-semibold mb-4">Event Map</h3>
                  <div className="bg-muted h-60 rounded-lg flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Map preview</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    {event.location.address}
                  </p>
                </GlassCard>
              </AnimatedTransition>
              
              <AnimatedTransition variant="slide-up" delay={0.3}>
                <GlassCard className="p-6">
                  <h3 className="font-semibold mb-4">Share This Event</h3>
                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                      Copy Link
                    </button>
                    <button className="flex-1 px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                      Invite
                    </button>
                  </div>
                </GlassCard>
              </AnimatedTransition>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
