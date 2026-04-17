import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useToast } from "../components/ToastContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { showToast } = useToast();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", {
            email,
            password,
            });

            // Save token + role
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.role);

            showToast("Login successful", "success");

            // Redirect based on role
            if (res.data.role === "admin") {
            window.location.href = "/admin";
            } else if (res.data.role === "teacher") {
            window.location.href = "/teacher";
            } else {
            window.location.href = "/student";
            }

        } catch (error) {
            showToast(error.response?.data?.message || "Login failed", "error");
        }
    };

  return (
    <div className="auth-container login-theme">
      <div className="auth-card login-card">
        <p className="auth-eyebrow login-eyebrow">Smart Attendance Platform</p>
        <h2>Welcome Back</h2>
        <p className="auth-subtext login-subtext">Sign in to continue to DYP-AttendX</p>
        <img className="auth-logo login-logo" src="/assets/logo.png" alt="DYP-AttendX logo" />
        <form className="auth-form login-form" onSubmit={handleLogin}>
          <input
            className="auth-field login-field"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="auth-field login-field"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="auth-btn login-btn" type="submit">Login</button>
        </form>

        <div className="auth-footer login-footer">
          Don’t have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;