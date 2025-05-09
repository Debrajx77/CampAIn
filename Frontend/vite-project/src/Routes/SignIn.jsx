import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("https://campain-2.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black pt-16">
      <form
        onSubmit={handleLogin}
        className="bg-neutral-900 p-8 rounded-xl shadow-lg border border-neutral-800 w-full max-w-sm"
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Sign In
        </h2>
        {error && <div className="mb-4 text-red-400 text-center">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          className="mb-4 w-full p-3 rounded bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-6 w-full p-3 rounded bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full py-3 rounded bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-black text-white font-semibold transition"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}

export default SignIn;
