const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const listingController = require("../controllers/reviews.js");


// add reviews
router.post("/",isLoggedIn, validateReview, wrapAsync(listingController.createReview));
// delete review route
router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync( listingController.deleteReview));

module.exports = router;