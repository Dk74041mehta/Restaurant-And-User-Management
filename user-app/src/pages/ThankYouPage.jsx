import React, { useEffect } from 'react';

const ThankYouPage = ({ countdown, navigateTo }) => {
  useEffect(() => {
    if (countdown === 0) {
      navigateTo('home');
    }
  }, [countdown, navigateTo]);

  return (
    <div className="thank-you-container">
      <div className="check-mark-bg">
        <svg className="check-mark-svg" width="64" height="64" viewBox="0 0 52 52">
          <polyline points="14,26 24,36 38,18" />
        </svg>
      </div>
      <h1 style={{fontSize:'1.875rem',fontWeight:'800',marginBottom:'0.5rem'}}>Thanks For Ordering</h1>
      <p style={{fontSize:'1.25rem',fontWeight:'300'}}>Redirecting in {countdown}</p>
    </div>
  );
};

export default ThankYouPage;
