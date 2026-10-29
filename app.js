const express = require("express");
require("dotenv").config();

const connectDB = require("./config/db");
const userRoutes = require("./routes/user.routes");

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.status(200).json({
        message: "API is running"
    });
});

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error(
            "Failed to start server due to DB connection error:",
            err.message
        );
        process.exit(1);
    });
