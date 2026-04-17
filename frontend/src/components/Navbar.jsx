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
      <nav className="app-navbar">
        <div className="app-navbar-left">
          <img src="/assets/logo.png" alt="College Logo" className="app-logo" />
          <h2 className="app-logo-text">DYP-AttendX</h2>
        </div>

        <div className="app-navbar-right">
          {role === "admin" && (
            <Link className="app-nav-link" to="/admin">
              Admin Dashboard
            </Link>
          )}

          {role === "teacher" && (
            <Link className="app-nav-link" to="/teacher">
              Teacher Dashboard
            </Link>
          )}

          {role === "student" && (
            <Link className="app-nav-link" to="/student">
              Student Dashboard
            </Link>
          )}

          <FaUserCircle
            size={26}
            className="app-profile-icon"
            onClick={() => setShowProfile(true)}
            aria-label="Open profile panel"
            role="button"
          />

          <button className="app-logout-btn" onClick={handleLogout}>
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

export default Navbar;