import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

            alert("Login successful");

            // Redirect based on role
            if (res.data.role === "admin") {
            window.location.href = "/admin";
            } else if (res.data.role === "teacher") {
            window.location.href = "/teacher";
            } else {
            window.location.href = "/student";
            }

        } catch (error) {
            alert(error.response?.data?.message || "Login failed");
        }
    };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>DYP-AttendX</h2>
        <img src="/assets/logo.png" style={{ height: "60px", marginBottom: "10px" }} />
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>

        <div className="auth-footer">
          Don’t have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;