import { Sidebar } from "@/components/ui/SideBar";
import { AddBudgetForm } from "@/features/budgets/AddBudgetForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addBudgetSchema } from "@/formSchemas/allFormSchemas";
import {
  budgetsLogo,
  sidebarItems,
  sideBarClass,
} from "@/components/config/sidebarConfig";
import { Card } from "@/components/ui/Card";
import { useState, useEffect } from "react";

export const Budgets = () => {
  const form = useForm({
    resolver: zodResolver(addBudgetSchema),
    defaultValues: {
      name: "",
      start_date: "",
      end_date: "",
      currency: "",
    },
  });

  const [budgets, setBudgets] = useState([]);

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchBudgets = async (token) => {
      try {
        const response = await fetch("/api/budgets/?limit=10", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("Error:", data);
          return;
        }

        setBudgets(data.budgets);
      } catch (err) {
        console.error("Error downloading all budgets from database:", err);
      }
    };

    fetchBudgets(token);
  }, [token]);

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
        logo={budgetsLogo}
        items={sidebarItems}
        className={sideBarClass}
      />
      <Card className="m-4 p-4 flex-1 bg-gray-300 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Budgets</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Add New Budget</h3>
            <AddBudgetForm
              formType="add"
              form={form}
              onSubmit={onSubmit}
              isLoading={false}
              className="space-y-4"
            />
          </div>

          <div className="flex-1 bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Existing Budgets</h3>
            {!budgets ? (
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
            )}
          </div>
        </div>
      </Card>
    </main>
  );
};
