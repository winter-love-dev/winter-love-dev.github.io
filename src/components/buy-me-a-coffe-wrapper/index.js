import React from "react";
import BuyMeACoffee from "../buy-me-a-coffee";
import "./style.scss";

const BuyMeACoffeeWrapper = () => {
  return (
    <div className="donation-section-wrapper">
      <span className="text">👇 도움이 되셨나요? 👇</span>
      <BuyMeACoffee />
    </div>
  );
};

export default BuyMeACoffeeWrapper;