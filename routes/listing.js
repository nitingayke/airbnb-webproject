const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

const { storage } = require("../cloudConfig.js");
const multer = require("multer");
const upload = multer({ storage });



router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.newListing));


router.get("/category", wrapAsync(listingController.searchedListing));

// New Listings
router.get("/new", isLoggedIn, listingController.newFormRender);

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))
    .delete(isOwner, wrapAsync(listingController.deleteListing));


// ------------------edit route-----------------------------
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

// delete route
router.delete("/:id", isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;