import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductPage from './pages/ProductPage';
import 'bootstrap/dist/css/bootstrap.min.css';

const App=()=> {
  return (
    <Router>
    <Routes>
      <Route path="/products/:id" element={<ProductPage/>} />
    </Routes>
  </Router>
  );
}

export default App;
