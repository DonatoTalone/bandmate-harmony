
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GlassCard } from "@/components/shared/GlassCard";
import { AnimatedTransition } from "@/components/shared/AnimatedTransition";
import { UserRating } from "@/components/ui/UserRating";
import { InstrumentSelector } from "@/components/ui/InstrumentSelector";
import { LocationPicker } from "@/components/ui/LocationPicker";
import { User, Mail, MapPin, Music, Calendar, Star, Edit2, Save } from "lucide-react";
import { toast } from "sonner";

const userProfile = {
  name: "Jane Davis",
  email: "jane.davis@example.com",
  joined: "2022-10-15",
  instruments: ["trumpet", "flute"],
  location: {
    address: "New York, NY",
    latitude: 40.7128,
    longitude: -74.0060,
  },
  rating: 4.5,
  ratingCount: 15,
  eventsParticipated: 12,
  eventsOrganized: 3,
  reliability: 95,
};

const ratingHistory = [
  {
    id: "rating1",
    eventName: "Summer Festival",
    date: "2023-05-15",
    rating: 5,
    comment: "Jane was punctual and played beautifully. A great addition to our ensemble!",
    from: "Michael Smith",
  },
  {
    id: "rating2",
    eventName: "City Park Performance",
    date: "2023-04-02",
    rating: 5,
    comment: "Excellent performance and very professional.",
    from: "Sarah Johnson",
  },
  {
    id: "rating3",
    eventName: "Community Parade",
    date: "2023-03-10",
    rating: 4,
    comment: "Good performance. Would invite again.",
    from: "Robert Wilson",
  },
  {
    id: "rating4",
    eventName: "School Fundraiser",
    date: "2023-02-20",
    rating: 3,
    comment: "Played well but arrived a bit late.",
    from: "Jennifer Brown",
  },
];

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(userProfile);
  const [activeTab, setActiveTab] = useState("overview");
  
  const handleSaveProfile = () => {
    toast.success("Profile updated successfully!");
    setIsEditing(false);
  };
  
  const updateProfileData = (key: string, value: any) => {
    setProfileData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 pt-20">
        <div className="container px-4 mx-auto py-8">
          <AnimatedTransition variant="slide-down" className="mb-8">
            <GlassCard className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <User size={32} />
                  </div>
                  
                  <div className="text-center md:text-left">
                    <h1 className="text-3xl font-bold mb-2">{profileData.name}</h1>
                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 text-muted-foreground mb-3">
                      <div className="flex items-center justify-center md:justify-start gap-1.5">
                        <Mail size={16} />
                        <span>{profileData.email}</span>
                      </div>
                      <div className="hidden md:block">•</div>
                      <div className="flex items-center justify-center md:justify-start gap-1.5">
                        <Calendar size={16} />
                        <span>Joined {new Date(profileData.joined).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center md:justify-start gap-1.5">
                      <div className="flex items-center">
                        <UserRating rating={profileData.rating} />
                        <span className="ml-2 text-sm text-muted-foreground">
                          ({profileData.ratingCount} ratings)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    isEditing 
                      ? "bg-primary text-white" 
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {isEditing ? (
                    <>
                      <Save size={16} />
                      <span onClick={handleSaveProfile}>Save Profile</span>
                    </>
                  ) : (
                    <>
                      <Edit2 size={16} />
                      <span>Edit Profile</span>
                    </>
                  )}
                </button>
              </div>
            </GlassCard>
          </AnimatedTransition>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AnimatedTransition variant="fade">
                <div className="border-b border-border mb-6">
                  <nav className="flex space-x-8">
                    {["overview", "ratings"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </nav>
                </div>
              </AnimatedTransition>
              
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <AnimatedTransition variant="slide-up">
                    <GlassCard className="p-6">
                      <h2 className="text-xl font-semibold mb-4">Your Instruments</h2>
                      
                      {isEditing ? (
                        <InstrumentSelector
                          selectedInstruments={profileData.instruments}
                          onChange={(instruments) => updateProfileData("instruments", instruments)}
                          maxSelections={3}
                        />
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {profileData.instruments.map((instrumentId) => (
                            <div
                              key={instrumentId}
                              className="bg-muted px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5"
                            >
                              <Music className="h-3.5 w-3.5 text-primary" />
                              {instrumentId.charAt(0).toUpperCase() + instrumentId.slice(1)}
                            </div>
                          ))}
                        </div>
                      )}
                    </GlassCard>
                  </AnimatedTransition>
                  
                  <AnimatedTransition variant="slide-up" delay={0.1}>
                    <GlassCard className="p-6">
                      <h2 className="text-xl font-semibold mb-4">Your Location</h2>
                      
                      {isEditing ? (
                        <LocationPicker
                          onSelectLocation={(location) => updateProfileData("location", location)}
                          defaultAddress={profileData.location.address}
                        />
                      ) : (
                        <div className="flex items-start gap-2">
                          <MapPin className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <p>{profileData.location.address}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              You'll be notified about events in this area
                            </p>
                          </div>
                        </div>
                      )}
                    </GlassCard>
                  </AnimatedTransition>
                  
                  <AnimatedTransition variant="slide-up" delay={0.2}>
                    <GlassCard className="p-6">
                      <h2 className="text-xl font-semibold mb-4">Statistics</h2>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 bg-muted/50 rounded-lg text-center">
                          <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
                          <h3 className="font-medium mb-1">Events Participated</h3>
                          <p className="text-2xl font-bold">{profileData.eventsParticipated}</p>
                        </div>
                        
                        <div className="p-4 bg-muted/50 rounded-lg text-center">
                          <Music className="h-6 w-6 mx-auto mb-2 text-primary" />
                          <h3 className="font-medium mb-1">Events Organized</h3>
                          <p className="text-2xl font-bold">{profileData.eventsOrganized}</p>
                        </div>
                        
                        <div className="p-4 bg-muted/50 rounded-lg text-center">
                          <Star className="h-6 w-6 mx-auto mb-2 text-primary" />
                          <h3 className="font-medium mb-1">Reliability</h3>
                          <p className="text-2xl font-bold">{profileData.reliability}%</p>
                        </div>
                      </div>
                    </GlassCard>
                  </AnimatedTransition>
                </div>
              )}
              
              {activeTab === "ratings" && (
                <AnimatedTransition variant="slide-up">
                  <GlassCard className="p-6">
                    <h2 className="text-xl font-semibold mb-6">Rating History</h2>
                    
                    <div className="space-y-6">
                      {ratingHistory.map((rating) => (
                        <div key={rating.id} className="border-b border-border pb-6 last:border-0 last:pb-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-medium">{rating.eventName}</h3>
                              <p className="text-sm text-muted-foreground">
                                {new Date(rating.date).toLocaleDateString()}
                              </p>
                            </div>
                            <UserRating rating={rating.rating} />
                          </div>
                          
                          <p className="mt-2 italic text-muted-foreground">
                            "{rating.comment}"
                          </p>
                          
                          <p className="text-sm mt-2">
                            — {rating.from}
                          </p>
                        </div>
                      ))}
                      
                      {ratingHistory.length === 0 && (
                        <div className="text-center py-8">
                          <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <p className="text-muted-foreground">No ratings yet</p>
                        </div>
                      )}
                    </div>
                  </GlassCard>
                </AnimatedTransition>
              )}
            </div>
            
            <div className="space-y-6">
              <AnimatedTransition variant="slide-up" delay={0.1}>
                <GlassCard className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                  
                  <div className="space-y-4">
                    <div className="p-3 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <Star size={18} />
                        </div>
                        <div>
                          <p className="font-medium">Received a 5-star rating</p>
                          <p className="text-sm text-muted-foreground">3 days ago</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                          <Calendar size={18} />
                        </div>
                        <div>
                          <p className="font-medium">Joined the Summer Festival event</p>
                          <p className="text-sm text-muted-foreground">1 week ago</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                          <Music size={18} />
                        </div>
                        <div>
                          <p className="font-medium">Added Flute as instrument</p>
                          <p className="text-sm text-muted-foreground">2 weeks ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </AnimatedTransition>
              
              <AnimatedTransition variant="slide-up" delay={0.2}>
                <GlassCard className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
                  
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <h3 className="font-medium">Downtown Performance</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Calendar className="h-3.5 w-3.5 mr-1.5" />
                        <span>June 15, 2023</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3.5 w-3.5 mr-1.5" />
                        <span>Central Park, New York</span>
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-muted/50">
                      <h3 className="font-medium">Summer Festival</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Calendar className="h-3.5 w-3.5 mr-1.5" />
                        <span>June 20, 2023</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3.5 w-3.5 mr-1.5" />
                        <span>Grant Park, Chicago</span>
                      </div>
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
