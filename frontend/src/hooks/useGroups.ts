import { useEffect, useState } from "react";
import {
  fetchGroups,
  fetchMembers,
  fetchSettlements,
  createGroup,
  addMember,
  createExpense,
  generateSettlements,
  markPaid,
} from "../services/groups";

export function useGroups() {
  const [groups, setGroups] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [settlements, setSettlements] = useState<any[]>([]);

  const [groupName, setGroupName] = useState("");
  const [groupId, setGroupId] = useState("");
  const [memberAccount, setMemberAccount] = useState("");

  const [expenseGroup, setExpenseGroup] = useState("");
  const [payerId, setPayerId] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [splitType, setSplitType] = useState("equal");

  const [custom1, setCustom1] = useState("");
  const [custom2, setCustom2] = useState("");
  const [custom3, setCustom3] = useState("");

  const [description, setDescription] = useState("");

  async function loadGroups() {
    const data = await fetchGroups();
    setGroups(data);
  }

  async function loadMembers(id: number) {
    const data = await fetchMembers(id);
    setMembers(data);
  }

  async function loadSettlements(id: number) {
    const data = await fetchSettlements(id);
    setSettlements(data);
  }

  async function addNewGroup() {
    const response = await createGroup(groupName);

    if (response.ok) {
      setGroupName("");
      loadGroups();
      window.location.reload();
    } else {
      alert("Failed to create group");
    }
  }

  async function addNewMember() {
    const response = await addMember(
      Number(groupId),
      Number(memberAccount),
    );

    if (response.ok) {
      setMemberAccount("");
      loadMembers(Number(groupId));
      window.location.reload();
    } else {
      alert("Failed to add member");
    }
  }

  async function addExpense() {
    const body: any = {
      payer_id: Number(payerId),
      description,
      amount: Number(expenseAmount),
      split_type: splitType,
    };

    if (splitType === "custom") {
      body.splits = [
        {
          account_id: 1,
          amount: Number(custom1),
        },
        {
          account_id: 2,
          amount: Number(custom2),
        },
        {
          account_id: 3,
          amount: Number(custom3),
        },
      ];
    }

    const response = await createExpense(
      Number(expenseGroup),
      body,
    );

    if (response.ok) {
      alert("Expense Created");

      setExpenseGroup("");
      setPayerId("");
      setDescription("");
      setExpenseAmount("");
      setCustom1("");
      setCustom2("");
      setCustom3("");
    } else {
      alert("Failed");
    }
  }

  async function createSettlements() {
    await generateSettlements(Number(groupId));
    loadSettlements(Number(groupId));
  }

  async function paySettlement(id: number) {
    await markPaid(id);
    loadSettlements(Number(groupId));
  }

  useEffect(() => {
    loadGroups();
  }, []);

  return {
    groups,
    members,
    settlements,

    groupName,
    groupId,
    memberAccount,

    expenseGroup,
    payerId,
    expenseAmount,
    splitType,

    custom1,
    custom2,
    custom3,

    description,

    setGroupName,
    setGroupId,
    setMemberAccount,

    setExpenseGroup,
    setPayerId,
    setExpenseAmount,
    setSplitType,

    setCustom1,
    setCustom2,
    setCustom3,

    setDescription,

    fetchMembers: loadMembers,
    fetchSettlements: loadSettlements,

    createGroup: addNewGroup,
    addMember: addNewMember,
    createExpense: addExpense,

    generateSettlements: createSettlements,
    markPaid: paySettlement,
  };
}