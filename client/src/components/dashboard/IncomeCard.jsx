import { Card } from "@/components/ui/Card";
import { useRouteLoaderData } from "react-router";

export const IncomeCard = () => {
  const data = useRouteLoaderData("dashboard");
  const income = data?.totalIncome;

  return (
    <Card className="p-4 bg-emerald-300 text-center rounded-lg shadow-md flex-1 min-w-[200px] max-w-[300px]">
      <div className="text-sm font-medium">Total Income</div>
      <div className="text-2xl font-bold text-gray-900">{`$${income}`}</div>
    </Card>
  );
};
