
import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnimatedTransition } from "@/components/shared/AnimatedTransition";
import { GlassCard } from "@/components/shared/GlassCard";
import { NotificationItem } from "@/components/ui/NotificationItem";
import { UserRating } from "@/components/ui/UserRating";
import { Calendar, Clock, MapPin, Music, Plus, Users } from "lucide-react";
import { toast } from "sonner";

// Mock data
const upcomingEvents = [
  {
    id: "1",
    title: "Downtown Performance",
    date: "2023-06-15T14:00:00Z",
    location: "Central Park, New York",
    organizer: "City Music Group",
    attendees: 12,
    requiredInstruments: ["Trumpet", "Saxophone", "Drums"],
  },
  {
    id: "2",
    title: "Summer Festival",
    date: "2023-06-20T17:30:00Z",
    location: "Grant Park, Chicago",
    organizer: "Festival Committee",
    attendees: 25,
    requiredInstruments: ["Flute", "Trombone", "Tuba"],
  },
];

const myNotifications = [
  {
    id: "1",
    type: "invitation",
    title: "New Event Invitation",
    message: "You've been invited to 'Summer Festival' as a Trumpet player.",
    time: "2023-06-10T09:43:00Z",
    read: false,
    eventId: "2",
  },
  {
    id: "2",
    type: "confirmation",
    title: "Event Confirmation",
    message: "Your participation in 'Downtown Performance' has been confirmed.",
    time: "2023-06-08T14:22:00Z",
    read: true,
    eventId: "1",
  },
  {
    id: "3",
    type: "rating",
    title: "You've been rated",
    message: "John Davis rated you 5 stars for 'Spring Concert'.",
    time: "2023-06-05T18:10:00Z",
    read: true,
  },
];

export default function Dashboard() {
  const [notifications, setNotifications] = useState(myNotifications);
  
  const handleAcceptInvitation = (notificationId: string) => {
    setNotifications(notifications.filter(n => n.id !== notificationId));
    toast.success("Invitation accepted!");
  };
  
  const handleRejectInvitation = (notificationId: string) => {
    setNotifications(notifications.filter(n => n.id !== notificationId));
    toast.info("Invitation declined");
  };
  
  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 pt-20">
        <div className="container px-4 mx-auto py-8">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Main Content */}
            <div className="flex-1 w-full">
              <AnimatedTransition variant="slide-up" className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold">Dashboard</h1>
                  <Link to="/create-event" className="btn-primary">
                    <Plus className="mr-2 h-4 w-4" /> Create Event
                  </Link>
                </div>
                
                <GlassCard className="p-6 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Users size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold">Welcome back, Jane</h2>
                        <div className="flex items-center mt-1">
                          <UserRating rating={4.5} />
                          <span className="ml-2 text-sm text-muted-foreground">
                            (15 ratings)
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Your Instruments</div>
                        <div className="font-medium">Trumpet, Flute</div>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                        <Music size={18} />
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </AnimatedTransition>
              
              <AnimatedTransition variant="slide-up" delay={0.1} className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Upcoming Events</h2>
                  <Link 
                    to="/events" 
                    className="text-sm text-primary hover:underline flex items-center"
                  >
                    View all
                  </Link>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {upcomingEvents.map((event) => (
                    <GlassCard key={event.id} className="p-5" hoverable>
                      <Link to={`/events/${event.id}`} className="block space-y-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-lg">{event.title}</h3>
                          <div className="bg-primary/10 text-primary text-xs rounded-full px-3 py-1">
                            Upcoming
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>
                              {new Date(event.date).toLocaleDateString(undefined, {
                                weekday: "long",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>
                              {new Date(event.date).toLocaleTimeString(undefined, {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          
                          <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center pt-2 border-t border-border">
                          <div className="flex items-center text-sm">
                            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{event.attendees} participants</span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            {event.requiredInstruments.map((instrument, i) => (
                              <span 
                                key={instrument}
                                className="bg-secondary/10 text-secondary text-xs rounded-full px-2 py-0.5"
                              >
                                {instrument}
                              </span>
                            ))}
                          </div>
                        </div>
                      </Link>
                    </GlassCard>
                  ))}
                </div>
              </AnimatedTransition>
              
              <AnimatedTransition variant="slide-up" delay={0.2}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Recommended Events</h2>
                  <Link 
                    to="/events" 
                    className="text-sm text-primary hover:underline flex items-center"
                  >
                    Explore more
                  </Link>
                </div>
                
                <GlassCard className="p-6">
                  <div className="text-center py-8">
                    <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No recommendations yet</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      We'll recommend events based on your instruments and location as they become available.
                    </p>
                    <Link to="/events" className="btn-primary">
                      Browse All Events
                    </Link>
                  </div>
                </GlassCard>
              </AnimatedTransition>
            </div>
            
            {/* Sidebar */}
            <div className="w-full md:w-96 space-y-6">
              <AnimatedTransition variant="slide-up" delay={0.1}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Notifications</h2>
                  <button className="text-sm text-primary hover:underline">
                    Mark all read
                  </button>
                </div>
                
                <div className="space-y-3">
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <NotificationItem
                        key={notification.id}
                        id={notification.id}
                        type={notification.type}
                        title={notification.title}
                        message={notification.message}
                        time={notification.time}
                        read={notification.read}
                        eventId={notification.eventId}
                        onAccept={
                          notification.type === "invitation" 
                            ? () => handleAcceptInvitation(notification.id) 
                            : undefined
                        }
                        onReject={
                          notification.type === "invitation" 
                            ? () => handleRejectInvitation(notification.id) 
                            : undefined
                        }
                        onMarkAsRead={handleMarkAsRead}
                      />
                    ))
                  ) : (
                    <GlassCard className="p-6 text-center">
                      <p className="text-muted-foreground">No notifications</p>
                    </GlassCard>
                  )}
                </div>
              </AnimatedTransition>
              
              <AnimatedTransition variant="slide-up" delay={0.2}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Your Stats</h2>
                </div>
                
                <GlassCard className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-lg bg-primary/5">
                      <p className="text-muted-foreground text-sm mb-1">Events Joined</p>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-secondary/5">
                      <p className="text-muted-foreground text-sm mb-1">Events Created</p>
                      <p className="text-2xl font-bold">3</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-accent/5">
                      <p className="text-muted-foreground text-sm mb-1">Reliability</p>
                      <p className="text-2xl font-bold">95%</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted">
                      <p className="text-muted-foreground text-sm mb-1">Connections</p>
                      <p className="text-2xl font-bold">28</p>
                    </div>
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
