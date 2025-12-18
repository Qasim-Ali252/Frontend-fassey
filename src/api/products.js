import client from "./client";

export const addProduct = async (formData) => {
  const { data } = await client.post("/products/add", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};
