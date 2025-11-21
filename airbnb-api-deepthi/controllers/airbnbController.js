const Airbnb = require("../models/airbnb");

// Helper: map DB fields to schema-friendly keys
function mapListing(doc) {
  return {
    listingId: doc.id,                 
    name: doc.NAME,
    hostName: doc["host name"],        
    neighbourhood: doc.neighbourhood,
    roomType: doc["room type"],
    price: doc.price,
    minimumNights: doc["minimum nights"],
    numberOfReviews: doc["number of reviews"],
    lastReview: doc["last review"],
    availability365: doc["availability 365"],
    thumbnail: doc.thumbnail || "",
    images: doc.images || []
  };
}

// =========================
// HTML VIEW ROUTES
// =========================

// GET ALL listings (HTML view)
exports.getAll = async (req, res, next) => {
  try {
    // Support optional neighbourhood filtering via query string: ?neighbourhood=Downtown
    const { neighbourhood } = req.query;
    const filter = {};
    if (neighbourhood && neighbourhood.trim() !== "") {
      // case-insensitive partial match
      filter.neighbourhood = { $regex: neighbourhood.trim(), $options: "i" };
    }

    const docs = await Airbnb.find(filter).lean().limit(50);
    const listings = docs.map(mapListing);

    // also gather list of neighbourhoods for the UI (small helper)
    let neighbourhoods = [];
    try {
      neighbourhoods = await Airbnb.distinct("neighbourhood");
    } catch (e) {
      // ignore distinct errors, use empty list
    }

    res.render("viewData", { title: "All Airbnb Listings", properties: listings, filter: neighbourhood || "", neighbourhoods });
  } catch (err) {
    next(err);
  }
};

// GET ONE listing (HTML view)
exports.getOne = async (req, res, next) => {
  try {
    const doc = await Airbnb.findOne({ id: req.params.listingId }).lean();

    if (!doc) return res.status(404).render("error", { title: "Not Found", message: "Listing not found" });

    const property = mapListing(doc);
    res.render("viewProperty", { title: "Listing Details", property });
  } catch (err) {
    next(err);
  }
};

// =========================
// API ROUTES (JSON / Postman)
// =========================

// GET ALL listings (API)
exports.getAllAirbnbs = async (req, res, next) => {
  try {
    const listings = await Airbnb.find().lean().limit(50);
    res.json(listings);   
  } catch (err) {
    next(err);
  }
};


// GET ONE listing by ID (API)
exports.getAirbnbById = async (req, res) => {
  try {
    const listingIdParam = req.params.listingId;

    // Try to find listing as string or number (in case DB stored it differently)
    const doc = await Airbnb.findOne({
      $or: [
        { listingId: listingIdParam },
        { listingId: Number(listingIdParam) }
      ]
    }).lean();

    if (!doc) return res.status(404).json({ message: "Listing not found" });

    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

// CREATE new listing (API)
exports.createAirbnb = async (req, res) => {
  try {
    const { listingId, NAME, hostName, neighbourhood, roomType, price, minimumNights, numberOfReviews } = req.body;
    if (!NAME) return res.status(400).json({ error: "NAME is required" });

    const newListing = new Airbnb({ listingId, NAME, hostName, neighbourhood, roomType, price, minimumNights, numberOfReviews });
    await newListing.save();
    res.status(201).json({ message: "Airbnb listing created successfully", listing: newListing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create Airbnb listing", details: err.message });
  }
};

// UPDATE listing via PUT (API)
exports.updatePut = async (req, res) => {
  try {
    const listingId = req.params.listingId;
    const updateData = {};
    if (req.body.NAME) updateData["NAME"] = req.body.NAME;
    if (req.body.price !== undefined) updateData["price"] = Number(req.body.price.toString().replace(/[^0-9.]/g, ""));

    const updated = await Airbnb.findOneAndUpdate({ listingId }, { $set: updateData }, { new: true });
    if (!updated) return res.status(404).json({ message: "Listing not found" });
    res.json({ message: "Updated successfully", listing: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

// DELETE listing (API)
exports.deleteAirbnb = async (req, res) => {
  try {
    const deleted = await Airbnb.findOneAndDelete({ listingId: req.params.listingId });
    if (!deleted) return res.status(404).json({ message: "Listing not found" });
    res.json({ message: "Listing deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
