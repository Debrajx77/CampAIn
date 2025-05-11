const handleDelete = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this campaign?"
  );
  if (!confirmed) return;

  try {
    const res = await fetch(
      `https://campain-b2rr.onrender.com/api/campaign/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    let data = {};
    try {
      data = await res.json();
    } catch (parseError) {
      setError("Invalid server response");
      return;
    }

    if (!res.ok) {
      setError(data.msg || "Failed to delete campaign");
      return;
    }

    // Remove the deleted campaign from state
    setCampaigns((prev) => prev.filter((c) => c._id !== id));
  } catch (err) {
    console.error("Error deleting campaign:", err);
    setError("Server error");
  }
};
