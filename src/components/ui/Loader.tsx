import React from "react";

interface LoaderProps {
  size?: "small" | "medium" | "large" | "extraLarge";
  color?: "primary" | "secondary" | "white";
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({
  size = "medium",
  color = "primary",
  className,
}) => {
  const sizeClasses = {
    small: "w-10 h-10 border-4",
    medium: "w-12 h-12 border-4",
    large: "w-14 h-14 border-4",
    extraLarge: "w-16 h-16 border-4",
  };

  const colorClasses = {
    primary: "text-primary",
    secondary: "text-secondary",
    white: "text-white",
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div
        className={`${className} inline-block rounded-full 
        animate-spin border-solid border-current border-r-transparent 
        ${sizeClasses[size]} ${colorClasses[color]}`}
      ></div>
    </div>
  );
};

export default Loader;
