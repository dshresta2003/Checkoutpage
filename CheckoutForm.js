import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import './index.css';

const stripePromise = loadStripe('your-public-key');

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [country, setCountry] = useState('United States');
  const [zip, setZip] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { error} = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
      billing_details: {
        email,
        name,
        address: {
          country,
          postal_code: zip,
        },
      },
    });

    if (!error) {
      try {
        const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer your-secret-key`,
          },
          body: new URLSearchParams({
            success_url: 'http://localhost:3000/success',
            cancel_url: 'http://localhost:3000/cancel',
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: JSON.stringify([{
              price_data: {
                currency: 'usd',
                product_data: {
                  name: 'Powdur Starter Subscription',
                },
                unit_amount: 1200,
                recurring: {
                  interval: 'month',
                },
              },
              quantity: 1,
            }]),
          }),
        });

        const session = await response.json();
        const result = await stripe.redirectToCheckout({
          sessionId: session.id,
        });

        if (result.error) {
          console.error(result.error.message);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <div>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label>Card information</label>
        <CardElement />
      </div>
      <div>
        <label>Name on card</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label>Country or region</label>
        <select value={country} onChange={(e) => setCountry(e.target.value)} required>
          <option value="United States">United States</option>
          <option >India</option>
        </select>
      </div>
      <div>
        <label>ZIP</label>
        <input type="text" value={zip} onChange={(e) => setZip(e.target.value)} required />
      </div>
      <button type="submit" disabled={!stripe}>
        Subscribe
      </button>
    </form>
  );
};

const Wrapper = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Wrapper;
