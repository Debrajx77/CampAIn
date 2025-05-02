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

    try {
      const res = await fetch("http://localhost:5000/api/create-campaign", {
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
      });

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
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex items-center justify-center px-4 py-6">
      <form
        onSubmit={handleCreateCampaign}
        className="bg-neutral-100 dark:bg-neutral-900 p-8 rounded-xl max-w-lg w-full shadow-lg border border-neutral-300 dark:border-neutral-800"
      >
        <h2 className="text-3xl font-semibold mb-6 text-black dark:text-white text-center">
          Create Campaign
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="text"
          placeholder="Campaign Name"
          className="mb-4 p-3 w-full rounded bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          className="mb-4 p-3 w-full rounded bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>

        <input
          type="number"
          placeholder="Budget"
          className="mb-4 p-3 w-full rounded bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          required
        />

        <input
          type="datetime-local"
          placeholder="Start Date"
          className="mb-4 p-3 w-full rounded bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <input
          type="datetime-local"
          placeholder="End Date"
          className="mb-4 p-3 w-full rounded bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <button
          type="submit"
          className="w-full py-3 rounded bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white transition"
        >
          Create Campaign
        </button>
      </form>
    </div>
  );
}

export default CreateCampaign;
