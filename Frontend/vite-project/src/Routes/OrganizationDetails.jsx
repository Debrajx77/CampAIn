// OrganizationDetails.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const OrganizationDetails = () => {
  const [organization, setOrganization] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const res = await axios.get("/api/organization", {
          headers: {
            "x-auth-token": localStorage.getItem("authToken"),
          },
        });
        setOrganization(res.data);
      } catch (err) {
        setError(err.response ? err.response.data.msg : "Server error");
      }
    };
    fetchOrganization();
  }, []);

  if (error) return <p>{error}</p>;
  if (!organization) return <p>Loading organization details...</p>;

  return (
    <div>
      <h1>Organization: {organization.name}</h1>
      <h2>Members:</h2>
      <ul>
        {organization.members.map((member) => (
          <li key={member}>{member}</li>
        ))}
      </ul>
    </div>
  );
};

export default OrganizationDetails;
