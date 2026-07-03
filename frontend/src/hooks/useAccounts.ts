import { useEffect, useState } from "react";
import {
  fetchAccounts,
  createAccount,
} from "../services/accounts";

export function useAccounts() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");

  async function loadAccounts() {
    setAccounts(await fetchAccounts());
  }

  async function addAccount() {
    const ok = await createAccount(name, Number(balance));

    if (!ok) {
      alert("Failed");
      return;
    }

    setName("");
    setBalance("");
    loadAccounts();
  }

  useEffect(() => {
    loadAccounts();
  }, []);

  return {
    accounts,

    name,
    balance,

    setName,
    setBalance,

    createAccount: addAccount,

    refreshAccounts: loadAccounts,
  };
}