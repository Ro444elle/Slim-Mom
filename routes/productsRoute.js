const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");

const {
  createDailyIntakeBalanceController,
  getProductsController,
  addIntakeProductController,
  deleteIntakeProductController,
  getInfoSelectedDayController,
} = require("../controllers/productsController");

router.post("/diary", auth, createDailyIntakeBalanceController);
router.get("/diary/products-list", auth, getProductsController);
router.post("/diary/add-intakeProduct", auth, addIntakeProductController);
router.delete("/diary/delete-product/:productId", auth, deleteIntakeProductController);
router.get("/diary/day-info/:selectedDay", auth, getInfoSelectedDayController);
