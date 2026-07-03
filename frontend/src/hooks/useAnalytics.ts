import { useEffect, useState } from "react";
import { fetchAnalytics } from "../services/anaytics";

type Analytics = {
  total_transactions: number;
  total_spending: number;
  food_transactions: number;
  most_used_category: string;
};

export function useAnalytics() {
  const [analytics, setAnalytics] = useState<Analytics>({
    total_transactions: 0,
    total_spending: 0,
    food_transactions: 0,
    most_used_category: "N/A",
  });

  async function loadAnalytics() {
    setAnalytics(await fetchAnalytics());
  }

  useEffect(() => {
    loadAnalytics();
  }, []);

  return {
    ...analytics,
    refreshAnalytics: loadAnalytics,
  };
}