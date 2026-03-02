import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import ProfilePanel from "./ProfilePanel";

function Navbar() {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <>
      <nav style={styles.navbar}>
        <div style={styles.left}>
          <img
            src="/assets/logo.png"
            alt="College Logo"
            style={styles.logoImg}
          />
          <h2 style={styles.logoText}>DYP-AttendX</h2>
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

          {/* Profile Icon */}
          <FaUserCircle
            size={26}
            style={styles.profileIcon}
            onClick={() => setShowProfile(true)}
          />

          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {showProfile && (
        <ProfilePanel onClose={() => setShowProfile(false)} />
      )}
    </>
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
    position: "sticky",
    top: 0,
    zIndex: 1000,
    boxShadow: "0 2px 8px rgba(0,0,0,50.15)",
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoImg: {
    height: "40px",
    borderRadius: "2px",
  },
  logoText: {
    margin: 0,
    fontWeight: "bold",
    letterSpacing: "1px",
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
  profileIcon: {
    cursor: "pointer",
  },
  logoutBtn: {
    backgroundColor: "white",
    color: "#1976d2",
    border: "none",
    padding: "6px 12px",
    cursor: "pointer",
    fontWeight: "bold",
    borderRadius: "6px",
  },
};

export default Navbar;