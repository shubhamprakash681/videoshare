import React from "react";

interface FormErrorStripProps extends React.AllHTMLAttributes<HTMLDivElement> {
  errorMessage: string;
  className?: "string";
  [key: string]: any;
}

const FormErrorStrip: React.FC<FormErrorStripProps> = ({
  errorMessage,
  className,
  ...props
}) => {
  return (
    <div {...props} className={`${className} text-destructive text-sm`}>
      {errorMessage}
    </div>
  );
};

export default FormErrorStrip;
