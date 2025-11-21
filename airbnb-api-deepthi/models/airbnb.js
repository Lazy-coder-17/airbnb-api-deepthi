const mongoose = require("mongoose");

const AirbnbSchema = new mongoose.Schema({
  listingId: { type: String, required: true, unique: true },
  NAME: { type: String, required: true, trim: true },
  hostName: { type: String },
  neighbourhood: { type: String },
  roomType: { type: String },
  price: { type: Number },
  minimumNights: { type: Number },
  numberOfReviews: { type: Number },
  lastReview: { type: Date },
  availability365: { type: Number },
  thumbnail: { type: String },
  images: { type: [String] }
}, { timestamps: true });


module.exports = mongoose.model("Airbnb", AirbnbSchema, "airbnb_data");
