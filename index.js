"use strict";
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const { swaggerDocs, swaggerUi } = require("./config/swagger");

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8899;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
// Routes

// var cron = require('node-cron');

// cron.schedule('* * * * *', () => {
//   console.log('running a task every minute');
// });

const homeRoutes = require("./routes/home.route");
const authRoutes = require("./routes/auth.route");
const brandRoutes = require("./routes/brand.route");
const categoryRoutes = require("./routes/category.route");
const subcategoryRoutes = require("./routes/subCategory.route");
const newsletterRoutes = require("./routes/newsletter.route");
const productRoutes = require("./routes/product.route");
const dashboardRoutes = require("./routes/dashboard.route");
const searchRoutes = require("./routes/search.route");
const userRoutes = require("./routes/user.route");
const cartRoutes = require("./routes/cart.route");
const couponCodeRoutes = require("./routes/coupon-code.route");
const productReviewRoutes = require("./routes/product-review.route");
const reviewRoutes = require("./routes/review.route");
const wishlistRoutes = require("./routes/wishlist.route");
const OrderRoutes = require("./routes/order.route");
const paymentRoutes = require("./routes/payment-intents.route");
const delete_fileRoutes = require("./routes/file-delete.route");
const shopRoutes = require("./routes/shop.route");
const payment = require("./routes/payment.route");
const currency = require("./routes/currencies.route");
const compaign = require("./routes/compaign.route");

app.use("/api", homeRoutes);
app.use("/api", authRoutes);
app.use("/api", brandRoutes);
app.use("/api", categoryRoutes);
app.use("/api", subcategoryRoutes);
app.use("/api", newsletterRoutes);
app.use("/api", productRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", searchRoutes);
app.use("/api", userRoutes);
app.use("/api", cartRoutes);
app.use("/api", couponCodeRoutes);
app.use("/api", productReviewRoutes);
app.use("/api", reviewRoutes);
app.use("/api", wishlistRoutes);
app.use("/api", OrderRoutes);
app.use("/api", paymentRoutes);
app.use("/api", delete_fileRoutes);
app.use("/api", shopRoutes);
app.use("/api", payment);
app.use("/api", currency);
app.use("/api", compaign);

// GET API
app.get("/", (req, res) => {
  res.send("This is a GET API");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
