import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function StudentDashboard() {

  const [totalSessions, setTotalSessions] = useState(0);
  const [overallPercentage, setOverallPercentage] = useState(0);
  const [subjects, setSubjects] = useState([]);
  const [attendanceData, setAttendanceData] = useState(null);

  const [sessionId, setSessionId] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        // Get logged-in student info
        const userRes = await api.get("/auth/me");
        const divisionId = userRes.data.division;

        // Get all subjects
        const subjectRes = await api.get("/subjects");

        // Filter subjects by student division
        const mySubjects = subjectRes.data.filter(
          (sub) => sub.division?._id === divisionId
        );

        setSubjects(mySubjects);



        let sessionCount = 0;
        let totalPresent = 0;

        for (let sub of mySubjects) {
          try {
            const res = await api.get(`/attendance/report/${sub._id}`);

            sessionCount += res.data.totalSessions;
            totalPresent += res.data.presentSessions;

          } catch (error) {
            console.error("Error calculating student stats");
          }
        }

        setTotalSessions(sessionCount);

        const percentage =
          sessionCount === 0
            ? 0
            : ((totalPresent / sessionCount) * 100).toFixed(1);

        setOverallPercentage(percentage);



      } catch (error) {
        console.error("Error loading student dashboard");
      }
    };

    init();
  }, []);

  // Mark Attendance
  const handleMarkAttendance = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/attendance/mark", {
        sessionId,
        otp,
      });

      setMessage(res.data.message);
      setSessionId("");
      setOtp("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Error marking attendance");
    }
  };

  // View Attendance %
  const fetchAttendance = async (subjectId) => {
    try {
      const res = await api.get(`/attendance/report/${subjectId}`);
      setAttendanceData(res.data);
    } catch (error) {
      alert("Error fetching attendance");
    }
  };

  return (
    <>
    <Navbar />
    <div className="container">
      <h1>Student Dashboard</h1>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Subjects</h3>
          <h2>{subjects.length}</h2>
        </div>

        <div className="stat-card">
          <h3>Total Sessions</h3>
          <h2>{totalSessions}</h2>
        </div>

        <div className="stat-card">
          <h3>Overall Attendance</h3>
          <h2 style={{ color: overallPercentage < 75 ? "red" : "#1976d2" }}>
            {overallPercentage}%
          </h2>
        </div>
      </div>

      {/* ================= MARK ATTENDANCE ================= */}
      <div className="card">
        <h2>Mark Attendance</h2>

        <form onSubmit={handleMarkAttendance}>
          <input
            type="text"
            placeholder="Enter Session ID"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <button type="submit">Mark</button>
        </form>

        {message && (
          <p style={{ marginTop: "10px", fontWeight: "bold" }}>
            {message}
          </p>
        )}
      </div>

      {/* ================= VIEW ATTENDANCE ================= */}
      <div className="card">
        <h2>Your Subjects</h2>

        {subjects.length === 0 ? (
          <p>No subjects found</p>
        ) : (
          <ul>
            {subjects.map((sub) => (
              <li key={sub._id} style={{ marginBottom: "10px" }}>
                {sub.name} — {sub.division?.name}
                <button
                  style={{ marginLeft: "10px" }}
                  onClick={() => fetchAttendance(sub._id)}
                >
                  View Attendance
                </button>
              </li>
            ))}
          </ul>
        )}

        {attendanceData && (
          <div className="card">
            <h3>Attendance Summary</h3>

            <p>
              <strong>Total Sessions:</strong> {attendanceData.totalSessions}
            </p>

            <p>
              <strong>Present Sessions:</strong> {attendanceData.presentSessions}
            </p>

            <p
              style={{
                color:
                  attendanceData.percentage < 75
                    ? "red"
                    : "green",
                fontWeight: "bold",
              }}
            >
              Attendance: {attendanceData.percentage}%
            </p>

            <h3 style={{ marginTop: "20px" }}>Attendance History</h3>

            <table border="1" cellPadding="8" style={{ marginTop: "10px" }}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.history.map((item, index) => (
                  <tr key={index}>
                    <td>
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td
                      style={{
                        color: item.status === "Present" ? "green" : "red",
                        fontWeight: "bold"
                      }}
                    >
                      {item.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <footer style={{ textAlign: "center", padding: "15px", color: "#777" }}>
        © 2026 DYP-AttendX | Developed by Tanmay Kad
      </footer>
    </div>
    </>
  );
}

export default StudentDashboard;