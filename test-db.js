const pool = require("./db");

async function testConnection() {
    try {
        const result = await pool.query("SELECT NOW()");

        console.log("SUCCESS: PostgreSQL connection is working!");
        console.log("Database time:", result.rows[0].now);
    } catch (error) {
        console.error("DATABASE CONNECTION FAILED:");
        console.error(error.message);
    } finally {
        await pool.end();
    }
}

testConnection();