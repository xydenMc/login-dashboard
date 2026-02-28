const express = require('express');
const cors = require('cors');
const jwt = require("jsonwebtoken");
const pool = require("./db.js");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;

    const result = await pool.query(
        "SELECT * FROM users WHERE email = $1 AND password = $2",
        [email, password]
    );
    if (result.rows.length === 0) {
        return res.status(401).json({
            message: "Login gagal"
        });
    }
    const token = jwt.sign(
        { id: result.rows[0].id },
        "SECRET_KEY",
        { expiresIn: "1h" }
    );

    res.json({
        message: "Login berhasil",
        token: token,
    });
});

// register
app.post("/auth/register", async (req, res) => {
    const { nama_lengkap, email, password } = req.body;

    try {
        // Cek apakah email sudah terdaftar
        const checkEmail = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (checkEmail.rows.length > 0) {
            return res.status(400).json({
                message: "Email sudah terdaftar"
            });
        }

        // Insert user baru dengan role default 'customer'
        const result = await pool.query(
            "INSERT INTO users (nama_lengkap, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id_user, email, nama_lengkap, role",
            [nama_lengkap, email, password, 'customer']
        );

        // Buat token untuk user baru (opsional, bisa langsung login)
        const token = jwt.sign(
            { id: result.rows[0].id_user, email: result.rows[0].email, role: result.rows[0].role },
            "SECRET_KEY",
            { expiresIn: "1h" }
        );

        res.status(201).json({
            message: "Registrasi berhasil",
            user: {
                id_user: result.rows[0].id_user,
                nama_lengkap: result.rows[0].nama_lengkap,
                email: result.rows[0].email,
                role: result.rows[0].role
            },
            token: token
        });

    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});

app.listen(5000, () => {
    console.log("Server berjalan di http://localhost:5000");
});