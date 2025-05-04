import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const CampaignCalendar = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCalendarData();
  }, []);

  const fetchCalendarData = async () => {
    try {
      const res = await fetch(
        "https://campain-2.onrender.com/api/campaigns/calendar",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.msg || "Failed to fetch calendar data");
        return;
      }

      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Error fetching calendar data:", err);
      setError("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Campaign Calendar</h1>

      {error && <p className="text-red-500">{error}</p>}

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        className="bg-white dark:bg-neutral-900 text-black dark:text-white"
      />
    </div>
  );
};

export default CampaignCalendar;
