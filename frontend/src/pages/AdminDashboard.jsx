import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function AdminDashboard() {

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };
  

  const [totalStudents, setTotalStudents] = useState(0);
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


const fetchStudents = async () => {
  try {
    const res = await api.get("/users/students");
    setTotalStudents(res.data.length);
  } catch (error) {
    console.error("Error fetching students");
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
    fetchStudents();
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
    <div className="container">
      <h1>Admin Dashboard</h1>




      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Departments</h3>
          <h2>{departments.length}</h2>
        </div>

        <div className="stat-card">
          <h3>Teachers</h3>
          <h2>{approvedTeachers.length}</h2>
        </div>

        <div className="stat-card">
          <h3>Students</h3>
          <h2>{totalStudents}</h2>
        </div>

        <div className="stat-card">
          <h3>Subjects</h3>
          <h2>{subjects.length}</h2>
        </div>
      </div>





      {/* ================= DEPARTMENT ================= */}
      <div className="card">
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

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Code</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept._id}>
                <td>{dept.name}</td>
                <td>{dept.code}</td>
                <td>
                  <button
                    className="btn-danger"
                    onClick={() => deleteDepartment(dept._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= YEAR ================= */}
      <div className="card">
        <h2>Create Year</h2>
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

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Order</th>
            </tr>
          </thead>
          <tbody>
            {years.map((year) => (
              <tr key={year._id}>
                <td>{year.name}</td>
                <td>{year.order}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= DIVISION ================= */}
      <div className="card">
        <h2>Create Division</h2>
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

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Year</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {divisions.map((div) => (
              <tr key={div._id}>
                <td>{div.name}</td>
                <td>{div.department?.name}</td>
                <td>{div.year?.name}</td>
                <td>
                  <button
                    className="btn-danger"
                    onClick={() => deleteDivision(div._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= SUBJECT ================= */}
      <div className="card">
        <h2>Create Subject</h2>
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
                {div.department?.code} - {div.year?.name} - {div.name}
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

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Teacher</th>
              <th>Division</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((sub) => (
              <tr key={sub._id}>
                <td>{sub.name}</td>
                <td>{sub.teacher?.name}</td>
                <td>{sub.division?.department?.code} — {sub.division?.year?.name} — {sub.division?.name}</td>
                <td>
                  <button
                    className="btn-danger"
                    onClick={() => deleteSubject(sub._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= TEACHERS ================= */}
      <div className="card">
        <h2>Pending Teachers</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingTeachers.map((teacher) => (
              <tr key={teacher._id}>
                <td>{teacher.name}</td>
                <td>{teacher.email}</td>
                <td>
                  <button
                    className="btn-success"
                    onClick={() => approveTeacher(teacher._id)}
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>Approved Teachers</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {approvedTeachers.map((teacher) => (
              <tr key={teacher._id}>
                <td>{teacher.name}</td>
                <td>{teacher.email}</td>
                <td>
                  <button
                    className="btn-danger"
                    onClick={() => removeTeacher(teacher._id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <footer style={{ textAlign: "center", padding: "15px", color: "#777" }}>
        © 2026 DYP-AttendX | Developed by Tanmay Kad
      </footer>
    </div>
  </>
);
}

export default AdminDashboard;