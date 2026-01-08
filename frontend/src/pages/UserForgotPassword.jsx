import { useState } from "react";
import { Link } from "react-router-dom";

export default function UserForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    try {
      const res = await fetch("http://localhost:8000/api/auth/password-reset-request/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to send reset request");
        setMessageType("error");
        return;
      }

      setMessage("Password reset request sent successfully! Please wait for admin approval.");
      setMessageType("success");
      setEmail("");
    } catch (error) {
      setMessage("Network error. Please try again.");
      setMessageType("error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
          Forgot Password
        </h2>

        <p className="text-gray-600 text-sm mb-6 text-center">
          Enter your email address to request a password reset. Once approved by admin, you'll receive a temporary password to login and change your password.
        </p>

        {message && (
          <div className={`mb-4 p-3 rounded-lg border text-sm ${
            messageType === "error" 
              ? "bg-red-50 border-red-200 text-red-700" 
              : "bg-green-50 border-green-200 text-green-700"
          }`}>
            {message}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 border rounded"
          required
        />

        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Send Reset Request
        </button>

        <div className="mt-4 text-center">
          <Link to="/userlogin" className="text-green-600 hover:text-green-800 text-sm">
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
}