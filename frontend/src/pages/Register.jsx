import { useEffect, useState } from "react";
import api from "../services/api";

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
    <div style={{ padding: "40px" }}>
      <h1>Register</h1>

      <form onSubmit={handleRegister}>
        <div>
          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>

        {role === "student" && (
          <div>
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              required
            >
              <option value="">Select Division</option>
              {divisions.map((div) => (
                <option key={div._id} value={div._id}>
                  {div.name} — {div.department?.name} — {div.year?.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;