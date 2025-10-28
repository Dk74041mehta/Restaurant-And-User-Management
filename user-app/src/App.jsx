import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Styling 
const rawCssStyles = `
  body {
    background-color: #f0f0f0;
    font-family: 'Inter', sans-serif;
  }

  /* Main App Container */
  .app-container {
    max-width: 512px; /* Equivalent to max-w-lg */
    margin: 0 auto;
    min-height: 100vh;
    background-color: white;
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.1);
    position: relative;
    display: flex;
    flex-direction: column;
  }

  /* Scrollbar Hide Utility */
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none; 
    scrollbar-width: none;
  }

  /* Header Styles */
  .header-sticky {
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 10;
    padding-left: 1.25rem;
    padding-right: 1.25rem;
    padding-top: 3rem; 
    padding-bottom: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  
  /* Search Input */
  .search-wrapper {
    position: relative;
    margin-bottom: 1.25rem;
  }
  .search-input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 3rem;
    color: #374151;
    background-color: #F3F4F6;
    border: 1px solid #E5E7EB; 
    border-radius: 0.75rem; 
    outline: none;
    transition: border-color 150ms;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.06);
  }
  .search-input:focus {
    border-color: #CCCCCC; 
    box-shadow: 0 0 0 1px #cccccc91; 
  }
  .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #6B7280; 
  }

  /* Category Navigation */
  .category-nav {
    display: flex;
    overflow-x: scroll;
    padding-bottom: 0.5rem;
  }
  .category-list {
    display: flex;
    gap: 0.75rem; 
    padding-bottom: 0.5rem;
  }
  .category-button {
    padding: 0.5rem 1.25rem;
    border-radius: 9999px;
    font-size: 1rem;
    font-weight: 600;
    transition: all 200ms;
    flex-shrink: 0;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  }
  .category-button-default {
    background-color: white;
    color: #4B5563; 
    border: 1px solid #E5E7EB; 
  }
  .category-button-default:hover {
    background-color: #F9FAFB;
  }
  .category-button-active {
    background-color: #CCCCCC; 
    color: white;
    box-shadow: 0 10px 15px -3px #fcf7f7f5, 0 4px 6px -4px #fcf7f7f5;
  }

  /* Menu Item Card */
  .menu-item-list {
    padding: 1.25rem;
    padding-top: 0.75rem;
    padding-bottom: 5rem; 
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .menu-item-card {
    display: flex;
    align-items: center;
    padding: 0.75rem;
    background-color: white;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06);
    border: 1px solid #F3F4F6;
  }
  .item-image {
    width: 4rem;
    height: 4rem;
    border-radius: 0.5rem;
    flex-shrink: 0;
    margin-right: 1rem;
    overflow: hidden;
    background-color: #F3F4F6;
  }
  .item-details {
    flex-grow: 1;
  }
  .item-name {
    font-weight: 600;
    color: #1F2937; 
  }
  .item-price {
    font-size: 1.125rem;
    font-weight: 800;
    color: #CCCCCC; 
  }

  /* Quantity Controls */
  .quantity-controls {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    background-color: #F3F4F6;
    border-radius: 9999px;
    padding: 0.25rem;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  .quantity-button {
    width: 2rem;
    height: 2rem;
    border-radius: 9999px;
    font-weight: 700;
    font-size: 1.125rem;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 150ms;
  }
  .quantity-button-add {
    background-color: #CCCCCC;
    color: white;
    box-shadow: 0 2px 4px #fcf7f7f5;
  }
  .quantity-button-add:hover {
    background-color: #CCCCCC;
  }
  .quantity-button-remove {
    background-color: #CCCCCC; 
    color: #1b1a1aff;
  }
  .quantity-button-remove:hover {
    background-color: #CCCCCC; 
  }
  .quantity-display {
    width: 1.5rem;
    text-align: center;
    font-weight: 700;
    color: #1F2937;
  }
  
  /* Simple Add Button */
  .add-button-plus {
    width: 2.5rem;
    height: 2.5rem;
    background-color: #CCCCCC;
    color: white;
    border-radius: 9999px;
    font-weight: 700;
    font-size: 1.25rem;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 6px #fcf7f7f5;
    transition: background-color 150ms;
  }
  .add-button-plus:hover {
    background-color: #CCCCCC;
  }

  /* Fixed Checkout Footer */
  .footer-checkout {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 1rem;
    background-color: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(4px);
    box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.1);
    max-width: 512px;
    margin: 0 auto;
    z-index: 20;
  }
  .checkout-button-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #CCCCCC;
    padding: 1rem;
    border-radius: 0.75rem;
    box-shadow: 0 10px 15px #fcf7f7f5;
    color: white;
    cursor: pointer;
    transition: background-color 150ms;
  }
  .checkout-button-bar:hover {
    background-color: #CCCCCC;
  }
  .checkout-summary-text {
    font-size: 1rem;
    font-weight: 500;
  }
  .checkout-next-text {
    font-size: 1.125rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  /* Checkout/Details Page Styles */
  .checkout-page-container {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    padding-bottom: 4rem; /* For sticky footer/swipe button */
  }
  .page-header {
    background-color: white;
    border-bottom: 1px solid #F3F4F6;
    padding: 1rem 1.25rem 1rem 0.5rem;
    display: flex;
    align-items: center;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    position: sticky;
    top: 0;
    z-index: 20;
  }
  .page-title {
    flex-grow: 1;
    text-align: center;
    font-size: 1.25rem;
    font-weight: 700;
    color: #1F2937;
    margin-left: -2rem; 
  }

  /* Mode Toggle */
  .mode-toggle-wrapper {
    padding: 1rem 1.25rem 0;
  }
  .mode-toggle-group {
    display: flex;
    background-color: #F3F4F6;
    padding: 0.25rem;
    border-radius: 9999px;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  .mode-toggle-button {
    flex: 1;
    padding: 0.5rem 0;
    font-weight: 600;
    border-radius: 9999px;
    transition: all 200ms;
    color: #6B7280;
    border: none;
    background: transparent;
  }
  .mode-toggle-button.active {
    background-color: white;
    color: #CCCCCC;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  /* User Details Form */
  .details-form-container {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding: 1.25rem;
    background-color: white;
    flex-grow: 1;
  }
  .details-form-title {
    font-size: 1.25rem;
    font-weight: 700;
    text-align: center;
    color: #1F2937;
  }
  .form-input, .form-textarea, .form-select {
    /* FIX: Ensure proper box model and width */
    width: 100%;
    min-width: 0; 
    box-sizing: border-box; 
    padding: 1rem;
    border: 1px solid #E5E7EB;
    border-radius: 0.75rem;
    background-color: #F9FAFB;
    transition: all 150ms;
    outline: none;
    white-space: nowrap; 
    overflow: hidden;
    text-overflow: ellipsis; 
  }
  .form-input:focus, .form-textarea:focus, .form-select:focus {
    border-color: #CCCCCC;
    box-shadow: 0 0 0 1px #ccccccc5;
  }
  .form-textarea {
    resize: none;
    white-space: normal; 
    overflow: auto;
  }
  .form-submit-button {
    width: 100%;
    padding: 1rem;
    color: white;
    font-weight: 700;
    border-radius: 9999px;
    transition: all 200ms;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  .form-submit-button:not(:disabled) {
    background-color: #CCCCCC;
    box-shadow: 0 8px 10px #fcf7f7f5;
  }
  .form-submit-button:not(:disabled):hover {
    background-color: #CCCCCC;
  }
  .form-submit-button:disabled {
    background-color: #9CA3AF; 
    cursor: not-allowed;
  }

  /* checkout Details*/
  .order-list-card {
    padding: 1rem;
    border: 1px solid #F3F4F6;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  }
  .order-item-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #E5E7EB;
  }
  .order-item-row:last-child {
    border-bottom: none;
  }
  .order-item-name {
    font-weight: 500;
    color: #374151;
  }
  .order-item-price {
    font-weight: 700;
    color: #CCCCCC;
    font-size: 0.875rem;
  }
  
  /* Cooking Instructions Button */
  .instructions-button {
    width: 100%;
    padding: 1rem;
    text-align: center;
    color: #4B5563;
    font-weight: 600;
    border: 2px dashed #D1D5DB;
    border-radius: 0.75rem;
    background-color: white;
    transition: background-color 150ms;
  }
  .instructions-button:hover {
    background-color: #F9FAFB;
  }

  /* User Details Display Card */
  .user-details-display {
    position: relative;
    padding: 1rem;
    background-color: #F9FAFB;
    border: 1px solid #E5E7EB;
    border-radius: 0.75rem;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
  }
  .user-details-header {
    font-size: 1rem;
    font-weight: 700;
    color: #1F2937;
    border-bottom: 1px solid #E5E7EB;
    padding-bottom: 0.5rem;
    margin-bottom: 0.75rem;
  }
  .edit-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    font-size: 0.75rem;
    color: #CCCCCC;
    font-weight: 700;
    text-decoration: underline;
  }

  /* Bill Summary Card */
  .bill-summary-card {
    padding: 1rem;
    background-color: white;
    border-radius: 0.75rem;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    border: 1px solid #F3F4F6;
  }
  .bill-summary-row {
    display: flex;
    justify-content: space-between;
    padding: 0.25rem 0;
    color: #4B5563;
  }
  .bill-summary-row span:last-child {
    font-weight: 600;
  }
  .bill-summary-total {
    padding-top: 0.5rem;
    border-top: 1px solid #E5E7EB;
    margin-top: 0.5rem;
    font-size: 1.125rem;
    font-weight: 800;
    color: #CCCCCC;
  }

  /* Swipe To Order Feature */
  .swipe-to-order-footer {
    padding: 1.25rem;
    position: sticky;
    bottom: 0;
    z-index: 15;
    background-color: white;
  }
  .swipe-button-base {
    position: relative;
    height: 3.5rem;
    background-color: #CCCCCC;
    color: white;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    overflow: hidden;
    box-shadow: 0 8px 10px #fcf7f7f5;
    touch-action: pan-y; 
  }
  .swipe-handle {
    height: 100%;
    width: 3.5rem;
    background-color: white;
    color: #CCCCCC;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 0;
    z-index: 10;
    font-size: 1.5rem;
    font-weight: 800;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
    cursor: grab;
  }
  .swipe-text {
    flex-grow: 1;
    text-align: center;
    font-weight: 700;
    font-size: 1.125rem;
    z-index: 5;
    transition: opacity 300ms;
  }

  /* Thank You Screen */
  .thank-you-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #20BF6D;
    color: white;
    text-align: center;
    padding: 1.5rem;
  }
  .check-mark-bg {
    width: 8rem;
    height: 8rem;
    background-color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 2rem;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
  .check-mark-svg {
    stroke-dasharray: 200;
    stroke-dashoffset: 200;
    animation: drawCheck 0.6s ease-out forwards;
    animation-delay: 0.1s;
    stroke: #CCCCCC;
    stroke-width: 4;
    fill: none;
  }
  @keyframes drawCheck {
    100% {
      stroke-dashoffset: 0;
    }
  }

  /* Modal/Instructions */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 100;
    display: flex;
    align-items: flex-end;
  }
  .modal-content {
    background-color: white;
    width: 100%;
    max-width: 512px;
    margin: 0 auto;
    border-top-left-radius: 1.5rem;
    border-top-right-radius: 1.5rem;
    padding: 1.5rem;
    box-shadow: 0 -10px 25px rgba(0, 0, 0, 0.2);
    animation: slide-in-up 0.3s ease-out;
  }
  @keyframes slide-in-up {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  .modal-textarea {
    width: 100%;
    padding: 1rem;
    border: 1px solid #D1D5DB;
    border-radius: 0.75rem;
    transition: border-color 150ms;
    resize: none;
  }
  .modal-buttons {
    display: flex;
    margin-top: 1.5rem;
    gap: 0.75rem;
  }
  .modal-button-default {
    flex: 1;
    padding: 0.75rem;
    background-color: #E5E7EB;
    color: #4B5563;
    font-weight: 700;
    border-radius: 9999px;
    transition: background-color 150ms;
  }
  .modal-button-primary {
    flex: 1;
    padding: 0.75rem;
    background-color: #CCCCCC;
    color: white;
    font-weight: 700;
    border-radius: 9999px;
    box-shadow: 0 4px 6px #fcf7f7f5;
    transition: background-color 150ms;
  }
`;

// --- Static Data ---
const mockMenu = [
  { id: 1, name: 'Capricciosa Pizza', description: 'Classic Italian pizza.', price: 200, category: 'Pizza', imageUrl: 'https://placehold.co/100x100/F06060/ffffff?text=Capricciosa' },
  { id: 2, name: 'Sicilian Pizza', description: 'Thick crust Sicilian style.', price: 150, category: 'Pizza', imageUrl: 'https://placehold.co/100x100/F06060/ffffff?text=Sicilian' },
  { id: 3, name: 'Marinara Pizza', description: 'Simple tomato and garlic.', price: 90, category: 'Pizza', imageUrl: 'https://placehold.co/100x100/F06060/ffffff?text=Marinara' },
  { id: 4, name: 'Pepperoni Pizza', description: 'Spicy pepperoni toppings.', price: 300, category: 'Pizza', imageUrl: 'https://placehold.co/100x100/F06060/ffffff?text=Pepperoni' },
  { id: 5, name: 'Classic Beef Burger', description: 'Juicy beef patty.', price: 250, category: 'Burger', imageUrl: 'https://placehold.co/100x100/3D9970/ffffff?text=Burger' },
  { id: 6, name: 'Veggie Delight Burger', description: 'Healthy plant-based.', price: 180, category: 'Burger', imageUrl: 'https://placehold.co/100x100/3D9970/ffffff?text=Veggie' },
  { id: 7, name: 'Cola Drink (Large)', description: 'Refreshing cola.', price: 50, category: 'Drink', imageUrl: 'https://placehold.co/100x100/39CCCC/ffffff?text=Cola' },
  { id: 8, name: 'Iced Tea', description: 'Sweet and chilled.', price: 40, category: 'Drink', imageUrl: 'https://placehold.co/100x100/39CCCC/ffffff?text=Tea' },
  { id: 9, name: 'Crispy French Fries', description: 'Golden and salted.', price: 100, category: 'French fries', imageUrl: 'https://placehold.co/100x100/FF851B/ffffff?text=Fries' },
  { id: 10, name: 'Baked Veggies', description: 'Seasonal baked vegetables.', price: 120, category: 'Veggies', imageUrl: 'https://placehold.co/100x100/B10DC9/ffffff?text=Veggies' },
];

const categories = ['All', ...new Set(mockMenu.map(item => item.category))];
const TABLE_SIZES = [2, 4, 6, 8];

// --- Local Storage Hooks ---
const useLocalStorageState = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [key, value]);

  return [value, setValue];
};

// --- Helper Components ---

const BackButton = ({ onClick }) => (
    <button
      onClick={onClick}
      className="back-button"
      style={{
        padding: '0.25rem',
        color: '#1F2937', 
        transition: 'color 150ms',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer'
      }}
    >
    
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m15 18-6-6 6-6"/>
      </svg>
    </button>
);

const ThankYouScreen = ({ countdown }) => (
    <div className="thank-you-container">
      <div className="check-mark-bg">
        <svg className="check-mark-svg" width="64" height="64" viewBox="0 0 52 52">
          <polyline points="14,26 24,36 38,18" />
        </svg>
      </div>
      <h1 style={{fontSize: '1.875rem', fontWeight: '800', marginBottom: '0.5rem'}}>Thanks For Ordering</h1>
      <p style={{fontSize: '1.25rem', fontWeight: '300'}}>Redirecting in {countdown}</p>
    </div>
);

// --- User Details Form  ---
const UserDetailsForm = ({ userData, setUserData, onNext, currentPage }) => {
    const isTakeAway = userData.mode === 'Take Away';

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Validation for Phone Number
        if (name === 'phone') {
            // Allow only digits and limit to 10 characters
            const cleanedValue = value.replace(/\D/g, '').slice(0, 10);
            setUserData(prev => ({ ...prev, [name]: cleanedValue }));
        } else {
            setUserData(prev => ({ ...prev, [name]: value }));
        }
    };

    const isFormValid = useMemo(() => {
        const { name, phone, address, members } = userData;
        // Basic validation: Name must exist, Phone must be 10 digits
        const phoneValid = phone && phone.length === 10 && /^\d{10}$/.test(phone);

        if (!name || !phoneValid) return false;
        if (isTakeAway && !address) return false;
        if (!isTakeAway && (!members || members === '')) return false;
        return true;
    }, [userData, isTakeAway]);

    return (
        <div className="details-form-container">
        <h2 className="details-form-title">Enter Your Details</h2>

        {/* Name Input */}
        <input
            name="name"
            placeholder="Full Name"
            value={userData.name}
            onChange={handleInputChange}
            className="form-input"
        />

        {/* Phone Input */}
        <input
            name="phone"
            placeholder="Contact (Phone Number) - 10 Digits"
            value={userData.phone}
            onChange={handleInputChange}
            type="tel"
            maxLength="10"
            className="form-input"
        />

        {isTakeAway ? (
            /* Address Input for Take Away */
            <textarea
            name="address"
            placeholder="Complete Address (e.g., Flat no: 301, SVR Enclave...)"
            value={userData.address}
            onChange={handleInputChange}
            rows="3"
            className="form-textarea"
            />
        ) : (
            /* Members Select for Dine In */
            <select
            name="members"
            value={userData.members}
            onChange={handleInputChange}
            className="form-select"
            >
            <option value="">Number of Persons</option>
            {TABLE_SIZES.map(size => (
                <option key={size} value={String(size)}>{size} Person Table</option>
            ))}
            </select>
        )}

        <button
            onClick={onNext}
            disabled={!isFormValid}
            className="form-submit-button"
        >
            {currentPage === 'details' ? 'Order Now' : 'Proceed to Order Summary'}
        </button>
        {isTakeAway && <p style={{textAlign: 'center', fontSize: '0.875rem', color: '#059669', fontWeight: '600'}}>Avg. Delivery Time: 42 mins</p>}
        </div>
    );
};

// --- Cooking Instructions Modal ---
const CookingInstructionsModal = ({ cookingInstructions, setCookingInstructions, navigateTo }) => (
    <div className="modal-overlay" onClick={() => navigateTo('details')}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{fontSize: '1.5rem', fontWeight: '700', color: '#1F2937'}}>Add Cooking Instructions</h2>
          <button onClick={() => navigateTo('details')} style={{color: '#6B7280', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.25rem'}}>
            {/* Close Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <p style={{fontSize: '0.875rem', color: '#6B7280', marginBottom: '1rem'}}>
          The restaurant will try its best to follow your request. However, refunds or cancellations in this regard won't be possible.
        </p>
        <textarea
          placeholder="Enter instructions here..."
          value={cookingInstructions}
          onChange={(e) => setCookingInstructions(e.target.value)}
          rows="5"
          className="modal-textarea"
        />
        <div className="modal-buttons">
          <button onClick={() => { setCookingInstructions(''); navigateTo('details'); }} className="modal-button-default">
            Remove and Go Back
          </button>
          <button onClick={() => navigateTo('details')} className="modal-button-primary">
            Save and Continue
          </button>
        </div>
      </div>
    </div>
);

// --- Checkout Screen ---
const CheckoutScreen = ({ currentPage, cart, userData, setUserData, cookingInstructions, navigateTo, updateCartQuantity, handleOrderPlace, cartTotal }) => {
    const isTakeAway = userData.mode === 'Take Away';
    const deliveryCharge = isTakeAway ? 50 : 0;
    const taxes = 5.00; // Mock fixed tax
    const grandTotal = cartTotal + deliveryCharge + taxes;

    // --- Component for Swipe to Order---
    const SwipeToOrderButton = () => {
        const [isSwiping, setIsSwiping] = useState(false);
        const [startX, setStartX] = useState(0);
        const [currentX, setCurrentX] = useState(0);
        const threshold = 150; 
        const maxSwipe = 250;

        const handleStart = (clientX) => {
            setIsSwiping(true);
            setStartX(clientX);
        };

        const handleMove = (clientX) => {
            if (!isSwiping) return;
            const diffX = clientX - startX;
            setCurrentX(Math.min(maxSwipe, Math.max(0, diffX)));
        };

        const handleEnd = () => {
            if (!isSwiping) return;
            setIsSwiping(false);
            if (currentX > threshold) {
            handleOrderPlace();
            }
            setCurrentX(0); 
        };

        const handleTouchStart = (e) => handleStart(e.touches[0].clientX);
        const handleTouchMove = (e) => handleMove(e.touches[0].clientX);
        const handleTouchEnd = () => handleEnd();

        const handleMouseDown = (e) => handleStart(e.clientX);
        const handleMouseMove = (e) => handleMove(e.clientX);
        const handleMouseUp = () => handleEnd();
        const handleMouseLeave = () => isSwiping && handleEnd(); 

        const swipeStyle = {
            transform: `translateX(${currentX}px)`,
            transition: isSwiping ? 'none' : 'transform 0.3s ease-out',
            cursor: isSwiping ? 'grabbing' : 'grab'
        };
        
        const textOpacity = currentX > 50 ? 0.3 : 1;
        const textTransition = isSwiping ? 'none' : 'opacity 0.3s';

        return (
            <div className="swipe-to-order-footer">
            <div
                className="swipe-button-base"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
            >
                <div className="swipe-handle" style={swipeStyle}>
                {'>'}
                </div>
                <span 
                    className="swipe-text" 
                    style={{ opacity: textOpacity, transition: textTransition }}
                >
                Swipe to Place Order (₹{grandTotal.toFixed(2)})
                </span>
            </div>
            </div>
        );
    };

    const UserDetailsDisplay = () => (
      <div className="user-details-display" style={{marginBottom: '1rem'}}>
        <h3 className="user-details-header">Your Details</h3>
        <p style={{fontSize: '0.875rem', fontWeight: '600', color: '#374151'}}>{userData.name}, {userData.phone}</p>
        {isTakeAway ? (
          <>
            <p style={{fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
              Home Delivery - {userData.address || 'Address Not Entered'}
            </p>
            <p style={{fontSize: '0.75rem', color: '#059669', fontWeight: '600', marginTop: '0.25rem'}}>Delivery in 42 mins</p>
          </>
        ) : (
          <p style={{fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem'}}>
            Dine In - **{userData.members}** Person Table
          </p>
        )}
        <button className="edit-button" onClick={() => navigateTo('checkout')}>
          Edit
        </button>
      </div>
    );

    return (
      <div className="checkout-page-container">
        {/* Header */}
        <div className="page-header">
          <BackButton onClick={() => navigateTo('home')} />
          <h1 className="page-title">Place Your Order Here</h1>
        </div>

        {/* Mode Toggle */}
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

        {/* Main Content Area */}
        <div style={{flexGrow: 1, overflowY: 'auto', padding: currentPage === 'details' ? '1.25rem' : '0'}}>
          {currentPage === 'checkout' && (
            <UserDetailsForm 
              userData={userData} 
              setUserData={setUserData} 
              onNext={() => navigateTo('details')} 
              currentPage={currentPage} 
            />
          )}

          {currentPage === 'details' && (
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>

              {/* Cart List */}
              <div className="order-list-card">
                <h3 style={{fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.75rem', color: '#1F2937'}}>Order Items</h3>
                {cart.map(item => (
                  <div key={item.id} className="order-item-row">
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                      <span className="order-item-name">{item.name}</span>
                      <span className="order-item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <div className="quantity-controls" style={{boxShadow: 'none', backgroundColor: 'transparent', padding: 0}}>
                      <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="quantity-button quantity-button-remove" style={{width: '1.5rem', height: '1.5rem', fontSize: '1rem'}}>-</button>
                      <span className="quantity-display" style={{width: '1rem', color: '#374151'}}>{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="quantity-button quantity-button-add" style={{width: '1.5rem', height: '1.5rem', fontSize: '1rem'}}>+</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cooking Instructions Button */}
              <button
                className="instructions-button"
                onClick={() => navigateTo('cooking-instructions')}
              >
                {cookingInstructions.length > 0 ? `Instructions Added (${cookingInstructions.length} characters)` : 'Add Cooking Instructions (Optional)'}
              </button>

              <UserDetailsDisplay />

              {/* Bill Summary */}
              <div className="bill-summary-card">
                <h3 style={{fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.75rem', color: '#1F2937'}}>Bill Summary</h3>
                <div style={{color: '#4B5563'}}>
                  <div className="bill-summary-row"><span>Item Total</span><span>₹{cartTotal.toFixed(2)}</span></div>
                  <div className="bill-summary-row"><span>Delivery Charge</span><span>{isTakeAway ? `₹${deliveryCharge.toFixed(2)}` : 'N/A'}</span></div>
                  <div className="bill-summary-row"><span>Taxes (5.00%)</span><span>₹{taxes.toFixed(2)}</span></div>
                  <div className="bill-summary-total">
                    <span>Grand Total</span>
                    <span style={{float: 'right'}}>₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {currentPage === 'details' && (
           <SwipeToOrderButton />
        )}
      </div>
    );
};

// --- Home Screen  ---
const HomeScreen = ({ cart, searchTerm, setSearchTerm, updateCartQuantity, addItemToCart, navigateTo, cartTotal }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredItems = useMemo(() => {
      const itemsByCategory = selectedCategory === 'All'
        ? mockMenu
        : mockMenu.filter(item => item.category === selectedCategory);

      if (!searchTerm) return itemsByCategory;

      // Search applies to the selected category only
      return itemsByCategory.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }, [selectedCategory, searchTerm]);

    const handleCategorySelect = (category) => {
      setSelectedCategory(category);
      setSearchTerm('');
    };

    // Renders the list of menu items
    const MenuList = () => (
        <main className="menu-item-list">
            <h2 style={{fontSize: '1.25rem', fontWeight: '700', color: '#1F2937'}}>{selectedCategory}</h2>
            {filteredItems.map(item => {
                const cartItem = cart.find(i => i.id === item.id);
                return (
                    <div key={item.id} className="menu-item-card">
                        {/* Image/Placeholder */}
                        <div className="item-image">
                            <img
                                src={item.imageUrl}
                                alt={item.name}
                                style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/64x64/f0f0f0/333333?text=Dish"; }}
                            />
                        </div>

                        {/* Details */}
                        <div className="item-details">
                            <div className="item-name">{item.name}</div>
                            <div className="item-price">₹{item.price}</div>
                        </div>

                        {/* Quantity Control or Add Button */}
                        {cartItem ? (
                            <div className="quantity-controls">
                                <button
                                    onClick={() => updateCartQuantity(item.id, cartItem.quantity - 1)}
                                    className="quantity-button quantity-button-remove"
                                >
                                    -
                                </button>
                                <span className="quantity-display">{cartItem.quantity}</span>
                                <button
                                    onClick={() => updateCartQuantity(item.id, cartItem.quantity + 1)}
                                    className="quantity-button quantity-button-add"
                                >
                                    +
                                </button>
                            </div>
                        ) : (
                            <button className="add-button-plus" onClick={() => addItemToCart(item)}>
                                +
                            </button>
                        )}
                    </div>
                );
            })}
            {filteredItems.length === 0 && <p style={{textAlign: 'center', color: '#6B7280', padding: '2.5rem 0'}}>No items found.</p>}
        </main>
    );

    return (
      <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
        {/* Header and Search */}
        <div className="header-sticky">
          <header style={{marginBottom: '1rem'}}>
            <div style={{fontSize: '1.25rem', fontWeight: '500', color: '#6B7280'}}>Good Evening</div>
            <div style={{fontSize: '1.875rem', fontWeight: '800', color: '#1F2937'}}>Place Your Order Here</div>
          </header>

          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search Menu"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {/* Search Icon */}
            <span className="search-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </span>
          </div>

          {/* Categories Nav */}
          <nav className="category-nav scrollbar-hide">
            <div className="category-list">
                {categories.map(category => (
                <button
                    key={category}
                    className={`category-button ${selectedCategory === category ? 'category-button-active' : 'category-button-default'}`}
                    onClick={() => handleCategorySelect(category)}
                >
                    {category}
                </button>
                ))}
            </div>
          </nav>
        </div>

        {/* Menu Items List */}
        <div style={{flexGrow: 1, overflowY: 'auto'}}>
            <MenuList />
        </div>

        {/* Fixed Checkout Bar */}
        {cart.length > 0 && (
          <footer className="footer-checkout">
            <div className="checkout-button-bar" onClick={() => navigateTo('checkout')}>
              <div className="checkout-summary-text">
                {cart.length} Item(s) | <span style={{fontWeight: '800'}}>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="checkout-next-text">
                <span>Next</span>
                {/* Arrow Right Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </div>
            </div>
          </footer>
        )}
      </div>
    );
};

// --- App Component ---
export default function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'checkout', 'details', 'cooking-instructions', 'thank-you'
  const [cart, setCart] = useLocalStorageState('foodAppCart', []);
  const [userData, setUserData] = useLocalStorageState('foodAppUser', {
    mode: 'Take Away', // 'Dine In' or 'Take Away'
    name: '',
    phone: '',
    address: '',
    members: '2'
  });
  const [cookingInstructions, setCookingInstructions] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [countdown, setCountdown] = useState(3);


  // --- Cart Logic ---
  const addItemToCart = useCallback((item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(i => i.id === item.id);
      if (existingItem) {
        return prevCart.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  }, [setCart]);

  const updateCartQuantity = useCallback((itemId, newQuantity) => {
    setCart(prevCart => {
      if (newQuantity <= 0) {
        return prevCart.filter(i => i.id !== itemId);
      }
      return prevCart.map(i =>
        i.id === itemId ? { ...i, quantity: newQuantity } : i
      );
    });
  }, [setCart]);

  const cartTotal = useMemo(() => cart.reduce((acc, item) => acc + item.price * item.quantity, 0), [cart]);

  // --- Navigation & Flow ---
  const navigateTo = useCallback((page) => setCurrentPage(page), []);

  const handleOrderPlace = useCallback(() => {
    if (cart.length === 0) return;

    // Reset countdown for thank you screen
    setCountdown(3);

    setCart([]);
    setCookingInstructions('');
    navigateTo('thank-you');

    // Redirect after 3 seconds
    const timer = setTimeout(() => {
      navigateTo('home');
    }, 3000);

    return () => clearTimeout(timer);
  }, [cart.length, navigateTo, setCart, setCookingInstructions]);

  // Countdown effect for Thank You screen
  useEffect(() => {
    if (currentPage === 'thank-you' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [currentPage, countdown]);


  const renderContent = () => {
    if ((currentPage === 'checkout' || currentPage === 'details' || currentPage === 'cooking-instructions') && cart.length === 0) {
      return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', padding: '1.5rem'}}>
          <h1 style={{fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: '#1F2937'}}>Your Cart is Empty</h1>
          <p style={{color: '#6B7280', marginBottom: '1.5rem'}}>Please add some delicious items to place an order.</p>
          <button onClick={() => navigateTo('home')} className="form-submit-button" style={{maxWidth: '15rem'}}>
            Back to Menu
          </button>
        </div>
      );
    }

    switch (currentPage) {
      case 'home':
        return (
            <HomeScreen 
                cart={cart} 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
                updateCartQuantity={updateCartQuantity} 
                addItemToCart={addItemToCart} 
                navigateTo={navigateTo}
                cartTotal={cartTotal}
            />
        );
      case 'checkout':
      case 'details':
        return (
            <CheckoutScreen 
                currentPage={currentPage}
                cart={cart}
                userData={userData}
                setUserData={setUserData}
                cookingInstructions={cookingInstructions}
                navigateTo={navigateTo}
                updateCartQuantity={updateCartQuantity}
                handleOrderPlace={handleOrderPlace}
                cartTotal={cartTotal}
            />
        );
      case 'cooking-instructions':
        return (
          <>
            <CheckoutScreen 
                currentPage='details' 
                cart={cart}
                userData={userData}
                setUserData={setUserData}
                cookingInstructions={cookingInstructions}
                navigateTo={navigateTo}
                updateCartQuantity={updateCartQuantity}
                handleOrderPlace={handleOrderPlace}
                cartTotal={cartTotal}
            />
            <CookingInstructionsModal 
                cookingInstructions={cookingInstructions} 
                setCookingInstructions={setCookingInstructions} 
                navigateTo={navigateTo}
            />
          </>
        );
      case 'thank-you':
        return <ThankYouScreen countdown={countdown} />;
      default:
        return (
            <HomeScreen 
                cart={cart} 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
                updateCartQuantity={updateCartQuantity} 
                addItemToCart={addItemToCart} 
                navigateTo={navigateTo}
                cartTotal={cartTotal}
            />
        );
    }
  };

  return (
    <div className="app-container">
      <style>{rawCssStyles}</style>
      {renderContent()}
    </div>
  );
}
