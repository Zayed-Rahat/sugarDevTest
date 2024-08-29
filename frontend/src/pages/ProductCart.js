import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";

const ProductCart = ({
  show,
  handleClose,
  product,
  quantity,
  handleQuantityChange,
}) => {
  const [currentQuantity, setCurrentQuantity] = useState(quantity);
  const [priceWithTax, setPriceWithTax] = useState(product.price);

  useEffect(() => {
    updatePrice(currentQuantity);
  }, [currentQuantity]);

  const updatePrice = (newQuantity) => {
    const totalPriceWithTax = product.price * newQuantity;
    // const totalPriceWithTax = priceBeforeTax * 1.25;
    setPriceWithTax(totalPriceWithTax.toFixed(2));
  };

  const handleIncrease = () => {
    const newQuantity = currentQuantity + 1;
    setCurrentQuantity(newQuantity);
    handleQuantityChange(newQuantity);
    updatePrice(newQuantity);
  };

  const handleDecrease = () => {
    if (currentQuantity > 1) {
      const newQuantity = currentQuantity - 1;
      setCurrentQuantity(newQuantity);
      handleQuantityChange(newQuantity);
      updatePrice(newQuantity);
    }
  };

  const handleBuyNow = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API}/cart`, {
        productId: product._id,
        quantity: currentQuantity,
        color: product.color,
        size: product.size,
      });
      alert("Purchase complete! Cart cleared.");
      setCurrentQuantity(1);
      setPriceWithTax(product.price);
      handleClose();
    } catch (error) {
      console.error("Error processing purchase:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Cart Summary</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5>{product.name}</h5>
            <p>Color: {product.color}</p>
            <p>Size: {product.size}</p>
          </div>
          <div className="d-flex flex-column align-items-center">
            <Button variant="outline-secondary" onClick={handleDecrease}>
              -
            </Button>
            <span>{currentQuantity}</span>
            <Button variant="outline-secondary" onClick={handleIncrease}>
              +
            </Button>
          </div>
        </div>
        <div className="mt-4">
          <h5>Total Price: ${priceWithTax}</h5>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleBuyNow}>
          Buy Now
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductCart;
