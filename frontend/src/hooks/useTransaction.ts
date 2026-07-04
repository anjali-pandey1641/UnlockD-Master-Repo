import { useCallback, useEffect, useState } from "react";
import {
  fetchTransactions,
  transferMoney,
} from "../services/transaction";
import { importStatement } from "../services/anaytics";

export function useTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);

  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [merchant, setMerchant] = useState("");

  const [search, setSearch] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  const [file, setFile] = useState<File | null>(null);

  const loadTransactions = useCallback(async () => {
    const data = await fetchTransactions(search, searchCategory);
    setTransactions(data);
  }, [search, searchCategory]);

  async function doTransfer() {
    const response = await transferMoney(
      Number(sender),
      Number(receiver),
      Number(amount),
      category,
      description,
      merchant,
    );

    if (response.ok) {
      const data = await response.json();

      if (data.warning) {
        alert(data.warning);
      }

      setSender("");
      setReceiver("");
      setAmount("");
      setCategory("");
      setDescription("");
      setMerchant("");

      await loadTransactions();
    } else {
      alert("Transfer failed");
    }
  }

  async function uploadStatement() {
    if (!file) return;

    const response = await importStatement(file);

    if (response.ok) {
      const data = await response.json();
      alert(`Imported ${data.count} rows`);

      setFile(null);

      await loadTransactions();
    } else {
      alert("Import failed");
    }
  }

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return {
    transactions,

    sender,
    receiver,
    amount,
    category,
    description,
    merchant,

    search,
    searchCategory,

    file,

    setSender,
    setReceiver,
    setAmount,
    setCategory,
    setDescription,
    setMerchant,

    setSearch,
    setSearchCategory,

    setFile,

    fetchTransactions: loadTransactions,

    transferMoney: doTransfer,

    importStatement: uploadStatement,
  };
}