import { Sidebar } from "@/components/ui/SideBar";
import {
  sidebarItems,
  sideBarClass,
  transactionLogo,
} from "@components/config/sidebarConfig";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { fetchLatestTransactions } from "@/api/plaid";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddExpenseForm } from "@/features/expenses/AddExpenseForm";
import { addExpenseSchema } from "@/formSchemas/allFormSchemas";
import { useForm } from "react-hook-form";

export const Transactions = ({ className }) => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(false);

  const expenseForm = useForm({
    resolver: zodResolver(addExpenseSchema),
    defaultValues: {
      amount: "",
      category: "",
      description: "",
      transactionDate: "",
    },
  });

  const handleClick = async () => {
    try {
      const jwt = sessionStorage.getItem("token");
      const data = await fetchLatestTransactions(jwt);
      setTransactions(data);
      setError(false);
    } catch (err) {
      console.error("Could not retrieve transactions:", err);
      setError(true);
    }
  };

  const onSubmit = async (budget) => {
    const { name, start_date, end_date, currency } = budget;
    try {
      const response = await fetch("/api/budgets?limit=10", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, start_date, end_date, currency }),
      });
      const data = await response.json();
      const budget = data.newBudget;

      setBudgets((prev) => [...prev, budget]);

      form.reset();
    } catch (err) {
      console.error("Error creating a new budget:", err);
    }
  };

  return (
    <main className="flex flex-row min-h-screen">
      <Sidebar
        logo={transactionLogo}
        items={sidebarItems}
        className={sideBarClass}
      />
      <Card className="m-4 p-4 flex-1 bg-gray-300 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Transactions</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Add New Transaction</h3>
            <AddExpenseForm
              formType="add"
              form={expenseForm}
              onSubmit={onSubmit}
              isLoading={false}
              className="space-y-4"
            />
          </div>

          <div className="flex-1 bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">
              Existing Transactions
            </h3>
            {/* {!budgets ? (
              <p>Something went wrong</p>
            ) : budgets.length === 0 ? (
              <p className="text-gray-500">No budgets yet.</p>
            ) : (
              <ul className="space-y-2">
                {budgets.map((budget, index) => (
                  <li
                    key={index}
                    className="border p-2 rounded-md flex justify-between"
                  >
                    <span>
                      <strong>{budget.budget_id}:</strong> {budget.name}
                    </span>
                    <span>${parseFloat(budget.currency).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            )} */}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-around">
          <Button onClick={handleClick}>Get transactions</Button>
        </div>
        <div className="flex flex-col items-center w-full">
          {error ? (
            <div className="border p-4 rounded bg-red-100 w-full max-w-md mt-4 text-red-800 text-center">
              Please connect a bank account via Account
            </div>
          ) : Array.isArray(transactions) && transactions.length > 0 ? (
            <ul className="border p-4 rounded bg-gray-100 w-full max-w-md mt-4">
              {transactions.map((item, index) => (
                <li key={index}>
                  <p>
                    <strong>Merchant:</strong> {item.merchant}
                  </p>
                  <p>
                    <strong>Amount:</strong> ${item.amount}
                  </p>
                  <p>
                    <strong>Date:</strong> {item.date}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="border p-4 rounded bg-gray-50 w-full max-w-md mt-4 text-gray-500 text-center">
              No transactions to show yet. Click “Get transactions” to load
              data.
            </div>
          )}
        </div>
      </Card>
    </main>
  );
};
