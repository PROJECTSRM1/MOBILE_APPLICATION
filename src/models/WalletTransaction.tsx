
export type WalletTransaction = {
  id: string;                 // unique transaction id
  jobId: string;              // Ticket ID
  totalAmount: number;        // Full job price (₹2000)
  commission: number;         // Platform cut (₹200)
  freelancerAmount: number;   // Wallet credit (₹1800)
  status: "pending" | "available" | "withdrawn";
  date: string;
};
