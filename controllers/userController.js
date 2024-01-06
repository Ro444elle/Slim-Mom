const jwt = require("jsonwebtoken");
require("dotenv").config();

const secret = process.env.SECRET;
const { nanoid } = require("nanoid");

const {
  createIntakeProfile,
  createUser,
  checkLoginUserDB,
  findUser,
  logoutUser,
  verifyEmail,
} = require("../services/usersServices");

const { sendVerificationEmail } = require("../services/emailServices");

const createIntakeProfileController = async (req, res, next) => {
  try {
    const { height, age, currentWeight, desiredWeight, bloodType, gender } = req.body;
    if (!height || !age || !currentWeight || !desiredWeight || !bloodType || !gender) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "All fields are required",
        data: "Bad Request",
      });
    }

    const userId = req.user ? req.user._id : null;
    const userData = { height, age, currentWeight, desiredWeight, bloodType, gender };
    const dataToCalculate = await createIntakeProfile(userId, userData);

    res.status(200).json({
      status: "success",
      code: 200,
      data: dataToCalculate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "fail",
      code: 500,
      message: "Internal Server Error",
    });
  }
};

const createUserController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Missing required fields: name, email or password",
        data: "Bad Request",
      });
    }

    const result = await createUser({ name, email, password });

    const payload = { email: result.email, name: result.name };
    const token = jwt.sign(payload, secret, { expiresIn: "24h" });

    res.status(201).json({
      status: "success",
      code: 201,
      data: { email: result.email, name: result.name, token },
    });
  } catch (error) {
    if (error.message === "This email is already used") {
      return res.status(409).json({
        status: "conflict",
        code: 409,
        message: "Email in use",
        data: "Conflict",
      });
    }

    console.error(error);
    res.status(500).json({
      status: "fail",
      code: 500,
      message: "Internal Server Error",
    });
  }
};

const loginUserController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: "Validation error",
        code: 400,
        message: "Missing required fields: email or password",
      });
    }
    const result = await checkLoginUserDB({ email, password });
    const payload = { email: result.email };
    const token = jwt.sign(payload, secret, { expiresIn: "24h" });

    res.status(200).json({
      status: "success",
      code: 200,
      data: { email: result.email, token },
    });
  } catch (error) {
    if (error.message === "Email or password is wrong") {
      return res.status(401).json({
        status: "Unauthorized",
        code: 401,
        message: "Email or password is wrong",
      });
    }
    console.error(error);
    res.status(500).json({
      status: "fail",
      code: 500,
      message: "Internal Server Error",
    });
  }
};

const findUserController = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Missing Authorization header",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Missing token",
      });
    }

    let tokenDecode;
    try {
      tokenDecode = jwt.verify(token, secret);
      console.log(tokenDecode);
    } catch (error) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Invalid token",
        data: error.message,
      });
    }

    const result = await findUser({ email: tokenDecode.email });
    console.log(result);
    if (result) {
      res.status(200).json({
        status: "Success",
        code: 200,
        data: {
          email: result.email,
          id: result._id,
        },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: "Not authorized",
      });
    }
  } catch (error) {
    next(error);
  }
};

const logoutUserController = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await logoutUser(userId);

    if (result.status === "Success") {
      res.status(204).json({
        status: "Success",
        code: 204,
        message: "No Content",
      });
    } else {
      res.status(401).json({
        message: "Not authorized",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const verifyEmailController = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    console.log(verificationToken);
    await verifyEmail(verificationToken);

    res.status(200).json({
      status: "Success",
      code: 200,
      message: "Verification successful",
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      code: 404,
      message: error.message,
    });
  }
};

const generateVerificationToken = () => {
  return nanoid();
};

const resendVerificationEmailController = async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log(email);
    if (!email) {
      return res.status(400).json({ message: "missing required field email" });
    }

    const user = await findUser({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    if (user.verify) {
      return res.status(400).json({ message: "Verification has already been passed" });
    }
    console.log(`User verify status: ${user.verify}`);
    const verificationToken = await generateVerificationToken();
    console.log(`Generated verification token: ${verificationToken}`);
    user.verificationToken = verificationToken;
    await user.save();
    try {
      await sendVerificationEmail(email, verificationToken);
      res.status(200).json({ message: "Verification email resent" });
      console.log("Sent verification email");
    } catch (error) {
      console.error("Failed to send verification email:", error);
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
    console.log(error);
  }
};
module.exports = {
  createIntakeProfileController,
  createUserController,
  loginUserController,
  findUserController,
  logoutUserController,
  verifyEmailController,
  resendVerificationEmailController,
};
