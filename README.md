# 🚀 DYP-AttendX – Smart Attendance Management System

DYP-AttendX is a full-stack Smart Attendance Management System built using the MERN stack (MongoDB, Express.js, React.js, Node.js).

It digitizes and automates academic attendance workflows using secure OTP-based verification and role-based access control. The system replaces traditional manual attendance with a scalable, structured, and secure digital solution.

---

# 🎯 Project Objective

To develop a secure, scalable, and user-friendly attendance system that:

- Automates classroom attendance
- Prevents proxy attendance
- Provides real-time analytics
- Centralizes academic structure
- Supports multiple user roles

---

# 👥 User Roles & Responsibilities

## 👨‍💼 Admin (Academic Controller)

- Create Departments
- Create Academic Years (FE, SE, TE, BE)
- Create Divisions (A, B, C, etc.)
- Create Subjects
- Assign Teachers to Subjects
- Approve or Reject Teacher accounts
- Delete Departments, Divisions, Subjects
- View system statistics (Teachers, Students, Subjects)

---

## 👨‍🏫 Teacher

- View assigned subjects
- Start attendance session (OTP + Session ID)
- Real-time session countdown
- View attendance session history
- Edit / Freeze attendance sessions
- Delete attendance sessions
- Download attendance report (CSV)
- View subject-wise defaulters (< 75%)
- Dashboard stats (Subjects, Sessions, Defaulters)

---

## 👨‍🎓 Student

- View enrolled subjects
- Mark attendance using OTP
- View subject-wise attendance %
- View complete attendance history (date-wise)
- Attendance warning for low attendance
- Dashboard overview statistics

---

# 🔐 Security Features

- JWT Authentication
- Role-Based Access Control
- OTP-based Attendance Validation
- Session Expiry Timer
- Division-based Validation (Prevents fake marking)
- Teacher Approval System
- Protected API Routes

---

# 📊 Dashboard Features

- Modern stat cards
- Attendance analytics
- Defaulter detection system
- CSV export functionality
- Profile panel system
- Clean and structured UI
- Modular component architecture

---

# 🛠 Tech Stack

## Frontend

- React.js
- Axios
- React Router
- Custom CSS (Modern UI Styling)

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

---

# 🗂 Project Structure

```
DYP-AttendX/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   └── styles.css
│
└── README.md
```

---

# ⚙️ Installation Guide

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/DYP-AttendX.git
cd DYP-AttendX
```

---

## 2️⃣ Backend Setup

```bash
cd backend
npm install
npm run dev
```

Create `.env` file inside backend folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:
```
http://localhost:5173
```

Backend runs on:
```
http://localhost:5000
```

---

# 🚀 Key Functional Highlights

- Secure OTP-based attendance marking
- Real-time session control with expiry
- Defaulter calculation (< 75%)
- Session editing & freeze mode
- Teacher approval workflow
- Dashboard analytics overview
- Subject-wise attendance tracking
- CSV export functionality
- Clean role-based architecture

---

# 📈 System Workflow

1. Admin creates academic structure (Department → Year → Division → Subject).
2. Teacher registers → Admin approves.
3. Admin assigns subject to teacher.
4. Teacher starts attendance session.
5. OTP generated (valid for limited time).
6. Students enter OTP to mark attendance.
7. Attendance stored securely in database.
8. System calculates attendance percentage.
9. Defaulters automatically detected.
10. Reports downloadable in CSV format.

---

# 🎓 Real-World Relevance

This project demonstrates:

- Full-stack development
- RESTful API design
- Authentication & Authorization
- Secure data handling
- Database schema modeling
- Scalable system architecture
- Role-based ERP structure
- Clean UI design principles

It simulates a real academic ERP attendance system used in colleges.

---

# 🔮 Future Enhancements

- Email notifications for defaulters
- Dark mode toggle
- Bulk student upload via CSV
- Attendance trend analytics
- Audit log system
- Multi-institution support
- Mobile responsive optimization
- Push notifications

---

# 🧠 Learning Outcomes

Through building DYP-AttendX:

- Designed complete academic data hierarchy
- Implemented JWT-based authentication
- Built OTP session mechanism
- Implemented role-based access control
- Managed relational MongoDB data using Mongoose
- Built reusable React components
- Structured scalable project architecture

---

# 👨‍💻 Author

**Tanmay Kad**  
Full Stack Developer | MERN Stack  

---

⭐ If you found this project useful, consider giving it a star!
