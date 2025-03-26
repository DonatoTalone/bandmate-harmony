
import { useState } from "react";
import { Check, X, CalendarDays, MapPin, Music } from "lucide-react";
import { GlassCard } from "../shared/GlassCard";
import { cn } from "@/lib/utils";
import { AnimatedTransition } from "../shared/AnimatedTransition";

export type NotificationType = 
  | "invitation" 
  | "confirmation" 
  | "cancellation" 
  | "rating";

interface NotificationItemProps {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string; // ISO string
  read: boolean;
  eventId?: string;
  onAccept?: () => void;
  onReject?: () => void;
  onMarkAsRead?: (id: string) => void;
  className?: string;
}

export function NotificationItem({
  id,
  type,
  title,
  message,
  time,
  read,
  eventId,
  onAccept,
  onReject,
  onMarkAsRead,
  className,
}: NotificationItemProps) {
  const [isVisible, setIsVisible] = useState(true);
  
  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    
    return date.toLocaleDateString();
  };
  
  const handleAccept = () => {
    if (onAccept) {
      setIsVisible(false);
      setTimeout(() => onAccept(), 300);
    }
  };
  
  const handleReject = () => {
    if (onReject) {
      setIsVisible(false);
      setTimeout(() => onReject(), 300);
    }
  };
  
  const handleMarkAsRead = () => {
    if (onMarkAsRead) {
      onMarkAsRead(id);
    }
  };
  
  const getIcon = () => {
    switch (type) {
      case "invitation":
        return <CalendarDays className="text-primary" />;
      case "confirmation":
        return <Check className="text-green-500" />;
      case "cancellation":
        return <X className="text-red-500" />;
      case "rating":
        return <Music className="text-accent" />;
      default:
        return <CalendarDays className="text-primary" />;
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatedTransition
      variant="slide-up"
      className={cn(className)}
    >
      <GlassCard
        className={cn(
          "p-4 transition-colors duration-300 relative",
          !read ? "border-l-4 border-l-primary" : ""
        )}
        intensity="light"
        onClick={handleMarkAsRead}
      >
        {!read && (
          <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-primary" />
        )}
        
        <div className="flex gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            {getIcon()}
          </div>
          
          <div className="space-y-1 flex-1">
            <h4 className="font-medium text-foreground">{title}</h4>
            <p className="text-muted-foreground text-sm">{message}</p>
            
            {type === "invitation" && onAccept && onReject && (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleAccept}
                  className="btn-primary py-1.5 px-4 text-sm flex-1"
                >
                  Accept
                </button>
                <button
                  onClick={handleReject}
                  className="btn-outline py-1.5 px-4 text-sm flex-1"
                >
                  Decline
                </button>
              </div>
            )}
            
            <div className="flex items-center gap-2 mt-2">
              <p className="text-xs text-muted-foreground">
                {formatTime(time)}
              </p>
              {eventId && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <div className="flex items-center gap-1">
                    <MapPin size={12} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Event details</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </GlassCard>
    </AnimatedTransition>
  );
}
