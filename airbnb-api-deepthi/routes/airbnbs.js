const express = require("express");
const router = express.Router();
const Airbnb = require("../models/airbnb");  // required for POST route
const airbnbController = require("../controllers/airbnbController");

// ================= API Routes =================
router.get("/api", airbnbController.getAllAirbnbs);
router.post("/api", airbnbController.createAirbnb);
router.put("/api/:listingId", airbnbController.updatePut);
router.delete("/api/:listingId", airbnbController.deleteAirbnb);
router.get("/api/:listingId", airbnbController.getAirbnbById);

// ================= HTML Routes =================
router.get("/", airbnbController.getAll);

// GET form to add new Airbnb
router.get("/add", (req, res) => {
  res.render("insertProperty", { title: "Add New Airbnb Listing" });
});
router.get("/:listingId", airbnbController.getOne);



// HTML POST route to add Airbnb
router.post("/", async (req, res) => {
  try {
    const {
      listingId,
      name,
      hostName,
      neighbourhood,
      roomType,
      price,
      minimumNights,
      numberOfReviews,
      availability365,
      thumbnail,
      images
    } = req.body;

    const newListing = new Airbnb({
      listingId,
      NAME: name,
      hostName,
      neighbourhood,
      roomType,
      price,
      minimumNights,
      numberOfReviews,
      availability365,
      thumbnail,
      images: images ? images.split(",").map(url => url.trim()) : []
    });

    await newListing.save();
    res.redirect("/airbnbs");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding new Airbnb");
  }
});

module.exports = router;
