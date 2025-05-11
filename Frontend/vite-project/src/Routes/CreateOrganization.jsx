// CreateOrganization.js
import React, { useState } from "react";
import axios from "axios";

const CreateOrganization = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "/api/organization",
        { name },
        {
          headers: {
            "x-auth-token": localStorage.getItem("authToken"),
          },
        }
      );
      console.log("Organization created:", res.data);
    } catch (err) {
      setError(err.response ? err.response.data.msg : "Server error");
    }
  };

  return (
    <div>
      <h1>Create Organization</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Organization Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">Create Organization</button>
      </form>
    </div>
  );
};

export default CreateOrganization;
