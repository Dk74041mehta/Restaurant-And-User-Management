import React from "react";
import { ArrowLeft } from "lucide-react";

const BackButton = ({ onClick }) => (
  <button className="back-btn" onClick={onClick}>
    <ArrowLeft size={20} />
  </button>
);

export default BackButton;
