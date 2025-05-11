import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateCampaign() {
  const [campaignName, setCampaignName] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCreateCampaign = async (e) => {
    e.preventDefault();

    if (new Date(startDate) > new Date(endDate)) {
      setError("Start date cannot be after end date.");
      return;
    }

    try {
      const res = await fetch(
        "https://campain-b2rr.onrender.com/api/create-campaign",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            title: campaignName,
            description,
            objective: budget,
            startDate,
            endDate,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.msg || "Failed to create campaign");
        return;
      }

      alert("Campaign created successfully!");
      navigate("/campaigns");
    } catch (err) {
      console.error("Error creating campaign:", err);
      setError("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-4 py-8">
      <form
        onSubmit={handleCreateCampaign}
        className="bg-neutral-900 p-8 rounded-2xl shadow-xl w-full max-w-lg border border-neutral-800"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-400">
          🎯 Create Campaign
        </h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Campaign Name"
            className="w-full p-3 rounded bg-neutral-800 border border-neutral-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            required
          />

          <textarea
            placeholder="Description"
            className="w-full p-3 rounded bg-neutral-800 border border-neutral-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            required
          ></textarea>

          <input
            type="number"
            placeholder="Budget ($)"
            className="w-full p-3 rounded bg-neutral-800 border border-neutral-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
          />

          <input
            type="datetime-local"
            className="w-full p-3 rounded bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />

          <input
            type="datetime-local"
            className="w-full p-3 rounded bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full py-3 rounded bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition font-semibold"
          >
            🚀 Create Campaign
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateCampaign;
