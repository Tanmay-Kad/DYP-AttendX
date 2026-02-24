import { useEffect, useState } from "react";
import api from "../services/api";

function StudentDashboard() {
  const [subjects, setSubjects] = useState([]);
  const [attendanceData, setAttendanceData] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        // 1️⃣ Get logged-in student info
        const userRes = await api.get("/auth/me");
        const divisionId = userRes.data.division;

        // 2️⃣ Get all subjects
        const subjectRes = await api.get("/subjects");

        // 3️⃣ Filter subjects by student division
        const mySubjects = subjectRes.data.filter(
          (sub) => sub.division?._id === divisionId
        );

        setSubjects(mySubjects);
      } catch (error) {
        console.error("Error loading student dashboard");
      }
    };

    init();
  }, []);

  const fetchAttendance = async (subjectId) => {
    try {
      const res = await api.get(`/attendance/report/${subjectId}`);
      setAttendanceData(res.data);
    } catch (error) {
      alert("Error fetching attendance");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Student Dashboard</h1>

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
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            border: "1px solid black",
            borderRadius: "8px",
            maxWidth: "400px"
          }}
        >
          <h3>Attendance Details</h3>

          <p>
            <strong>Total Sessions:</strong>{" "}
            {attendanceData.totalSessions}
          </p>

          <p>
            <strong>Present Sessions:</strong>{" "}
            {attendanceData.presentSessions}
          </p>

          <p
            style={{
              color:
                attendanceData.percentage < 75
                  ? "red"
                  : "green",
              fontWeight: "bold"
            }}
          >
            Attendance: {attendanceData.percentage}%
          </p>
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;