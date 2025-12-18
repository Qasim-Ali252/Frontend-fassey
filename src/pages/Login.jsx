import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { useLogin } from "../hooks/useAuth";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  // Persistent login
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const loginMutation = useLogin(setErrorMsg);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!credentials.email || !credentials.password) {
      setErrorMsg("Please fill all fields");
      return;
    }

    loginMutation.mutate(credentials);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Admin Login</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={credentials.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
          <button className="btn" type="submit">
            {loginMutation.isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Inline error messages */}
        {errorMsg && <p style={{ color: "red", marginTop: "10px" }}>{errorMsg}</p>}

        <p className="auth-text">
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
