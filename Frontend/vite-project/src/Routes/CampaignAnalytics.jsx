import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import "chart.js/auto";

function CampaignAnalytics() {
  const [analytics, setAnalytics] = useState([]);
  const [error, setError] = useState("");
  const [viewType, setViewType] = useState("bar"); // Toggle between bar and line

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
        data: analytics.map((c) => c.clicks),
        backgroundColor: "rgba(99, 102, 241, 0.6)",
        borderColor: "rgba(99, 102, 241, 1)",
        fill: true,
      },
      {
        label: "Conversions",
        data: analytics.map((c) => c.conversions),
        backgroundColor: "rgba(236, 72, 153, 0.6)",
        borderColor: "rgba(236, 72, 153, 1)",
        fill: true,
      },
    ],
  };

  const ctrData = {
    labels: analytics.map((c) => c.title),
    datasets: [
      {
        label: "CTR (%)",
        data: analytics.map((c) =>
          c.clicks ? ((c.conversions / c.clicks) * 100).toFixed(2) : 0
        ),
        backgroundColor: "rgba(34, 197, 94, 0.6)",
        borderColor: "rgba(34, 197, 94, 1)",
        fill: true,
      },
    ],
  };

  const budgetData = {
    labels: analytics.map((campaign) => campaign.title),
    datasets: [
      {
        label: "Budget",
        data: analytics.map((campaign) => campaign.budget),
        backgroundColor: "rgba(251, 191, 36, 0.6)",
        borderColor: "rgba(251, 191, 36, 1)",
        fill: true,
      },
    ],
  };

  const ChartComponent = viewType === "bar" ? Bar : Line;

  return (
    <div className="min-h-screen bg-neutral-950 text-white px-6 py-20">
      <h1 className="text-3xl font-bold mb-8 text-purple-400">
        📈 Campaign Analytics
      </h1>

      {error && <p className="text-red-500 mb-6">{error}</p>}

      {analytics.length === 0 ? (
        <p className="text-gray-400 text-center">
          No analytics data available.
        </p>
      ) : (
        <>
          <div className="mb-8 flex justify-end">
            <button
              onClick={() => setViewType(viewType === "bar" ? "line" : "bar")}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md transition text-sm"
            >
              Switch to {viewType === "bar" ? "Line" : "Bar"} View
            </button>
          </div>

          <div className="mb-14">
            <h2 className="text-xl font-semibold mb-4 text-purple-300">
              Clicks & Conversions
            </h2>
            <ChartComponent data={chartData} />
          </div>

          <div className="mb-14">
            <h2 className="text-xl font-semibold mb-4 text-green-400">
              CTR (Click-Through Rate)
            </h2>
            <Line data={ctrData} />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 text-yellow-400">
              Budget Utilization
            </h2>
            <Line data={budgetData} />
          </div>
        </>
      )}
    </div>
  );
}

export default CampaignAnalytics;
