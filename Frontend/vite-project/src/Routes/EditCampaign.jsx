import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditCampaign() {
  const { id } = useParams(); // Extract campaign id from URL
  const navigate = useNavigate(); // Hook to navigate after successful edit

  const [campaignName, setCampaignName] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        const res = await fetch(
          `https://campain-2.onrender.com/api/campaign/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setError(data.msg || "Failed to fetch campaign data");
        } else {
          setCampaignName(data.campaign.title);
          setDescription(data.campaign.description);
          setBudget(data.campaign.objective);
        }
      } catch (err) {
        console.error(err);
        setError("Server error");
      }
    };

    fetchCampaignData();
  }, [id]);

  const handleEditCampaign = async (e) => {
    e.preventDefault();

    if (!campaignName || !description || !budget) {
      setError("All fields are required");
      return;
    }

    try {
      const res = await fetch(
        `https://campain-2.onrender.com/api/campaign/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            title: campaignName,
            description,
            objective: budget,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Campaign update failed");
      } else {
        alert("Campaign updated successfully");
        navigate("/campaigns"); // Redirect to the list of campaigns after successful update
      }
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-6">
      <form
        onSubmit={handleEditCampaign}
        className="bg-neutral-900 p-8 rounded-xl max-w-lg w-full shadow-lg border border-neutral-800"
      >
        <h2 className="text-3xl font-semibold mb-6 text-white text-center">
          Edit Campaign
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="text"
          placeholder="Campaign Name"
          className="mb-4 p-3 w-full rounded bg-neutral-800 border border-neutral-700 text-white"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          className="mb-4 p-3 w-full rounded bg-neutral-800 border border-neutral-700 text-white"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>

        <input
          type="number"
          placeholder="Budget"
          className="mb-4 p-3 w-full rounded bg-neutral-800 border border-neutral-700 text-white"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full py-3 rounded bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black transition"
        >
          Update Campaign
        </button>
      </form>
    </div>
  );
}

export default EditCampaign;
