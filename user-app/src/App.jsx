import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Minus, ArrowLeft, X, ChevronRight, CheckCircle } from 'lucide-react'; 

const MOCK_CATEGORIES = ['Pizza', 'Burger', 'Drink', 'French fries', 'Veggies', 'Desserts', 'Salads', 'Soups'];
const MOCK_ITEMS = [
  { id: 1, name: 'Capricciosa', price: 200, category: 'Pizza' },
  { id: 2, name: 'Sicilian', price: 150, category: 'Pizza' },
  { id: 3, name: 'Marinara', price: 90, category: 'Pizza' },
  { id: 4, name: 'Pepperoni', price: 300, category: 'Pizza' },
  { id: 5, name: 'Classic Beef Burger', price: 250, category: 'Burger' },
  { id: 6, name: 'Crispy Fries', price: 120, category: 'French fries' },
  { id: 7, name: 'Chicken Tenders', price: 280, category: 'Burger' },
  { id: 8, name: 'Coke (Small)', price: 60, category: 'Drink' },
  // Adding more items for infinite scroll simulation
  { id: 9, name: 'Vegetable Pizza', price: 220, category: 'Pizza' },
  { id: 10, name: 'Jalapeno Burger', price: 270, category: 'Burger' },
  { id: 11, name: 'Cheesy Garlic Bread', price: 180, category: 'Veggies' },
  { id: 12, name: 'Mineral Water', price: 40, category: 'Drink' },
];


// MenuItem Component
const MenuItem = ({ item, count, onAdd, onRemove }) => (
  <div className="menuItem">
    <div className="itemImagePlaceholder"></div>
    
    <div className="itemInfo">
      <h3 className="itemName">{item.name}</h3>
      <p className="itemPrice">₹{item.price.toFixed(2)}</p>
    </div>

    <div className="actionButtonContainer">
      {count > 0 ? (
        <div className="counter">
          <button onClick={() => onRemove(item.id)} className="counterButton"><Minus size={16} /></button>
          <span className="count">{count}</span>
          <button onClick={() => onAdd(item.id)} className="counterButton"><Plus size={16} /></button>
        </div>
      ) : (
        <button onClick={() => onAdd(item.id)} className="addButton">
          <Plus size={16} />
        </button>
      )}
    </div>
  </div>
);

// CategoryBar Component
const CategoryBar = ({ categories, selectedCategory, onSelectCategory }) => (
  <div className="categoryBarContainer">
    <div className="categoryList">
      {categories.map((category) => (
        <button
          key={category}
          className={`categoryButton ${selectedCategory === category ? 'selected' : ''}`}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  </div>
);

// Header Component
const Header = ({ searchTerm, setSearchTerm, currentPage }) => {
    // Search is only on the Home page
    if (currentPage !== 'home') return null;

    return (
      <div className="header">
        <p className="greeting">Good evening</p>
        <h1 className="title">Place your order here</h1>
        
        <div className="searchBar">
          <Search size={20} className="searchIcon" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="searchInput"
          />
        </div>
      </div>
    );
};

// HomePage Component
const HomePage = ({ cart, selectedCategory, setSelectedCategory, searchTerm, setSearchTerm, handleAddToCart, handleRemoveFromCart, navigateTo }) => {
  const filteredItems = MOCK_ITEMS
    .filter(item => selectedCategory === 'Pizza' ? true : item.category === selectedCategory) 
    .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalItemsInCart = Object.values(cart).reduce((sum, count) => sum + count, 0);

  return (
    <div className="homeContainer">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} currentPage="home" />

      <CategoryBar
        categories={MOCK_CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      
      <div className="menuList">
        <p className="categoryTitle">{selectedCategory}</p>
        {filteredItems.map(item => (
          <MenuItem
            key={item.id}
            item={item}
            count={cart[item.id] || 0}
            onAdd={handleAddToCart}
            onRemove={handleRemoveFromCart}
          />
        ))}
        <div className="infiniteLoader">Loading more items...</div> 
      </div>

      {totalItemsInCart > 0 && (
        <button 
          className="nextButton"
          onClick={() => navigateTo('checkout')} 
        >
          Next ({totalItemsInCart} items)
        </button>
      )}
    </div>
  );
};


// InstructionsModal Component (Helper for CheckoutPage)
const InstructionsModal = ({ cookingInstructions, setCookingInstructions, setIsAddingInstructions }) => (
    <div className="instructionsModalOverlay">
      <div className="instructionsModal">
        <div className="modalHeader">
          <button className="modalClose" onClick={() => setIsAddingInstructions(false)}><X size={24} /></button>
          <h3 className="modalTitle">Add Cooking instructions</h3>
          <button className="modalNext" onClick={() => setIsAddingInstructions(false)}>Next</button>
        </div>
        <textarea
          className="instructionsTextarea"
          placeholder="Enter instructions here..."
          value={cookingInstructions}
          onChange={(e) => setCookingInstructions(e.target.value)}
        />
        <p className="instructionWarning">
          The restaurant will try its best to follow your request. However, refunds or cancellations in this regard won't be possible.
        </p>
      </div>
    </div>
);

// CheckoutPage Component
const CheckoutPage = ({ cart, navigateTo }) => {
    const [orderType, setOrderType] = useState('takeaway'); // SRD: Default can be either, setting to takeaway
    const [cookingInstructions, setCookingInstructions] = useState('');
    const [isAddingInstructions, setIsAddingInstructions] = useState(false);
    const [formData, setFormData] = useState({ 
        name: 'Divya Sigatapu', 
        phone: '9109109109', 
        address: 'Flat no: 301, SVR Enclave, Hyper Nagar, vasavi...', 
        members: 2 // For Dine In, available sizes: 2, 4, 6, 8
    });

    // Calculate Order Summary
    const itemTotal = Object.entries(cart).reduce((total, [itemId, count]) => {
        const item = MOCK_ITEMS.find(i => i.id == itemId);
        return total + (item ? item.price * count : 0);
    }, 0);
    
    const deliveryCharge = orderType === 'takeaway' ? 50 : 0; 
    const taxes = 5.00; 
    const grandTotal = itemTotal + deliveryCharge + taxes;

    const handleSwipeToOrder = () => {
        console.log("Order Placed:", { formData, cart, orderType, cookingInstructions, grandTotal });
        navigateTo('thankyou');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const renderOrderSummary = () => (
        <div className="orderSummary">
            <h3 className="summaryTitle">Order Summary</h3>
            <div className="summaryLine">
                <span>Item Total</span>
                <span>₹{itemTotal.toFixed(2)}</span>
            </div>
            <div className="summaryLine">
                <span>Delivery Charge</span>
                <span>₹{deliveryCharge.toFixed(2)}</span>
            </div>
            <div className="summaryLine">
                <span>Taxes</span>
                <span>₹{taxes.toFixed(2)}</span>
            </div>
            <div className={`summaryLine grandTotal`}>
                <span>Grand Total</span>
                <span>₹{grandTotal.toFixed(2)}</span>
            </div>
        </div>
    );

    const renderDetailsForm = () => {
        if (orderType === 'dinein') {
            return (
                <div className="detailsForm">
                    <h3 className="summaryTitle">Enter Your Details (Dine In)</h3>
                    <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="inputField" required />
                    <input type="tel" name="phone" placeholder="Contact Phone" value={formData.phone} onChange={handleChange} className="inputField" required />
                    <select name="members" value={formData.members} onChange={handleChange} className="inputField" required>
                        <option value="" disabled>Number of Persons</option>
                        {[2, 4, 6, 8].map(size => ( // SRD available sizes: 2, 4, 6, 8
                            <option key={size} value={size}>{size} Persons</option>
                        ))}
                    </select>
                </div>
            );
        }
        // Takeaway Form
        return (
            <div className="detailsForm">
                <h3 className="summaryTitle">Enter Your Details (Take Away)</h3>
                <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="inputField" required />
                <input type="tel" name="phone" placeholder="Contact Phone" value={formData.phone} onChange={handleChange} className="inputField" required />
                <input type="text" name="address" placeholder="Complete Address" value={formData.address} onChange={handleChange} className="inputField" required />
                <p className="deliveryTime">Delivery in 42 mins</p>
            </div>
        );
    };

    return (
        <div className="checkoutContainer">
            <button className="backButton" onClick={() => navigateTo('home')}>
                <ArrowLeft size={24} />
            </button>
            <h2 className="checkoutTitle">Checkout</h2>

            {/* Order Type Switch */}
            <div className="orderTypeToggle">
                <button 
                className={`toggleButton ${orderType === 'dinein' ? 'toggleSelected' : ''}`}
                onClick={() => setOrderType('dinein')}
                >
                Dine In
                </button>
                <button 
                className={`toggleButton ${orderType === 'takeaway' ? 'toggleSelected' : ''}`}
                onClick={() => setOrderType('takeaway')}
                >
                Take Away
                </button>
            </div>

            {/* Cooking Instructions Box */}
            <div className="instructionsBox" onClick={() => setIsAddingInstructions(true)}>
                <span className={cookingInstructions ? 'instructionTextFilled' : 'instructionTextPlaceholder'}>
                    {cookingInstructions || "Add cooking instructions (optional)"}
                </span>
                <ChevronRight size={20} />
            </div>

            {/* Cart Items Summary */}
            <div className="cartItemsSummary">
                <h3 className="summaryTitle">Your Items</h3>
                {Object.entries(cart).map(([itemId, count]) => {
                const item = MOCK_ITEMS.find(i => i.id == itemId);
                return item && (
                    <div key={itemId} className="cartItemLine">
                    <span>{count} x {item.name}</span>
                    <span>₹{(item.price * count).toFixed(2)}</span>
                    </div>
                );
                })}
            </div>

            {renderDetailsForm()}
            {renderOrderSummary()}

            <div className="swipeToOrderBar" onClick={handleSwipeToOrder}>
                <span>Swipe to Order</span>
                <div className="swipeHandle">
                    <ChevronRight size={20} color="#333" />
                </div>
            </div>
            
            {isAddingInstructions && (
                <InstructionsModal 
                    cookingInstructions={cookingInstructions} 
                    setCookingInstructions={setCookingInstructions}
                    setIsAddingInstructions={setIsAddingInstructions}
                />
            )}
        </div>
    );
};

// ThankYouPage Component
const ThankYouPage = ({ navigateTo, resetCart }) => {
    const [redirectCount, setRedirectCount] = useState(3);

    useEffect(() => {
        if (redirectCount > 0) {
            const timer = setTimeout(() => setRedirectCount(prev => prev - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            resetCart(); // Reset cart state
            navigateTo('home'); // SRD: Redirect to / after 2 seconds (3 to 0 countdown)
        }
    }, [redirectCount, navigateTo, resetCart]);

    return (
        <div className="thankYouContainer">
            <CheckCircle size={64} className="thankYouIcon" />
            <h1 className="thankYouTitle">Thanks For Ordering</h1>
            <p className="redirectText">Redirecting in {redirectCount}</p>
        </div>
    );
};


// Main App Component
const App = () => {
    const [currentPage, setCurrentPage] = useState('home'); 
    const [cart, setCart] = useState({ 1: 1, 4: 2 }); // Initial items for quick checkout testing
    const [selectedCategory, setSelectedCategory] = useState('Pizza');
    const [searchTerm, setSearchTerm] = useState('');

    const navigateTo = (page) => setCurrentPage(page);

    // Cart Handlers
    const handleAddToCart = useCallback((itemId) => {
      setCart(prevCart => ({ ...prevCart, [itemId]: (prevCart[itemId] || 0) + 1 }));
    }, []);

    const handleRemoveFromCart = useCallback((itemId) => {
      setCart(prevCart => {
        const newCount = (prevCart[itemId] || 0) - 1;
        if (newCount <= 0) {
          // Remove item entirely if count is zero or less
          const { [itemId]: removed, ...rest } = prevCart;
          return rest;
        }
        return { ...prevCart, [itemId]: newCount };
      });
    }, []);
    
    const resetCart = useCallback(() => {
      setCart({});
    }, []);

    // Main Router Logic ---
    let pageContent;

    if (currentPage === 'checkout') {
        // Only proceed if cart is not empty
        if (Object.keys(cart).length === 0) {
            pageContent = (
                <HomePage 
                    cart={cart}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    handleAddToCart={handleAddToCart}
                    handleRemoveFromCart={handleRemoveFromCart}
                    navigateTo={navigateTo}
                />
            );
        } else {
            pageContent = <CheckoutPage cart={cart} navigateTo={navigateTo} />;
        }
    } else if (currentPage === 'thankyou') {
        pageContent = <ThankYouPage navigateTo={navigateTo} resetCart={resetCart} />;
    } else {
        // Default is Home Page
        pageContent = (
            <HomePage 
                cart={cart}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleAddToCart={handleAddToCart}
                handleRemoveFromCart={handleRemoveFromCart}
                navigateTo={navigateTo}
            />
        );
    }

    // Always render the styles and the current page content
    return (
        <>
            <style>{CSS_STYLES}</style>
            {pageContent}
        </>
    );
};

// 9. CSS Styles 
const CSS_STYLES = `
/* Global Reset and Base Styles */
body {
    font-family: 'Inter', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f7f7f7;
}

/* --- Global Layout / Container Styles --- */
/* The main container limits the app to a typical mobile width */
.homeContainer, .checkoutContainer, .thankYouContainer {
    padding: 20px;
    background-color: #f7f7f7; 
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    max-width: 450px; 
    margin: 0 auto;
    position: relative; /* For fixed elements */
}
.thankYouContainer {
    /* Override for thank you page to center content */
    justify-content: center;
    align-items: center;
    background-color: white;
}


/* --- Header Styles --- */
.header {
    margin-bottom: 20px;
}

.greeting {
    font-size: 16px;
    color: #888;
    font-weight: 500;
    margin-bottom: 4px;
}

.title {
    font-size: 24px;
    font-weight: 700;
    color: #333;
    margin-bottom: 15px;
}

.searchBar {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.searchIcon {
    color: #888;
    margin-right: 10px;
}

.searchInput {
    flex-grow: 1;
    border: none;
    outline: none;
    font-size: 16px;
    padding: 0;
    background-color: transparent;
}

/* --- CategoryBar Styles --- */
.categoryBarContainer {
    overflow-x: auto; 
    white-space: nowrap;
    margin: 5px 0 20px 0;
    /* Hide scrollbar */
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.categoryBarContainer::-webkit-scrollbar {
    display: none;
}

.categoryList {
    display: flex;
    gap: 10px;
    padding: 5px 0;
}

.categoryButton {
    background-color: white;
    color: #666;
    border: 1px solid #ddd;
    padding: 8px 15px;
    border-radius: 20px;
    font-size: 14px;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.2s ease;
}

.categoryButton.selected {
    background-color: #333; /* Selected pill style */
    color: white;
    border-color: #333;
    font-weight: 600;
}

/* --- Menu List & Item Styles --- */
.menuList {
    flex-grow: 1;
    overflow-y: auto;
    padding-bottom: 100px; 
}

.categoryTitle {
    font-size: 20px;
    font-weight: 600;
    color: #333;
    margin-top: 5px;
    margin-bottom: 15px;
}

.infiniteLoader {
    text-align: center;
    padding: 20px 0;
    color: #999;
}

.menuItem {
    display: flex;
    background-color: white;
    border-radius: 12px;
    margin-bottom: 15px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    padding: 10px;
    align-items: center;
}

.itemImagePlaceholder {
    width: 60px;
    height: 60px;
    background-color: #eee;
    border-radius: 8px;
    margin-right: 10px;
    flex-shrink: 0;
}

.itemInfo {
    flex-grow: 1;
}

.itemName {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0;
}

.itemPrice {
    font-size: 14px;
    color: #4CAF50;
    font-weight: 700;
    margin-top: 5px;
}

.actionButtonContainer {
    flex-shrink: 0;
}

.addButton {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #4CAF50; /* Green Add Button */
    color: white;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(76, 175, 80, 0.4);
}

.counter {
    display: flex;
    align-items: center;
    border: 1px solid #ddd;
    border-radius: 20px;
    overflow: hidden;
    background-color: white;
}

.counterButton {
    background-color: white;
    border: none;
    padding: 8px 10px;
    cursor: pointer;
    color: #4CAF50;
    display: flex;
    align-items: center;
    justify-content: center;
}

.count {
    padding: 0 5px;
    font-weight: 600;
    font-size: 16px;
    color: #333;
}

.nextButton {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 400px; 
    padding: 15px;
    border: none;
    border-radius: 12px;
    background-color: #4CAF50; /* Green button */
    color: white;
    font-size: 18px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    z-index: 100;
}


/* --- Checkout Page Styles --- */
.checkoutContainer {
    padding-bottom: 100px; /* Space for swipe bar */
}
.checkoutTitle {
    font-size: 24px;
    font-weight: 700;
    color: #333;
    margin: 0 0 20px 0;
}

.backButton {
    background: none;
    border: none;
    color: #333;
    padding: 0;
    margin-bottom: 10px;
    cursor: pointer;
}

.orderTypeToggle {
    display: flex;
    justify-content: space-between;
    background-color: white;
    border-radius: 12px;
    padding: 5px;
    margin-bottom: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.toggleButton {
    flex: 1;
    padding: 12px;
    border: none;
    background-color: transparent;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
}

.toggleSelected {
    background-color: #333; /* Selected style */
    color: white;
}

.instructionsBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    margin-bottom: 20px;
    background-color: white;
    border-radius: 10px;
    cursor: pointer;
    color: #444;
}
.instructionTextPlaceholder {
    color: #999;
    font-size: 15px;
}
.instructionTextFilled {
    color: #333;
    font-size: 15px;
    font-weight: 500;
}

/* --- Summary and Form Styles --- */
.detailsForm, .cartItemsSummary, .orderSummary {
    padding: 15px;
    margin-bottom: 20px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.summaryTitle {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 15px;
    color: #333;
}

.inputField {
    width: 100%;
    padding: 12px;
    margin-bottom: 10px;
    border: 1px solid #eee;
    border-radius: 8px;
    font-size: 16px;
    box-sizing: border-box;
    background-color: #fcfcfc;
}
.inputField:focus {
    border-color: #4CAF50;
    outline: none;
}
.inputField::placeholder {
    color: #aaa;
}
.deliveryTime {
    font-size: 14px;
    color: #4CAF50;
    font-weight: 500;
    margin-top: 10px;
}

.cartItemLine, .summaryLine {
    display: flex;
    justify-content: space-between;
    font-size: 15px;
    padding: 5px 0;
    color: #666;
}
.summaryLine:not(.grandTotal) {
    border-bottom: 1px dotted #eee;
}

.grandTotal {
    font-weight: 700;
    color: #333;
    border-top: 2px solid #333;
    padding-top: 10px;
    margin-top: 10px;
    font-size: 18px;
}

/* --- Swipe to Order Styles (Based on Image) --- */
.swipeToOrderBar {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%; /* Full width of its container (max-width: 450px) */
    max-width: 450px;
    background-color: #333; /* Dark background */
    color: white;
    padding: 15px 20px;
    border-radius: 15px 15px 0 0;
    font-size: 18px;
    font-weight: 700;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    height: 70px;
    box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.3);
    z-index: 100;
    box-sizing: border-box; /* Include padding in width */
}

.swipeHandle {
    position: absolute;
    right: 20px;
    width: 40px;
    height: 40px;
    background-color: #4CAF50; /* Green handle for contrast */
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
    /* Adding a slight animation to suggest swiping */
    animation: swipeHint 1.5s infinite;
}

@keyframes swipeHint {
    0% { transform: translateX(0); }
    50% { transform: translateX(5px); }
    100% { transform: translateX(0); }
}


/* --- Cooking Instructions Modal Styles --- */
.instructionsModalOverlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: flex-end; 
    z-index: 1000;
}

.instructionsModal {
    background: white;
    width: 100%;
    max-width: 450px;
    padding: 20px;
    border-radius: 20px 20px 0 0;
    box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
}

.modalHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}
.modalClose, .modalNext {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    color: #333;
    font-weight: 600;
}
.modalNext {
    color: #4CAF50;
    font-size: 16px;
}
.modalTitle {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
}

.instructionsTextarea {
    width: 100%;
    height: 150px;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    resize: none;
    margin-bottom: 15px;
    box-sizing: border-box;
}

.instructionWarning {
    font-size: 12px;
    color: #f44336; 
    padding: 10px;
    background-color: #fff3f3;
    border-radius: 8px;
    font-weight: 500;
}


/* --- Thank You Page Styles (Centered and Clean) --- */
.thankYouIcon {
    color: #4CAF50;
    margin-bottom: 20px;
}

.thankYouTitle {
    font-size: 28px;
    font-weight: 700;
    color: #333;
    margin-bottom: 10px;
}

.redirectText {
    font-size: 16px;
    color: #666;
}
`;

export default App;