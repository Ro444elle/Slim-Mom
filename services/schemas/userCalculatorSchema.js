const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userCalculatorSchema = new Schema({
  height: {
    type: Number,
    validate: {
      validator: function (v) {
        return v >= 100 && v <= 250;
      },
      message: (props) => `${props.value} is not a valid height!Height must be between 100 and 250 cm`,
    },
    require: [true, "Height is required"],
  },
  age: {
    type: Number,
    validate: {
      validator: function (v) {
        return v >= 14 && v <= 100;
      },
      message: (props) => `${props.value} is not a valid age! Age must be between 14 and 100 years!`,
    },
    require: [true, "Age is required"],
  },
  currentWeight: {
    type: Number,
    validate: {
      validator: function (v) {
        return v >= 30 && v <= 250;
      },
      message: (props) => `${props.value} is not a valid weight! Weight must be between 30 and 250 kg!`,
    },
    require: [true, "Weight is required"],
  },
  desiredWeight: {
    type: Number,
    validate: {
      validator: function (v) {
        return v >= 30 && v <= 150;
      },
      message: (props) => `${props.value} is not a valid weight! Weight must be between 30 and 150 kg!`,
    },
    require: [true, "Weight is required"],
  },
  bloodType: {
    type: Number,
    enum: [1, 2, 3, 4],
    require: [true, "Blood type is required"],
  },
  gender: {
    type: String,
    enum: ["female", "male"],
    require: [true, "Gender is required, for a personalised recommendation"],
  },
});

userCalculatorSchema.methods.calculateDailyCalories = function () {
  const weightDifference = this.currentWeight - this.desiredWeight;
  const totalCalories = weightDifference * 7700;
  const dailyCalories = totalCalories / 14;

  // Calculate basal metabolic rate (BMR) using the Mifflin-St Jeor Equation
  let bmr;
  if (this.gender === "female") {
    bmr = 10 * this.currentWeight + 6.25 * this.height - 5 * this.age - 161;
  } else {
    bmr = 10 * this.currentWeight + 6.25 * this.height - 5 * this.age + 5;
  }

  return bmr + dailyCalories;
};

const UserCalculator = mongoose.model("UserCalculator", userCalculatorSchema);

module.exports = UserCalculator;
