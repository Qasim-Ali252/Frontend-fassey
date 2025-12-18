import React from "react";
import { useParams } from "react-router-dom";
import { useViewProduct } from "../../hooks/useViewProduct";
import "./Product.css";

const ViewProduct = () => {
  const { sku } = useParams();
  const { data: product, isLoading, isError } = useViewProduct(sku);

  if (isLoading) return <p className="loading">Loading product...</p>;
  if (isError || !product) return <p className="error">Failed to load product.</p>;

  const imageUrl = product.images?.length
    ? product.images[0].url
    : null;

  return (
    <div className="view-product-card">
      <h2 className="product-name">{product.name || "No Name"}</h2>

      {imageUrl ? (
        <img className="product-image" src={imageUrl} alt={product.name || "Product"} />
      ) : (
        <p className="no-image">No Image</p>
      )}

      <div className="product-details">
        <p><strong>Description:</strong> {product.description || "No Description"}</p>
        <p><strong>Price:</strong> Rs. {typeof product.price === 'string' ? parseFloat(product.price).toLocaleString() : (product.price || "N/A")}</p>
        <p><strong>SKU:</strong> {product.sku || "N/A"}</p>
        <p><strong>Gender:</strong> {product.gender || "N/A"}</p>
        <p><strong>Category:</strong> {product.category?.name || "N/A"}</p>
        {product.productVariants && product.productVariants.length > 0 && (
          <div>
            <p><strong>Variants:</strong></p>
            <ul>
              {product.productVariants.map((variant) => (
                <li key={variant.variant_id}>
                  {variant.size || variant.size_relation?.display_label || variant.size_relation?.value} - 
                  Stock: {variant.stock ?? variant.totalstock ?? 0} - 
                  SKU: {variant.sku}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewProduct;
