const express = require("express");
const {
  createUser,
  getAllUsers,
  getClientUsers,
  getDriverUsers,
  getOneUser,
  updateUser,
  deleteUser,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  loginUser,
  logoutUser,
  updateReview,
} = require("../controllers/userController");

const {
  authenticate,
  authorizedAdmin,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router
  .route("/")
  .get(authenticate, authorizedAdmin, getAllUsers)
  .post(authenticate, createUser);

router.get("/clients", authenticate, authorizedAdmin, getClientUsers);
router.get("/drivers", authenticate, authorizedAdmin, getDriverUsers);

router.post("/auth", loginUser);
router.post("/logout", logoutUser);

router
  .route("/current")
  .get(authenticate, getCurrentUserProfile)
  .put(authenticate, updateCurrentUserProfile);

router.put("/review/:id", authenticate, updateReview);

router
  .route("/:id")
  .get(authenticate, getOneUser)
  .put(authenticate, authorizedAdmin, updateUser)
  .delete(authenticate, authorizedAdmin, deleteUser);

module.exports = router;
