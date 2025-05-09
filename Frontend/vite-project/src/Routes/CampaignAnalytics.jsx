import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import "chart.js/auto";
import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";

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

  const handleDownloadImage = () => {
    const content = document.getElementById("analytics-content");

    toPng(content)
      .then((dataUrl) => {
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = "analytics-image.png";
        a.click();
      })
      .catch((error) => {
        console.error("Error downloading image", error);
      });
  };

  const handleDownloadPDF = () => {
    const content = document.getElementById("analytics-content");

    toPng(content)
      .then((dataUrl) => {
        const doc = new jsPDF();
        doc.addImage(dataUrl, "PNG", 10, 10, 180, 160);
        doc.save("analytics.pdf");
      })
      .catch((error) => {
        console.error("Error downloading PDF", error);
      });
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">
        Campaign Analytics
      </h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {!error && analytics.length === 0 && (
        <p className="text-gray-400">Loading analytics...</p>
      )}

      <div className="flex gap-4 mb-6">
        <button
          onClick={handleDownloadImage}
          className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 transition"
        >
          Download Image
        </button>
        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2 bg-teal-600 rounded hover:bg-teal-700 transition"
        >
          Download PDF
        </button>
      </div>

      <div id="analytics-content" className="space-y-12">
        {analytics.length > 0 && (
          <>
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Clicks & Conversions
              </h2>
              <Bar data={chartData} />
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Budget Utilization</h2>
              <Line data={budgetData} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CampaignAnalytics;
