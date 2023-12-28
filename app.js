const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const sgMail = require("@sendgrid/mail");
// const path = require("path");

dotenv.config();

require("./middleware/passportConfig.js");

const usersRouter = require("./routes/usersRoute.js");
const productsRouter = require("./routes/productsRoute");
const coreOptions = require("./cors.js");

const app = express();

app.use(morgan("tiny"));
app.use(cors(coreOptions));
app.use(express.json());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use("/users", usersRouter);
app.use("products", productsRouter);

app.use((_, res, __) => {
  res.status(404).json({
    status: "error",
    code: 404,
    message: "Route not found",
    data: "Not found!",
  });
});

app.use((err, _, res, __) => {
  console.log(err.stack);
  res.status(500).json({
    status: "fail",
    code: 500,
    messsage: err.message,
    data: "Internal Server Error",
  });
});

const PORT = process.env.PORT_SERVER || 5000;
const URL_DB = process.env.DB_URL;

mongoose
  .connect(URL_DB)
  .then(() => {
    console.log("MongoDB server connected");
    app.listen(PORT, () => {
      console.log(`Server is running.Use my API on port:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Server NOT connected.Error:${err.message}`);
  });

module.exports = app;
