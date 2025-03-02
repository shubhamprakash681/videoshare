import { useAppSelector } from "@/hooks/useStore";
import { PathConstants } from "@/lib/variables";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Github, Linkedin, Mail, Youtube, Heart } from "lucide-react";

type FooterProps = {
  isSidebarOpen: boolean;
  SIDEBAR_WIDTH: string;
  SIDEBAR_WIDTH_CLOSED: string;
  isSmallerScreen: boolean;
};

const Footer: React.FC<FooterProps> = ({
  isSidebarOpen,
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_CLOSED,
  isSmallerScreen,
}) => {
  const platformName = "VideoShare";
  const currentYear = new Date().getFullYear();
  const location = useLocation();

  const { isAuthenticated } = useAppSelector((state) => state.authReducer);

  return (
    <footer
      style={{
        width:
          isSmallerScreen || !isAuthenticated
            ? "100%"
            : isSidebarOpen
            ? `calc(100% - ${SIDEBAR_WIDTH})`
            : `calc(100% - ${SIDEBAR_WIDTH_CLOSED})`,
      }}
      className="border-t py-8 bg-background/95 backdrop-blur-sm"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">About {platformName}</h3>
            <p className="text-sm text-muted-foreground">
              {platformName} is a personal portfolio project showcasing a modern
              video-sharing platform powered by{" "}
              <Link
                to="https://cloudinary.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Cloudinary
              </Link>
              . Explore, create, and share your stories with the world.
            </p>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="flex flex-col gap-2">
              <Link
                to={PathConstants.ABOUT}
                className={`hover:text-primary ${
                  location.pathname.includes(PathConstants.ABOUT) &&
                  "text-primary/90"
                }`}
              >
                About
              </Link>
              <Link
                to={PathConstants.TERMS}
                className={`hover:text-primary ${
                  location.pathname.includes(PathConstants.TERMS) &&
                  "text-primary/90"
                }`}
              >
                Terms of Service
              </Link>
              <Link
                to={PathConstants.PRIVACY}
                className={`hover:text-primary ${
                  location.pathname.includes(PathConstants.PRIVACY) &&
                  "text-primary/90"
                }`}
              >
                Privacy Policy
              </Link>
            </div>
          </div>

          <div className="text-center md:text-right">
            <h3 className="text-lg font-semibold mb-4">Connect With Me</h3>
            <div className="flex justify-center md:justify-end gap-4">
              <Link
                to="https://github.com/shubhamprakash681"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                to="https://linkedin.com/in/shubhamprakash681"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              {/* <Link
                to="https://twitter.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Twitter className="h-5 w-5" />
              </Link> */}
              <Link
                to="https://youtube.com/@shubhamprakash5520"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Youtube className="h-5 w-5" />
              </Link>
              <Link
                to="mailto:shubhamprakash681@gmail.com"
                className="text-muted-foreground hover:text-primary"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-6" />

        {/* Footer Bottom */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Made with <Heart className="inline h-4 w-4 text-red-500" /> by{" "}
            <Link
              to={"https://github.com/shubhamprakash681"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Shubham Prakash
            </Link>
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            © {currentYear} {platformName}. A personal portfolio project. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
