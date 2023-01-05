const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      required: true,
    },
    Size: {
      type: String,
      required: true,
    },
    Rating: {
      type: Number,
      required: true,
    },
    Type: {
      type: String,
      required: true,
    },
    Company_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
