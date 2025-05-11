import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://campain-b2rr.onrender.com/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Signup failed");
        return;
      }

      // Token ko localStorage mein save karo
      localStorage.setItem("token", data.token); // JWT token
      navigate("/dashboard"); // Dashboard pe redirect
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <form
        onSubmit={handleSignup}
        className="bg-neutral-900 p-8 rounded-xl max-w-sm w-full shadow border border-neutral-800"
      >
        <h2 className="text-2xl font-semibold mb-6 text-white text-center">
          Sign Up
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="text"
          placeholder="Name"
          className="mb-4 p-3 w-full rounded bg-neutral-800 border border-neutral-700 text-white"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="mb-4 p-3 w-full rounded bg-neutral-800 border border-neutral-700 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="mb-6 p-3 w-full rounded bg-neutral-800 border border-neutral-700 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full py-3 rounded bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black transition"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignUp;
