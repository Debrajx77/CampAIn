import { useState } from "react";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Send } from "lucide-react";

const EmailCampaign = () => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleSend = async () => {
    setLoading(true);
    setSuccess(null);
    try {
      await axios.post("/api/email/send-email", { to, subject, text });
      setSuccess("Email sent successfully!");
      setTo("");
      setSubject("");
      setText("");
    } catch (err) {
      console.error(err);
      setSuccess("Failed to send email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-xl bg-[#1a1a1a] border border-[#2a2a2a] shadow-lg">
        <CardContent className="space-y-4 p-6">
          <h2 className="text-2xl font-bold text-center">📧 Email Campaign</h2>

          <Input
            type="email"
            placeholder="Recipient Email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="bg-[#121212] text-white border-[#333] focus:ring-purple-500"
          />

          <Input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="bg-[#121212] text-white border-[#333] focus:ring-purple-500"
          />

          <Textarea
            placeholder="Your message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            className="bg-[#121212] text-white border-[#333] focus:ring-purple-500"
          />

          <div className="flex items-center justify-between">
            <Button
              onClick={handleSend}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {loading ? "Sending..." : "Send Email"}
            </Button>

            {success && (
              <span className="text-sm text-gray-400">{success}</span>
            )}
          </div>

          <div className="text-xs text-gray-500 text-center pt-4">
            Ensure your SMTP settings are correctly configured.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailCampaign;
