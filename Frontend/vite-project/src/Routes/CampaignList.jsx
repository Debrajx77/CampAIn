import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CampaignList() {
  const [campaigns, setCampaigns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch("https://campain-2.onrender.com/api/campaigns", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.msg || "Failed to fetch campaigns");
        return;
      }

      const data = await res.json();
      setCampaigns(data);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
      setError("Server error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this campaign?"))
      return;
    try {
      const res = await fetch(
        `https://campain-2.onrender.com/api/campaign/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setError(data.msg || "Failed to delete campaign");
        return;
      }

      setCampaigns(campaigns.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Error deleting campaign:", err);
      setError("Server error");
    }
  };

  const updateAnalytics = async (id, type) => {
    try {
      await fetch(
        `https://campain-2.onrender.com/api/campaign/${id}/analytics`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ type }),
        }
      );
    } catch (err) {
      console.error("Error updating analytics:", err);
    }
  };

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white px-4 py-20">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">📋 Campaigns</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <input
        type="text"
        placeholder="Search campaigns..."
        className="mb-6 w-full p-3 rounded-lg bg-neutral-800 border border-neutral-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredCampaigns.map((campaign) => (
          <div
            key={campaign._id}
            onClick={() => updateAnalytics(campaign._id, "click")}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-lg hover:shadow-purple-700/40 transition duration-300 flex flex-col"
          >
            <h2 className="text-xl font-semibold text-purple-300 mb-2">
              {campaign.title}
            </h2>
            <p className="text-gray-400 mb-3">{campaign.description}</p>
            <div className="text-sm text-gray-500 space-y-1 mb-4">
              <p>💰 Budget: ${campaign.objective}</p>
              <p>🖱️ Clicks: {campaign.clicks}</p>
              <p>🎯 Conversions: {campaign.conversions}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(campaign._id);
              }}
              className="mb-2 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
            >
              Delete
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/campaign/${campaign._id}`);
              }}
              className="py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
            >
              View Comments
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CampaignList;
