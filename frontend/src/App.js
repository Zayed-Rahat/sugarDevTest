// import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductPage from './pages/ProductPage';
import 'bootstrap/dist/css/bootstrap.min.css';

const App=()=> {
  return (
    <Router>
    <Routes>
      <Route path="/products/:id" element={<ProductPage/>} />
      {/* <Route path="/cart" component={Cart} /> */}
    </Routes>
    {/* <Modal isOpen={isModalOpen} onClose={handleToggleModal} cartItems={cartItems} /> */}
  </Router>
  );
}

export default App;
