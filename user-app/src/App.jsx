// import React, { useState, useEffect, useCallback } from 'react';
// import { Search, Plus, Minus, ArrowLeft, X, ChevronRight, CheckCircle } from 'lucide-react'; 

// const MOCK_CATEGORIES = ['Pizza', 'Burger', 'Drink', 'French fries', 'Veggies', 'Desserts', 'Salads', 'Soups'];
// const MOCK_ITEMS = [
//   { id: 1, name: 'Capricciosa', price: 200, category: 'Pizza' },
//   { id: 2, name: 'Sicilian', price: 150, category: 'Pizza' },
//   { id: 3, name: 'Marinara', price: 90, category: 'Pizza' },
//   { id: 4, name: 'Pepperoni', price: 300, category: 'Pizza' },
//   { id: 5, name: 'Classic Beef Burger', price: 250, category: 'Burger' },
//   { id: 6, name: 'Crispy Fries', price: 120, category: 'French fries' },
//   { id: 7, name: 'Chicken Tenders', price: 280, category: 'Burger' },
//   { id: 8, name: 'Coke (Small)', price: 60, category: 'Drink' },
//   // Adding more items for infinite scroll simulation
//   { id: 9, name: 'Vegetable Pizza', price: 220, category: 'Pizza' },
//   { id: 10, name: 'Jalapeno Burger', price: 270, category: 'Burger' },
//   { id: 11, name: 'Cheesy Garlic Bread', price: 180, category: 'Veggies' },
//   { id: 12, name: 'Mineral Water', price: 40, category: 'Drink' },
// ];


// // MenuItem Component
// const MenuItem = ({ item, count, onAdd, onRemove }) => (
//   <div className="menuItem">
//     <div className="itemImagePlaceholder"></div>
    
//     <div className="itemInfo">
//       <h3 className="itemName">{item.name}</h3>
//       <p className="itemPrice">₹{item.price.toFixed(2)}</p>
//     </div>

//     <div className="actionButtonContainer">
//       {count > 0 ? (
//         <div className="counter">
//           <button onClick={() => onRemove(item.id)} className="counterButton"><Minus size={16} /></button>
//           <span className="count">{count}</span>
//           <button onClick={() => onAdd(item.id)} className="counterButton"><Plus size={16} /></button>
//         </div>
//       ) : (
//         <button onClick={() => onAdd(item.id)} className="addButton">
//           <Plus size={16} />
//         </button>
//       )}
//     </div>
//   </div>
// );

// // CategoryBar Component
// const CategoryBar = ({ categories, selectedCategory, onSelectCategory }) => (
//   <div className="categoryBarContainer">
//     <div className="categoryList">
//       {categories.map((category) => (
//         <button
//           key={category}
//           className={`categoryButton ${selectedCategory === category ? 'selected' : ''}`}
//           onClick={() => onSelectCategory(category)}
//         >
//           {category}
//         </button>
//       ))}
//     </div>
//   </div>
// );

// // Header Component
// const Header = ({ searchTerm, setSearchTerm, currentPage }) => {
//     // Search is only on the Home page
//     if (currentPage !== 'home') return null;

//     return (
//       <div className="header">
//         <p className="greeting">Good evening</p>
//         <h1 className="title">Place your order here</h1>
        
//         <div className="searchBar">
//           <Search size={20} className="searchIcon" />
//           <input
//             type="text"
//             placeholder="Search"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="searchInput"
//           />
//         </div>
//       </div>
//     );
// };

// // HomePage Component
// const HomePage = ({ cart, selectedCategory, setSelectedCategory, searchTerm, setSearchTerm, handleAddToCart, handleRemoveFromCart, navigateTo }) => {
//   const filteredItems = MOCK_ITEMS
//     .filter(item => selectedCategory === 'Pizza' ? true : item.category === selectedCategory) 
//     .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

//   const totalItemsInCart = Object.values(cart).reduce((sum, count) => sum + count, 0);

//   return (
//     <div className="homeContainer">
//       <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} currentPage="home" />

//       <CategoryBar
//         categories={MOCK_CATEGORIES}
//         selectedCategory={selectedCategory}
//         onSelectCategory={setSelectedCategory}
//       />
      
//       <div className="menuList">
//         <p className="categoryTitle">{selectedCategory}</p>
//         {filteredItems.map(item => (
//           <MenuItem
//             key={item.id}
//             item={item}
//             count={cart[item.id] || 0}
//             onAdd={handleAddToCart}
//             onRemove={handleRemoveFromCart}
//           />
//         ))}
//         <div className="infiniteLoader">Loading more items...</div> 
//       </div>

//       {totalItemsInCart > 0 && (
//         <button 
//           className="nextButton"
//           onClick={() => navigateTo('checkout')} 
//         >
//           Next ({totalItemsInCart} items)
//         </button>
//       )}
//     </div>
//   );
// };


// // InstructionsModal Component (Helper for CheckoutPage)
// const InstructionsModal = ({ cookingInstructions, setCookingInstructions, setIsAddingInstructions }) => (
//     <div className="instructionsModalOverlay">
//       <div className="instructionsModal">
//         <div className="modalHeader">
//           <button className="modalClose" onClick={() => setIsAddingInstructions(false)}><X size={24} /></button>
//           <h3 className="modalTitle">Add Cooking instructions</h3>
//           <button className="modalNext" onClick={() => setIsAddingInstructions(false)}>Next</button>
//         </div>
//         <textarea
//           className="instructionsTextarea"
//           placeholder="Enter instructions here..."
//           value={cookingInstructions}
//           onChange={(e) => setCookingInstructions(e.target.value)}
//         />
//         <p className="instructionWarning">
//           The restaurant will try its best to follow your request. However, refunds or cancellations in this regard won't be possible.
//         </p>
//       </div>
//     </div>
// );

// // CheckoutPage Component
// const CheckoutPage = ({ cart, navigateTo }) => {
//     const [orderType, setOrderType] = useState('takeaway'); // SRD: Default can be either, setting to takeaway
//     const [cookingInstructions, setCookingInstructions] = useState('');
//     const [isAddingInstructions, setIsAddingInstructions] = useState(false);
//     const [formData, setFormData] = useState({ 
//         name: 'Divya Sigatapu', 
//         phone: '9109109109', 
//         address: 'Flat no: 301, SVR Enclave, Hyper Nagar, vasavi...', 
//         members: 2 // For Dine In, available sizes: 2, 4, 6, 8
//     });

//     // Calculate Order Summary
//     const itemTotal = Object.entries(cart).reduce((total, [itemId, count]) => {
//         const item = MOCK_ITEMS.find(i => i.id == itemId);
//         return total + (item ? item.price * count : 0);
//     }, 0);
    
//     const deliveryCharge = orderType === 'takeaway' ? 50 : 0; 
//     const taxes = 5.00; 
//     const grandTotal = itemTotal + deliveryCharge + taxes;

//     const handleSwipeToOrder = () => {
//         console.log("Order Placed:", { formData, cart, orderType, cookingInstructions, grandTotal });
//         navigateTo('thankyou');
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const renderOrderSummary = () => (
//         <div className="orderSummary">
//             <h3 className="summaryTitle">Order Summary</h3>
//             <div className="summaryLine">
//                 <span>Item Total</span>
//                 <span>₹{itemTotal.toFixed(2)}</span>
//             </div>
//             <div className="summaryLine">
//                 <span>Delivery Charge</span>
//                 <span>₹{deliveryCharge.toFixed(2)}</span>
//             </div>
//             <div className="summaryLine">
//                 <span>Taxes</span>
//                 <span>₹{taxes.toFixed(2)}</span>
//             </div>
//             <div className={`summaryLine grandTotal`}>
//                 <span>Grand Total</span>
//                 <span>₹{grandTotal.toFixed(2)}</span>
//             </div>
//         </div>
//     );

//     const renderDetailsForm = () => {
//         if (orderType === 'dinein') {
//             return (
//                 <div className="detailsForm">
//                     <h3 className="summaryTitle">Enter Your Details (Dine In)</h3>
//                     <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="inputField" required />
//                     <input type="tel" name="phone" placeholder="Contact Phone" value={formData.phone} onChange={handleChange} className="inputField" required />
//                     <select name="members" value={formData.members} onChange={handleChange} className="inputField" required>
//                         <option value="" disabled>Number of Persons</option>
//                         {[2, 4, 6, 8].map(size => ( // SRD available sizes: 2, 4, 6, 8
//                             <option key={size} value={size}>{size} Persons</option>
//                         ))}
//                     </select>
//                 </div>
//             );
//         }
//         // Takeaway Form
//         return (
//             <div className="detailsForm">
//                 <h3 className="summaryTitle">Enter Your Details (Take Away)</h3>
//                 <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="inputField" required />
//                 <input type="tel" name="phone" placeholder="Contact Phone" value={formData.phone} onChange={handleChange} className="inputField" required />
//                 <input type="text" name="address" placeholder="Complete Address" value={formData.address} onChange={handleChange} className="inputField" required />
//                 <p className="deliveryTime">Delivery in 42 mins</p>
//             </div>
//         );
//     };

//     return (
//         <div className="checkoutContainer">
//             <button className="backButton" onClick={() => navigateTo('home')}>
//                 <ArrowLeft size={24} />
//             </button>
//             <h2 className="checkoutTitle">Checkout</h2>

//             {/* Order Type Switch */}
//             <div className="orderTypeToggle">
//                 <button 
//                 className={`toggleButton ${orderType === 'dinein' ? 'toggleSelected' : ''}`}
//                 onClick={() => setOrderType('dinein')}
//                 >
//                 Dine In
//                 </button>
//                 <button 
//                 className={`toggleButton ${orderType === 'takeaway' ? 'toggleSelected' : ''}`}
//                 onClick={() => setOrderType('takeaway')}
//                 >
//                 Take Away
//                 </button>
//             </div>

//             {/* Cooking Instructions Box */}
//             <div className="instructionsBox" onClick={() => setIsAddingInstructions(true)}>
//                 <span className={cookingInstructions ? 'instructionTextFilled' : 'instructionTextPlaceholder'}>
//                     {cookingInstructions || "Add cooking instructions (optional)"}
//                 </span>
//                 <ChevronRight size={20} />
//             </div>

//             {/* Cart Items Summary */}
//             <div className="cartItemsSummary">
//                 <h3 className="summaryTitle">Your Items</h3>
//                 {Object.entries(cart).map(([itemId, count]) => {
//                 const item = MOCK_ITEMS.find(i => i.id == itemId);
//                 return item && (
//                     <div key={itemId} className="cartItemLine">
//                     <span>{count} x {item.name}</span>
//                     <span>₹{(item.price * count).toFixed(2)}</span>
//                     </div>
//                 );
//                 })}
//             </div>

//             {renderDetailsForm()}
//             {renderOrderSummary()}

//             <div className="swipeToOrderBar" onClick={handleSwipeToOrder}>
//                 <span>Swipe to Order</span>
//                 <div className="swipeHandle">
//                     <ChevronRight size={20} color="#333" />
//                 </div>
//             </div>
            
//             {isAddingInstructions && (
//                 <InstructionsModal 
//                     cookingInstructions={cookingInstructions} 
//                     setCookingInstructions={setCookingInstructions}
//                     setIsAddingInstructions={setIsAddingInstructions}
//                 />
//             )}
//         </div>
//     );
// };

// // ThankYouPage Component
// const ThankYouPage = ({ navigateTo, resetCart }) => {
//     const [redirectCount, setRedirectCount] = useState(3);

//     useEffect(() => {
//         if (redirectCount > 0) {
//             const timer = setTimeout(() => setRedirectCount(prev => prev - 1), 1000);
//             return () => clearTimeout(timer);
//         } else {
//             resetCart(); // Reset cart state
//             navigateTo('home'); // SRD: Redirect to / after 2 seconds (3 to 0 countdown)
//         }
//     }, [redirectCount, navigateTo, resetCart]);

//     return (
//         <div className="thankYouContainer">
//             <CheckCircle size={64} className="thankYouIcon" />
//             <h1 className="thankYouTitle">Thanks For Ordering</h1>
//             <p className="redirectText">Redirecting in {redirectCount}</p>
//         </div>
//     );
// };


// // Main App Component
// const App = () => {
//     const [currentPage, setCurrentPage] = useState('home'); 
//     const [cart, setCart] = useState({ 1: 1, 4: 2 }); // Initial items for quick checkout testing
//     const [selectedCategory, setSelectedCategory] = useState('Pizza');
//     const [searchTerm, setSearchTerm] = useState('');

//     const navigateTo = (page) => setCurrentPage(page);

//     // Cart Handlers
//     const handleAddToCart = useCallback((itemId) => {
//       setCart(prevCart => ({ ...prevCart, [itemId]: (prevCart[itemId] || 0) + 1 }));
//     }, []);

//     const handleRemoveFromCart = useCallback((itemId) => {
//       setCart(prevCart => {
//         const newCount = (prevCart[itemId] || 0) - 1;
//         if (newCount <= 0) {
//           // Remove item entirely if count is zero or less
//           const { [itemId]: removed, ...rest } = prevCart;
//           return rest;
//         }
//         return { ...prevCart, [itemId]: newCount };
//       });
//     }, []);
    
//     const resetCart = useCallback(() => {
//       setCart({});
//     }, []);

//     // Main Router Logic ---
//     let pageContent;

//     if (currentPage === 'checkout') {
//         // Only proceed if cart is not empty
//         if (Object.keys(cart).length === 0) {
//             pageContent = (
//                 <HomePage 
//                     cart={cart}
//                     selectedCategory={selectedCategory}
//                     setSelectedCategory={setSelectedCategory}
//                     searchTerm={searchTerm}
//                     setSearchTerm={setSearchTerm}
//                     handleAddToCart={handleAddToCart}
//                     handleRemoveFromCart={handleRemoveFromCart}
//                     navigateTo={navigateTo}
//                 />
//             );
//         } else {
//             pageContent = <CheckoutPage cart={cart} navigateTo={navigateTo} />;
//         }
//     } else if (currentPage === 'thankyou') {
//         pageContent = <ThankYouPage navigateTo={navigateTo} resetCart={resetCart} />;
//     } else {
//         // Default is Home Page
//         pageContent = (
//             <HomePage 
//                 cart={cart}
//                 selectedCategory={selectedCategory}
//                 setSelectedCategory={setSelectedCategory}
//                 searchTerm={searchTerm}
//                 setSearchTerm={setSearchTerm}
//                 handleAddToCart={handleAddToCart}
//                 handleRemoveFromCart={handleRemoveFromCart}
//                 navigateTo={navigateTo}
//             />
//         );
//     }

//     // Always render the styles and the current page content
//     return (
//         <>
//             <style>{CSS_STYLES}</style>
//             {pageContent}
//         </>
//     );
// };

// // 9. CSS Styles 
// const CSS_STYLES = `
// /* Global Reset and Base Styles */
// body {
//     font-family: 'Inter', sans-serif;
//     margin: 0;
//     padding: 0;
//     background-color: #f7f7f7;
// }

// /* --- Global Layout / Container Styles --- */
// /* The main container limits the app to a typical mobile width */
// .homeContainer, .checkoutContainer, .thankYouContainer {
//     padding: 20px;
//     background-color: #f7f7f7; 
//     min-height: 100vh;
//     display: flex;
//     flex-direction: column;
//     max-width: 450px; 
//     margin: 0 auto;
//     position: relative; /* For fixed elements */
// }
// .thankYouContainer {
//     /* Override for thank you page to center content */
//     justify-content: center;
//     align-items: center;
//     background-color: white;
// }


// /* --- Header Styles --- */
// .header {
//     margin-bottom: 20px;
// }

// .greeting {
//     font-size: 16px;
//     color: #888;
//     font-weight: 500;
//     margin-bottom: 4px;
// }

// .title {
//     font-size: 24px;
//     font-weight: 700;
//     color: #333;
//     margin-bottom: 15px;
// }

// .searchBar {
//     display: flex;
//     align-items: center;
//     padding: 10px 15px;
//     background-color: white;
//     border-radius: 12px;
//     box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
// }

// .searchIcon {
//     color: #888;
//     margin-right: 10px;
// }

// .searchInput {
//     flex-grow: 1;
//     border: none;
//     outline: none;
//     font-size: 16px;
//     padding: 0;
//     background-color: transparent;
// }

// /* --- CategoryBar Styles --- */
// .categoryBarContainer {
//     overflow-x: auto; 
//     white-space: nowrap;
//     margin: 5px 0 20px 0;
//     /* Hide scrollbar */
//     -ms-overflow-style: none;
//     scrollbar-width: none;
// }

// .categoryBarContainer::-webkit-scrollbar {
//     display: none;
// }

// .categoryList {
//     display: flex;
//     gap: 10px;
//     padding: 5px 0;
// }

// .categoryButton {
//     background-color: white;
//     color: #666;
//     border: 1px solid #ddd;
//     padding: 8px 15px;
//     border-radius: 20px;
//     font-size: 14px;
//     cursor: pointer;
//     flex-shrink: 0;
//     transition: all 0.2s ease;
// }

// .categoryButton.selected {
//     background-color: #333; /* Selected pill style */
//     color: white;
//     border-color: #333;
//     font-weight: 600;
// }

// /* --- Menu List & Item Styles --- */
// .menuList {
//     flex-grow: 1;
//     overflow-y: auto;
//     padding-bottom: 100px; 
// }

// .categoryTitle {
//     font-size: 20px;
//     font-weight: 600;
//     color: #333;
//     margin-top: 5px;
//     margin-bottom: 15px;
// }

// .infiniteLoader {
//     text-align: center;
//     padding: 20px 0;
//     color: #999;
// }

// .menuItem {
//     display: flex;
//     background-color: white;
//     border-radius: 12px;
//     margin-bottom: 15px;
//     box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
//     padding: 10px;
//     align-items: center;
// }

// .itemImagePlaceholder {
//     width: 60px;
//     height: 60px;
//     background-color: #eee;
//     border-radius: 8px;
//     margin-right: 10px;
//     flex-shrink: 0;
// }

// .itemInfo {
//     flex-grow: 1;
// }

// .itemName {
//     font-size: 16px;
//     font-weight: 600;
//     color: #333;
//     margin: 0;
// }

// .itemPrice {
//     font-size: 14px;
//     color: #4CAF50;
//     font-weight: 700;
//     margin-top: 5px;
// }

// .actionButtonContainer {
//     flex-shrink: 0;
// }

// .addButton {
//     width: 35px;
//     height: 35px;
//     border-radius: 50%;
//     background-color: #4CAF50; /* Green Add Button */
//     color: white;
//     border: none;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     cursor: pointer;
//     box-shadow: 0 2px 5px rgba(76, 175, 80, 0.4);
// }

// .counter {
//     display: flex;
//     align-items: center;
//     border: 1px solid #ddd;
//     border-radius: 20px;
//     overflow: hidden;
//     background-color: white;
// }

// .counterButton {
//     background-color: white;
//     border: none;
//     padding: 8px 10px;
//     cursor: pointer;
//     color: #4CAF50;
//     display: flex;
//     align-items: center;
//     justify-content: center;
// }

// .count {
//     padding: 0 5px;
//     font-weight: 600;
//     font-size: 16px;
//     color: #333;
// }

// .nextButton {
//     position: fixed;
//     bottom: 20px;
//     left: 50%;
//     transform: translateX(-50%);
//     width: 90%;
//     max-width: 400px; 
//     padding: 15px;
//     border: none;
//     border-radius: 12px;
//     background-color: #4CAF50; /* Green button */
//     color: white;
//     font-size: 18px;
//     font-weight: 700;
//     cursor: pointer;
//     box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
//     z-index: 100;
// }


// /* --- Checkout Page Styles --- */
// .checkoutContainer {
//     padding-bottom: 100px; /* Space for swipe bar */
// }
// .checkoutTitle {
//     font-size: 24px;
//     font-weight: 700;
//     color: #333;
//     margin: 0 0 20px 0;
// }

// .backButton {
//     background: none;
//     border: none;
//     color: #333;
//     padding: 0;
//     margin-bottom: 10px;
//     cursor: pointer;
// }

// .orderTypeToggle {
//     display: flex;
//     justify-content: space-between;
//     background-color: white;
//     border-radius: 12px;
//     padding: 5px;
//     margin-bottom: 20px;
//     box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
// }

// .toggleButton {
//     flex: 1;
//     padding: 12px;
//     border: none;
//     background-color: transparent;
//     border-radius: 10px;
//     font-size: 16px;
//     font-weight: 600;
//     cursor: pointer;
//     transition: background-color 0.2s;
// }

// .toggleSelected {
//     background-color: #333; /* Selected style */
//     color: white;
// }

// .instructionsBox {
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     padding: 15px;
//     margin-bottom: 20px;
//     background-color: white;
//     border-radius: 10px;
//     cursor: pointer;
//     color: #444;
// }
// .instructionTextPlaceholder {
//     color: #999;
//     font-size: 15px;
// }
// .instructionTextFilled {
//     color: #333;
//     font-size: 15px;
//     font-weight: 500;
// }

// /* --- Summary and Form Styles --- */
// .detailsForm, .cartItemsSummary, .orderSummary {
//     padding: 15px;
//     margin-bottom: 20px;
//     background-color: white;
//     border-radius: 10px;
//     box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
// }

// .summaryTitle {
//     font-size: 18px;
//     font-weight: 600;
//     margin-bottom: 15px;
//     color: #333;
// }

// .inputField {
//     width: 100%;
//     padding: 12px;
//     margin-bottom: 10px;
//     border: 1px solid #eee;
//     border-radius: 8px;
//     font-size: 16px;
//     box-sizing: border-box;
//     background-color: #fcfcfc;
// }
// .inputField:focus {
//     border-color: #4CAF50;
//     outline: none;
// }
// .inputField::placeholder {
//     color: #aaa;
// }
// .deliveryTime {
//     font-size: 14px;
//     color: #4CAF50;
//     font-weight: 500;
//     margin-top: 10px;
// }

// .cartItemLine, .summaryLine {
//     display: flex;
//     justify-content: space-between;
//     font-size: 15px;
//     padding: 5px 0;
//     color: #666;
// }
// .summaryLine:not(.grandTotal) {
//     border-bottom: 1px dotted #eee;
// }

// .grandTotal {
//     font-weight: 700;
//     color: #333;
//     border-top: 2px solid #333;
//     padding-top: 10px;
//     margin-top: 10px;
//     font-size: 18px;
// }

// /* --- Swipe to Order Styles (Based on Image) --- */
// .swipeToOrderBar {
//     position: fixed;
//     bottom: 0;
//     left: 50%;
//     transform: translateX(-50%);
//     width: 100%; /* Full width of its container (max-width: 450px) */
//     max-width: 450px;
//     background-color: #333; /* Dark background */
//     color: white;
//     padding: 15px 20px;
//     border-radius: 15px 15px 0 0;
//     font-size: 18px;
//     font-weight: 700;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     cursor: pointer;
//     height: 70px;
//     box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.3);
//     z-index: 100;
//     box-sizing: border-box; /* Include padding in width */
// }

// .swipeHandle {
//     position: absolute;
//     right: 20px;
//     width: 40px;
//     height: 40px;
//     background-color: #4CAF50; /* Green handle for contrast */
//     border-radius: 50%;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
//     /* Adding a slight animation to suggest swiping */
//     animation: swipeHint 1.5s infinite;
// }

// @keyframes swipeHint {
//     0% { transform: translateX(0); }
//     50% { transform: translateX(5px); }
//     100% { transform: translateX(0); }
// }


// /* --- Cooking Instructions Modal Styles --- */
// .instructionsModalOverlay {
//     position: fixed;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     background: rgba(0, 0, 0, 0.7);
//     display: flex;
//     justify-content: center;
//     align-items: flex-end; 
//     z-index: 1000;
// }

// .instructionsModal {
//     background: white;
//     width: 100%;
//     max-width: 450px;
//     padding: 20px;
//     border-radius: 20px 20px 0 0;
//     box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.3);
//     animation: slideUp 0.3s ease-out;
// }

// @keyframes slideUp {
//     from { transform: translateY(100%); }
//     to { transform: translateY(0); }
// }

// .modalHeader {
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     margin-bottom: 15px;
// }
// .modalClose, .modalNext {
//     background: none;
//     border: none;
//     cursor: pointer;
//     padding: 0;
//     color: #333;
//     font-weight: 600;
// }
// .modalNext {
//     color: #4CAF50;
//     font-size: 16px;
// }
// .modalTitle {
//     margin: 0;
//     font-size: 18px;
//     font-weight: 700;
// }

// .instructionsTextarea {
//     width: 100%;
//     height: 150px;
//     padding: 15px;
//     border: 1px solid #ddd;
//     border-radius: 8px;
//     font-size: 16px;
//     resize: none;
//     margin-bottom: 15px;
//     box-sizing: border-box;
// }

// .instructionWarning {
//     font-size: 12px;
//     color: #f44336; 
//     padding: 10px;
//     background-color: #fff3f3;
//     border-radius: 8px;
//     font-weight: 500;
// }


// /* --- Thank You Page Styles (Centered and Clean) --- */
// .thankYouIcon {
//     color: #4CAF50;
//     margin-bottom: 20px;
// }

// .thankYouTitle {
//     font-size: 28px;
//     font-weight: 700;
//     color: #333;
//     margin-bottom: 10px;
// }

// .redirectText {
//     font-size: 16px;
//     color: #666;
// }
// `;

// export default App;



import React, { useState, useEffect, useCallback, useMemo } from 'react';

// --- Custom Raw CSS Styling ---
const rawCssStyles = `
  /* Global Resets and Fonts */
  body {
    background-color: #f0f0f0;
    font-family: 'Inter', sans-serif;
  }

  /* Main App Container (Simulates a mobile frame) */
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

  /* Scrollbar Hide Utility (for mobile feel) */
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }

  /* Header Styles */
  .header-sticky {
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 10;
    padding-left: 1.25rem;
    padding-right: 1.25rem;
    padding-top: 3rem; /* Simulates safe area/status bar */
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
    padding: 0.75rem 1rem 0.75rem 3rem; /* Padding left for icon */
    color: #374151; /* gray-700 */
    background-color: #F3F4F6; /* gray-100 */
    border: 1px solid #E5E7EB; /* gray-200 */
    border-radius: 0.75rem; /* rounded-xl */
    outline: none;
    transition: border-color 150ms;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.06);
  }
  .search-input:focus {
    border-color: #DC2626; /* red-600 */
    box-shadow: 0 0 0 1px #F87171; /* ring-red-500 */
  }
  .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #6B7280; /* gray-500 */
  }

  /* Category Navigation */
  .category-nav {
    display: flex;
    overflow-x: scroll;
    padding-bottom: 0.5rem;
  }
  .category-list {
    display: flex;
    gap: 0.75rem; /* space-x-3 */
    padding-bottom: 0.5rem;
  }
  .category-button {
    padding: 0.5rem 1.25rem;
    border-radius: 9999px; /* rounded-full */
    font-size: 1rem;
    font-weight: 600;
    transition: all 200ms;
    flex-shrink: 0;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  }
  .category-button-default {
    background-color: white;
    color: #4B5563; /* gray-700 */
    border: 1px solid #E5E7EB; /* gray-200 */
  }
  .category-button-default:hover {
    background-color: #F9FAFB;
  }
  .category-button-active {
    background-color: #DC2626; /* red-600 */
    color: white;
    box-shadow: 0 10px 15px -3px rgba(220, 38, 38, 0.3), 0 4px 6px -4px rgba(220, 38, 38, 0.3);
  }

  /* Menu Item Card */
  .menu-item-list {
    padding: 1.25rem;
    padding-top: 0.75rem;
    padding-bottom: 5rem; /* Space for fixed footer */
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
    color: #1F2937; /* gray-800 */
  }
  .item-price {
    font-size: 1.125rem;
    font-weight: 800;
    color: #DC2626; /* red-600 */
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
    background-color: #DC2626;
    color: white;
    box-shadow: 0 2px 4px rgba(220, 38, 38, 0.3);
  }
  .quantity-button-add:hover {
    background-color: #B91C1C;
  }
  .quantity-button-remove {
    background-color: #FEE2E2; /* red-100 */
    color: #DC2626;
  }
  .quantity-button-remove:hover {
    background-color: #FECACA; /* red-200 */
  }
  .quantity-display {
    width: 1.5rem;
    text-align: center;
    font-weight: 700;
    color: #1F2937;
  }
  
  /* Simple Add Button (when item is not in cart) */
  .add-button-plus {
    width: 2.5rem;
    height: 2.5rem;
    background-color: #DC2626;
    color: white;
    border-radius: 9999px;
    font-weight: 700;
    font-size: 1.25rem;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 6px rgba(220, 38, 38, 0.4);
    transition: background-color 150ms;
  }
  .add-button-plus:hover {
    background-color: #B91C1C;
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
    background-color: #DC2626;
    padding: 1rem;
    border-radius: 0.75rem;
    box-shadow: 0 10px 15px rgba(220, 38, 38, 0.4);
    color: white;
    cursor: pointer;
    transition: background-color 150ms;
  }
  .checkout-button-bar:hover {
    background-color: #B91C1C;
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
    margin-left: -2rem; /* Center the title over the back button space */
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
    color: #DC2626;
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
    width: 100%;
    padding: 1rem;
    border: 1px solid #E5E7EB;
    border-radius: 0.75rem;
    background-color: #F9FAFB;
    transition: all 150ms;
    outline: none;
  }
  .form-input:focus, .form-textarea:focus, .form-select:focus {
    border-color: #DC2626;
    box-shadow: 0 0 0 1px #F87171;
  }
  .form-textarea {
    resize: none;
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
    background-color: #DC2626;
    box-shadow: 0 8px 10px rgba(220, 38, 38, 0.4);
  }
  .form-submit-button:not(:disabled):hover {
    background-color: #B91C1C;
  }
  .form-submit-button:disabled {
    background-color: #9CA3AF; /* gray-400 */
    cursor: not-allowed;
  }

  /* Order Items List (Checkout Details) */
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
    color: #DC2626;
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
    color: #DC2626;
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
    color: #DC2626;
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
    background-color: #DC2626;
    color: white;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    overflow: hidden;
    box-shadow: 0 8px 10px rgba(220, 38, 38, 0.4);
    touch-action: pan-y; /* Important for preventing browser swipe gestures */
  }
  .swipe-handle {
    height: 100%;
    width: 3.5rem;
    background-color: white;
    color: #DC2626;
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
    background-color: #DC2626;
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
    stroke: #DC2626;
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
    background-color: #DC2626;
    color: white;
    font-weight: 700;
    border-radius: 9999px;
    box-shadow: 0 4px 6px rgba(220, 38, 38, 0.4);
    transition: background-color 150ms;
  }
`;

// --- Static Data (Mock Menu) ---
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

// --- Local Storage Hooks (For persistent user data across pages) ---
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
  const navigateTo = (page) => setCurrentPage(page);

  const handleOrderPlace = () => {
    // Simulating order placement success
    if (cart.length === 0) return;

    setCart([]);
    setCookingInstructions('');
    navigateTo('thank-you');

    // Redirect after 3 seconds as per SRD
    setTimeout(() => {
      navigateTo('home');
    }, 3000);
  };

  // --- Components ---

  const BackButton = ({ onClick }) => (
    <button
      onClick={onClick}
      className="back-button"
      style={{
        padding: '0.25rem',
        color: '#1F2937', // gray-800
        transition: 'color 150ms',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer'
      }}
    >
      {/* Chevron Left Icon */}
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m15 18-6-6 6-6"/>
      </svg>
    </button>
  );

  const ThankYouScreen = () => {
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      }
    }, [countdown]);

    return (
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
  };

  const UserDetailsForm = ({ onNext }) => {
    const isTakeAway = userData.mode === 'Take Away';

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setUserData(prev => ({ ...prev, [name]: value }));
    };

    const isFormValid = useMemo(() => {
      const { name, phone, address, members } = userData;
      // Basic validation: Name must exist, Phone must be 10 digits
      const phoneValid = phone && phone.length === 10 && !isNaN(phone);

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
          placeholder="Contact (Phone Number)"
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
            placeholder="Complete Address (Flat no: 301, SVR Enclave...)"
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

  const CheckoutScreen = () => {
    const isTakeAway = userData.mode === 'Take Away';
    const deliveryCharge = isTakeAway ? 50 : 0;
    const taxes = 5.00; // Mock fixed tax
    const grandTotal = cartTotal + deliveryCharge + taxes;

    // --- Component for Swipe to Order (Raw CSS/Inline Style) ---
    const SwipeToOrderButton = () => {
      const [isSwiping, setIsSwiping] = useState(false);
      const [startX, setStartX] = useState(0);
      const [currentX, setCurrentX] = useState(0);
      const threshold = 150; // Distance to count as a 'swipe'
      const maxSwipe = 250;

      const handleStart = (clientX) => {
        setIsSwiping(true);
        setStartX(clientX);
      };

      const handleMove = (clientX) => {
        if (!isSwiping) return;
        const diffX = clientX - startX;
        // Restrict movement between 0 and maxSwipe
        setCurrentX(Math.min(maxSwipe, Math.max(0, diffX)));
      };

      const handleEnd = () => {
        if (!isSwiping) return;
        setIsSwiping(false);
        if (currentX > threshold) {
          handleOrderPlace();
        }
        setCurrentX(0); // Reset position
      };

      const handleTouchStart = (e) => handleStart(e.touches[0].clientX);
      const handleTouchMove = (e) => handleMove(e.touches[0].clientX);
      const handleTouchEnd = () => handleEnd();

      const handleMouseDown = (e) => handleStart(e.clientX);
      const handleMouseMove = (e) => handleMove(e.clientX);
      const handleMouseUp = () => handleEnd();
      const handleMouseLeave = () => isSwiping && handleEnd(); // Important for desktop simulation

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
              Swipe to Order (₹{grandTotal.toFixed(2)})
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
              Delivery at Home - {userData.address || 'Address not entered'}
            </p>
            <p style={{fontSize: '0.75rem', color: '#059669', fontWeight: '600', marginTop: '0.25rem'}}>Delivery in 42 mins</p>
          </>
        ) : (
          <p style={{fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem'}}>
            Dine In - Table for **{userData.members}** members
          </p>
        )}
        <button className="edit-button" onClick={() => navigateTo('checkout')}>
          Edit Details
        </button>
      </div>
    );

    return (
      <div className="checkout-page-container">
        {/* Header */}
        <div className="page-header">
          <BackButton onClick={() => navigateTo('home')} />
          <h1 className="page-title">Place your order here</h1>
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
            <UserDetailsForm onNext={() => navigateTo('details')} />
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
                {cookingInstructions.length > 0 ? `Instructions Added (${cookingInstructions.length} chars)` : 'Add cooking instructions (optional)'}
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

        {/* Fixed Swipe Footer - Only on Details/Order Summary Screen */}
        {currentPage === 'details' && (
           <SwipeToOrderButton />
        )}
      </div>
    );
  };

  const CookingInstructionsModal = () => (
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
            Clear & Back
          </button>
          <button onClick={() => navigateTo('details')} className="modal-button-primary">
            Save & Next
          </button>
        </div>
      </div>
    </div>
  );

  const HomeScreen = () => {
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
        {/* Header and Search (Sticky) */}
        <div className="header-sticky">
          <header style={{marginBottom: '1rem'}}>
            <div style={{fontSize: '1.25rem', fontWeight: '500', color: '#6B7280'}}>Good evening</div>
            <div style={{fontSize: '1.875rem', fontWeight: '800', color: '#1F2937'}}>Place your order here</div>
          </header>

          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search"
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
                {cart.length} item(s) | <span style={{fontWeight: '800'}}>₹{cartTotal.toFixed(2)}</span>
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

  const renderContent = () => {
    // Show NoCartScreen if trying to access checkout/details with an empty cart
    if ((currentPage === 'checkout' || currentPage === 'details') && cart.length === 0) {
      return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', padding: '1.5rem'}}>
          <h1 style={{fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: '#1F2937'}}>Your Cart is Empty</h1>
          <p style={{color: '#6B7280', marginBottom: '1.5rem'}}>Please add some delicious items to place an order.</p>
          <button onClick={() => navigateTo('home')} className="form-submit-button" style={{maxWidth: '15rem'}}>
            Go Back to Menu
          </button>
        </div>
      );
    }

    switch (currentPage) {
      case 'home':
        return <HomeScreen />;
      case 'checkout':
      case 'details':
        return <CheckoutScreen />;
      case 'cooking-instructions':
        return (
          // Render CheckoutScreen first, then the modal overlay on top
          <>
            <CheckoutScreen />
            <CookingInstructionsModal />
          </>
        );
      case 'thank-you':
        return <ThankYouScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="app-container">
      <style>{rawCssStyles}</style>
      {renderContent()}
    </div>
  );
}
