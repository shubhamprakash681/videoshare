import PageContainer from "@/components/ui/PageContainer";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Privacy: React.FC = () => {
  const platformName = "VideoShare";
  // const currentYear = new Date().getFullYear();
  const lastUpdated = "March 2, 2025";

  return (
    <PageContainer>
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
              {platformName} Privacy Policy
            </h1>
            <p className="text-muted-foreground">Last Updated: {lastUpdated}</p>
          </div>

          <div className="prose prose-gray max-w-none dark:prose-invert">
            <p>
              At {platformName}, we take your privacy seriously. This Privacy
              Policy explains how we collect, use, disclose, and safeguard your
              information when you use our video-sharing platform. Please read
              this privacy policy carefully. If you do not agree with the terms
              of this privacy policy, please do not access the platform.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              1. Information We Collect
            </h2>

            <h3 className="text-lg font-medium mt-6 mb-2">
              1.1. Personal Data
            </h3>
            <p>
              We may collect personal information that you voluntarily provide
              to us when you register on the platform, express interest in
              obtaining information about us or our products and services, or
              otherwise contact us. The personal information we collect may
              include:
            </p>
            <ul className="list-disc list-inside pl-6 space-y-2">
              <li>
                Name and contact information (email address, phone number)
              </li>
              <li>Account credentials</li>
              <li>Profile information (username, profile picture, bio)</li>
              <li>Content you upload (videos, comments, messages)</li>
              <li>
                Payment information (for premium features or monetization)
              </li>
            </ul>

            <h3 className="text-lg font-medium mt-6 mb-2">
              1.2. Automatically Collected Data
            </h3>
            <p>
              When you access our platform, we may automatically collect certain
              information about your device and usage, including:
            </p>
            <ul className="list-disc list-inside pl-6 space-y-2">
              <li>
                Device information (IP address, browser type, operating system)
              </li>
              <li>Usage data (pages visited, time spent, links clicked)</li>
              <li>Location data (general location based on IP address)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              2. How We Use Your Information
            </h2>
            <p>
              We may use the information we collect for various purposes,
              including:
            </p>
            <ul className="list-disc list-inside pl-6 space-y-2">
              <li>Providing, maintaining, and improving our platform</li>
              <li>Processing transactions and managing your account</li>
              <li>Responding to your inquiries and support requests</li>
              <li>Sending administrative information and updates</li>
              <li>
                Personalizing your experience and delivering content relevant to
                your interests
              </li>
              <li>Analyzing usage patterns to improve our platform</li>
              <li>
                Protecting against unauthorized access and legal liability
              </li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              3. Sharing Your Information
            </h2>
            <p>We may share your information in the following situations:</p>
            <ul className="list-disc list-inside pl-6 space-y-2">
              <li>
                <strong>With Service Providers:</strong> We may share your
                information with third-party vendors, service providers, and
                contractors who perform services for us.
              </li>
              <li>
                <strong>Business Transfers:</strong> We may share or transfer
                your information in connection with a merger, acquisition, or
                sale of all or a portion of our assets.
              </li>
              <li>
                <strong>With Your Consent:</strong> We may disclose your
                information for any other purpose with your consent.
              </li>
              <li>
                <strong>Legal Requirements:</strong> We may disclose your
                information where required by law or to protect our rights.
              </li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              4. Cookies and Tracking Technologies
            </h2>
            <p>
              We use cookies and similar tracking technologies to collect and
              store information about your preferences and activity on our
              platform. You can instruct your browser to refuse all cookies or
              to indicate when a cookie is being sent. However, if you do not
              accept cookies, you may not be able to use some portions of our
              platform.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              5. Data Security
            </h2>
            <p>
              We have implemented appropriate technical and organizational
              security measures designed to protect the security of any personal
              information we process. However, please also remember that we
              cannot guarantee that the internet itself is 100% secure. Although
              we will do our best to protect your personal information,
              transmission of personal information to and from our platform is
              at your own risk.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              6. Children's Privacy
            </h2>
            <p>
              Our platform is not intended for individuals under the age of 13.
              We do not knowingly collect personal information from children
              under 13. If we learn we have collected or received personal
              information from a child under 13 without verification of parental
              consent, we will delete that information.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              7. Your Privacy Rights
            </h2>
            <p>
              Depending on your location, you may have certain rights regarding
              your personal information, including:
            </p>
            <ul className="list-disc list-inside pl-6 space-y-2">
              <li>
                The right to access personal information we hold about you
              </li>
              <li>The right to request correction of inaccurate information</li>
              <li>
                The right to request deletion of your personal information
              </li>
              <li>
                The right to object to processing of your personal information
              </li>
              <li>The right to data portability</li>
              <li>The right to withdraw consent</li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information
              provided in the "Contact Us" section below.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              8. Changes to This Privacy Policy
            </h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page
              and updating the "Last Updated" date. You are advised to review
              this Privacy Policy periodically for any changes.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">9. Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy,
              please contact us at{" "}
              <Link
                to="mailto:shubhamprakash681@gmail.com"
                className="text-primary hover:underline"
              >
                shubhamprakash681@gmail.com
              </Link>
              .
            </p>

            <div className="border-t border-border mt-8 pt-6">
              <p>
                By using {platformName}, you acknowledge that you have read and
                understood this Privacy Policy.
              </p>
              {/* <p className="text-sm text-muted-foreground text-center mt-4">
                © {currentYear} {platformName}. A personal portfolio project.
                All rights reserved.
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Privacy;
