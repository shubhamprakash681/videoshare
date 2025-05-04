import { SignupCard } from "@/components";
import PageContainer from "@/components/ui/PageContainer";
import React from "react";

const SignUp: React.FC = () => {
  return (
    <PageContainer className="flex items-center auth-page-container">
      <SignupCard />
    </PageContainer>
  );
};

export default SignUp;
