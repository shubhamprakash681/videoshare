import { LoginCard } from "@/components";
import PageContainer from "@/components/ui/PageContainer";
import React from "react";

const Login: React.FC = () => {
  return (
    <PageContainer className="flex items-center h-[800px]">
      <LoginCard />
    </PageContainer>
  );
};

export default Login;
