const express = require("express");
const router = express.Router();
const stripe = require("../config/stripe");
const Billing = require("../models/Billing");
const authenticate = require("../middleware/authenticate");

// Create Stripe Checkout Session
router.post("/create-checkout-session", authenticate, async (req, res) => {
  const { priceId } = req.body;
  try {
    let billing = await Billing.findOne({ userId: req.user._id });
    let customerId = billing?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        metadata: { userId: req.user._id.toString() },
      });
      customerId = customer.id;
      if (!billing) {
        billing = new Billing({
          userId: req.user._id,
          stripeCustomerId: customerId,
        });
      } else {
        billing.stripeCustomerId = customerId;
      }
      await billing.save();
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/billing/cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Create checkout session error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get subscription status
router.get("/subscription", authenticate, async (req, res) => {
  try {
    const billing = await Billing.findOne({ userId: req.user._id });
    if (!billing || !billing.subscriptionId) {
      return res.json({ plan: "free", status: "free" });
    }
    const subscription = await stripe.subscriptions.retrieve(
      billing.subscriptionId
    );
    res.json({
      plan: subscription.items.data[0].price.nickname.toLowerCase(),
      status: subscription.status,
      currentPeriodEnd: subscription.current_period_end,
    });
  } catch (error) {
    console.error("Get subscription error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Stripe webhook to update subscription status
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed.", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const data = event.data.object;

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        const subscription = data;
        const customerId = subscription.customer;
        const billing = await Billing.findOne({ stripeCustomerId: customerId });
        if (billing) {
          billing.subscriptionId = subscription.id;
          billing.plan =
            subscription.items.data[0].price.nickname.toLowerCase();
          billing.status = subscription.status;
          billing.currentPeriodEnd = new Date(
            subscription.current_period_end * 1000
          );
          await billing.save();
        }
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  }
);

module.exports = router;
