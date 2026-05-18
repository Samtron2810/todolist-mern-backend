// Import required packages
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// import routes files
const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todo");

// Initialize app
const app = express();

// MIDDLEWARES
// allow frontend to connect
app.use(
  cors({
    origin: "*",
    // origin: "https://yourfrontend.vercel.app",
    credentials: true,
  }),
);

app.use(express.json()); // allow JSON data

// use imported routes
app.use("/api/auth", authRoutes); // use auth routes
app.use("/api/todos", todoRoutes); // use todo routes

// Test route
app.get("/", (req, res) => {
  res.send("API is working now...");
  console.log("Root route hit");
});

// Start server
const PORT = process.env.PORT || 5000;
// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Atlas Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
