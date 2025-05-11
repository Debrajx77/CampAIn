// AddMemberToTeam.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const AddMemberToTeam = ({ teamId }) => {
  const [userId, setUserId] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/users", {
          headers: {
            "x-auth-token": localStorage.getItem("authToken"),
          },
        });
        setUsers(res.data);
      } catch (err) {
        setError(err.response ? err.response.data.msg : "Server error");
      }
    };
    fetchUsers();
  }, []);

  const handleAddMember = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `/api/team/${teamId}/add-member`,
        { userId },
        {
          headers: {
            "x-auth-token": localStorage.getItem("authToken"),
          },
        }
      );
      console.log("Member added");
    } catch (err) {
      setError(err.response ? err.response.data.msg : "Server error");
    }
  };

  return (
    <div>
      <h1>Add Member to Team</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleAddMember}>
        <label htmlFor="userId">Select User</label>
        <select
          id="userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        >
          <option value="">Select a user</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
        <button type="submit">Add Member</button>
      </form>
    </div>
  );
};

export default AddMemberToTeam;
