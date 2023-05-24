const Product = require("../models/products");
const Customer = require("../models/customers");
const Transaction = require("../models/transactions");
var db = require("../database.js");
const ObjectId = require('mongodb').ObjectId;
const mongoose = require("mongoose");
const { session } = require("passport");
exports.createProduct = async (req, res, next) => {
    const name = req.body.name;
    const price = req.body.price;
    const author = req.body.author;
    const genre = req.body.genre;
    const quantity = req.body.quantity;
    const product = new Product({ name, price, author, genre, quantity });
    const savedProduct = await product.save();
    res.status(201).json({
        message: "New Product Added",
        product: savedProduct
    });
};

exports.buyProduct = async (req, res, next) => {
    const CID = req.session.userId;
    const PID = req.body.id;
    console.log(CID, PID);
    const product = await Product.findOne({ _id: PID });
    const customer = await Customer.findOne({ _id: CID });
    if (!customer) {
        res.redirect("/HTML/SignIn.html");
    }
    else if (!product) {
        res.redirect("/Section");
    }
    else {
        if (product.qty > 0) {
            customer.items.push(product._id);
            customer.total += product.price;
            customer.total = customer.total.toFixed(2);
            const Ncustomer = await customer.save();
            res.status(201);
        }
        else {
            res.redirect("/Section");
        }
    }
};
exports.removeProduct = async (req, res, next) => {
    const CID = req.session.userId;
    const PID = req.body.id;
    console.log(CID, PID);
    const product = await Product.findOne({ _id: PID });
    const customer = await Customer.findOne({ _id: CID });
    if (!customer) {
        res.redirect("/HTML/SignIn.html");
    }
    else if (!product) {
        res.redirect("/cart");
    }
    else {
        const NPID = new ObjectId(PID);
        const index = customer.items.findIndex(item => item.equals(NPID));
        if (index !== -1) {
            customer.items.splice(index, 1);
        }
        customer.total -= product.price;
        customer.total = customer.total.toFixed(2);
        const Ncustomer = await customer.save();
        res.redirect("/cart");
    }
};
exports.checkOut = async (req, res, next) => {
    const CID = req.session.userId;
    const customer = await Customer.findOne({ _id: CID });
    var total = customer.total / 10;
    total += customer.total;
    const items = customer.items;
    for (let i = 0; i < items.length; i++) {
        PID = items[i];
        const product = await Product.findOne({ _id: PID });
        product.qty -= 1;
        await product.save();
    }
    const transaction = new Transaction({ CID, items, total });
    const newTransaction = await transaction.save();
    customer.items = [];
    customer.total = 0;
    cart = await customer.save()
    res.redirect("/cart");
};
exports.getProductURL = async (req, res, next) => {
    const ID = req.params.id;
    const product = await Product.findOne({ _id: ID })
    res.status(201).json({
        message: product ? "Product found" : "Product not found",
        product: product
    });
};
exports.ListProduct = async (req, res, next) => {
    const condition = {
        $and: [
            { category: req.body.category },
            { qty: { $ne: 0 } }
        ]
    };
    let products = await db.collection('products').find(condition).toArray(function (err, result) {
        if (err) throw err;
        console.log(result);

    });
    const userId = req.session.userId;
    res.render('List', { products: products, userId, istop: false });
}

exports.getProduct = async function (req, res) {
    //console.log(req.body.id)
    let item = await db.collection('products').findOne({ _id: new ObjectId(req.body.id) })
    //console.log(item)
    const userId = req.session.userId;
    res.render('Product', { product: item, userId });
};