import { LoginCard } from "@/components";
import PageContainer from "@/components/ui/PageContainer";
import React from "react";

const Login: React.FC = () => {
  return (
    <PageContainer className="flex items-center auth-page-container">
      <LoginCard />
    </PageContainer>
  );
};

export default Login;
