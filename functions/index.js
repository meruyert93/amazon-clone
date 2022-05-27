const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const stripe = require("stripe")(
  "sk_test_51KaRBKFiWdOm02wLgD5SMWDGY2awPBeZu29nImnHcCLbEt018dQIEXNM1IAmDISNKUshQ6A4Y6l0K7tSN1q5JswS00UVXhFlX5"
);

//API

// - App config
const app = express();

// - Middlewares
app.use(cors({ origin: true }));
app.use(express.json());

// - API routes
app.get("/", (request, response) => {
  response.status(200).send("response is ok");
});

app.post("/payments/create", async (request, response) => {
  const total = request.query.total;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: total, //subunits of the currency
    currency: "usd",
  });

  // Ok - created something
  response.status(201).send({
    clientSecret: paymentIntent.client_secret,
  });
});

// - Listen commands
exports.api = functions.https.onRequest(app);

//example endpoint
// http://localhost:5001/e-clone-with-react/us-central1/api

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
