// CreateTeam.js
import React, { useState } from "react";
import axios from "axios";

const CreateTeam = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "/api/team",
        { name },
        {
          headers: {
            "x-auth-token": localStorage.getItem("authToken"),
          },
        }
      );
      console.log("Team created:", res.data);
    } catch (err) {
      setError(err.response ? err.response.data.msg : "Server error");
    }
  };

  return (
    <div>
      <h1>Create Team</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Team Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">Create Team</button>
      </form>
    </div>
  );
};

export default CreateTeam;
