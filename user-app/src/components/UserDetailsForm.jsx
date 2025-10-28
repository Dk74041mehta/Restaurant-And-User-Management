import React from "react";

const UserDetailsForm = ({ userData, setUserData, onNext }) => {
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  return (
    <div className="user-form">
      <h3>Enter Your Details</h3>
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={userData.name}
        onChange={handleChange}
      />
      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        value={userData.phone}
        onChange={handleChange}
      />
      {userData.mode === "Take Away" && (
        <input
          type="text"
          name="address"
          placeholder="Delivery Address"
          value={userData.address}
          onChange={handleChange}
        />
      )}
      <input
        type="number"
        name="members"
        placeholder="No. of Members"
        value={userData.members}
        onChange={handleChange}
        min="1"
      />
      <button className="next-btn" onClick={onNext}>
        Next
      </button>
    </div>
  );
};

export default UserDetailsForm;
