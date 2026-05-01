import { apiRequest } from "./apiClient";

export async function createOrder(cart: any[]) {
  const payload = {
    pickupTime: new Date().toISOString(), // luego lo mejoramos
    items: cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    })),
  };

  return await apiRequest("/api/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getMyOrders() {
  const result = await apiRequest("/api/orders/my-orders");
  return result.data;
}

