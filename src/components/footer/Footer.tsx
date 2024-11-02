import React from "react";

type FooterProps = {
  isSidebarOpen: boolean;
  SIDEBAR_WIDTH: string;
  SIDEBAR_WIDTH_CLOSED: string;
  isSmallerScreen: boolean;
};

const Footer: React.FC<FooterProps> = ({
  isSidebarOpen,
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_CLOSED,
  isSmallerScreen,
}) => {
  return (
    <div
      style={{
        width: isSmallerScreen
          ? "100%"
          : isSidebarOpen
          ? `calc(100% - ${SIDEBAR_WIDTH})`
          : `calc(100% - ${SIDEBAR_WIDTH_CLOSED})`,
        border: "1px solid green",
      }}
      className="p-3 bg-secondary"
    >
      Footer
    </div>
  );
};

export default Footer;
