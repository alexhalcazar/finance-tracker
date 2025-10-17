import { useState } from "react";
import { Button } from "@/components/ui/button";
export const LatestTransactions = () => {
  const [transactions, setTransactions] = useState([]);

  const handleClick = async () => {
    const MAX_TRANSACTIONS = 4;
    const latestTransactions = [];
    try {
      const response = await fetch("/api/bank/transactions");
      const data = await response.json();
      for (let i = 0; i <= Math.min(data.length, MAX_TRANSACTIONS); i++) {
        const thisTransaction = {
          amount: data[i].amount,
          date: data[i].date,
          merchant: data[i].merchant_name,
        };

        latestTransactions.push(thisTransaction);
      }
      setTransactions(latestTransactions);
    } catch (err) {
      console.error("Could not retrieve transactions:", err);
    }
  };
  //space-y-4
  return (
    <div className={"flex flex-col items-start"}>
      <Button onClick={handleClick}>Get transactions</Button>
      {transactions.length > 0 && (
        <ul className="border p-4 rounded bg-gray-100 w-full max-w-md mt-4">
          {transactions &&
            transactions.map((item, index) => (
              <li key={index} className="">
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
      )}
    </div>
  );
};
