const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
// const { readdirSync } = require("fs");
require("dotenv").config();

// app
const app = express();

// db
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true 
  })
  .then(() => console.log("DB CONNECTED"))
  .catch((err) => console.log("DB CONNECTION ERR", err));

// middlewares
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(cors());


app.get("/api", (req, res) => {
  res.json({
    data: "hey you hit user API endpoint lol",
  });
});


// Models
const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    benefits: Array,
    details: Array,
    images: [{ type: String }],
    colors: Array,
    sizes: Array,
    category: String
  });
  
  const CartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    color: String,
    size: String,
    timestamp: Date
  });
  
const Product = mongoose.model('Product', ProductSchema);
const CartItem = mongoose.model('CartItem', CartItemSchema);


// API routes
app.get('/api/product/:id', async (req, res) => {
    try {
      const product = await Product.findById(req.params.id).populate('images').exec();
      res.json(product);
    } catch (error) {
      res.status(404).json({ message: 'Product not found' });
    }
  });
  
app.post('/api/cart', async (req, res) => {
    try {
      const cartItem = new CartItem(req.body);
      await cartItem.save();
      res.json({ cartItems: await CartItem.find().sort({ timestamp: -1 }).limit(100) });
    } catch (error) {
      res.status(400).json({ message: 'Failed to add item to cart' });
    }
  });
  
app.put('/api/cart/:id', async (req, res) => {
    try {
      const cartItem = await CartItem.findByIdAndUpdate(
        req.params.id,
        { $set: { quantity: req.body.quantity } },
        { new: true }
      );
      res.json({ cartItems: await CartItem.find().sort({ timestamp: -1 }).limit(100) });
    } catch (error) {
      res.status(404).json({ message: 'Cart item not found' });
    }
  });
  
app.delete('/api/cart/:id', async (req, res) => {
    try {
      await CartItem.findByIdAndDelete(req.params.id);
      res.json({ message: 'Item removed from cart successfully' });
    } catch (error) {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  });


// port
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));