const mongoose = require('mongoose');

console.log("Connecting to the database...");
mongoose.connect(process.env.MONGO_URL, {}, (error) => {
    if(error) {
        throw error;
    }
    console.log("Connected to the database");

});

module.exports = mongoose;


