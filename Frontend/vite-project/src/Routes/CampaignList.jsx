import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function CampaignList() {
  const [campaigns, setCampaigns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    fetchCampaigns();
    // eslint-disable-next-line
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
        `http://campain-2.onrender.com/api/campaign/${id}/analytics`,
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
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">All Campaigns</h1>

      {error && <p className="text-red-500">{error}</p>}

      <input
        type="text"
        placeholder="Search campaigns..."
        className="mb-4 p-3 w-full rounded bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampaigns.map((campaign) => (
          <div
            key={campaign._id}
            className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 p-5 rounded-xl shadow"
            onClick={() => updateAnalytics(campaign._id, "click")} // Increment clicks on click
          >
            <h2 className="text-xl font-semibold mb-2">{campaign.title}</h2>
            <p className="text-sm text-gray-500 mb-4">{campaign.description}</p>
            <p className="text-sm text-gray-400">
              Budget: ${campaign.objective}
            </p>
            <p className="text-sm text-gray-400">Clicks: {campaign.clicks}</p>
            <p className="text-sm text-gray-400">
              Conversions: {campaign.conversions}
            </p>
            <button
              onClick={() => handleDelete(campaign._id)}
              className="mt-auto px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
            >
              Delete
            </button>
            <button
              onClick={() => navigate(`/campaign/${campaign._id}`)} // Navigate to campaign details
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
