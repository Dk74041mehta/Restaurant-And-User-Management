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

// NOTE: The 'import "./App.css";' line has been permanently removed.
// All styling is now implemented using Tailwind CSS classes for compliance.

// --- Tailwind Configuration (Self-Contained Styling) ---
// Since we can't use a separate CSS file, we include a style block for custom/complex elements
const customStyles = `
  /* Custom scrollbar hide for mobile feel */
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }

  /* Custom Checkmark Animation for Thank You Screen */
  .check-mark-svg {
    stroke-dasharray: 200;
    stroke-dashoffset: 200;
    animation: drawCheck 0.6s ease-out forwards;
    animation-delay: 0.1s;
  }
  @keyframes drawCheck {
    100% {
      stroke-dashoffset: 0;
    }
  }

  /* Custom Swipe Button Styling */
  .swipe-to-order-button {
    touch-action: pan-y; /* Allows vertical scrolling but captures horizontal touch */
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
      className="p-1 text-gray-800 hover:text-red-600 transition-colors"
    >
      {/* Chevron Left Icon (Lucide equivalent) */}
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
      <div className="flex flex-col items-center justify-center h-full bg-red-600 text-white text-center p-6 min-h-screen">
        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-8 shadow-2xl">
          <svg className="check-mark-svg w-16 h-16 stroke-red-600" viewBox="0 0 52 52">
            <polyline points="14,26 24,36 38,18" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold mb-2">Thanks For Ordering</h1>
        <p className="text-xl font-light">Redirecting in {countdown}</p>
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
      const phoneValid = phone && phone.length === 10 && !isNaN(phone);

      if (!name || !phoneValid) return false;
      if (isTakeAway && !address) return false;
      if (!isTakeAway && (!members || members === '')) return false;
      return true;
    }, [userData, isTakeAway]);

    return (
      <div className="flex flex-col gap-5 p-5 bg-white rounded-t-2xl shadow-inner flex-grow">
        <h2 className="text-xl font-bold text-center text-gray-800">Enter Your Details</h2>
        
        {/* Name Input */}
        <input
          name="name"
          placeholder="Full Name"
          value={userData.name}
          onChange={handleInputChange}
          className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:ring-red-500 focus:border-red-500 transition duration-150"
        />

        {/* Phone Input */}
        <input
          name="phone"
          placeholder="Contact (Phone Number)"
          value={userData.phone}
          onChange={handleInputChange}
          type="tel"
          maxLength="10"
          className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:ring-red-500 focus:border-red-500 transition duration-150"
        />

        {isTakeAway ? (
          /* Address Input for Take Away */
          <textarea
            name="address"
            placeholder="Complete Address (Flat no: 301, SVR Enclave...)"
            value={userData.address}
            onChange={handleInputChange}
            rows="3"
            className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:ring-red-500 focus:border-red-500 transition duration-150 resize-none"
          />
        ) : (
          /* Members Select for Dine In */
          <select
            name="members"
            value={userData.members}
            onChange={handleInputChange}
            className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:ring-red-500 focus:border-red-500 transition duration-150"
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
          className={`w-full py-4 text-white font-bold rounded-full transition-all duration-200 shadow-lg ${
            isFormValid ? 'bg-red-600 hover:bg-red-700 shadow-red-300' : 'bg-gray-400 cursor-not-allowed shadow-none'
          }`}
        >
          {currentPage === 'details' ? 'Order Now' : 'Proceed to Order Summary'}
        </button>
        {isTakeAway && <p className="text-center text-sm text-green-600 font-semibold">Avg. Delivery Time: 42 mins</p>}
      </div>
    );
  };

  const CheckoutScreen = () => {
    const isTakeAway = userData.mode === 'Take Away';
    const deliveryCharge = isTakeAway ? 50 : 0;
    const taxes = 5.00; // Mock fixed tax
    const grandTotal = cartTotal + deliveryCharge + taxes;

    // --- Component for Swipe to Order ---
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
        transition: isSwiping ? 'none' : 'transform 0.3s ease-out'
      };

      return (
        <div className="p-5">
          <div 
            className="swipe-to-order-button bg-red-600 text-white h-14 rounded-full flex items-center relative overflow-hidden shadow-xl"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            <div className="swipe-handle h-full w-14 bg-white text-red-600 rounded-full flex items-center justify-center absolute left-0 z-10 shadow-md" style={swipeStyle}>
              <span className="text-xl font-extrabold">{'>'}</span>
            </div>
            <span className="flex-grow text-center font-bold text-lg z-0 transition-opacity duration-300" style={{ opacity: currentX > 50 ? 0.3 : 1 }}>
              Swipe to Order (₹{grandTotal.toFixed(2)})
            </span>
          </div>
        </div>
      );
    };

    const UserDetailsDisplay = () => (
      <div className="relative p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-inner">
        <h3 className="text-base font-bold text-gray-800 border-b pb-2 mb-3">Your Details</h3>
        <p className="text-sm font-semibold text-gray-700">{userData.name}, {userData.phone}</p>
        {isTakeAway ? (
          <>
            <p className="text-xs text-gray-500 mt-1 truncate">
              Delivery at Home - {userData.address || 'Address not entered'}
            </p>
            <p className="text-xs text-green-600 font-semibold mt-1">Delivery in 42 mins</p>
          </>
        ) : (
          <p className="text-xs text-gray-500 mt-1">
            Dine In - Table for **{userData.members}** members
          </p>
        )}
        <button className="absolute top-4 right-4 text-xs text-red-600 font-bold hover:underline" onClick={() => navigateTo('checkout')}>
          Edit Details
        </button>
      </div>
    );

    return (
      <div className="flex flex-col h-full bg-white">
        {/* Header */}
        <div className="sticky top-0 bg-white z-20 border-b border-gray-100 px-4 pt-12 pb-4 flex items-center shadow-sm">
          <BackButton onClick={() => navigateTo('home')} />
          <h1 className="flex-grow text-center text-xl font-bold text-gray-800 -ml-8">Place your order here</h1>
        </div>

        {/* Mode Toggle */}
        <div className="px-5 pt-4">
          <div className="flex bg-gray-100 p-1 rounded-full shadow-inner">
            <button
              className={`flex-1 py-2 font-semibold rounded-full transition-colors ${!isTakeAway ? 'bg-white text-red-600 shadow-md' : 'text-gray-500 hover:text-red-500'}`}
              onClick={() => setUserData(p => ({ ...p, mode: 'Dine In' }))}
            >
              Dine In
            </button>
            <button
              className={`flex-1 py-2 font-semibold rounded-full transition-colors ${isTakeAway ? 'bg-white text-red-600 shadow-md' : 'text-gray-500 hover:text-red-500'}`}
              onClick={() => setUserData(p => ({ ...p, mode: 'Take Away' }))}
            >
              Take Away
            </button>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-grow overflow-y-auto pb-4">
          {currentPage === 'checkout' && (
            <UserDetailsForm onNext={() => navigateTo('details')} />
          )}
          
          {currentPage === 'details' && (
            <div className="px-5 flex flex-col gap-4">
              
              {/* Cart List */}
              <div className="mt-4 p-4 border border-gray-100 rounded-xl shadow-sm">
                <h3 className="text-lg font-bold mb-3 text-gray-800">Order Items</h3>
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-700">{item.name}</span>
                      <span className="text-sm font-bold text-red-600">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="w-6 h-6 bg-red-100 text-red-600 rounded-full font-bold text-sm hover:bg-red-200">-</button>
                      <span className="w-5 text-center font-bold text-gray-800">{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="w-6 h-6 bg-red-600 text-white rounded-full font-bold text-sm hover:bg-red-700">+</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cooking Instructions Button */}
              <button
                className="w-full p-4 text-center text-gray-600 font-semibold border-2 border-dashed border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                onClick={() => navigateTo('cooking-instructions')}
              >
                {cookingInstructions.length > 0 ? `Instructions Added (${cookingInstructions.length} chars)` : 'Add cooking instructions (optional)'}
              </button>

              <UserDetailsDisplay />

              {/* Bill Summary */}
              <div className="p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold mb-3 text-gray-800">Bill Summary</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between"><span>Item Total</span><span className="font-semibold">₹{cartTotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Delivery Charge</span><span className="font-semibold">{isTakeAway ? `₹${deliveryCharge.toFixed(2)}` : 'N/A'}</span></div>
                  <div className="flex justify-between"><span>Taxes (5.00%)</span><span className="font-semibold">₹{taxes.toFixed(2)}</span></div>
                  <div className="flex justify-between pt-2 border-t border-gray-200 text-lg font-extrabold text-red-600">
                    <span>Grand Total</span>
                    <span>₹{grandTotal.toFixed(2)}</span>
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
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-end" onClick={() => navigateTo('details')}>
      <div className="bg-white w-full max-w-lg mx-auto rounded-t-3xl p-6 shadow-2xl animate-slide-in-up" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Add Cooking Instructions</h2>
          <button onClick={() => navigateTo('details')} className="text-gray-500 hover:text-gray-800 transition-colors text-xl">
            {/* Close Icon (Lucide equivalent) */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          The restaurant will try its best to follow your request. However, refunds or cancellations in this regard won't be possible.
        </p>
        <textarea
          placeholder="Enter instructions here..."
          value={cookingInstructions}
          onChange={(e) => setCookingInstructions(e.target.value)}
          rows="5"
          className="w-full p-4 border border-gray-300 rounded-xl focus:ring-red-500 focus:border-red-500 resize-none"
        />
        <div className="flex justify-between mt-6 gap-3">
          <button onClick={() => { setCookingInstructions(''); navigateTo('details'); }} className="flex-1 py-3 bg-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-300 transition-colors">
            Clear & Back
          </button>
          <button onClick={() => navigateTo('details')} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 shadow-md shadow-red-300 transition-colors">
            Save & Next
          </button>
        </div>
      </div>
      {/* Custom keyframe for modal to slide up */}
      <style>{`
        @keyframes slide-in-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-in-up {
          animation: slide-in-up 0.3s ease-out;
        }
      `}</style>
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
        <main className="px-5 pt-3 space-y-4">
            <h2 className="text-xl font-bold text-gray-800">{selectedCategory}</h2>
            {filteredItems.map(item => {
                const cartItem = cart.find(i => i.id === item.id);
                return (
                    <div key={item.id} className="flex items-center p-3 bg-white rounded-xl shadow-md border border-gray-100">
                        {/* Image/Placeholder */}
                        <div className="w-16 h-16 rounded-lg bg-gray-200 flex-shrink-0 mr-4 overflow-hidden">
                            <img 
                                src={item.imageUrl} 
                                alt={item.name} 
                                className="w-full h-full object-cover" 
                                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/64x64/f0f0f0/333333?text=Dish"; }}
                            />
                        </div>
                        
                        {/* Details */}
                        <div className="flex-grow">
                            <div className="font-semibold text-gray-800">{item.name}</div>
                            <div className="text-lg font-extrabold text-red-600">₹{item.price}</div>
                        </div>

                        {/* Quantity Control or Add Button */}
                        {cartItem ? (
                            <div className="flex items-center space-x-1 bg-gray-100 rounded-full p-1 shadow-inner">
                                <button 
                                    onClick={() => updateCartQuantity(item.id, cartItem.quantity - 1)} 
                                    className="w-8 h-8 bg-red-600 text-white rounded-full font-bold text-lg hover:bg-red-700"
                                >
                                    -
                                </button>
                                <span className="w-6 text-center font-bold text-gray-800">{cartItem.quantity}</span>
                                <button 
                                    onClick={() => updateCartQuantity(item.id, cartItem.quantity + 1)} 
                                    className="w-8 h-8 bg-red-600 text-white rounded-full font-bold text-lg hover:bg-red-700"
                                >
                                    +
                                </button>
                            </div>
                        ) : (
                            <button className="w-10 h-10 bg-red-600 text-white rounded-full font-bold text-xl hover:bg-red-700 shadow-md shadow-red-300" onClick={() => addItemToCart(item)}>
                                +
                            </button>
                        )}
                    </div>
                );
            })}
            {filteredItems.length === 0 && <p className="text-center text-gray-500 py-10">No items found.</p>}
        </main>
    );

    return (
      <div className="flex flex-col h-full bg-white pb-20">
        
        {/* Header and Search (Sticky) */}
        <div className="sticky top-0 bg-white z-10 px-5 pt-12 pb-4 shadow-sm">
          <header className="mb-4">
            <div className="text-xl font-medium text-gray-500">Good evening</div>
            <div className="text-3xl font-extrabold text-gray-800">Place your order here</div>
          </header>

          <div className="relative mb-5">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 pl-12 pr-4 text-gray-700 bg-gray-100 border border-gray-200 rounded-xl focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none shadow-inner transition duration-150"
            />
            {/* Search Icon */}
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </span>
          </div>

          {/* Categories Nav */}
          <nav className="flex overflow-x-scroll scrollbar-hide">
            <div className="flex space-x-3 pb-2">
                {categories.map(category => (
                <button
                    key={category}
                    className={`px-5 py-2 rounded-full text-base font-semibold transition-all duration-200 shadow-md flex-shrink-0 ${
                    selectedCategory === category
                        ? 'bg-red-600 text-white shadow-red-300'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => handleCategorySelect(category)}
                >
                    {category}
                </button>
                ))}
            </div>
          </nav>
        </div>
        
        {/* Menu Items List */}
        <div className="flex-grow overflow-y-auto">
            <MenuList />
        </div>

        {/* Fixed Checkout Bar */}
        {cart.length > 0 && (
          <footer className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm shadow-2xl border-t border-gray-100 max-w-lg mx-auto z-20">
            <div className="flex justify-between items-center bg-red-600 p-4 rounded-xl shadow-lg shadow-red-300 text-white cursor-pointer hover:bg-red-700 transition-colors" onClick={() => navigateTo('checkout')}>
              <div className="text-base font-medium">
                {cart.length} item(s) | <span className="font-extrabold">₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-extrabold">Next</span>
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
        <div className="flex flex-col items-center justify-center h-full text-center p-6 min-h-screen">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Your Cart is Empty</h1>
          <p className="text-gray-500 mb-6">Please add some delicious items to place an order.</p>
          <button onClick={() => navigateTo('home')} className="py-3 px-6 bg-red-600 text-white font-bold rounded-full shadow-lg hover:bg-red-700">
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
    <div className="max-w-lg mx-auto min-h-screen shadow-2xl bg-white relative">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      {renderContent()}
    </div>
  );
}
