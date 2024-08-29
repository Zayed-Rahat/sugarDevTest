import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import "./ProductPage.css";
import ProductCart from "./ProductCart";

const ProductPage = () => {
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [priceWithTax, setPriceWithTax] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("Small");
  const [showModal, setShowModal] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    fetchProduct(id);
  }, [id]);

  useEffect(() => {
    if (product) {
      updatePrice(quantity);
    }
  }, [quantity, product]);

  const fetchProduct = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/product/${id}`
      );
      setProduct(response.data);
      setImages(response.data.images);
      setSelectedColor(response.data.colors[0]);
      setSelectedSize(response.data.sizes[0]);
      updatePrice(quantity);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
  };

  const handleQuantityChange = (value) => {
    if (value >= 1) {
      setQuantity(value);
      updatePrice(value);

    }
  };

  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    updatePrice(newQuantity);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      updatePrice(newQuantity);
    }
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    // setSize(size);
  };

  const updatePrice = (newQuantity) => {
    const priceBeforeTax = product.price * newQuantity;
    const totalPriceWithTax = priceBeforeTax * 1.25;
    setPriceWithTax(totalPriceWithTax.toFixed(2));
  };

  const addToCart = async () => {
    try {
      setShowModal(true);
      // setTotalPrice(calculateTotalPrice(product.price, quantity));
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  if (!product) return null;

  return (
    <div className="product-page container mt-5">
      <header className="mb-4">
        <h1 className="logo">FashionHub</h1>
      </header>

      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/category">{product.category}</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="row">
        <div className="col-md-6">
          <div className="product-images">
            <img
              src={images[currentImageIndex]}
              alt={product.name}
              className="img-fluid rounded main-image"
            />
            <div className="image-gallery mt-3 d-flex justify-content-center">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={product.name}
                  onClick={() => handleImageChange(index)}
                  className={`img-thumbnail ${
                    currentImageIndex === index ? "active" : ""
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="product-details">
            <h1>{product.name}</h1>
            <p className="price h3">${product.price.toFixed(2)}</p>
            <div className="ratings mb-2">
              <span className="badge bg-warning text-dark">4.8</span>
              <Link to="#reviews" className="ms-2 text-muted">
                67 Reviews
              </Link>
            </div>
            <p className="text-success">
              93% of buyers have recommended this product.
            </p>

            <div className="mt-4">
              <h4>Choose a Color</h4>
              <div className="d-flex color-options">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    className={`color-circle ${
                      selectedColor === color ? "active" : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange(color)}
                  />
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h4>Choose a Size</h4>
              <div className="btn-group" role="group">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`btn btn-outline-secondary ${
                      selectedSize === size ? "active" : ""
                    }`}
                    onClick={() => handleSizeChange(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="quantity-section mt-4">
              <h4>Quantity</h4>
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-outline-secondary"
                  onClick={handleDecrease}
                >
                  -
                </button>
                <input
                  type="number"
                  className="form-control text-center mx-2"
                  value={quantity}
                  onChange={(e) =>
                    handleQuantityChange(parseInt(e.target.value))
                  }
                  min="1"
                  max="100"
                />
                <button
                  className="btn btn-outline-secondary"
                  onClick={handleIncrease}
                >
                  +
                </button>
              </div>
            </div>

            <div className="price-with-tax mb-3 h4">
              ${priceWithTax} Add To Cart
            </div>

            <button onClick={addToCart} className="btn btn-primary w-100">
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <div className="description mt-5">
        <div className="product-description-section mt-5">
          <ul className="nav nav-tabs" id="description-tab" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active"
                id="description-tab-btn"
                data-bs-toggle="tab"
                data-bs-target="#description"
                type="button"
                role="tab"
                aria-controls="description"
                aria-selected="true"
              >
                Description
              </button>
            </li>
          </ul>
          <div className="tab-content" id="description-tab-content">
            <div
              className="tab-pane fade show active"
              id="description"
              role="tabpanel"
              aria-labelledby="description-tab-btn"
            >
              <h2 className="mt-4">Product Description</h2>
              <p>{product.description}</p>

              <h2>Benefits</h2>
              <ul className="benefits-list">
                {product.benefits.map((benefit) => (
                  <li key={benefit}>
                    <i className="bi bi-check-circle-fill"></i> {benefit}
                  </li>
                ))}
              </ul>

              <h2>Product Details</h2>
              <ul className="details-list">
                {product.details.map((detail, index) => (
                  <li key={index}>
                    <i className="bi bi-check-circle-fill"></i> {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <ProductCart
        show={showModal}
        handleClose={() => setShowModal(false)}
        product={{
          name: product.name,
          price: product.price,
          color: selectedColor,
          size: selectedSize,
          quantity: quantity,
        }}
        products={product}
        handleQuantityChange={handleQuantityChange}
      />
    </div>
  );
};

export default ProductPage;
