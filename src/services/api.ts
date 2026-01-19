import axios from "axios";

const BASE_URL = "https://swachify-india-be-1-mcrb.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================
   REQUEST INTERCEPTOR
   ========================= */
api.interceptors.request.use(
  (config) => {
    const fullUrl = `${config.baseURL ?? ""}${config.url ?? ""}`;

    console.log("➡️ API REQUEST");
    console.log("URL:", fullUrl);
    console.log("METHOD:", config.method?.toUpperCase());
    console.log("DATA:", config.data);

    return config;
  },
  (error) => {
    console.log("❌ REQUEST ERROR:", error);
    return Promise.reject(error);
  }
);

/* =========================
   RESPONSE INTERCEPTOR
   ========================= */
api.interceptors.response.use(
  (response) => {
    const fullUrl = `${response.config.baseURL ?? ""}${response.config.url ?? ""}`;

    console.log("✅ API RESPONSE");
    console.log("URL:", fullUrl);
    console.log("STATUS:", response.status);
    console.log("DATA:", response.data);

    return response;
  },
  (error) => {
    const fullUrl = `${error.config?.baseURL ?? ""}${error.config?.url ?? ""}`;

    console.log("❌ API RESPONSE ERROR");
    console.log("URL:", fullUrl);
    console.log("STATUS:", error.response?.status);
    console.log("DATA:", error.response?.data || error.message);

    return Promise.reject(error);
  }
);

export default api;
