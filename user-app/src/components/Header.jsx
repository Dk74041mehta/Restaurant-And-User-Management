import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <h1> Restaurant App</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/checkout">Checkout</Link>
        <Link to="/thankyou">Thank You</Link>
      </nav>
    </header>
  );
};

export default Header;
