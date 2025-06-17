// models/Category.js
const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: String,
});

CategorySchema.virtual("benihs", {
  ref: "Benih",
  localField: "_id",
  foreignField: "categoryId",
});

CategorySchema.set("toObject", { virtuals: true });
CategorySchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Category", CategorySchema);
