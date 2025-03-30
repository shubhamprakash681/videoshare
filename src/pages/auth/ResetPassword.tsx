import { ResetPasswordCard } from "@/components";
import PageContainer from "@/components/ui/PageContainer";
import React from "react";

const ResetPassword: React.FC = () => {
  return (
    <PageContainer className="flex items-center h-[800px]">
      <ResetPasswordCard />
    </PageContainer>
  );
};

export default ResetPassword;
