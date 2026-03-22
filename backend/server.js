require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SRMS API is running");
});

// Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  },
  connectTimeout: 10000
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});


// CRUD APIs  //

// 1. INSERT (Add Student)
app.post("/addStudent", (req, res) => {
  const { student_name, course, marks } = req.body;

  // Validation
  if (!student_name || student_name.trim() === "") {
    return res.status(400).send("Student name is required");
  }

  if (!course || course.trim() === "") {
    return res.status(400).send("Course is required");
  }

  if (marks < 0 || marks > 600) {
    return res.status(400).send("Marks must be between 0 and 600");
  }

  const sql = "INSERT INTO students (student_name, course, marks) VALUES (?, ?, ?)";
  db.query(sql, [student_name, course, marks], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send("Student added successfully");
  });
});


// 2. RETRIEVE (Get All Students)
app.get("/getStudents", (req, res) => {
  const sql = "SELECT * FROM students";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});


// 3. UPDATE (Update Student)
app.put("/updateStudent/:id", (req, res) => {
  const { student_name, course, marks } = req.body;
  const { id } = req.params;

  const sql = "UPDATE students SET student_name=?, course=?, marks=? WHERE id=?";
  db.query(sql, [student_name, course, marks, id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send("Student updated successfully");
  });
});


// 4. DELETE (Delete Student)
app.delete("/deleteStudent/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM students WHERE id=?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send("Student deleted successfully");
  });
});


// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});