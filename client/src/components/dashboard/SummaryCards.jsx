import { useRouteLoaderData } from "react-router";
import { Card } from "@/components/ui/Card";

export const SummaryCards = () => {
  const data = useRouteLoaderData("dashboard");
  const income = data?.totalIncome;
  const expenses = 0;
  const budget = 0;

  return (
    <div className="flex flex-wrap gap-4 justify-around">
      <Card className="p-4 bg-emerald-300 text-center rounded-lg shadow-md flex-1 min-w-[200px] max-w-[300px]">
        <div className="text-sm font-medium">Total Income</div>
        <div className="text-2xl font-bold text-gray-900">{`$${income}`}</div>
      </Card>
      <Card className="p-4 bg-rose-400 text-center rounded-lg shadow-md flex-1 min-w-[200px] max-w-[300px]">
        <div className="text-sm font-medium">Expenses</div>
        <div className="text-2xl font-bold text-gray-900">{`$${expenses}`}</div>
      </Card>
      <Card className="p-4 bg-white text-center rounded-lg shadow-md flex-1 min-w-[200px] max-w-[300px]">
        <div className="text-sm font-medium"> Remaining Budget</div>
        <div className="text-2xl font-bold text-gray-900">{`$${budget}`}</div>
      </Card>
    </div>
  );
};
