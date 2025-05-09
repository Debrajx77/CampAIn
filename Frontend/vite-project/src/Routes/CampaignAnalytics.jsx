import React, { useState, useEffect, useRef } from "react";
import { Bar, Line } from "react-chartjs-2";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "chart.js/auto";

function CampaignAnalytics() {
  const [analytics, setAnalytics] = useState([]);
  const [error, setError] = useState("");
  const chartRef = useRef();

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

  const exportAsImage = async () => {
    const canvas = await html2canvas(chartRef.current);
    const link = document.createElement("a");
    link.download = "campaign_analytics.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const exportAsPDF = async () => {
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("campaign_analytics.pdf");
  };

  const chartData = {
    labels: analytics.map((campaign) => campaign.title),
    datasets: [
      {
        label: "Clicks",
        data: analytics.map((campaign) => campaign.clicks),
        backgroundColor: "rgba(56, 189, 248, 0.6)",
        borderColor: "rgba(56, 189, 248, 1)",
        borderWidth: 1,
      },
      {
        label: "Conversions",
        data: analytics.map((campaign) => campaign.conversions),
        backgroundColor: "rgba(168, 85, 247, 0.6)",
        borderColor: "rgba(168, 85, 247, 1)",
        borderWidth: 1,
      },
    ],
  };

  const budgetData = {
    labels: analytics.map((campaign) => campaign.title),
    datasets: [
      {
        label: "Budget",
        data: analytics.map((campaign) => campaign.budget),
        fill: false,
        borderColor: "rgba(251, 191, 36, 1)",
        backgroundColor: "rgba(251, 191, 36, 0.4)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-10 py-10">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">
        Campaign Analytics
      </h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex gap-4 mb-6 flex-wrap">
        <button
          onClick={exportAsImage}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
        >
          Export as Image
        </button>
        <button
          onClick={exportAsPDF}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded transition"
        >
          Export as PDF
        </button>
      </div>

      <div ref={chartRef} className="space-y-12">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-cyan-400">
            Clicks & Conversions
          </h2>
          <div className="bg-neutral-900 p-4 rounded-xl shadow-lg">
            <Bar data={chartData} />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-yellow-400">
            Budget Utilization
          </h2>
          <div className="bg-neutral-900 p-4 rounded-xl shadow-lg">
            <Line data={budgetData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CampaignAnalytics;
