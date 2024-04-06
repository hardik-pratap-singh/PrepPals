const express = require("express");
const { protect } = require("../middleware/auth");

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  getPointsAndReviews , 
  addPointAndReview
} = require("../controllers/auth");

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:resetToken").put(resetPassword);
router.route("/getPointsAndReviews").post(getPointsAndReviews)
router.route("/addPointsAndReviews").post(addPointAndReview)
// router.route("/getPointsAndReviews").post(protect , getPointsAndReviews)


module.exports = router;




