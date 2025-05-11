import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const apiUrl = "https://campain-b2rr.onrender.com/api/auth/login"; // Directly use the API URL

    try {
      const res = await fetch(`${apiUrl}/login`, {
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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to bottom, #0f172a, #1e293b)",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          backgroundColor: "#111",
          padding: "2rem",
          borderRadius: "1rem",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h2
          style={{
            fontSize: "1.8rem",
            fontWeight: "bold",
            color: "#fff",
            marginBottom: "1.5rem",
            textAlign: "center",
          }}
        >
          Sign In
        </h2>

        {error && (
          <div
            style={{
              marginBottom: "1rem",
              color: "#f87171",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "0.75rem",
            marginBottom: "1rem",
            borderRadius: "0.5rem",
            backgroundColor: "#1e293b",
            border: "1px solid #334155",
            color: "#fff",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "0.75rem",
            marginBottom: "1.5rem",
            borderRadius: "0.5rem",
            backgroundColor: "#1e293b",
            border: "1px solid #334155",
            color: "#fff",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "0.75rem",
            background: "linear-gradient(to right, #3b82f6, #1e40af)",
            color: "#fff",
            border: "none",
            borderRadius: "0.5rem",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Sign In
        </button>

        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <p style={{ color: "#94a3b8" }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "#60a5fa", fontWeight: "bold" }}>
              Create one
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default SignIn;
