import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const CampaignOptimization = () => {
  const { id } = useParams();
  const [insights, setInsights] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const res = await fetch(
        `https://campain-b2rr.onrender.com/api/campaigns/${id}/optimize`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.msg || "Failed to fetch insights");
        return;
      }

      const data = await res.json();
      setInsights(data.insights);
    } catch (err) {
      console.error("Error fetching insights:", err);
      setError("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Campaign Optimization</h1>

      {error && <p className="text-red-500">{error}</p>}

      {insights.length === 0 ? (
        <p className="text-gray-500">
          No insights available for this campaign.
        </p>
      ) : (
        <ul className="space-y-4">
          {insights.map((insight, index) => (
            <li
              key={index}
              className="bg-blue-50 dark:bg-blue-900 text-gray-800 dark:text-gray-200 p-4 rounded-lg shadow"
            >
              {insight}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CampaignOptimization;
