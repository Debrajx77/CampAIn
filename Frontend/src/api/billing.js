export async function createCheckoutSession(priceId) {
  const res = await fetch("/api/billing/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ priceId }),
  });
  const data = await res.json();
  return data.url;
}

export async function getSubscriptionStatus() {
  const res = await fetch("/api/billing/subscription");
  return res.json();
}
