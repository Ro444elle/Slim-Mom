const User = require("../services/schemas/usersProfileSchema");
const UserCalculator = require("../services/schemas/userCalculatorSchema");
const { sendVerificationEmail } = require("./emailServices");

let nanoid;
import("nanoid").then((module) => {
  nanoid = module.nanoid;
});

const createIntakeProfile = async (userData) => {
  try {
    const { height, age, currentWeight, desiredWeight, bloodType, gender } = userData;
    const userCalculator = new UserCalculator({
      height,
      age,
      currentWeight,
      desiredWeight,
      bloodType,
      gender,
    });
    const dailyIntake = userCalculator.calculateDailyCalories();
    return dailyIntake;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const createUser = async ({ name, email, password }) => {
  try {
    const userExisting = await User.findOne({ email });
    if (userExisting) {
      throw new Error("This email is already used");
    }

    const uniqueCodeVerify = nanoid();

    await sendVerificationEmail(email, uniqueCodeVerify);

    const newUser = new User({ name, email, password, verificationToken: uniqueCodeVerify });
    newUser.setPassword(password);
    newUser.generateAuthToken();
    return await newUser.save();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const checkLoginUserDB = async ({ email, password }) => {
  try {
    const user = await User.findOne({ email });
    if (!user || !user.validPassword(password)) {
      throw new Error("Email or password is wrong");
    }
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findUser = async (user) => {
  const result = await User.findOne({ email: user.email });
  return result;
};

const logoutUser = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.token = [];
    await user.save();

    return {
      status: "Success",
      code: 200,
      message: "User logged out successfully",
    };
  } catch (error) {
    console.log(`Error logging out user:with id:${userId}`);
    return {
      status: "Error",
      message: error.message,
    };
  }
};

const verifyEmail = async (verificationToken) => {
  const update = { verify: true, verificationToken: null };

  const result = await User.findOneAndUpdate(
    {
      verificationToken,
    },
    { $set: update },
    { new: true }
  );
  console.log(result);
  if (!result) {
    throw new Error("User not found");
  }
};

module.exports = {
  createIntakeProfile,
  createUser,
  checkLoginUserDB,
  findUser,
  logoutUser,
  verifyEmail,
};
