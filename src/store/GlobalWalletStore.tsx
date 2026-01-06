export type WalletTransaction = {
  id: string;
  jobId: string;
  totalAmount: number;
  commission: number;
  freelancerAmount: number;
  status: "pending" | "available" | "withdrawn";
  date: string;
};

export const GlobalWalletStore = {
  transactions: [] as WalletTransaction[],
};
