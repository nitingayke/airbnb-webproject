const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Calling to the main function
main()
.then((res) => {
    console.log("Connect Successfuly.");
}).catch((err) => {
    console.log(err);
});

//  this url used to connect the DATABASE   wanderlust: this is collection name(db name);
async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async() => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "66b745e00cf464956abad5c9",
    }));

    await Listing.insertMany(initData.data);
}

initDB();