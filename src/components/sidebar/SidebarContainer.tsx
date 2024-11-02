import React from "react";

interface SidebarProps extends React.AllHTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  SIDEBAR_WIDTH: string;
  SIDEBAR_WIDTH_CLOSED: string;

  className?: string;
}

const SidebarContainer: React.FC<SidebarProps> = ({
  isOpen = false,
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_CLOSED,

  className,
  ...props
}) => {
  if (!isOpen) {
    return (
      <div
        className="hidden sm:flex absolute left-0 top-0 h-full bg-sidebar text-sidebar-foreground z-10"
        style={{ width: SIDEBAR_WIDTH_CLOSED }}
      >
        <div
          {...props}
          className={`${className} custom-sidebar z-10`}
          style={{ width: SIDEBAR_WIDTH_CLOSED }}
        >
          <div>SCC</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-full absolute left-0 top-0 bg-sidebar text-sidebar-foreground z-10"
      style={{ width: SIDEBAR_WIDTH }}
    >
      <div
        {...props}
        className={`${className} custom-sidebar z-10`}
        style={{ width: SIDEBAR_WIDTH }}
      >
        <div>Sidebar content</div>
      </div>
    </div>
  );
};

export default SidebarContainer;
