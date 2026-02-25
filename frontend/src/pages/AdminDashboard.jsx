import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function AdminDashboard() {

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };
  
  const [approvedTeachers, setApprovedTeachers] = useState([]);
  const [pendingTeachers, setPendingTeachers] = useState([]);
  // ================= DEPARTMENT STATE =================
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  // ================= YEAR STATE =================
  const [years, setYears] = useState([]);
  const [yearName, setYearName] = useState("");
  const [order, setOrder] = useState("");

  // ================= DIVISION STATE =================
  const [divisions, setDivisions] = useState([]);
  const [divisionName, setDivisionName] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // ================= SUBJECT STATE =================
  const [subjects, setSubjects] = useState([]);
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");

  // ================= FETCH FUNCTIONS =================
  const fetchDepartments = async () => {
    const res = await api.get("/departments");
    setDepartments(res.data);
  };

  const fetchYears = async () => {
    const res = await api.get("/years");
    setYears(res.data);
  };

  const fetchDivisions = async () => {
    const res = await api.get("/divisions");
    setDivisions(res.data);
  };

  const fetchTeachers = async () => {
    const res = await api.get("/auth/teachers");
    setTeachers(res.data);
  };

  const fetchSubjects = async () => {
    const res = await api.get("/subjects");
    setSubjects(res.data);
  };

  const fetchPendingTeachers = async () => {
  try {
    const res = await api.get("/auth/pending-teachers");
    setPendingTeachers(res.data);
  } catch (error) {
    console.error("Error fetching pending teachers");
  }
};

const fetchApprovedTeachers = async () => {
  try {
    const res = await api.get("/auth/teachers");
    setApprovedTeachers(res.data);
  } catch (error) {
    console.error("Error fetching approved teachers");
  }
};


const removeTeacher = async (teacherId) => {
  try {
    await api.delete(`/auth/delete-teacher/${teacherId}`);
    alert("Teacher removed successfully");

    // Refresh list
    fetchApprovedTeachers();
    fetchPendingTeachers();

  } catch (error) {
    alert("Error removing teacher");
  }
};


const deleteDepartment = async (departmentId) => {
  try {
    await api.delete(`/departments/${departmentId}`);
    alert("Department deleted successfully");

    fetchDepartments(); // refresh list
  } catch (error) {
    alert("Error deleting department");
  }
};



const deleteDivision = async (divisionId) => {
  try {
    await api.delete(`/divisions/${divisionId}`);
    alert("Division deleted successfully");

    fetchDivisions(); // refresh list
  } catch (error) {
    alert("Error deleting division");
  }
};


const deleteSubject = async (subjectId) => {
  try {
    await api.delete(`/subjects/${subjectId}`);
    alert("Subject deleted successfully");

    fetchSubjects(); // refresh list
  } catch (error) {
    alert("Error deleting subject");
  }
};


  useEffect(() => {
    fetchDepartments();
    fetchYears();
    fetchDivisions();
    fetchTeachers();
    fetchSubjects();
    fetchPendingTeachers();
    fetchApprovedTeachers();
  }, []);

  // ================= CREATE FUNCTIONS =================

  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    await api.post("/departments", { name, code });
    setName("");
    setCode("");
    fetchDepartments();
  };

  const handleCreateYear = async (e) => {
    e.preventDefault();
    await api.post("/years", {
      name: yearName,
      order: Number(order),
    });
    setYearName("");
    setOrder("");
    fetchYears();
  };

  const handleCreateDivision = async (e) => {
    e.preventDefault();
    await api.post("/divisions", {
      name: divisionName,
      departmentId: selectedDept,
      yearId: selectedYear,
    });
    setDivisionName("");
    setSelectedDept("");
    setSelectedYear("");
    fetchDivisions();
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    await api.post("/subjects", {
      name: subjectName,
      code: subjectCode,
      divisionId: selectedDivision,
      teacherId: selectedTeacher,
    });

    setSubjectName("");
    setSubjectCode("");
    setSelectedDivision("");
    setSelectedTeacher("");
    fetchSubjects();
  };


  const approveTeacher = async (teacherId) => {
    try {
      await api.put(`/auth/approve-teacher/${teacherId}`);
      alert("Teacher approved successfully");

      // Refresh pending list
      fetchPendingTeachers();

    } catch (error) {
      alert("Error approving teacher");
    }
  };

  return (
    <>
    <Navbar />
    <div style={{ padding: "40px" }}>
      <h1>Admin Dashboard</h1>

      <button
      onClick={handleLogout}
      style={{ marginBottom: "20px" }}
      >
        Logout
      </button>

      {/* ================= DEPARTMENT ================= */}
      <h2>Create Department</h2>
      <form onSubmit={handleCreateDepartment}>
        <input
          type="text"
          placeholder="Department Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Department Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button type="submit">Create</button>
      </form>

      <ul>
        {departments.map((dept) => (
          <li key={dept._id} style={{ marginBottom: "10px" }}>
            {dept.name} ({dept.code})
            <button
              style={{ marginLeft: "10px", backgroundColor: "red" }}
              onClick={() => deleteDepartment(dept._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* ================= YEAR ================= */}
      <h2 style={{ marginTop: "40px" }}>Create Year</h2>
      <form onSubmit={handleCreateYear}>
        <input
          type="text"
          placeholder="Year Name"
          value={yearName}
          onChange={(e) => setYearName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Order"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          required
        />
        <button type="submit">Create</button>
      </form>

      <ul>
        {years.map((year) => (
          <li key={year._id}>
            {year.name} (Order: {year.order})
          </li>
        ))}
      </ul>

      {/* ================= DIVISION ================= */}
      <h2 style={{ marginTop: "40px" }}>Create Division</h2>
      <form onSubmit={handleCreateDivision}>
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          required
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept._id} value={dept._id}>
              {dept.name}
            </option>
          ))}
        </select>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          required
        >
          <option value="">Select Year</option>
          {years.map((year) => (
            <option key={year._id} value={year._id}>
              {year.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Division Name"
          value={divisionName}
          onChange={(e) => setDivisionName(e.target.value)}
          required
        />

        <button type="submit">Create</button>
      </form>

      <ul>
        {divisions.map((div) => (
          <li key={div._id} style={{ marginBottom: "10px" }}>
            {div.name} — {div.department?.name} — {div.year?.name}
            <button
              style={{ marginLeft: "10px", backgroundColor: "red" }}
              onClick={() => deleteDivision(div._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>







      {/* ================= SUBJECT ================= */}
      <h2 style={{ marginTop: "40px" }}>Create Subject</h2>
      <form onSubmit={handleCreateSubject}>
        <input
          type="text"
          placeholder="Subject Name"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Subject Code"
          value={subjectCode}
          onChange={(e) => setSubjectCode(e.target.value)}
          required
        />

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

        <select
          value={selectedTeacher}
          onChange={(e) => setSelectedTeacher(e.target.value)}
          required
        >
          <option value="">Select Teacher</option>
          {teachers.map((teacher) => (
            <option key={teacher._id} value={teacher._id}>
              {teacher.name}
            </option>
          ))}
        </select>

        <button type="submit">Create</button>
      </form>

      <ul>
        {subjects.map((sub) => (
          <li key={sub._id} style={{ marginBottom: "10px" }}>
            {sub.name} — {sub.teacher?.name} — {sub.division?.name}
            <button
              style={{ marginLeft: "10px", backgroundColor: "red" }}
              onClick={() => deleteSubject(sub._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      

            {/* ================= PENDING TEACHERS ================= */}
      <div className="card">
        <h2>Pending Teachers</h2>

        {pendingTeachers.length === 0 ? (
          <p>No pending teachers</p>
        ) : (
          <ul>
            {pendingTeachers.map((teacher) => (
              <li key={teacher._id} style={{ marginBottom: "10px" }}>
                {teacher.name} — {teacher.email}
                <button
                  style={{ marginLeft: "10px" }}
                  onClick={() => approveTeacher(teacher._id)}
                >
                  Approve
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>




      {/* ================= APPROVED TEACHERS ================= */}
      <div className="card">
        <h2>Approved Teachers</h2>

        {approvedTeachers.length === 0 ? (
          <p>No approved teachers</p>
        ) : (
          <ul>
            {approvedTeachers.map((teacher) => (
              <li key={teacher._id} style={{ marginBottom: "10px" }}>
                {teacher.name} — {teacher.email}
                <button
                  style={{ marginLeft: "10px", backgroundColor: "red" }}
                  onClick={() => removeTeacher(teacher._id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>


    </div>
    </>
  );
}

export default AdminDashboard;