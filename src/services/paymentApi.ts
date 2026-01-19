import api from "./api";

/* =========================
   CREATE ORDER
   ========================= */
export const createOrder = async (amount: number, bookingId: number) => {
  const res = await api.post("/api/payment/create-order", {
    amount,
    bookingId,
  });
  return res.data;
};

/* =========================
   VERIFY PAYMENT
   ========================= */
export const verifyPayment = async (payload: any) => {
  const res = await api.post("/api/payment/verify-payment", payload);
  return res.data;
};
