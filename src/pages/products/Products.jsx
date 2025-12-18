import React from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import { useDeleteProduct } from "../../hooks/useDeleteProduct";
import "./Product.css";

const Products = () => {
const { data: products = [], isLoading, isError } = useProducts();
const deleteMutation = useDeleteProduct();
const navigate = useNavigate();

if (isLoading) return <p>Loading products...</p>;
if (isError) return <p>Failed to load products.</p>;

const handleDelete = (id) => {
if (window.confirm("Are you sure you want to delete this product?")) {
deleteMutation.mutate(id);
}
};

return ( <div className="product-page"> <h2>All Products</h2>


  <div className="product-grid">
    {products.length > 0 ? (
      products.map((product) => (
        <div className="product-card" key={product.product_id}>
          <div className="product-image">
            {product.images?.length ? (
              <img src={product.images[0].url} alt={product.name} />
            ) : (
              <span className="no-image">No Image</span>
            )}
          </div>

          <div className="product-info">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>SKU: {product.sku}</p>
            <p>Price: ${product.price}</p>
            <p>Gender: {product.gender}</p>
            <p>Category: {product.category?.name}</p>

            <div className="product-actions">
              <button onClick={() => navigate(`/products/edit/${product.product_id}`)}>
                Edit
              </button>

              <button onClick={() => handleDelete(product.product_id)}>
                Delete
              </button>

              <button onClick={() => navigate(`/products/view/${product.product_id}`)}>
                View
              </button>
            </div>
          </div>
        </div>
      ))
    ) : (
      <p>No products found.</p>
    )}
  </div>
</div>

);
};

export default Products;
