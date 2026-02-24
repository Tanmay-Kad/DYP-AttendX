import { useState } from "react";
import axios from "axios";

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
    <div style={{ padding: "40px" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <br />
        <div>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <br />
        <button type="submit">Login</button>
        <p>
          Don't have an account? <a href="/register">Register</a>
        </p>
      </form>
    </div>
  );
}

export default Login;