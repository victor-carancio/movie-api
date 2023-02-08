const express = require("express");
const router = express.Router();

const {
  getAllFavorites,
  getFavorite,
  createFavorite,
  updateFavorite,
  deleteFavorite,
} = require("../controllers/favoriteController");

router.route("/").get(getAllFavorites);
router
  .route("/:id")
  .get(getFavorite)
  .post(createFavorite)
  .patch(updateFavorite)
  .delete(deleteFavorite);

module.exports = router;
