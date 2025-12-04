import { Sidebar } from "@/components/ui/SideBar";
import {
  sidebarItems,
  sideBarClass,
  transactionLogo,
} from "@components/config/sidebarConfig";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { Card } from "@/components/ui/Card";
import { fetchLatestTransactions } from "@/api/plaid";
import { useState } from "react";

export const Transactions = ({ className }) => {
  const [transactions, setTransactions] = useState([]);

  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const jwt = sessionStorage.getItem("token");
      const data = await fetchLatestTransactions(jwt);
      setTransactions(data);
    } catch (err) {
      console.error("Could not retrieve transactions:", err);
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
        <div className="flex flex-wrap gap-4 justify-around">
          <Button onClick={() => navigate("/transactions/add-expense")}>
            Add an expense
          </Button>
          <Button onClick={handleClick}>Get transactions</Button>
        </div>
        <div className="flex flex-col items-center w-full">
          {transactions.length > 0 ? (
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
