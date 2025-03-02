import PageContainer from "@/components/ui/PageContainer";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const TermsCondition: React.FC = () => {
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
              {platformName} Terms and Conditions
            </h1>
            <p className="text-muted-foreground">Last Updated: {lastUpdated}</p>
          </div>

          <div className="prose prose-gray max-w-none dark:prose-invert">
            <p>
              Welcome to {platformName}! By accessing or using our video-sharing
              platform, you agree to comply with and be bound by the following
              Terms and Conditions. Please read them carefully before using our
              services. If you do not agree to these terms, you must not use{" "}
              {platformName}.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              1. Acceptable Use Policy
            </h2>

            <h3 className="text-lg font-medium mt-6 mb-2">
              1.1. Prohibited Content:
            </h3>
            <p>
              You agree not to upload, post, share, or otherwise distribute any
              content that is explicit, obscene, pornographic, sexually
              suggestive, or otherwise inappropriate. This includes, but is not
              limited to:
            </p>
            <ul className="list-disc list-inside pl-6 space-y-2">
              <li>Nudity or sexually explicit material.</li>
              <li>Content depicting violence, abuse, or exploitation.</li>
              <li>
                Content that promotes hate speech, discrimination, or
                harassment.
              </li>
              <li>
                Any material that violates applicable laws or regulations.
              </li>
            </ul>

            <h3 className="text-lg font-medium mt-6 mb-2">
              1.2. Compliance with Laws:
            </h3>
            <p>
              You are solely responsible for ensuring that your content complies
              with all local, national, and international laws and regulations.{" "}
              {platformName} reserves the right to remove any content that
              violates these Terms and Conditions or is deemed inappropriate at
              our sole discretion.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              2. Content Ownership and Licensing
            </h2>

            <h3 className="text-lg font-medium mt-6 mb-2">2.1. Ownership:</h3>
            <p>
              You retain ownership of the content you upload to {platformName}.
              However, by uploading content, you grant {platformName} a
              worldwide, non-exclusive, royalty-free license to use, reproduce,
              distribute, and display your content on the platform.
            </p>

            <h3 className="text-lg font-medium mt-6 mb-2">
              2.2. Copyright Infringement:
            </h3>
            <p>
              You must not upload content that infringes on the intellectual
              property rights of others. If you believe your copyright has been
              violated, please contact us at{" "}
              <Link
                to="mailto:shubhamprakash681@gmail.com"
                className="text-primary hover:underline"
              >
                shubhamprakash681@gmail.com
              </Link>
              .
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              3. User Responsibilities
            </h2>

            <h3 className="text-lg font-medium mt-6 mb-2">
              3.1. Account Security:
            </h3>
            <p>
              You are responsible for maintaining the confidentiality of your
              account credentials and for all activities that occur under your
              account.
            </p>

            <h3 className="text-lg font-medium mt-6 mb-2">
              3.2. Age Restriction:
            </h3>
            <p>
              You must be at least 13 years old to use {platformName}. If you
              are under 18, you confirm that you have obtained parental or
              guardian consent to use the platform.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              4. Content Moderation
            </h2>

            <h3 className="text-lg font-medium mt-6 mb-2">
              4.1. Review and Removal:
            </h3>
            <p>
              {platformName} reserves the right to review, moderate, and remove
              any content that violates these Terms and Conditions. We may also
              suspend or terminate your account for repeated violations.
            </p>

            <h3 className="text-lg font-medium mt-6 mb-2">
              4.2. Reporting Violations:
            </h3>
            <p>
              Users can report inappropriate content by using the "Report"
              feature available on the platform. We will investigate all reports
              and take appropriate action.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              5. Limitation of Liability
            </h2>
            <p>
              {platformName} is not responsible for any content uploaded by
              users. We do not endorse or guarantee the accuracy, quality, or
              legality of user-generated content. You use the platform at your
              own risk.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              6. Changes to Terms and Conditions
            </h2>
            <p>
              We reserve the right to update or modify these Terms and
              Conditions at any time. Continued use of the platform after such
              changes constitutes your acceptance of the revised terms.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">7. Termination</h2>
            <p>
              {platformName} may suspend or terminate your access to the
              platform at any time, with or without notice, for violations of
              these Terms and Conditions or for any other reason.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">8. Contact Us</h2>
            <p>
              If you have any questions or concerns about these Terms and
              Conditions, please contact us at{" "}
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
                By using {platformName}, you acknowledge that you have read,
                understood, and agreed to these Terms and Conditions. Thank you
                for being a part of our community!
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

export default TermsCondition;
