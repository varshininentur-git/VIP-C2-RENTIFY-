const express = require("express");
const cors = require("cors");
const connectDB = require("./config/connect");

const userRoutes = require("./routes/userRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/user", userRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Rentify Backend Running");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});