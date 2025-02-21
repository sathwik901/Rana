const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());

// GET endpoint to return operation_code
app.get("/api", (req, res) => {
    res.json({ operation_code: "VIDE0IT2025" });
});

// POST endpoint to process request data
app.post("/api", (req, res) => {
    const { data } = req.body;

    if (!data || !Array.isArray(data)) {
        return res.status(400).json({ is_success: false, message: "Invalid request format" });
    }

    const numbers = data.filter(item => !isNaN(item));
    const alphabets = data.filter(item => /^[a-zA-Z]$/.test(item));
    const highest_alphabet = alphabets.length ? [alphabets.sort((a, b) => b.localeCompare(a))[0]] : [];

    res.json({
        is_success: true,
        user_id: "surukutla_vv_rana_10052005",
        email: "surukutlavvrana@gmail.com",
        roll_number: "22BAI70506",
        numbers,
        alphabets,
        highest_alphabet
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
