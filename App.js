import React from 'react';
import CheckoutForm from './CheckoutForm';
import logo from './logo.jpg'; 
import productImage from './img.jpg';
import './index.css';

const App = () => {
  return (
    <div className="container">
      <div className="sidebar">
        <img src={logo} alt="Logo" className="logo" />
        <img src={productImage} alt="Product" className="product-image" />
        <div className="footer">Powered by Stripe</div>
      </div>
      <div className="content">
        <header className="App-header">
          <h1>Herbivore</h1>
          <CheckoutForm />
        </header>
      </div>
    </div>
  );
};

export default App;
