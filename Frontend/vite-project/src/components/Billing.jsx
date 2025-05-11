import React, { useEffect, useState } from "react";
import { createCheckoutSession, getSubscriptionStatus } from "../api/billing";

const plans = [
  {
    id: "price_free",
    name: "Free",
    features: ["Limited campaigns", "Small team"],
    priceId: null,
  },
  {
    id: "price_pro",
    name: "Pro",
    features: ["Unlimited campaigns", "Medium team", "AI optimization"],
    priceId: "price_1ProXXX",
  },
  {
    id: "price_enterprise",
    name: "Enterprise",
    features: ["All Pro features", "Large team", "Dedicated support"],
    priceId: "price_1EntXXX",
  },
];

export default function Billing() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSubscriptionStatus()
      .then(setSubscription)
      .finally(() => setLoading(false));
  }, []);

  const handleSubscribe = async (priceId) => {
    if (!priceId) return alert("Free plan selected, no payment needed.");
    const url = await createCheckoutSession(priceId);
    window.location.href = url;
  };

  if (loading) return <div>Loading subscription info...</div>;

  return (
    <div>
      <h1>Pricing Plans</h1>
      <div style={{ display: "flex", gap: "1rem" }}>
        {plans.map((plan) => (
          <div
            key={plan.name}
            style={{ border: "1px solid #ccc", padding: "1rem", width: 250 }}
          >
            <h2>{plan.name}</h2>
            <ul>
              {plan.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <button
              disabled={
                subscription?.plan === plan.name.toLowerCase() &&
                subscription?.status === "active"
              }
              onClick={() => handleSubscribe(plan.priceId)}
            >
              {subscription?.plan === plan.name.toLowerCase() &&
              subscription?.status === "active"
                ? "Current Plan"
                : plan.priceId
                ? "Subscribe"
                : "Free"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
