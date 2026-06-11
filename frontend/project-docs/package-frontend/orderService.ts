import { apiRequest } from "./apiClient";

export async function createOrder(cart: any[], pickupTime: string) {
  const today = new Date();
  const [hours, minutes] = pickupTime.split(":");

  today.setHours(Number(hours));
  today.setMinutes(Number(minutes));
  today.setSeconds(0);
  today.setMilliseconds(0);

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  const payload = {
    pickupTime: `${year}-${month}-${day}T${pickupTime}:00`,
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

export async function cancelOrder(orderId: number) {
  const result = await apiRequest(`/api/orders/${orderId}/cancel`, {
    method: "PUT",
  });

  return result.data;
}

export async function getAllOrders() {
  const result = await apiRequest("/api/orders");
  return result.data;
}

export async function updateOrderStatus(orderId: number, status: string) {
  const result = await apiRequest(
    `/api/orders/${orderId}/status?status=${status}`,
    {
      method: "PUT",
    }
  );

  return result.data;
}