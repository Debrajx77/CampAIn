// TeamDetails.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const TeamDetails = () => {
  const [team, setTeam] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await axios.get("/api/team", {
          headers: {
            "x-auth-token": localStorage.getItem("authToken"),
          },
        });
        setTeam(res.data);
      } catch (err) {
        setError(err.response ? err.response.data.msg : "Server error");
      }
    };
    fetchTeam();
  }, []);

  if (error) return <p>{error}</p>;
  if (!team) return <p>Loading team details...</p>;

  return (
    <div>
      <h1>Team: {team.name}</h1>
      <h2>Members:</h2>
      <ul>
        {team.members.map((member) => (
          <li key={member}>{member}</li>
        ))}
      </ul>
    </div>
  );
};

export default TeamDetails;
