import React from "react";

const TweetsTable: React.FC = () => {
  return (
    <div className="h-60 p-2 sm:p-3 md:p-4 lg:p-6 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-lg font-bold text-primary">Coming Soon</h1>
        <p className="text-sm text-muted-foreground">
          This feature is not available yet.
        </p>
      </div>
    </div>
  );
};

export default TweetsTable;
