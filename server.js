const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { find } = require("./models/products");
require('dotenv').config();
const Product = require("./models/products");

const db = mongoose.connection
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

db.on('error', (err) => console.log(err.message + ' is mongo not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));

app.use(express.urlencoded({ extended: true}));

app.post("/products", (req, res)=>{
    Product.create(req.body, (error, createdProduct)=>{
        res.send(createdProduct);
    });
});

app.get("/products", (req, res)=>{
    Product.find({}, (error, allProducts)=>{
    res.render("index.ejs", {
        products : allProducts,
        });
    });
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log("hello"));