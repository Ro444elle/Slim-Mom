const mongoose = require("mongoose");
const bCrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const secret = process.env.SECRET;

const Schema = mongoose.Schema;

const userProfileSchema = new Schema({
  name: {
    type: String,
    require: [true, "Name is required"],
    minLength: 2,
    maxLength: 30,
    unique: true,
  },
  email: {
    type: String,
    require: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    require: [true, "Password is required"],
    minLength: 4,
  },
  token: {
    type: String,
    default: null,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    require: [true, "Verification token is required"],
  },
});

userProfileSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, secret);
  this.token = token;
};

userProfileSchema.methods.setPassword = function (password) {
  this.password = bCrypt.hashSync(password, bCrypt.genSaltSync(10));
};

userProfileSchema.methods.validPassword = function (password) {
  return bCrypt.compareSync(password, this.password);
};

const User = mongoose.model("user", userProfileSchema);

module.exports = User;
