
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { GlassCard } from "../shared/GlassCard";
import { Bell, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Events", path: "/events" },
    { name: "Profile", path: "/profile" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "py-3" : "py-5"
      )}
    >
      <GlassCard
        className="mx-4 px-4 py-3 flex items-center justify-between"
        intensity={isScrolled ? "heavy" : "medium"}
        bordered={isScrolled}
      >
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold shadow-md">
            BH
          </div>
          <span className="font-semibold text-lg hidden sm:inline-block">Bandmate Harmony</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "font-medium transition-colors duration-200 hover:text-primary",
                location.pathname === item.path
                  ? "text-primary"
                  : "text-foreground/70"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 rounded-full hover:bg-accent/10 transition-colors duration-200">
            <Bell size={20} className="text-foreground/70" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-accent rounded-full"></span>
          </button>

          {/* Mobile Menu Button */}
          <button
            className="p-1 md:hidden rounded-full hover:bg-accent/10 transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X size={24} className="text-foreground/70" />
            ) : (
              <Menu size={24} className="text-foreground/70" />
            )}
          </button>
        </div>
      </GlassCard>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <GlassCard className="mt-1 mx-4 py-4 animate-slide-down">
            <nav className="flex flex-col space-y-4 px-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "font-medium transition-colors duration-200 hover:text-primary py-2",
                    location.pathname === item.path
                      ? "text-primary"
                      : "text-foreground/70"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </GlassCard>
        </div>
      )}
    </header>
  );
}
