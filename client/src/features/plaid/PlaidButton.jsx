import { useState, useCallback, useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

export const PlaidButton = ({ className }) => {
  const [linkToken, setLinkToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchLinkToken = async () => {
    try {
      const response = await fetch("/api/plaid/get_link_token");
      const data = await response.json();
      setLinkToken(data.link_token);
    } catch (err) {
      console.error("Backend call to create link token failed");
    }
  };

  const onSuccess = useCallback(async (publicToken, metadata) => {
    try {
      const response = await fetch("/api/plaid/exchange_link_token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicToken }),
      });
      const data = await response.json();
    } catch (err) {
      console.error("Error fetching public token");
    }
  }, []);

  const { open, ready, error } = usePlaidLink({
    token: linkToken || "",
    onSuccess,
  });

  useEffect(() => {
    if (linkToken && ready) {
      open();
    }
  }, [linkToken, ready, open]);

  const handleClick = async () => {
    try {
      if (!linkToken) {
        setLoading(true);
        await fetchLinkToken();
        setLoading(false);
      } else {
        setLoading(true);
        open();
        setLoading(false);
      }
    } catch (err) {
      console.error("Error calling fetch token");
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      className={cn(`max-h-24 m-4 ${className}`)}
    >
      {!loading ? "Connect a bank account" : "Loading"}
    </Button>
  );
};
