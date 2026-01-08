/* ===============================
   COMPANY TYPE
================================ */

export type Company = {
  id: number;
  name: string;
  industry: string;
  description: string;
  location: string;
  size: string;        // "1-200" | "201-500" | "500+"
  isRemote: boolean;
  badge: string;
  badgeColor: string;
  active?: string;
  icon: string;
  iconBg: string;
};

/* ===============================
   NAVIGATION STACK TYPES
================================ */

export type RootStackParamList = {
  Companies: undefined;
  JobDetails: {
    company: Company;
  };
};
