import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import "chart.js/auto";

function CampaignAnalytics() {
  const [analytics, setAnalytics] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(
        "https://campain-2.onrender.com/api/campaigns/analytics",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.msg || "Failed to fetch analytics");
        return;
      }

      const data = await res.json();
      setAnalytics(data);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError("Server error");
    }
  };

  const chartData = {
    labels: analytics.map((campaign) => campaign.title),
    datasets: [
      {
        label: "Clicks",
        data: analytics.map((campaign) => campaign.clicks),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Conversions",
        data: analytics.map((campaign) => campaign.conversions),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  const budgetData = {
    labels: analytics.map((campaign) => campaign.title),
    datasets: [
      {
        label: "Budget",
        data: analytics.map((campaign) => campaign.budget),
        backgroundColor: "rgba(255, 159, 64, 0.6)",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Campaign Analytics</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Clicks and Conversions</h2>
        <Bar data={chartData} />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Budget Utilization</h2>
        <Line data={budgetData} />
      </div>
    </div>
  );
}

export default CampaignAnalytics;
