export const dashboardLoader = async () => {
  const token = sessionStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const incomeResponse = await fetch("/api/summary/income", { headers });

    const incomeData = await incomeResponse.json();
    return {
      totalIncome: incomeData.total_income || 0,
    };
  } catch (error) {
    console.error("Error loading dashboard data:", error);
    throw new Error("Failed to load dashboard data");
  }
};
