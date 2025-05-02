const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this campaign?")) return;
  try {
    const res = await fetch(`http://localhost:5000/api/campaign/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    let data;
    try {
      data = await res.json();
    } catch {
      setError("Server error");
      return;
    }

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
