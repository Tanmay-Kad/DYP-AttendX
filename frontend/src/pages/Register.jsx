import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { useToast } from "../components/ToastContext";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");
  const { showToast } = useToast();

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

      showToast("Registration successful", "success");

      setName("");
      setEmail("");
      setPassword("");
      setSelectedDivision("");
    } catch (error) {
      showToast(error.response?.data?.message || "Registration failed", "error");
    }
  };

  return (
    <div className="auth-container register-theme">
      <div className="auth-card register-card">
        <p className="auth-eyebrow register-eyebrow">Join The Platform</p>
        <h2>Create Account</h2>
        <p className="auth-subtext register-subtext">Set up your profile to start managing attendance</p>

        <form className="auth-form register-form" onSubmit={handleRegister}>
          <input
            className="auth-field register-field"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            className="auth-field register-field"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="auth-field register-field"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <select
            className="auth-field register-field"
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
              className="auth-field register-field"
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

          <button className="auth-btn register-btn" type="submit">Register</button>
        </form>

        <div className="auth-footer register-footer">
          Already have an account? <Link to="/">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;