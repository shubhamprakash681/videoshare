import { UpdatePasswordCard } from "@/components";
import PageContainer from "@/components/ui/PageContainer";
import React from "react";

const UpdatePassword: React.FC = () => {
  return (
    <PageContainer className="flex items-center auth-page-container">
      <UpdatePasswordCard />
    </PageContainer>
  );
};

export default UpdatePassword;
