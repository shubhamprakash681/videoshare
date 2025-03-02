import {
  ArrowLeft,
  Award,
  Globe,
  MessageSquare,
  Shield,
  Users,
  Video,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const About: React.FC = () => {
  const platformName = "VideoShare";
  // const currentYear = new Date().getFullYear();
  const lastUpdated = "March 2, 2025";

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              About {platformName}
            </h1>
            <p className="text-xl text-muted-foreground">
              A personal portfolio project for sharing videos
            </p>
            <p className="text-muted-foreground">Last Updated: {lastUpdated}</p>
          </div>

          <div className="prose prose-gray max-w-none dark:prose-invert">
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
              <p>
                {platformName} is a personal portfolio project created in 2023
                to showcase the development of a modern video-sharing platform.
                It leverages the power of{" "}
                <Link
                  to="https://cloudinary.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Cloudinary
                </Link>{" "}
                for seamless video storage, optimization, and delivery. This
                project demonstrates how technology can be used to build
                scalable, user-friendly applications for content sharing.
              </p>
              <p>
                While this is not a commercial platform, it serves as a
                testament to the possibilities of modern web development and
                cloud-based solutions. It's a space where creativity meets
                technology, and where I explore the potential of video as a
                medium for storytelling and connection.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Our Mission</h2>
              <div className="p-6 bg-secondary/50 rounded-lg">
                <p className="text-lg italic">
                  "To demonstrate the capabilities of modern web development by
                  creating a scalable, user-friendly video-sharing platform
                  powered by Cloudinary, and to inspire others to explore the
                  intersection of creativity and technology."
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Key Features</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex gap-4">
                  <div className="mt-1 w-fit min-w-fit">
                    <Video className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Cloud-Powered Video Storage
                    </h3>
                    <p>
                      Videos are securely stored and delivered using Cloudinary,
                      ensuring fast and reliable streaming.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 w-fit min-w-fit">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Simple and Intuitive
                    </h3>
                    <p>
                      Designed as a portfolio project, the platform focuses on
                      simplicity and ease of use for both creators and viewers.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 w-fit min-w-fit">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Secure and Scalable
                    </h3>
                    <p>
                      Built with security and scalability in mind, leveraging
                      Cloudinary's robust infrastructure.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 w-fit min-w-fit">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Global Access</h3>
                    <p>
                      Videos are optimized for global delivery, ensuring smooth
                      playback from anywhere in the world.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 w-fit min-w-fit">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Engagement Features
                    </h3>
                    <p>
                      Basic engagement tools like comments and likes are
                      included to foster interaction.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 w-fit min-w-fit">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Learning and Growth
                    </h3>
                    <p>
                      This project is a learning experience, showcasing the
                      potential of modern web technologies.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">
                About the Developer
              </h2>
              <p>
                {platformName} is a solo project developed by me as part of my
                portfolio. It reflects my passion for building scalable,
                user-friendly applications and exploring the potential of
                cloud-based solutions like Cloudinary. This project combines my
                skills in front-end and back-end development, as well as my
                interest in video technology and content sharing.
              </p>
              <p>
                While this is not a commercial platform, it serves as a
                demonstration of what can be achieved with modern tools and a
                focus on clean, efficient design.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Explore the Platform
              </h2>
              <p>
                Whether you're here to explore the features or to see how
                Cloudinary can be integrated into a video-sharing app, I welcome
                you to try out {platformName}. Feel free to upload a video, test
                the streaming capabilities, and explore the interface.
              </p>
              <p>
                If you have any questions, feedback, or just want to connect,
                you can reach me at{" "}
                <Link
                  to="mailto:shubhamprakash681@gmail.com"
                  className="text-primary hover:underline"
                >
                  shubhamprakash681@gmail.com
                </Link>
                .
              </p>
            </section>

            {/* <div className="border-t border-border mt-8 pt-6">
              <p className="text-sm text-muted-foreground text-center mt-4">
                © {currentYear} {platformName}. A personal portfolio project.
                All rights reserved.
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
