import { Button } from "./button";

type ErrorStateCompProps = {
  handleRefresh: () => void;
};
const ErrorStateComp: React.FC<ErrorStateCompProps> = ({ handleRefresh }) => {
  return (
    <div className="w-full h-28 flex flex-col items-center justify-evenly">
      <p>
        Failed to fetch resources. Please{" "}
        <Button onClick={handleRefresh} className="p-0 h-fit" variant="link">
          Refresh
        </Button>{" "}
        this page
      </p>
    </div>
  );
};

export default ErrorStateComp;
