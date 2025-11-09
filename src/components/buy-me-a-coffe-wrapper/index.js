import React from "react";
import BuyMeACoffee from "../buy-me-a-coffee";
import "./style.scss";

const BuyMeACoffeeWrapper = () => {
  return (
    <div className="donation-section-wrapper">
      <span className="text">Found this helpful?</span>
      <BuyMeACoffee />
    </div>
  );
};

export default BuyMeACoffeeWrapper;