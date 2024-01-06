const {
  createDailyIntakeBalance,
  getProducts,
  addIntakeProduct,
  deleteIntakeProduct,
  getInfoSelectedDay,
} = require("../services/productsServices");

const createDailyIntakeBalanceController = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const consumedProducts = req.body.consumedProducts;
    //
    const diaryEntry = await createDailyIntakeBalance(userId, consumedProducts);
    await diaryEntry.save();
    res.status(201).json({
      status: "success",
      code: 201,
      data: diaryEntry,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating daily intake balance", error: error.message });
  }
};

const getProductsController = async (req, res, next) => {
  try {
    const products = await getProducts();
    const productNames = products.map((product) => product.title);
    res.status(200).json({
      status: 200,
      data: productNames,
    });
  } catch (error) {
    res.status(500).json({ message: "Error getting products", error: error.message });
  }
};

const addIntakeProductController = async (req, res, next) => {
  try {
    const { userId, productId, amountInGrams } = req.body;
    const diaryEntry = await addIntakeProduct(userId, productId, amountInGrams);
    res.status(200).json({
      status: "success",
      code: 200,
      data: diaryEntry,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding intake product", error: error.message });
  }
};

const deleteIntakeProductController = async (res, req, next) => {
  try {
    const { userId, productId } = req.body;
    const diaryEntry = await deleteIntakeProduct(userId, productId);
    res.status(200).json({
      status: "success",
      code: 200,
      data: diaryEntry,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting intake product", error: error.message });
  }
};

const getInfoSelectedDayController = async (req, res, next) => {
  try {
    const { userId, date } = req.body;
    const diaryEntry = await getInfoSelectedDay(userId, date);
    res.status(200).json({
      status: "success",
      code: 200,
      data: diaryEntry,
    });
  } catch (error) {
    res.status(500).json({ message: "Error getting info for selected day", error: error.message });
  }
};

module.exports = {
  createDailyIntakeBalanceController,
  getProductsController,
  addIntakeProductController,
  deleteIntakeProductController,
  getInfoSelectedDayController,
};
