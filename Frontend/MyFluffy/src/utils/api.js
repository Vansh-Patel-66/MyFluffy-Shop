import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

export const getImageUrl = (url) => {
  if (!url) return null;
  // If the DB stored the old hardcoded absolute URL, rewrite it to use the current origin
  if (url.startsWith("http://localhost:3000")) {
    return API_BASE_URL.replace("/api", "") + url.replace("http://localhost:3000", "");
  }
  // If it's a relative URL, prepend the backend host
  if (url.startsWith("/public")) {
    return API_BASE_URL.replace("/api", "") + url;
  }
  // Otherwise (e.g. Unsplash, Cloudinary), return as is
  return url;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically inject JWT token into requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  login: async (email, password) => {
    const response = await api.post("/users/login", { email, password });
    return response.data; // { success: true, token, data: user }
  },
  adminLogin: async (email, password) => {
    const response = await api.post("/admin/login", { email, password });
    return response.data;
  },
  register: async (email, password, role = "user") => {
    const response = await api.post("/users/register", { email, password, role });
    return response.data; // { success: true, message }
  },
  verifyEmail: async (token) => {
    const response = await api.get(`/users/verify/${token}`);
    return response.data;
  },
  getUsers: async () => {
    const response = await api.get("/users");
    return response.data; // { success: true, data: [...] }
  },
  getUser: async (email) => {
    const response = await api.get(`/users/${email}`);
    return response.data; // { success: true, data: user }
  },
  updateUser: async (email, data) => {
    const response = await api.put(`/users/${email}`, data);
    return response.data;
  },
  deleteUser: async (email) => {
    const response = await api.delete(`/users/${email}`);
    return response.data;
  },
};

export const productAPI = {
  getAll: async () => {
    const response = await api.get("/products");
    return response.data?.data || response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post("/products", data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    await api.delete(`/products/${id}`);
    return true;
  },
};

export const categoryAPI = {
  getAll: async () => {
    const response = await api.get("/categories");
    return response.data?.data || response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post("/categories", data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    await api.delete(`/categories/${id}`);
    return true;
  },
};

export const cartAPI = {
  create: async (userId) => {
    const response = await api.post("/carts", { user_id: userId });
    return response.data;
  },
  getAllCarts: async () => {
    const response = await api.get("/carts");
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/carts/${id}`);
    return response.data;
  },
  delete: async (id) => {
    await api.delete(`/carts/${id}`);
    return true;
  },
};

export const cartItemAPI = {
  getAll: async () => {
    const response = await api.get("/cart-items");
    return response.data; // { total, data: [...] }
  },
  create: async (data) => {
    const response = await api.post("/cart-items", data);
    return response.data; // Created cart item
  },
  update: async (id, data) => {
    const response = await api.put(`/cart-items/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    await api.delete(`/cart-items/${id}`);
    return true;
  },
};

export const addressAPI = {
  getAll: async () => {
    const response = await api.get("/addresses");
    return response.data; // { total, data: [...] }
  },
  getById: async (id) => {
    const response = await api.get(`/addresses/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post("/addresses", data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/addresses/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    await api.delete(`/addresses/${id}`);
    return true;
  },
};

export const orderAPI = {
  getAll: async () => {
    const response = await api.get("/orders");
    return response.data; // { total, data: [...] }
  },
  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post("/orders", data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/orders/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    await api.delete(`/orders/${id}`);
    return true;
  },
};

export const orderItemAPI = {
  getAll: async () => {
    const response = await api.get("/order-items");
    return response.data;
  },
  create: async (data) => {
    const response = await api.post("/order-items", data);
    return response.data;
  },
};

export const contactAPI = {
  submit: async (data) => {
    const response = await api.post("/contact-us", data);
    return response.data;
  },
  getAll: async () => {
    const response = await api.get("/contact-us");
    return response.data;
  },
  delete: async (id) => {
    await api.delete(`/contact-us/${id}`);
    return true;
  },
};

export const analyticsAPI = {
  get: async () => {
    const response = await api.get("/analytics");
    return response.data; // List of records
  },
};

export const uploadAPI = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    
    // Use the api instance but override headers for form data
    const response = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export default api;
