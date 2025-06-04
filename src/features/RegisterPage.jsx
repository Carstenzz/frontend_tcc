import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../controller/auth";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const success = await register(username, password);
      if (!success) throw new Error("Registration failed");
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      // Show backend error message if available
      if (err.response && err.response.data && err.response.data.message) {
        setError("Register failed: " + err.response.data.message);
      } else {
        setError("Register failed: " + err.message);
      }
    }
  };

  return (
    <div className="md-container flex flex-col items-center justify-center min-h-screen bg-[var(--color-primary)]">
      <form
        onSubmit={handleRegister}
        className="bg-[var(--color-secondary)] p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h1 className="text-3xl mb-6 text-center text-[var(--color-text)]">
          Register
        </h1>
        {error && <div className="mb-4 text-red-400">{error}</div>}
        {success && <div className="mb-4 text-green-400">{success}</div>}
        <input
          className="w-full mb-4 p-2 rounded bg-[var(--color-tertiary)] text-[var(--color-text)]"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="w-full mb-6 p-2 rounded bg-[var(--color-tertiary)] text-[var(--color-text)]"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="w-full bg-[var(--color-accent)] text-[var(--color-primary)] font-bold py-2 rounded"
          type="submit"
        >
          Register
        </button>
        <div className="mt-4 text-center">
          <span className="text-[var(--color-text)]">
            Already have an account?{" "}
          </span>
          <span
            className="text-[var(--color-accent)] cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </div>
      </form>
    </div>
  );
}
