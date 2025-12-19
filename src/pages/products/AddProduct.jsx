import React, { useState } from "react";
import { useCreateProduct } from "../../hooks/useCreateProduct";
import { useCategories } from "../../hooks/useCategories";
import { useImageUpload } from "../../hooks/useImageUpload";

const AddProduct = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    sku: "",
    price: "",
    discount_percentage: "",
    gender: "",
    category_id: "",
    is_new_arrival: false,
  });
  
  const [variants, setVariants] = useState([
    { size_id: "", color: "", stock: "" }
  ]);
  
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadMethod, setUploadMethod] = useState("file"); // Backend requires files
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const mutation = useCreateProduct();
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const imageUploadMutation = useImageUpload();

  // Available sizes (you might want to fetch these from an API)
  const sizes = [
    { id: 1, name: "XS" },
    { id: 2, name: "S" },
    { id: 3, name: "M" },
    { id: 4, name: "L" },
    { id: 5, name: "XL" },
    { id: 6, name: "XXL" },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ 
      ...form, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index][field] = value;
    setVariants(updatedVariants);
  };

  const addVariant = () => {
    setVariants([...variants, { size_id: "", color: "", stock: "" }]);
  };

  const removeVariant = (index) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index));
    }
  };

  const handleImageFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageFiles(files);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!form.name || !form.sku || !form.price || !form.category_id || !form.gender) {
      setError("Please fill all required fields");
      return;
    }

    if (imageFiles.length === 0) {
      setError("Please select at least one image file");
      return;
    }

    // Validate variants
    const validVariants = variants.filter(v => v.size_id && v.color && v.stock);
    if (validVariants.length === 0) {
      setError("Please add at least one complete variant (size, color, stock)");
      return;
    }

    try {
      // Prepare FormData for multipart upload (backend expects this format)
      const formData = new FormData();
      
      // Add basic product fields
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('sku', form.sku);
      formData.append('price', form.price);
      formData.append('discount_percentage', form.discount_percentage || "0");
      formData.append('gender', form.gender);
      formData.append('category_id', form.category_id);
      formData.append('is_new_arrival', form.is_new_arrival.toString());
      
      // Add variants as JSON string (backend will parse it)
      formData.append('variants', JSON.stringify(validVariants.map(v => ({
        size_id: parseInt(v.size_id),
        color: v.color,
        stock: parseInt(v.stock)
      }))));
      
      // Add image files
      imageFiles.forEach((file, index) => {
        formData.append('images', file);
      });

      mutation.mutate(formData, {
        onSuccess: () => {
          setSuccess("Product added successfully!");
          // Reset form
          setForm({
            name: "",
            description: "",
            sku: "",
            price: "",
            discount_percentage: "",
            gender: "",
            category_id: "",
            is_new_arrival: false,
          });
          setVariants([{ size_id: "", color: "", stock: "" }]);
          setImageFiles([]);
          setError("");
        },
        onError: (err) => {
          console.error(err);
          setError(err.message || "Failed to add product.");
          setSuccess("");
        },
      });
    } catch (uploadError) {
      setError("Failed to upload image: " + uploadError.message);
    }
  };

  return (
    <div className="card add-product-card">
      <h3>Add Product</h3>
      
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <form className="add-product-form" onSubmit={handleSubmit}>
        {/* Basic Product Info */}
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name *"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Product Description"
          rows="3"
        />

        <input
          name="sku"
          value={form.sku}
          onChange={handleChange}
          placeholder="SKU (e.g., TSHIRT-2024-001) *"
          required
        />

        <input
          name="price"
          type="number"
          step="0.01"
          value={form.price}
          onChange={handleChange}
          placeholder="Price *"
          required
        />

        <input
          name="discount_percentage"
          type="number"
          min="0"
          max="100"
          value={form.discount_percentage}
          onChange={handleChange}
          placeholder="Discount % (optional)"
        />

        <select name="gender" value={form.gender} onChange={handleChange} required>
          <option value="">Select Gender *</option>
          <option value="MEN">Men</option>
          <option value="WOMEN">Women</option>
          <option value="KIDS">Kids</option>
        </select>

        <select name="category_id" value={form.category_id} onChange={handleChange} required>
          <option value="">Select Category *</option>
          {categoriesLoading ? (
            <option disabled>Loading categories...</option>
          ) : (
            categoriesData?.categories?.map(category => (
              <option key={category.category_id} value={category.category_id}>
                {category.name}
              </option>
            ))
          )}
        </select>

        <div className="checkbox-container">
          <label>
            <input
              type="checkbox"
              name="is_new_arrival"
              checked={form.is_new_arrival}
              onChange={handleChange}
            />
            New Arrival
          </label>
        </div>

        {/* Image Upload Section */}
        <div className="image-upload-section">
          <h4>Product Images *</h4>
          <div className="file-upload-container">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageFileChange}
              required
            />
            <small style={{ color: '#64748b', fontSize: '12px', marginTop: '8px', display: 'block' }}>
              Select one or more product images (JPG, PNG, WebP)
            </small>
            {imageFiles.length > 0 && (
              <div className="file-preview">
                <strong>Selected files:</strong>
                <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                  {imageFiles.map((file, index) => (
                    <li key={index} style={{ fontSize: '14px', color: '#059669' }}>
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Variants Section */}
        <div className="variants-section">
          <h4>Product Variants</h4>
          {variants.map((variant, index) => (
            <div key={index} className="variant-row">
              <select
                value={variant.size_id}
                onChange={(e) => handleVariantChange(index, 'size_id', e.target.value)}
                required
              >
                <option value="">Select Size</option>
                {sizes.map(size => (
                  <option key={size.id} value={size.id}>{size.name}</option>
                ))}
              </select>

              <input
                type="text"
                value={variant.color}
                onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                placeholder="Color (e.g., Red, Blue)"
                required
              />

              <input
                type="number"
                min="0"
                value={variant.stock}
                onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                placeholder="Stock Quantity"
                required
              />

              {variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="btn-remove"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          
          <button type="button" onClick={addVariant} className="btn-add-variant">
            Add Another Variant
          </button>
        </div>

        <button type="submit" className="btn" disabled={mutation.isPending || imageUploadMutation.isPending}>
          {mutation.isPending || imageUploadMutation.isPending ? "Creating Product..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
