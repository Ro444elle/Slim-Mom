const DiaryEntry = require("./schemas/userDiaryScherma");
const Product = require("./schemas/productsSchema");

const createDailyIntakeBalance = async (userId, consumedProducts) => {
  const userDiaryEntry = new DiaryEntry({ user: userId, consumedProducts });
  await userDiaryEntry.save();
  return userDiaryEntry;
};

const getProducts = async () => {
  return await Product.find();
};

const addIntakeProduct = async (userId, productId, amountInGrams) => {
  const product = await Product.findById(productId);
  const diaryEntry = await DiaryEntry.findOne({
    user: userId,
    date: { $gte: new Date().setHours(0, 0, 0, 0), $lt: new Date().setHours(23, 59, 59, 999) },
  });
  diaryEntry.consumedProducts.push({
    productName: product._id,
    amountInGrams,
    amountInCalories: (product.calories * amountInGrams) / 100,
  });
  await diaryEntry.save();
  return diaryEntry;
};

const deleteIntakeProduct = async (userId, productId) => {
  const diaryEntry = await DiaryEntry.findOne({
    user: userId,
    date: { $gte: new Date().setHours(0, 0, 0, 0), $lt: new Date().setHours(23, 59, 59, 999) },
  });
  diaryEntry.consumedProducts = diaryEntry.consumedProducts.filter(
    (product) => product.productName.toString() !== productId
  );
  await diaryEntry.save();
  return diaryEntry;
};

const getInfoSelectedDay = async (userId, date) => {
  return await DiaryEntry.findOne({
    user: userId,
    date: { $gte: date.setHours(0, 0, 0, 0), $lt: date.setHours(23, 59, 59, 999) },
  });
};

module.exports = {
  createDailyIntakeBalance,
  getProducts,
  addIntakeProduct,
  deleteIntakeProduct,
  getInfoSelectedDay,
};
