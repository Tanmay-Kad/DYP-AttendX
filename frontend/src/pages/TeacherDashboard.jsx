import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { useToast } from "../components/ToastContext";
import { useConfirm } from "../components/ConfirmContext";

function TeacherDashboard() {
  const { showToast } = useToast();
  const { confirm } = useConfirm();

  const [totalSessions, setTotalSessions] = useState(0);
  const [totalDefaulters, setTotalDefaulters] = useState(0);
  const [selectedHistorySubject, setSelectedHistorySubject] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [attendanceData, setAttendanceData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedDefaulterSubject, setSelectedDefaulterSubject] = useState("");
  const [defaulterList, setDefaulterList] = useState([]);

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

      // Calculate total sessions and total defaulters
let sessionCount = 0;
let defaulterSet = new Set(); // To avoid duplicates

for (let sub of mySubjects) {
  try {
    // Count sessions
    const sessionRes = await api.get(`/attendance/subject/${sub._id}`);
    sessionCount += sessionRes.data.length;

    // Get defaulters
    const defaulterRes = await api.get(`/attendance/defaulters/${sub._id}`);

    defaulterRes.data.forEach((d) => {
      defaulterSet.add(d.student._id);
    });

  } catch (error) {
    console.error("Error calculating stats");
  }
}

setTotalSessions(sessionCount);
setTotalDefaulters(defaulterSet.size);

setTotalSessions(sessionCount);
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
      showToast(error.response?.data?.message || "Error starting attendance", "error");
    }
  };

  // ================= FETCH DEFAULTERS =================
  const fetchDefaulters = async (subjectId) => {
    try {
      const res = await api.get(`/attendance/defaulters/${subjectId}`);
      setDefaulters(res.data);
    } catch (error) {
      showToast("Error fetching defaulters", "error");
    }
  };

  // ================= FETCH SESSIONS =================
  const fetchSessions = async (subjectId) => {
  if (selectedHistorySubject === subjectId && sessions.length > 0) {
    setSessions([]);
    setSessionDetails(null);
    setEditMode(false);
    setSelectedHistorySubject("");
    return;
  }

  try {
    const res = await api.get(`/attendance/subject/${subjectId}`);
    setSessions(res.data);
    setSessionDetails(null);
    setEditMode(false);
    setSelectedHistorySubject(subjectId);
  } catch (error) {
    showToast("Error fetching session history", "error");
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
      showToast("Error fetching session details", "error");
    }
  };





  const fetchSubjectDefaulters = async (subjectId) => {
  if (selectedDefaulterSubject === subjectId && defaulterList.length > 0) {
    setDefaulterList([]);
    setSelectedDefaulterSubject("");
    return;
  }

  try {
    const res = await api.get(`/attendance/defaulters/${subjectId}`);
    setDefaulterList(res.data);
    setSelectedDefaulterSubject(subjectId);
  } catch (error) {
    showToast("Error fetching defaulters", "error");
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

      showToast("Attendance updated successfully", "success");
      setEditMode(false);
      fetchSessionDetails(sessionDetails.sessionId);

    } catch (error) {
      showToast("Error updating attendance", "error");
    }
  };



  const deleteSession = async (sessionId) => {
  const confirmDelete = await confirm({
    title: "Delete Session",
    message: "Are you sure you want to delete this session?",
    confirmText: "Delete",
    cancelText: "Cancel",
  });

  if (!confirmDelete) return;

  try {
    await api.delete(`/attendance/session/${sessionId}`);

    showToast("Session deleted successfully", "success");

    // Refresh sessions
    setSessionDetails(null);
    setEditMode(false);

    // Re-fetch sessions of selected subject
    fetchSessions(selectedHistorySubject);

  } catch (error) {
    showToast("Error deleting session", "error");
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
      showToast("Error downloading CSV", "error");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Teacher Dashboard</h1>


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
          <h3>Defaulters</h3>
          <h2>{totalDefaulters}</h2>
        </div>
      </div>



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
          <p className="section-subtext">Pick a subject to view session history or export attendance.</p>
          <div className="subject-action-grid">
            {subjects.map((sub) => (
              <div className="subject-action-card" key={sub._id}>
                <div className="subject-action-title">{sub.name}</div>
                <div className="subject-action-meta">{sub.division?.name || "Division not assigned"}</div>
                <div className="subject-action-buttons">
                  <button onClick={() => fetchSessions(sub._id)}>View Sessions</button>
                  <button className="btn-success" onClick={() => downloadCSV(sub._id)}>
                    Download CSV
                  </button>
                </div>
              </div>
            ))}
          </div>

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

                        <button
                          className="btn-danger ml-8"
                          onClick={() => deleteSession(session._id)}
                        >
                          Delete
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
                  className="btn-success ml-10"
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
                          className={`${student.status === "Present" ? "text-success" : "text-danger"} bold ${editMode ? "clickable" : ""}`}
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

        {/* ================= DEFAULTERS SECTION ================= */}
          <div className="card">
            <h2>Defaulters</h2>
            <p className="section-subtext">Quickly check students below attendance threshold by subject.</p>
            <div className="subject-action-grid">
              {subjects.map((sub) => (
                <div className="subject-action-card" key={sub._id}>
                  <div className="subject-action-title">{sub.name}</div>
                  <div className="subject-action-meta">{sub.division?.name || "Division not assigned"}</div>
                  <div className="subject-action-buttons">
                    <button onClick={() => fetchSubjectDefaulters(sub._id)}>
                      View Defaulters
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {defaulterList.length > 0 && (
              <div className="card mt-15">
                <h3>Defaulter List</h3>

                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Attendance %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {defaulterList.map((d, index) => (
                      <tr key={index}>
                        <td>{d.student.name}</td>
                        <td>{d.student.email}</td>
                        <td className="text-danger bold">
                          {d.percentage}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        <footer>
          © 2026 DYP-AttendX | Developed by Tanmay Kad
        </footer>
      </div>
    </>
  );
}

export default TeacherDashboard;