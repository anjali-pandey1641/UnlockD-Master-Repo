type Props = {
  groups: any[];
  members: any[];
  accounts: any[];

  groupName: string;
  groupId: string;
  memberAccount: string;

  setGroupName: (value: string) => void;
  setGroupId: (value: string) => void;
  setMemberAccount: (value: string) => void;

  createGroup: () => void;
  addMember: () => void;
  fetchMembers: (id: number) => void;
};

export default function Groups({
  groups,
  members,
  accounts,
  groupName,
  groupId,
  memberAccount,
  setGroupName,
  setGroupId,
  setMemberAccount,
  createGroup,
  addMember,
  fetchMembers,
}: Props) {
  return (
    <div className="card">
      <h2>Create Group</h2>

      <div className="form-row">
        <input
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
      </div>

      <div className="button-row">
        <button onClick={createGroup}>Create Group</button>
      </div>

      <h2 style={{ marginTop: "24px" }}>Groups</h2>

      {groups.map((g: any) => (
        <div
          key={g.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 0",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <strong>#{g.id}</strong>
          <span>{g.name}</span>
        </div>
      ))}

      <h2 style={{ marginTop: "30px" }}>Add Member</h2>

      <div className="form-row">
        <input
          placeholder="Group ID"
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
        />

        <select
          value={memberAccount}
          onChange={(e) => setMemberAccount(e.target.value)}
        >
          <option value="">Select Account</option>

          {accounts.map((account: any) => (
            <option key={account.id} value={account.id}>
              {account.name} (#{account.id})
            </option>
          ))}
        </select>
      </div>

      <div className="button-row">
        <button onClick={addMember}>Add Member</button>

        <button onClick={() => fetchMembers(Number(groupId))}>
          Load Members
        </button>
      </div>

      {members.length > 0 && (
        <>
          <h2 style={{ marginTop: "24px" }}>Members</h2>

          {members.map((m: any) => (
            <div
              key={m.account_id}
              style={{
                padding: "8px 0",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              👤 {m.name ?? `Account #${m.account_id}`}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
