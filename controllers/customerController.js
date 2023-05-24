const Customer = require("../models/customers");
const productController = require("../controllers/productController");
const transactions = require("../models/transactions");
exports.createCustomer = async (req, res, next) => {
    console.log(req.body);
    var fname = req.body.fname;
	var lname = req.body.lname;
	var email = req.body.email;
	var password = req.body.password;
	var gender =req.body.gender;
	var items = [];
	var total = 0;
    const customer = new Customer({ fname, lname, email, password, gender, items, total });
    const savedCustomer = await customer.save();
    res.redirect("/HomePage");
};

exports.signIn = async (req, res, next) => {
    try {
		//! Check if the user exists
		var email = req.body.email;
		const user = await Customer.findOne({ email : email });
		console.log(user);
		if (user) {
			//! Check if password matches
			const result = req.body.password === user.password;
			if (result) {
                req.session.userId = user._id;
                console.log(req.session);
				console.log("Loggin Page Hit !")
				res.redirect("/HomePage");
			} else {
				console.log("Incorrect Password !")
				res.redirect("/HTML/SignIn.html");
			}
		} else {
			console.log("No Such User !")
			res.redirect("/HTML/SignIn.html");
		}
	} catch (error) {
		console.log("Request Error !")
		res.status(500).json({ error });
	}
};

exports.signOut = async (req, res, next) => {
    req.session.destroy((err) => {
		if (err) {
		  console.log('Error destroying session:', err);
		} else {
		  res.redirect('/SignIn.html');
		}
	  });
};

exports.getCustomers = async (req, res, next) => {
    const customers = await Customer.find();
    res.status(201).json({
        message: customers.length ? "All Customers" : "No Registered Customers",
        customers: customers
    });
};

exports.buyItem = async (req, res, next) => {
    productController.buyProduct(req, res, next);
};
exports.checkOut = async (req, res, next) => {
    productController.checkOut(req, res, next);
};
exports.getProfile = async (req, res, next) => {
    const customer = await Customer.findOne({_id: req.session.userId})
    if (customer){
		const Transactions = await transactions.find({CID: req.session.userId})
		var spent = 0;
		console.log(Transactions[0]);
		for (let i=0; i<Transactions.length; i++){
			spent += Transactions[i].total;
		}
        res.render('profile', { customer: customer , spent: spent})
    }
};