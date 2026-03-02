import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");

  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const res = await api.get("/divisions");
        setDivisions(res.data);
      } catch (error) {
        console.error("Error fetching divisions");
      }
    };

    fetchDivisions();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name,
        email,
        password,
        role,
      };

      if (role === "student") {
        payload.division = selectedDivision;
      }

      await api.post("/auth/register", payload);

      alert("Registration successful");

      setName("");
      setEmail("");
      setPassword("");
      setSelectedDivision("");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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

          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setSelectedDivision(""); // reset when role changes
            }}
            required
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>

          {/* ✅ Division dropdown appears only for students */}
          {role === "student" && (
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              required
            >
              <option value="">Select Division</option>
              {divisions.map((div) => (
                <option key={div._id} value={div._id}>
                  {div.department?.code} - {div.year?.name} - {div.name}
                </option>
              ))}
            </select>
          )}

          <button type="submit">Register</button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;