const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
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
    data: "hey you hit user API endpoint",
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
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  color: { type: String, required: true },
  size: { type: String, required: true },
  timestamp: { 
    type: Date, 
    required: true, 
    default: () => {
      // Get the current UTC time
      const now = new Date();
      const bangladeshOffset = 6 * 60 * 60 * 1000; 

      // Create a new Date object adjusted to Bangladesh time
      return new Date(now.getTime() + bangladeshOffset);
    }
  }
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
  


// port
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));