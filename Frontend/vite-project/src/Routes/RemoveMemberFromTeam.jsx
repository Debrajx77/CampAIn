// RemoveMemberFromTeam.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const RemoveMemberFromTeam = ({ teamId }) => {
  const [userId, setUserId] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const res = await axios.get(`/api/team/${teamId}/members`, {
          headers: {
            "x-auth-token": localStorage.getItem("authToken"),
          },
        });
        setTeamMembers(res.data.members);
      } catch (err) {
        setError(err.response ? err.response.data.msg : "Server error");
      }
    };
    fetchTeamMembers();
  }, [teamId]);

  const handleRemoveMember = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `/api/team/${teamId}/remove-member`,
        { userId },
        {
          headers: {
            "x-auth-token": localStorage.getItem("authToken"),
          },
        }
      );
      console.log("Member removed");
    } catch (err) {
      setError(err.response ? err.response.data.msg : "Server error");
    }
  };

  return (
    <div>
      <h1>Remove Member from Team</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleRemoveMember}>
        <label htmlFor="userId">Select User</label>
        <select
          id="userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        >
          <option value="">Select a member</option>
          {teamMembers.map((member) => (
            <option key={member._id} value={member._id}>
              {member.name}
            </option>
          ))}
        </select>
        <button type="submit">Remove Member</button>
      </form>
    </div>
  );
};

export default RemoveMemberFromTeam;
