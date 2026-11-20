const express = require("express");
const pool = require("../db");

const router = express.Router();

// GET all study support requests
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM records ORDER BY id ASC"
        );

        res.json({
            success: true,
            count: result.rows.length,
            records: result.rows
        });
    } catch (error) {
        console.error("Error fetching records:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve records"
        });
    }
});

// GET one study support request by ID
router.get("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "A valid record ID is required"
            });
        }

        const result = await pool.query(
            "SELECT * FROM records WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Record not found"
            });
        }

        res.json({
            success: true,
            record: result.rows[0]
        });
    } catch (error) {
        console.error("Error fetching record:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve record"
        });
    }
});

// POST a new study support request
router.post("/", async (req, res) => {
    try {
        const { title, category, description, status } = req.body;

        if (
            typeof title !== "string" ||
            typeof category !== "string" ||
            typeof description !== "string" ||
            typeof status !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields must be provided as text"
            });
        }

        const cleanTitle = title.trim();
        const cleanCategory = category.trim();
        const cleanDescription = description.trim();
        const cleanStatus = status.trim();

        if (cleanTitle.length < 3 || cleanTitle.length > 80) {
            return res.status(400).json({
                success: false,
                message: "Title must be between 3 and 80 characters"
            });
        }

        if (cleanCategory.length < 2 || cleanCategory.length > 40) {
            return res.status(400).json({
                success: false,
                message: "Category must be between 2 and 40 characters"
            });
        }

        if (
            cleanDescription.length < 5 ||
            cleanDescription.length > 300
        ) {
            return res.status(400).json({
                success: false,
                message: "Description must be between 5 and 300 characters"
            });
        }

        const allowedStatuses = [
            "Pending",
            "In progress",
            "Completed"
        ];

        if (!allowedStatuses.includes(cleanStatus)) {
            return res.status(400).json({
                success: false,
                message: "Status must be Pending, In progress, or Completed"
            });
        }

        const result = await pool.query(
            `INSERT INTO records
            (title, category, description, status)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [
                cleanTitle,
                cleanCategory,
                cleanDescription,
                cleanStatus
            ]
        );

        res.status(201).json({
            success: true,
            message: "Record created successfully",
            record: result.rows[0]
        });
    } catch (error) {
        console.error("Error creating record:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create record"
        });
    }
});

// PUT update an existing study support request
router.put("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "A valid record ID is required"
            });
        }

        const { title, category, description, status } = req.body;

        if (
            typeof title !== "string" ||
            typeof category !== "string" ||
            typeof description !== "string" ||
            typeof status !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields must be provided as text"
            });
        }

        const cleanTitle = title.trim();
        const cleanCategory = category.trim();
        const cleanDescription = description.trim();
        const cleanStatus = status.trim();

        if (cleanTitle.length < 3 || cleanTitle.length > 80) {
            return res.status(400).json({
                success: false,
                message: "Title must be between 3 and 80 characters"
            });
        }

        if (cleanCategory.length < 2 || cleanCategory.length > 40) {
            return res.status(400).json({
                success: false,
                message: "Category must be between 2 and 40 characters"
            });
        }

        if (
            cleanDescription.length < 5 ||
            cleanDescription.length > 300
        ) {
            return res.status(400).json({
                success: false,
                message: "Description must be between 5 and 300 characters"
            });
        }

        const allowedStatuses = [
            "Pending",
            "In progress",
            "Completed"
        ];

        if (!allowedStatuses.includes(cleanStatus)) {
            return res.status(400).json({
                success: false,
                message: "Status must be Pending, In progress, or Completed"
            });
        }

        const result = await pool.query(
            `UPDATE records
            SET title = $1,
                category = $2,
                description = $3,
                status = $4
            WHERE id = $5
            RETURNING *`,
            [
                cleanTitle,
                cleanCategory,
                cleanDescription,
                cleanStatus,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Record not found"
            });
        }

        res.json({
            success: true,
            message: "Record updated successfully",
            record: result.rows[0]
        });
    } catch (error) {
        console.error("Error updating record:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update record"
        });
    }
});

// DELETE a study support request
router.delete("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "A valid record ID is required"
            });
        }

        const result = await pool.query(
            "DELETE FROM records WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Record not found"
            });
        }

        res.json({
            success: true,
            message: "Record deleted successfully",
            record: result.rows[0]
        });
    } catch (error) {
        console.error("Error deleting record:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete record"
        });
    }
});

module.exports = router;