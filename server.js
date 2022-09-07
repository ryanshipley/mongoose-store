const express = require("express");
const app = express();
const mongoose = require("mongoose");
require('dotenv').config();
const Product = require("./models/products");
const methodOverride = require("method-override");

const db = mongoose.connection
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

db.on('error', (err) => console.log(err.message + ' is mongo not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));

app.use(express.urlencoded({ extended: true}));
app.use(methodOverride("_method"));

app.get("/products", (req, res)=>{
    Product.find({}, (error, allProducts)=>{
        res.render("index.ejs", {
            products : allProducts,
        });
    });
});

app.get('/products/new', (req, res) => {
    res.render('new.ejs');
});

// Delete
app.delete("/products/:id", (req, res) => {
	Product.findByIdAndDelete(req.params.id, (err, data) => {
		res.redirect("/products");
	});
});

// Update
app.put("/products/:id", (req, res) => {  
	Product.findByIdAndUpdate(
	  req.params.id,
	  req.body,
	  {
		new: true,
	  },
	  (error, updatedProduct) => {
		res.redirect(`/products/${req.params.id}`);
	  }
	)
  })


// Create
app.post("/products", (req, res)=>{
    Product.create(req.body, (error, createdProduct)=>{
        res.redirect("/products");
    });
});

// Edit
app.get("/products/:id/edit", (req, res) => {
	Product.findById(req.params.id, (error, foundProduct) => {
	  res.render("edit.ejs", {
		product: foundProduct,
	  });
	});
  });


// Show
app.get('/products/:id', (req, res) => {
	Product.findById(req.params.id, (err, foundProduct) => {
		res.render('show.ejs', {
			product: foundProduct,
            //document.getElemenyById("purchase").addEventListener("click", subtract(){product.qty -1;})
		});
	});
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log("hello"));