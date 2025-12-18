import React, { useState } from "react";
import { useAddProduct } from "../../hooks/useAddProduct";

const AddProduct = () => {
const [form, setForm] = useState({
name: "",
description: "",
sku: "",
price: "",
gender: "",
category_id: "",
});
const [images, setImages] = useState([]);
const [error, setError] = useState("");

const mutation = useAddProduct();

const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

const handleImageChange = (e) => {
const files = Array.from(e.target.files);
if (files.length === 0) {
setError("Please select at least one image");
return;
}
setImages(files);
setError("");
};

const handleSubmit = (e) => {
e.preventDefault();


if (!form.name || !form.sku || !form.price || !form.category_id) {
  setError("Please fill all required fields");
  return;
}
if (images.length === 0) {
  setError("Please upload at least one image");
  return;
}

const formData = new FormData();
Object.entries(form).forEach(([key, value]) => formData.append(key, value));
images.forEach((img) => formData.append("images", img));

mutation.mutate(formData, {
  onSuccess: () => {
    alert("Product added successfully!");
    setForm({ name: "", description: "", sku: "", price: "", gender: "", category_id: "" });
    setImages([]);
    setError("");
  },
  onError: (err) => {
    console.error(err.response?.data || err.message);
    setError(err.response?.data?.message || "Failed to add product.");
  },
});


};

return ( <div className="card add-product-card"> <h3>Add Product</h3>
{error && <p className="error-message">{error}</p>}

```
  <form className="add-product-form" onSubmit={handleSubmit}>
    <input
      name="name"
      value={form.name}
      onChange={handleChange}
      placeholder="Product Name"
      required
    />

    <textarea
      name="description"
      value={form.description}
      onChange={handleChange}
      placeholder="Description"
    />

    <input
      name="sku"
      value={form.sku}
      onChange={handleChange}
      placeholder="SKU"
      required
    />

    <input
      name="price"
      type="number"
      value={form.price}
      onChange={handleChange}
      placeholder="Price"
      required
    />

    <select name="gender" value={form.gender} onChange={handleChange} required>
  <option value="">Select Gender</option>
  <option value="MEN">Men</option>
  <option value="WOMEN">Women</option>
  <option value="KIDS">Kids</option>
</select>



    <input
      name="category_id"
      type="number"
      value={form.category_id}
      onChange={handleChange}
      placeholder="Category ID"
      required
    />

    <input type="file" multiple accept="image/*" onChange={handleImageChange} />

    <button type="submit" className="btn" disabled={mutation.isLoading}>
      {mutation.isLoading ? "Saving..." : "Add Product"}
    </button>
  </form>
</div>


);
};

export default AddProduct;
