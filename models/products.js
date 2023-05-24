const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const productSchema = new Schema({
    image: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    category:{
        type:String,
        required: true
    },
    qty: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("product", productSchema);