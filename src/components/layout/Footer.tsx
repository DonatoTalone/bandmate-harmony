
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="py-8 mt-auto">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-foreground/60 text-sm">
            © {new Date().getFullYear()} Bandmate Harmony. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link
              to="/terms"
              className="text-foreground/60 hover:text-primary transition-colors duration-200 text-sm"
            >
              Terms
            </Link>
            <Link
              to="/privacy"
              className="text-foreground/60 hover:text-primary transition-colors duration-200 text-sm"
            >
              Privacy
            </Link>
            <Link
              to="/help"
              className="text-foreground/60 hover:text-primary transition-colors duration-200 text-sm"
            >
              Help
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
