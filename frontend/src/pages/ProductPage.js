import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FaShoppingCart } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import "./ProductPage.css";

const ProductPage = () => {
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [priceWithTax, setPriceWithTax] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("Small");
  const [showModal, setShowModal] = useState(false);
  const [currentQuantity, setCurrentQuantity] = useState(1);

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
      setCurrentQuantity(value);
      updatePrice(value);
    }
  };

  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    setCurrentQuantity(newQuantity);
    updatePrice(newQuantity);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      setCurrentQuantity(newQuantity);
      updatePrice(newQuantity);
    }
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const updatePrice = (newQuantity) => {
    const priceBeforeTax = product.price * newQuantity;
    const totalPriceWithTax = priceBeforeTax * 1.25;
    setPriceWithTax(totalPriceWithTax.toFixed(2));
  };

  const addToCart = async () => {
    try {
      setShowModal(true);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleBuyNow = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API}/cart`, {
        productId: product._id,
        quantity: currentQuantity,
        color: selectedColor,
        size: selectedSize,
      });
      alert("Purchase complete! Cart cleared.");
      setCurrentQuantity(1);
      setPriceWithTax(product.price * 1.25);
      setShowModal(false);
      setQuantity(1);
    } catch (error) {
      console.error("Error processing purchase:", error);
    }
  };

  if (!product) return null;

  return (
    <div className="product-page container mt-3">
      <header className="mb-2 d-flex justify-content-between align-items-center">
        <h1 className="logo">FashionHub</h1>
        <Link
          onClick={() => setShowModal(true)}
          className="cart-icon position-relative"
        >
          <FaShoppingCart size={30} />
          {quantity > 0 && (
            <span className="badge bg-danger top-0 translate-middle">
              {quantity}
            </span>
          )}
        </Link>
      </header>

      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="#">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="#">{product.category}</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

     <div className="row">
        <div className="col-md-6 p-0">
          <div className="product-images">
            <img
              src={images[currentImageIndex]}
              alt={product.name}
              className="rounded main-image"
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

        <div className="col-md-6 p-0">
          <div className="product-details">
            <h1 className="product-title">
              {product.name}
            </h1>
            <p className="price h3">
              <i className="fas fa-dollar-sign icon"></i>
              {product.price.toFixed(2)}
            </p>
            <div className="ratings mb-2">
              <span className="badge bg-warning text-dark">
                <i className="fas fa-star icon"></i> 4.8
              </span>
              <Link to="#reviews" className="ms-2 text-muted">
                <i className="fas fa-comment-alt icon"></i> 67 Reviews
              </Link>
            </div>
            <p className="text-success">
              <i className="fas fa-thumbs-up icon"></i> 93% of buyers have
              recommended this product.
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
              <div className="btn-group size-options" role="group">
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
            <div className="add-to-cart">
              <button onClick={addToCart} className="add-to-cart-btn">
                ${priceWithTax} Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div> 

      <div className="description mt-2">
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

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Body className="modal-body-custom">
          <button
            type="button"
            className="close custom-close"
            aria-label="Close"
            onClick={() => setShowModal(false)}
          >
            <span aria-hidden="true">&times;</span>
          </button>

          <div className="modal-product-details">
            <img
              src={product.images[0]} // Assuming you have a product image URL
              alt={product.name}
              className="modal-product-image"
            />
            <div className="modal-product-info">
              <h5 className="modal-product-name">{product.name}</h5>
              <div className="modal-product-options">
                <div
                  className="modal-color-circle"
                  style={{ backgroundColor: selectedColor }}
                ></div>
                <span className="modal-size-badge">{selectedSize}</span>
              </div>
            </div>
            <div className="modal-quantity-controls">
              <button className="modal-quantity-btn" onClick={handleDecrease}>
                -
              </button>
              <span className="modal-quantity-number">{currentQuantity}</span>
              <button className="modal-quantity-btn" onClick={handleIncrease}>
                +
              </button>
            </div>
          </div>

          {/* <div className="mt-4">
          <h5>Total Price: ${priceWithTax}</h5>
        </div> */}
          <div className="buy-now-container">
            <Link to="#">
              <button className="buy-now-btn" onClick={handleBuyNow}>
                ${priceWithTax} Buy Now
              </button>
            </Link>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProductPage;
