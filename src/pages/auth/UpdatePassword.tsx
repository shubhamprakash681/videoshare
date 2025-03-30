import { UpdatePasswordCard } from "@/components";
import PageContainer from "@/components/ui/PageContainer";
import React from "react";

const UpdatePassword: React.FC = () => {
  return (
    <PageContainer className="flex items-center h-[800px]">
      <UpdatePasswordCard />
    </PageContainer>
  );
};

export default UpdatePassword;
