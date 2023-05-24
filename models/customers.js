const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const customerSchema = new Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    items: {
        type: Array,
        required: true
    },
    total:{
        type: Number,
        required: true
    }
});

customerSchema.index({ email: 1 } , {unique: true});

module.exports = mongoose.model("Customer", customerSchema);