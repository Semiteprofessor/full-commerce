"use strict";
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8899;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const authRoutes = require("./routes/auth.route");
const productRoutes = require("./routes/product.route");
const categoryRoutes = require("./routes/category.route");

app.use("/api", authRoutes);
app.use("/api", productRoutes);
app.use("/api", categoryRoutes);

app.get("/", (req, res) => {
  res.send("This is a GET API");
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
