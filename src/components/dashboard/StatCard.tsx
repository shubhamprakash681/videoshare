import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  count: number;
  Icon: React.ReactNode;
}
const StatCard: React.FC<StatCardProps> = ({ Icon, count, title }) => {
  return (
    <Card className="w-full max-w-[300px] hover:scale-105 transform transition duration-300 ease-in-out">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon}
        {/* <Icon className="h-4 w-4 text-muted-foreground" /> */}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
        {/* <p className="text-xs text-muted-foreground">+2.1% from last month</p> */}
      </CardContent>
    </Card>
  );
};

export default StatCard;
