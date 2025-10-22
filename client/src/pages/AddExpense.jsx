import { AddExpenseForm } from "@/features/expenses/AddExpenseForm";
import { Card } from "@/components/ui/Card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addExpenseSchema } from "@/features/auth/formSchema";
import { useState } from "react";

export function AddExpense() {
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form using Zod schema
  const expenseForm = useForm({
    resolver: zodResolver(addExpenseSchema),
    defaultValues: {
      amount: "",
      category: "",
      description: "",
      transactionDate: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      console.log("Add Expense Data\n", data);
      // Example: you can later replace this with an API call to save the expense
      // await axios.post("/api/expenses", data);
    } catch (error) {
      console.error("AddExpensePage error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl text-primary font-bold">Add Expense</h2>
          <p className="text-base text-muted">
            Record a new expense below to keep track of your spending.
          </p>
        </div>

        <Card className="p-8 space-y-6">
          <AddExpenseForm
            formType="addExpense"
            form={expenseForm}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
        </Card>
      </div>
    </main>
  );
}
