require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./db");
const recordsRouter = require("./routes/records");

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = (
    process.env.CLIENT_ORIGINS || "http://localhost:5500"
).split(",").map(origin => origin.trim());

app.use(cors({
    origin: allowedOrigins
}));

app.use(express.json());

// API GUIDE
app.get("/", (req, res) => {
    const baseURL =
        process.env.RENDER_EXTERNAL_URL ||
        "http://localhost:3000";

    const studentNumber =
        process.env.STUDENT_NUMBER || "TO BE ADDED";

    res.type("html").send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Study Support Requests API Guide</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 950px;
                margin: 30px auto;
                padding: 20px;
                line-height: 1.6;
                color: #222;
                background: #f4f6f9;
            }
            h1, h2 {
                color: #174a7e;
            }
            section {
                background: white;
                padding: 18px;
                margin-bottom: 18px;
                border-radius: 8px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
            }
            th, td {
                border: 1px solid #ccc;
                padding: 10px;
                text-align: left;
            }
            th {
                background: #e5edf6;
            }
            code, pre {
                background: #eef1f5;
                padding: 8px;
                overflow-wrap: anywhere;
            }
        </style>
    </head>
    <body>
        <h1>Study Support Requests API</h1>

        <section>
            <h2>Project Information</h2>
            <p><strong>Student number:</strong> ${studentNumber}</p>
            <p>
                This API manages study support requests.
                It allows clients to create, read, update and delete records.
            </p>
            <p><strong>API base URL:</strong>
                <a href="${baseURL}">${baseURL}</a>
            </p>
            <p><a href="/health">Check API health</a></p>
            <p><a href="/api/records">View all records</a></p>
        </section>

        <section>
            <h2>Available API Routes</h2>
            <table>
                <tr><th>Method</th><th>Route</th><th>Purpose</th></tr>
                <tr><td>GET</td><td>/</td><td>API guide</td></tr>
                <tr><td>GET</td><td>/health</td><td>Check server and database</td></tr>
                <tr><td>GET</td><td>/api/records</td><td>Get all records</td></tr>
                <tr><td>GET</td><td>/api/records/:id</td><td>Get one record</td></tr>
                <tr><td>POST</td><td>/api/records</td><td>Create a record</td></tr>
                <tr><td>PUT</td><td>/api/records/:id</td><td>Update a record</td></tr>
                <tr><td>DELETE</td><td>/api/records/:id</td><td>Delete a record</td></tr>
            </table>
        </section>

        <section>
            <h2>Record Fields</h2>
            <ul>
                <li>title: 3 to 80 characters</li>
                <li>category: 2 to 40 characters</li>
                <li>description: 5 to 300 characters</li>
                <li>status: Pending, In progress, or Completed</li>
                <li>id: generated automatically by the database</li>
            </ul>
        </section>

        <section>
            <h2>Example POST and PUT JSON Body</h2>
            <pre>{
  "title": "Broken classroom light",
  "category": "Electrical",
  "description": "The light in Room B12 does not switch on.",
  "status": "Pending"
}</pre>
            <p>Do not include the id in POST or PUT request bodies.</p>
        </section>

        <section>
            <h2>Expected Response Codes</h2>
            <ul>
                <li>200: Request successful</li>
                <li>201: Record created successfully</li>
                <li>400: Invalid input or malformed JSON</li>
                <li>404: Record or route not found</li>
                <li>500: Unexpected server error</li>
                <li>503: Database unavailable during health check</li>
            </ul>
            <p>
                Note: If the hosted service has been idle, its first request
                may take some time while the service starts.
            </p>
        </section>
    </body>
    </html>
    `);
});

// HEALTH CHECK
app.get("/health", async (req, res) => {
    try {
        await pool.query("SELECT 1");

        res.status(200).json({
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

// RECORD ROUTES
app.use("/api/records", recordsRouter);

// UNKNOWN ROUTES
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// ERROR HANDLING
app.use((error, req, res, next) => {
    console.error("Server error:", error);

    if (
        error instanceof SyntaxError &&
        error.status === 400 &&
        "body" in error
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON request body"
        });
    }

    res.status(500).json({
        success: false,
        message: "An unexpected server error occurred"
    });
});

// START SERVER
app.listen(PORT, "0.0.0.0", () => {
    console.log(
        `Study Support Requests API running on port ${PORT}`
    );
});