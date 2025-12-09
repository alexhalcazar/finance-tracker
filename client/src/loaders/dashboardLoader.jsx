export const dashboardLoader = async () => {
  const token = sessionStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const incomeResponse = await fetch("/api/summary/income", { headers });
    const expensesResponse = await fetch("/api/summary/expenses", { headers });
    const remainingBudgetResponse = await fetch(
      "/api/summary/remaining-budget",
      { headers }
    );

    const incomeData = await incomeResponse.json();
    const expensesData = await expensesResponse.json();
    const remainingBudgetData = await remainingBudgetResponse.json();

    return {
      totalIncome: incomeData.total_income || 0,
      totalExpenses: expensesData.total_expenses || 0,
      remainingBudget: remainingBudgetData.remaining_budget || 0,
    };
  } catch (error) {
    console.error("Error loading dashboard data:", error);
    throw new Error("Failed to load dashboard data");
  }
};
