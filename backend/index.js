require("dotenv").config();
const express = require("express");
const connectDB = require("./db");

const userRoutes = require("./routes/User");
const balanceRoutes = require("./routes/balance");

const app = express();
const PORT = 3000;

// Connect to MongoDB
connectDB();

app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello from Express with MongoDB!");
});

app.use("/api/users", userRoutes);
app.use("/api/balance", balanceRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
