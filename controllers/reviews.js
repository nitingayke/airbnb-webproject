const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newreview = new Review(req.body.review);
    newreview.author = req.user._id;
    listing.reviews.push(newreview);

    await newreview.save();
    let curr = await listing.save();
   
    req.flash("success", "new review created");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});// it will delete the id form the listing.review array
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
};