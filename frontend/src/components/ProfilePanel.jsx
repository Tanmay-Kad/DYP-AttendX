import { useEffect, useState } from "react";
import api from "../services/api";
import { FaTimes } from "react-icons/fa";

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

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div
        style={styles.panel}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside panel
      >
        <div style={styles.header}>
          <h2 style={{ margin: 0 }}>My Profile</h2>
          <FaTimes style={styles.closeIcon} onClick={onClose} />
        </div>

        {user ? (
          <div style={styles.content}>
            <div style={styles.avatar}>
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>

          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    right: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "flex-end",
    zIndex: 2000,
  },
  panel: {
    width: "350px",
    background: "linear-gradient(180deg, #ffffff, #e3f2fd)",
    height: "50%",
    padding: "25px",
    boxShadow: "-5px 0px 25px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    borderRadius: "20px",
    animation: "slideIn 0.3s ease-out",
    // color: "white"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },
  closeIcon: {
    cursor: "pointer",
    fontSize: "20px",
    color: "#444",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    fontSize: "15px",
  },
  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #1976d2, #42a5f5)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "20px",
    alignSelf: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  },
};

export default ProfilePanel;