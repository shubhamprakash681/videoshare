import { ForgotPasswordCard } from "@/components";
import PageContainer from "@/components/ui/PageContainer";
import React from "react";

const ForgotPassword: React.FC = () => {
  return (
    <PageContainer className="flex items-center auth-page-container">
      <ForgotPasswordCard />
    </PageContainer>
  );
};

export default ForgotPassword;
