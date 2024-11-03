import React from "react";

interface PageContainerProps extends React.AllHTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;

  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div {...props} className={`page-container ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer;
