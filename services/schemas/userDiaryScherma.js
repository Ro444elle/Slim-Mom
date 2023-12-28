const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Product = require("./productsSchema");

const diaryEntrySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  consumedProducts: [
    {
      productName: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
      amountInGrams: {
        type: Number,
        default: 0,
        validate: {
          validator: function (v) {
            return v % 25 === 0;
          },
          message: (props) => `${props.value} is not a valid amount!You need to intorduce a multiple of 25!`,
        },
      },
      amountInCalories: {
        type: Number,
        default: 0,
      },
    },
  ],
});

diaryEntrySchema.pre("save", async function (next) {
  for (const product of this.consumedProducts) {
    const productData = await Product.findById(product.productName);
    product.amountInCalories = (product.amountInGrams / 100) * productData.calories;
  }
  next();
});
const DiaryEntry = mongoose.model("DiaryEntry", diaryEntrySchema);

module.exports = DiaryEntry;
