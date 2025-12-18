import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";
import { useSignup } from "../hooks/useAuth";

const Signup = () => {
  const [formData, setFormData] = useState({ email: "", username: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const signupMutation = useSignup(setErrorMsg, setSuccessMsg);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!formData.email || !formData.username || !formData.password) {
      setErrorMsg("Please fill all fields");
      return;
    }

    signupMutation.mutate(formData);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Admin Create Account</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button className="btn" type="submit">
            {signupMutation.isLoading ? "Signing up..." : "Signup"}
          </button>
        </form>

        {/* Inline messages */}
        {errorMsg && <p style={{ color: "red", marginTop: "10px" }}>{errorMsg}</p>}
        {successMsg && <p style={{ color: "green", marginTop: "10px" }}>{successMsg}</p>}

        <p className="auth-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
