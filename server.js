require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./db");
const recordsRouter = require("./routes/records");

const app = express();
const PORT = process.env.PORT || 3000;

// Allow requests from the frontend
const allowedOrigins = (
    process.env.CLIENT_ORIGINS || "http://localhost:5500"
).split(",").map(origin => origin.trim());

app.use(cors({
    origin: allowedOrigins
}));

// Read JSON request bodies
app.use(express.json());

// API guide
app.get("/", (req, res) => {
    res.json({
        message: "Study Support Requests API",
        version: "1.0.0",
        endpoints: {
            health: "GET /health",
            getAllRecords: "GET /api/records",
            getOneRecord: "GET /api/records/:id",
            createRecord: "POST /api/records",
            updateRecord: "PUT /api/records/:id",
            deleteRecord: "DELETE /api/records/:id"
        }
    });
});

// Check server and database health
app.get("/health", async (req, res) => {
    try {
        await pool.query("SELECT 1");

        res.json({
            success: true,
            message: "API and database are working"
        });
    } catch (error) {
        console.error("Health check failed:", error);

        res.status(503).json({
            success: false,
            message: "Database connection failed"
        });
    }
});

// Connect records routes
app.use("/api/records", recordsRouter);

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Study Support Requests API running on port ${PORT}`);
});