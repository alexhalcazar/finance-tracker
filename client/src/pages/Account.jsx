import { Sidebar } from "@/components/ui/SideBar";
import {
  sideBarClass,
  sidebarItems,
  accountLogo,
} from "@/components/config/sidebarConfig";
import { useState, useCallback } from "react";
import { fetchLinkToken } from "@/api/plaid";
import { usePlaidLink } from "react-plaid-link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";

export const Account = () => {
  const [linkToken, setLinkToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      // TODO: grab JWT from storage
      // TODO: pass JWT to fetchLinkToken

      const token = await fetchLinkToken();
      setLinkToken(token);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onSuccess = useCallback(async (publicToken, metadata) => {
    try {
      // TODO: grab JWT from storage
      // TODO: pass JWT token into headers
      const response = await fetch("/api/plaid/exchange_link_token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicToken }),
      });
      const data = await response.json();
      // storing data to local storage for demo purposes only
      if (data) {
        localStorage.setItem("access_token", data);
      }
    } catch (err) {
      console.error("Error fetching public token");
    }
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken || "",
    onSuccess,
  });

  return (
    <main className="flex flex-row min-h-screen">
      <Sidebar
        logo={accountLogo}
        items={sidebarItems}
        className={sideBarClass}
      />
      <Card className="m-4 p-4 flex-1 bg-gray-300 rounded-lg">
        <div className="flex flex-wrap gap-4 justify-around">
          <Button
            onClick={() => (linkToken ? open() : handleClick())}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {!loading ? "Connect a bank account" : "Loading"}
          </Button>
        </div>
      </Card>
    </main>
  );
};
