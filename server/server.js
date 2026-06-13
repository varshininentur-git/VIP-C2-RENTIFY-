require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/connect");
const userRoutes = require("./routes/userRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/property", propertyRoutes);

connectDB();

app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Rentify Backend Running");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});