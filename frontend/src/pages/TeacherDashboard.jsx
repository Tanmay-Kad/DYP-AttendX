import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function TeacherDashboard() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [attendanceData, setAttendanceData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const [defaulters, setDefaulters] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [sessionDetails, setSessionDetails] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [editableStudents, setEditableStudents] = useState([]);

  // ================= FETCH SUBJECTS =================
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

  // ================= START ATTENDANCE =================
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

  // ================= FETCH DEFAULTERS =================
  const fetchDefaulters = async (subjectId) => {
    try {
      const res = await api.get(`/attendance/defaulters/${subjectId}`);
      setDefaulters(res.data);
    } catch (error) {
      alert("Error fetching defaulters");
    }
  };

  // ================= FETCH SESSIONS =================
  const fetchSessions = async (subjectId) => {
    try {
      const res = await api.get(`/attendance/subject/${subjectId}`);
      setSessions(res.data);
      setSessionDetails(null);
      setEditMode(false);
    } catch (error) {
      alert("Error fetching session history");
    }
  };

  // ================= FETCH SESSION DETAILS =================
  const fetchSessionDetails = async (sessionId) => {
    try {
      const res = await api.get(`/attendance/session-details/${sessionId}`);
      setSessionDetails(res.data);
      setEditableStudents(res.data.students);
      setEditMode(false);
    } catch (error) {
      alert("Error fetching session details");
    }
  };

  // ================= TOGGLE STATUS =================
  const toggleStatus = (studentId) => {
    setEditableStudents((prev) =>
      prev.map((student) =>
        student._id === studentId
          ? {
              ...student,
              status:
                student.status === "Present" ? "Absent" : "Present",
            }
          : student
      )
    );
  };

  // ================= SAVE UPDATED ATTENDANCE =================
  const saveAttendanceChanges = async () => {
    try {
      await api.put(
        `/attendance/update-session/${sessionDetails.sessionId}`,
        {
          updatedStudents: editableStudents.map((s) => ({
            studentId: s._id,
            status: s.status,
          })),
        }
      );

      alert("Attendance updated successfully");
      setEditMode(false);
      fetchSessionDetails(sessionDetails.sessionId);

    } catch (error) {
      alert("Error updating attendance");
    }
  };

  // ================= DOWNLOAD CSV =================
  const downloadCSV = async (subjectId) => {
    try {
      const response = await api.get(
        `/attendance/export/${subjectId}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "attendance_report.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (error) {
      alert("Error downloading CSV");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Teacher Dashboard</h1>

        {/* START ATTENDANCE */}
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
              <p><strong>Time Left:</strong> {timeLeft} seconds</p>
            </div>
          )}
        </div>

        {/* SESSION HISTORY */}
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
                <button
                  style={{ marginLeft: "10px" }}
                  onClick={() => downloadCSV(sub._id)}
                >
                  Download CSV
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
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session) => (
                    <tr key={session._id}>
                      <td>{new Date(session.createdAt).toLocaleDateString()}</td>
                      <td>{new Date(session.createdAt).toLocaleTimeString()}</td>
                      <td>{session.studentsPresent.length}</td>
                      <td>
                        <button
                          onClick={() => fetchSessionDetails(session._id)}
                        >
                          View Students
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* SESSION DETAILS WITH EDIT MODE */}
          {sessionDetails && (
            <div className="card">
              <h3>
                Session Details -{" "}
                {new Date(sessionDetails.sessionDate).toLocaleString()}
              </h3>

              <button onClick={() => setEditMode(!editMode)}>
                {editMode ? "Cancel Edit" : "Edit Attendance"}
              </button>

              {editMode && (
                <button
                  onClick={saveAttendanceChanges}
                  style={{
                    marginLeft: "10px",
                    backgroundColor: "green",
                    color: "white",
                  }}
                >
                  Save Changes
                </button>
              )}

              <table border="1" cellPadding="8">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(editMode ? editableStudents : sessionDetails.students).map(
                    (student) => (
                      <tr key={student._id}>
                        <td>{student.name}</td>
                        <td>{student.email}</td>
                        <td
                          onClick={() =>
                            editMode && toggleStatus(student._id)
                          }
                          style={{
                            cursor: editMode ? "pointer" : "default",
                            color:
                              student.status === "Present"
                                ? "green"
                                : "red",
                            fontWeight: "bold",
                          }}
                        >
                          {student.status}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default TeacherDashboard;