import { useState } from "react";
import axios from "axios";

const EmailCampaign = () => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");

  const handleSend = async () => {
    try {
      const res = await axios.post("/api/email/send-email", {
        to,
        subject,
        text,
      });
      alert("Email sent!");
    } catch (err) {
      console.error(err);
      alert("Error sending email");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <input
        type="email"
        placeholder="To"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        className="w-full mb-2"
      />
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="w-full mb-2"
      />
      <textarea
        placeholder="Text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full mb-2"
      />
      <button
        onClick={handleSend}
        className="bg-purple-500 text-white px-4 py-2 rounded"
      >
        Send Email
      </button>
    </div>
  );
};

export default EmailCampaign;
