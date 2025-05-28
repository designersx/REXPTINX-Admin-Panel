import axios from "axios";
import React from "react";
import { API_URL } from "../config/apiStore";
const PaymentPage = () => {
   const handleSubscribe = async (plan) => {
    try {
      const response = await axios.post(`${API_URL}api/stripe/post?plan=${plan}`);
      // Optionally redirect user after successful subscription
      console.log(response.data);
      // window.location.href = response.data.redirectUrl; // If API gives a redirect URL
    } catch (error) {
      console.error("Subscription error:", error);
    }
  };

    return (
        <>

            <div>
                <h1>Plans</h1>
                <h2>Starter</h2>
                <p><b>$20/month</b></p>
                <p>This is the Starter Plan</p>
                <a  href="#" onClick={(e) => { e.preventDefault(); handleSubscribe('starter'); }}>Subscribe</a>
                <br />
                <h2>Pro</h2>

                <p><b>$30/month</b></p>
                <p>This is the Pro Plan</p>
                <a href="#" onClick={(e) => { e.preventDefault(); handleSubscribe('pro'); }}>Subscribe</a>

            </div>

        </>
    )
}
export default PaymentPage