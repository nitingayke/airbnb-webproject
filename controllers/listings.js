const Listing = require("../models/listing.js");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res, next) => {
    let allListings = await Listing.find({});
    return res.render("./listings/index.ejs", { allListings });
};

module.exports.searchedListing = async (req, res) => {
    const query = req.query.query;
    
    let allListings = await Listing.find({category: query});
    return res.render("./listings/index.ejs", {allListings});
};

module.exports.newFormRender = (req, res) => {
    return res.render("./listings/new.ejs");// console.log(req.user);// this is user to get current login user
};

module.exports.showListing = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({ path: "reviews", populate: ("author"), }).populate("owner");

    if (!listing) {
        req.flash("error", "Listing Does Not Found.");
        return res.redirect("/listings");
    }

    return res.render("./listings/show.ejs", { listing });
};

module.exports.newListing = async (req, res, next) => {

    // github mapbox-sdk-js documentation
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send()
 

    let url = req.file.path;
    let filename = req.file.filename;
    let newListings = new Listing({
        ...req.body.listing,
        owner: req.user._id,
        image: {url, filename},
        geometry: response.body.features[0].geometry
    });

    let savedListing = await newListings.save();
    req.flash("success", "New Listing Created!");
    return res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }

    let originalURL = listing.image.url;
    originalURL = originalURL.replace("/upload", "/upload/w_250");
    res.render("./listings/edit.ejs", { listing, originalURL });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing Updated");
    return res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res, next) => {

    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
};