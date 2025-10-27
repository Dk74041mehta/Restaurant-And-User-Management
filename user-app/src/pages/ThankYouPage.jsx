import React from "react";
import { Link } from "react-router-dom";

const ThankYouPage = () => {
  return (
    <div className="thankyou">
      <h2>🎉 Thank You for Your Order!</h2>
      <p>Your food will arrive soon.</p>
      <Link to="/">Back to Home</Link>
    </div>
  );
};

export default ThankYouPage;
