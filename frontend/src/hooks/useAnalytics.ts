import { useEffect, useState } from "react";
import { fetchAnalytics } from "../services/anaytics";

type Analytics = {
  total_transactions: number;
  total_spending: number;
  food_transactions: number;
  most_used_category: string;

  highest_expense: {
    merchant: string;
    amount: number;
  };

  top_merchants: {
    merchant: string;
    spent: number;
  }[];

  recurring_expenses: {
    merchant: string;
    count: number;
  }[];
  category_spending: {
    category: string;
    amount: number;
  }[];
};

export function useAnalytics() {
  const [analytics, setAnalytics] = useState<Analytics>({
    total_transactions: 0,
    total_spending: 0,
    food_transactions: 0,
    most_used_category: "N/A",

    highest_expense: {
      merchant: "N/A",
      amount: 0,
    },

    top_merchants: [],

    recurring_expenses: [],

    category_spending: [],
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