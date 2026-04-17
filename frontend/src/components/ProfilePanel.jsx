import { useEffect, useState } from "react";
import api from "../services/api";
import { FaTimes, FaEnvelope, FaUserShield, FaUserGraduate, FaSignOutAlt, FaCalendarCheck } from "react-icons/fa";

function ProfilePanel({ onClose }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching profile");
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div
        className="profile-panel modern-profile"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="profile-header-modern">
          <h2 className="profile-title-modern">Profile Overview</h2>
          <button className="profile-close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {user ? (
          <div className="profile-content-modern">
            <div className="profile-avatar-container">
              <div className="profile-avatar-glow"></div>
              <div className="profile-avatar-modern">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="profile-info-card">
              <h3 className="profile-name-modern">{user.name}</h3>
              <div className={`profile-role-badge ${user.role}`}>
                {user.role === "admin" || user.role === "teacher" ? <FaUserShield /> : <FaUserGraduate />}
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </div>
            </div>

            <div className="profile-details-list">
              <div className="profile-detail-item">
                <div className="detail-icon"><FaEnvelope /></div>
                <div className="detail-text">
                  <span className="detail-label">Email Address : </span>
                  <span className="detail-value">{user.email}</span>
                </div>
              </div>
              <div className="profile-detail-item">
                <div className="detail-icon"><FaCalendarCheck /></div>
                <div className="detail-text">
                  <span className="detail-label">Account Status : </span>
                  <span className="detail-value text-success">Active</span>
                </div>
              </div>
            </div>

            <button className="profile-logout-modern" onClick={handleLogout}>
              <FaSignOutAlt /> Sign Out
            </button>
          </div>
        ) : (
          <div className="profile-loading-modern">
            <div className="profile-spinner"></div>
            <p>Loading profile...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePanel;