// src/api/productApi.js (FINALIZED)

import client from "./client";

const PRODUCT_BASE = "/products";
const SEARCH_BASE_URL = "http://localhost:8000/api/product/search"; // Specific Search Endpoint

// Generic fetch products function
export const fetchProducts = async (gender, category) => {
  // Only category filter (skip if "View All" or null)
  if (category && category !== "View All") {
    // Ensure category is capitalized (Shirts, Hoodies) and gender is uppercase (MEN)
    const normalizedCategory = category.toLowerCase();
    const normalizedGender = gender?.toUpperCase();

    const endpoint = normalizedGender
      ? `${PRODUCT_BASE}/category/${normalizedCategory}/${normalizedGender}`
      : `${PRODUCT_BASE}/category/${normalizedCategory}`;

    console.debug("[fetchProducts] category endpoint:", endpoint);
    const res = await client.get(endpoint);
    return res.data;
  }

  // Only gender filter
  if (gender) {
    const normalizedGender = gender.toUpperCase();
    console.debug(
      "[fetchProducts] gender endpoint:",
      `${PRODUCT_BASE}/gender/${normalizedGender}`
    );
    const res = await client.get(`${PRODUCT_BASE}/gender/${normalizedGender}`);
    return res.data;
  }

  // No filters → get all products
  const res = await client.get(PRODUCT_BASE);
  const data = res.data;
  if (Array.isArray(data)) return data;
  if (data?.products) return data.products;
  if (data?.data) return data.data;
  return [];
};

// Fetch by gender explicitly
export const fetchProductsByGender = async (gender) => {
  if (!gender) throw new Error("Gender is required");
  const res = await client.get(`${PRODUCT_BASE}/gender/${gender}`);
  return res.data;
};

// Fetch by category + gender explicitly
export const fetchProductsByCategory = async (category, gender) => {
  if (!category || category === "View All")
    throw new Error("Valid category is required");
  const endpoint = gender
    ? `${PRODUCT_BASE}/category/${category}/${gender}`
    : `${PRODUCT_BASE}/category/${category}`;
  const res = await client.get(endpoint);
  return res.data;
};

// Fetch single product by SKU
export const fetchProductBySku = async (sku) => {
  if (!sku) throw new Error("SKU is required");
  console.debug("[fetchProductBySku] fetching", sku);
  const res = await client.get(`${PRODUCT_BASE}/${sku}`);
  const data = res.data;
  // Normalize common backend shapes
  if (data?.product) return data.product;
  return data;
};

// Add a new product (with file upload)
export const addProduct = async (formData) => {
  const res = await client.post(`${PRODUCT_BASE}/add`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// =========================================================
// 🚀 NEW FUNCTIONALITY: Product Search
// =========================================================

/**
 * Fetches products based on a search query.
 * Endpoint (explicit, bypassing baseURL):
 *   POST http://localhost:8000/api/product/search
 *   Body: { "query": "<searchTerm>" }
 *
 * Expected response:
 * {
 *   "success": true,
 *   "data": {
 *     "success": true,
 *     "data": [ { sku, name, price, image_url }, ... ]
 *   }
 * }
 */
export const searchProducts = async (query) => {
    if (!query || query.trim() === '') {
    return [];
  }

  try {
    // Send the query in the request body as JSON, using the explicit search URL
    const response = await client.post(SEARCH_BASE_URL, {
      query: query.trim(),
    });

    const outer = response.data;

    // If outer success flag is false → treat as error
    if (!outer || outer.success !== true) {
      throw new Error("Something went wrong while searching products.");
    }

    const inner = outer.data;

    // If inner success flag is false → also treat as error
    if (!inner || inner.success !== true) {
      throw new Error("Something went wrong while searching products.");
    }

    // Final product list (may be an empty array)
    return Array.isArray(inner.data) ? inner.data : [];
  } catch (error) {
    console.error("Error fetching search results:", error);
    // Re-throw so React Query can surface an error state
    throw error;
  }
};