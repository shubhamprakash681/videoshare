import { SignupCard } from "@/components";
import PageContainer from "@/components/ui/PageContainer";
import React from "react";

const SignUp: React.FC = () => {
  return (
    <PageContainer className="flex items-center h-[800px]">
      <SignupCard />
    </PageContainer>
  );
};

export default SignUp;
