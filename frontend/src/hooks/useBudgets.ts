import { useEffect, useState } from "react";
import {
  fetchBudgets,
  createBudget,
} from "../services/budgets";

export function useBudgets() {
  const [budgets, setBudgets] = useState<any[]>([]);

  const [budgetAccount, setBudgetAccount] = useState("");
  const [budgetCategory, setBudgetCategory] = useState("");
  const [budgetLimit, setBudgetLimit] = useState("");

  async function loadBudgets() {
    const data = await fetchBudgets();
    setBudgets(data);
  }

  async function addBudget() {
    const response = await createBudget(
      Number(budgetAccount),
      budgetCategory,
      Number(budgetLimit),
    );

    if (response.ok) {
      setBudgetAccount("");
      setBudgetCategory("");
      setBudgetLimit("");

      loadBudgets();
    } else {
      alert("Failed to create budget");
    }
  }

  useEffect(() => {
    loadBudgets();
  }, []);

  return {
    budgets,

    budgetAccount,
    budgetCategory,
    budgetLimit,

    setBudgetAccount,
    setBudgetCategory,
    setBudgetLimit,

    createBudget: addBudget,

    refreshBudgets: loadBudgets,
  };
}