import React, { useMemo } from 'react';
import BackButton from '../components/BackButton';
import SwipeToOrderButton from '../components/SwipeToOrderButton';
import UserDetailsForm from '../components/UserDetailsForm';

const CheckoutPage = ({
  page, cart, userData, setUserData, cookingInstructions,
  updateCartQuantity, handleOrderPlace, navigateTo
}) => {
  const isTakeAway = userData.mode === 'Take Away';
  const deliveryCharge = isTakeAway ? 50 : 0;
  const taxes = 5.00;
  const cartTotal = useMemo(() => cart.reduce((acc,i)=>acc + i.price*i.quantity,0), [cart]);
  const grandTotal = cartTotal + deliveryCharge + taxes;

  return (
    <div className="checkout-page-container">
      <div className="page-header">
        <BackButton onClick={() => navigateTo('home')} />
        <h1 className="page-title">Place Your Order Here</h1>
      </div>

      <div className="mode-toggle-wrapper">
        <div className="mode-toggle-group">
          <button
            className={`mode-toggle-button ${!isTakeAway ? 'active' : ''}`}
            onClick={() => setUserData(p => ({ ...p, mode: 'Dine In' }))}
          >
            Dine In
          </button>
          <button
            className={`mode-toggle-button ${isTakeAway ? 'active' : ''}`}
            onClick={() => setUserData(p => ({ ...p, mode: 'Take Away' }))}
          >
            Take Away
          </button>
        </div>
      </div>

      {page === 'checkout' && (
        <UserDetailsForm
          userData={userData}
          setUserData={setUserData}
          onNext={() => navigateTo('details')}
          currentPage={page}
        />
      )}

      {page === 'details' && (
        <div style={{flexGrow:1, overflowY:'auto', padding:'1.25rem'}}>
          {/* render order items, cooking instructions modal trigger, bill summary */}
        </div>
      )}

      {page === 'details' && <SwipeToOrderButton handleOrderPlace={handleOrderPlace} grandTotal={grandTotal} />}
    </div>
  );
};

export default CheckoutPage;
