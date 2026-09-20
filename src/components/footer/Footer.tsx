import { useAppSelector } from "@/hooks/useStore";
import { PathConstants } from "@/lib/variables";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Github,
  Linkedin,
  Mail,
  Youtube,
  Heart,
  Globe,
  ExternalLink,
  Video,
  Cloud,
} from "lucide-react";

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
      className="border-t border-border bg-card/40 text-muted-foreground w-full min-w-0"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-12 sm:px-6 lg:px-8 w-full min-w-0">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 min-w-0">
          {/* Column 1: Brand & Overview */}
          <div className="space-y-4 min-w-0">
            <Link to={PathConstants.HOME} className="inline-block">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center rounded-lg bg-primary p-1.5 text-primary-foreground">
                  <Video className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-foreground">
                  Video<span className="text-primary">Share</span>
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {platformName} is a personal portfolio project showcasing a modern
              video-sharing platform powered by{" "}
              <Link
                to="https://cloudinary.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                Cloudinary
              </Link>
              . Explore, create channels, upload videos, and share your stories
              with high-performance cloud video delivery.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              <Cloud className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span>Cloudinary Powered Platform</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="min-w-0">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to={PathConstants.ABOUT}
                  className={`transition-colors hover:text-primary hover:underline ${
                    location.pathname.includes(PathConstants.ABOUT)
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  About {platformName}
                </Link>
              </li>
              <li>
                <Link
                  to={PathConstants.TERMS}
                  className={`transition-colors hover:text-primary hover:underline ${
                    location.pathname.includes(PathConstants.TERMS)
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to={PathConstants.PRIVACY}
                  className={`transition-colors hover:text-primary hover:underline ${
                    location.pathname.includes(PathConstants.PRIVACY)
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to={PathConstants.LIKEDVIDEOS}
                  className={`transition-colors hover:text-primary hover:underline ${
                    location.pathname.includes(PathConstants.LIKEDVIDEOS)
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  Liked Videos
                </Link>
              </li>
              <li>
                <Link
                  to={PathConstants.WATCHHISTORY}
                  className={`transition-colors hover:text-primary hover:underline ${
                    location.pathname.includes(PathConstants.WATCHHISTORY)
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  Watch History
                </Link>
              </li>
              <li>
                <Link
                  to={PathConstants.DASHBOARD}
                  className={`transition-colors hover:text-primary hover:underline ${
                    location.pathname.includes(PathConstants.DASHBOARD)
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  Creator Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform Features */}
          <div className="min-w-0">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Platform Features
            </h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span>Cloudinary Video Delivery</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span>Channel Profiles & Subscriptions</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span>Interactive Likes & Comments</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span>Custom Playlists & Watch History</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span>Creator Studio & Content Management</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Connect With Me */}
          <div className="min-w-0">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Connect With Me
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              A personal portfolio project developed by{" "}
              <Link
                to="https://shubhamprakash681.in"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:text-primary transition-colors hover:underline"
              >
                Shubham Prakash
              </Link>
              .
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="https://shubhamprakash681.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                aria-label="Personal Portfolio Website"
                title="Portfolio Website"
              >
                <Globe className="h-4 w-4" />
              </Link>
              <Link
                to="https://github.com/shubhamprakash681"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                aria-label="GitHub Profile"
                title="GitHub"
              >
                <Github className="h-4 w-4" />
              </Link>
              <Link
                to="https://linkedin.com/in/shubhamprakash681"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                aria-label="LinkedIn Profile"
                title="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link
                to="https://youtube.com/@shubhamprakash5520"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                aria-label="YouTube Channel"
                title="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </Link>
              <Link
                to="mailto:shubhamprakash681@gmail.com"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                aria-label="Send an email to Shubham Prakash"
                title="Email"
              >
                <Mail className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-4 space-y-2">
              <Link
                to="https://shubhamprakash681.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary break-all font-medium"
              >
                <Globe className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span>Visit Portfolio: shubhamprakash681.in</span>
                <ExternalLink className="h-3 w-3 shrink-0" />
              </Link>
              <div>
                <Link
                  to="https://tradex.shubhamprakash681.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/80 transition-colors hover:text-primary break-all"
                >
                  <span>Check out TradeX project</span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-border" />

        {/* Footer Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 text-center text-xs text-muted-foreground md:flex-row md:text-left min-w-0">
          <p>
            Made with{" "}
            <Heart className="inline h-3.5 w-3.5 fill-red-500 text-red-500" />{" "}
            by{" "}
            <Link
              to="https://shubhamprakash681.in"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              Shubham Prakash
            </Link>
          </p>
          <p>
            © {currentYear} {platformName}. A personal portfolio project. All
            rights reserved.
          </p>
          <p className="max-w-md text-[11px] leading-tight text-muted-foreground/80 break-words">
            Disclaimer: {platformName} is a video sharing simulation platform
            for educational and portfolio demonstration purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
