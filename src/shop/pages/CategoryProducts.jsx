import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAddToCart } from "../../hooks/useAddToCart";
import { useCart } from "../../shop/context/CartContext";
import { fetchProductsByCategory } from "../../api/productApi";
import "../../shop/styles/CategoryProducts.css";

const CategoryProducts = () => {
  const { gender, category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { dispatch } = useCart();
  const addToCartMutation = useAddToCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetchProductsByCategory(category, gender);
        setProducts(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, gender]);

  const handleAddToCart = (product) => {
    // Ensure productVariants exists and has at least one variant
    if (!product.productVariants || product.productVariants.length === 0) {
      console.error("Product has no variants available");
      return;
    }
    
    addToCartMutation.mutate(
      { sku: product.productVariants[0].sku, quantity: 1 },
      {
        onSuccess: (data) => {
          // Convert price from string to number if needed
          const priceNum = typeof product.price === 'string' ? parseFloat(product.price) : Number(product.price ?? 0);
          dispatch({
            type: "ADD_TO_CART",
            payload: {
              _id: product.product_id,
              name: product.name,
              price: priceNum,
              image: product.images?.[0]?.url,
              quantity: 1,
            },
          });
        },
      }
    );
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="category-products-page">
      <h2>
        {gender.toUpperCase()} - {category.toUpperCase()}
      </h2>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div className="product-card" key={product.product_id}>
              <img src={product.images[0]?.url} alt={product.name} />
              <div className="product-name">{product.name}</div>
              <div className="product-price">
                Rs {typeof product.price === 'string' ? parseFloat(product.price).toLocaleString() : (product.price || 0).toLocaleString()}{" "}
                {product.discount_percentage && (
                  <span className="discount">
                    -{product.discount_percentage}%
                  </span>
                )}
              </div>
              <button onClick={() => handleAddToCart(product)}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;
