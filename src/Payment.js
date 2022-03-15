import React, { useEffect, useState } from "react";
import { useStateValue } from "./StateProvider";
import "./Payment.css";
import CurrencyFormat from "react-currency-format";
import CheckoutProduct from "./CheckoutProduct";
import { getBasketTotal } from "./reducer";
import { Link, useHistory } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "./axios";
import { db } from "./firebase";

function Payment() {
  const history = useHistory();
  const [{ basket, user }, dispatch] = useStateValue();

  const stripe = useStripe();
  const elements = useElements();

  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    // generate the special stripe secret which allows
    // to charge a customer
    let unmounted = false;
    const getClientSecret = async () => {
      try {
        const response = await axios({
          method: "post",
          //Stripe expects the total in a currencies subunits
          url: `/payments/create?total=${getBasketTotal(basket) * 100}`,
        });
        if (!unmounted) setClientSecret(response.data.clientSecret);
      } catch (error) {
        if (!unmounted) console.error(error);
      }
    };

    getClientSecret();

    return () => {
      unmounted = true;
      setClientSecret(null);
      setProcessing(false);
      setError(null);
      setSucceeded(false);
    };
  }, [basket]);

  console.log("the secret is", clientSecret);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    await stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      })
      .then(({ paymentIntent }) => {
        // paymentIntent = payment confirmation
        console.log("paymentIntent", paymentIntent);

        // if payment is confirmed, put items into db
        if (paymentIntent) {
          try {
            db.collection("users")
              .doc(user?.uid)
              .collection("orders")
              .doc(paymentIntent.id)
              .set({
                basket: basket,
                amount: paymentIntent.amount,
                created: paymentIntent.created,
              });
          } catch (error) {
            console.error(error);
            alert(error.message);
          }

          setSucceeded(true);
          setError(null);
          setProcessing(false);
        }

        // empty the store
        dispatch({
          type: "EMPTY_BASKET",
        });

        history.replace("/orders");
      })
      .catch((error) => alert(error.message));
  };

  const handleChange = (e) => {
    // listen for changes in the CardElement
    //and display any errors as the customer types their card details
    setDisabled(e.empty);
    setError(e.error ? e.error.message : "");
  };

  return (
    <div className="payment">
      <div className="payment__container">
        <h1>
          Checkout (<Link to="/checkout">{basket?.length} items</Link>)
        </h1>
        <div className="payment__section">
          <div className="payment__title">
            <h3>Delivery Address</h3>
          </div>
          <div className="payment__address">
            <p>{user?.email}</p>
            <p>80538, Munich</p>
            <p>Germany</p>
          </div>
        </div>
        <div className="payment__section">
          <div className="payment__title">
            <h3>Review items and delivery</h3>
          </div>
          <div className="payment__items">
            {basket.map((item) => (
              <CheckoutProduct
                id={item.id}
                title={item.title}
                image={item.image}
                price={item.price}
                rating={item.rating}
              />
            ))}
          </div>
        </div>
        <div className="payment__section">
          <div className="payment__title">
            <h3>Payment method</h3>
          </div>
          <div className="payment__details">
            <form onSubmit={handleSubmit}>
              <CardElement onChange={handleChange} />

              <div className="payment__priceContainer">
                <CurrencyFormat
                  renderText={(value) => <h3>Order Total: {value}</h3>}
                  decimalScale={2}
                  value={getBasketTotal(basket)}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                />

                <button disabled={processing || disabled || succeeded}>
                  <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
                </button>
              </div>

              {/**Show in case of error */}
              {error && <div>{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
