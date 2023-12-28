const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  categories: {
    type: String,
    require: true,
  },
  weight: {
    type: Number,
  },
  title: {
    type: String,
    require: true,
  },
  calories: {
    type: Number,
    require: true,
  },
  groupBloodNotAllowed: {
    type: [Boolean],
    // require: true,
  },
});

const Product = mongoose.model("product", productSchema);

module.exports = Product;
