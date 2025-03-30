import React, { useState } from "react";
import Loader from "./Loader";

interface ImageProps extends React.AllHTMLAttributes<HTMLImageElement> {
  loaderSize?: "small" | "medium" | "large" | "extraLarge";
  src: string;
  alt: string;
}

const Image: React.FC<ImageProps> = ({ src, alt, loaderSize, ...props }) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  return (
    <>
      {!isLoaded && (
        <div
          className={`${
            props.className && props.className
          } w-full flex items-center`}
        >
          <Loader size={loaderSize || "small"} />
        </div>
      )}

      <img
        {...props}
        onLoad={() => setIsLoaded(true)}
        className={props.className}
        style={{
          display: isLoaded ? "block" : "none",
        }}
        src={src}
        alt={alt}
      />
    </>
  );
};

export default Image;
