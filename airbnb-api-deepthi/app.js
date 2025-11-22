require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const { engine } = require("express-handlebars");
const methodOverride = require("method-override");
const config = require("./config/database");

const app = express();

// MongoDB connection
mongoose.connect(config.url, { dbName: config.dbName, useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected to airbnb_lab"))
  .catch(err => console.error(err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// Handlebars
app.engine(".hbs", engine({
  extname: ".hbs",
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "views/layouts"),
  partialsDir: path.join(__dirname, "views/partials")
}));
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "views"));

// Routes
const airbnbRoutes = require("./routes/airbnbs");
app.use("/airbnbs", airbnbRoutes);      // HTML view routes

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render("error", { title: "Error", message: "Something went wrong!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Export the app for serverless deployments (Vercel) and for a local server starter
module.exports = app;
