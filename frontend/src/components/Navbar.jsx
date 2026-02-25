import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.left}>
        <h2 style={styles.logo}>DYP-AttendX</h2>
      </div>

      <div style={styles.right}>
        {role === "admin" && (
          <Link style={styles.link} to="/admin">
            Admin Dashboard
          </Link>
        )}

        {role === "teacher" && (
          <Link style={styles.link} to="/teacher">
            Teacher Dashboard
          </Link>
        )}

        {role === "student" && (
          <Link style={styles.link} to="/student">
            Student Dashboard
          </Link>
        )}

        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    backgroundColor: "#1976d2",
    color: "white",
  },
  left: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    margin: 0,
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: "500",
  },
  logoutBtn: {
    backgroundColor: "white",
    color: "#1976d2",
    border: "none",
    padding: "6px 12px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Navbar;