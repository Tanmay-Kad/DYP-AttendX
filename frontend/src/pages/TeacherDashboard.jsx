import { useEffect, useState } from "react";
import api from "../services/api";

function TeacherDashboard() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  const [sessions, setSessions] = useState([]);
  const [selectedHistorySubject, setSelectedHistorySubject] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [attendanceData, setAttendanceData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [defaulters, setDefaulters] = useState([]);

  // Fetch teacher subjects
  const fetchSubjects = async () => {
    try {
      const res = await api.get("/subjects");

      const token = localStorage.getItem("token");
      const payload = JSON.parse(atob(token.split(".")[1]));
      const teacherId = payload.id;

      const mySubjects = res.data.filter(
        (sub) => sub.teacher?._id === teacherId
      );

      setSubjects(mySubjects);
    } catch (error) {
      console.error("Error fetching subjects");
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Start Attendance
  const handleStartAttendance = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/attendance/start", {
        subjectId: selectedSubject,
      });

      setAttendanceData(res.data);

      const expiryTime = new Date(res.data.expiresAt).getTime();

      const interval = setInterval(() => {
        const now = new Date().getTime();
        const difference = Math.floor((expiryTime - now) / 1000);

        if (difference <= 0) {
          clearInterval(interval);
          setTimeLeft(0);
        } else {
          setTimeLeft(difference);
        }
      }, 1000);
    } catch (error) {
      alert(error.response?.data?.message || "Error starting attendance");
    }
  };

  // Fetch Defaulters
  const fetchDefaulters = async (subjectId) => {
    try {
      const res = await api.get(`/attendance/defaulters/${subjectId}`);
      setDefaulters(res.data);
    } catch (error) {
      alert("Error fetching defaulters");
    }
  };


  const fetchSessions = async (subjectId) => {
  try {
    const res = await api.get(`/attendance/subject/${subjectId}`);
    setSessions(res.data);
    setSelectedHistorySubject(subjectId);
  } catch (error) {
    alert("Error fetching session history");
  }
};


  return (
    <div className="container">
      <h1>Teacher Dashboard</h1>

      <button onClick={handleLogout}>Logout</button>

      {/* ================= START ATTENDANCE ================= */}
      <div className="card">
        <h2>Start Attendance</h2>

        <form onSubmit={handleStartAttendance}>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            required
          >
            <option value="">Select Subject</option>
            {subjects.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name} — {sub.division?.name}
              </option>
            ))}
          </select>

          <button type="submit">Start</button>
        </form>

        {attendanceData && (
          <div className="card">
            <h3>Attendance Started ✅</h3>
            <p><strong>OTP:</strong> {attendanceData.otp}</p>
            <p><strong>Session ID:</strong> {attendanceData.sessionId}</p>
            <p>
              <strong>Expires At:</strong>{" "}
              {new Date(attendanceData.expiresAt).toLocaleTimeString()}
            </p>
            <p><strong>Time Left:</strong> {timeLeft} seconds</p>
          </div>
        )}
      </div>

      {/* ================= DEFAULTER SECTION ================= */}
      <div className="card">
        <h2>View Defaulters</h2>

        <ul>
          {subjects.map((sub) => (
            <li key={sub._id}>
              {sub.name}
              <button onClick={() => fetchDefaulters(sub._id)}>
                View Defaulters
              </button>
            </li>
          ))}
        </ul>

        {Array.isArray(defaulters) && defaulters.length > 0 && (
          <div className="card">
            <h3>Defaulter List</h3>
            <ul>
              {defaulters.map((d, index) => (
                <li key={index} style={{ color: "red" }}>
                  {d.student.name} — {d.percentage}%
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ================= SESSION HISTORY ================= */}
      <div className="card">
        <h2>Attendance History</h2>

        <ul>
          {subjects.map((sub) => (
            <li key={sub._id}>
              {sub.name}
              <button
                style={{ marginLeft: "10px" }}
                onClick={() => fetchSessions(sub._id)}
              >
                View Sessions
              </button>
            </li>
          ))}
        </ul>

        {sessions.length > 0 && (
          <div className="card">
            <h3>Session List</h3>

            <table border="1" cellPadding="8">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Students Present</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session._id}>
                    <td>
                      {new Date(session.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      {new Date(session.createdAt).toLocaleTimeString()}
                    </td>
                    <td>{session.studentsPresent.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherDashboard;