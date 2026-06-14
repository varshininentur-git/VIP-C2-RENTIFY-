require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/connect");
const userRoutes = require("./routes/userRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// Routes
app.use("/api/user", userRoutes);
app.use("/api/property", propertyRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/favorite", favoriteRoutes);

app.get("/", (req, res) => {
  res.send("Rentify Backend Running");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});