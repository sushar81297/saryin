require("dotenv").config();
const express = require("express");
const connectDB = require("./db");

const userRoutes = require("./routes/User");
const balanceRoutes = require("./routes/balance");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

app.use(express.json());

// Add CORS headers for frontend access
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use("/api/users", userRoutes);
app.use("/api/balance", balanceRoutes);

// Add a simple route for the root path
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// For local development
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}

// Export for Vercel
module.exports = app;
