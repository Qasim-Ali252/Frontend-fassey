import React, { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProduct } from "../../hooks/useProduct";
import { useAddToCart } from "../../hooks/useAddToCart";
import { useCartStore } from "../../store/useCartStore"; 
import ProductDetailSkeleton from "../components/ProductDetailSkeleton"; 
import Breadcrumb from "../../components/Breadcrumb";
import "../styles/ShopProduct.css";

const ShopProduct = () => {
  const { sku } = useParams();
  const openCart = useCartStore((state) => state.openCart);
  
  // Data fetching
  const { data: product, isLoading, isError } = useProduct(sku);
  const addToCartMutation = useAddToCart();

  // Local Component State
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [status, setStatus] = useState({ message: "", type: "" });

  // Memoized Data Normalization
  const normalized = useMemo(() => {
    if (!product) return null;
    return product.product || product.data || product;
  }, [product]);

  // Create custom breadcrumbs for product page
  const customBreadcrumbs = useMemo(() => {
    if (!normalized) return [
      { label: 'Home', link: '/' },
      { label: 'Shop', link: '/shop' },
      { label: 'Product', link: null }
    ];
    
    const breadcrumbs = [
      { label: 'Home', link: '/' },
      { label: 'Shop', link: '/shop' }
    ];
    
    // Add gender if available
    if (normalized.gender) {
      breadcrumbs.push({ 
        label: normalized.gender.charAt(0).toUpperCase() + normalized.gender.slice(1).toLowerCase(), 
        link: `/shop/${normalized.gender.toLowerCase()}` 
      });
    }
    
    // Add product name as current page
    breadcrumbs.push({ 
      label: normalized.name,
      link: null 
    });
    
    return breadcrumbs;
  }, [normalized]);

  const variants = useMemo(() => {
    if (!normalized) return [];
    return normalized.variants || normalized.productVariants || [];
  }, [normalized]);

  const allSizes = useMemo(() => {
    // Use size_relation.sort_order if available, otherwise fallback to manual ordering
    const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
    
    // Create a map of size values with their sort order
    const sizeMap = new Map();
    variants.forEach((v) => {
      const sizeValue = v.size || v.size_relation?.value;
      if (sizeValue && !sizeMap.has(sizeValue)) {
        sizeMap.set(sizeValue, {
          value: sizeValue,
          sortOrder: v.size_relation?.sort_order ?? sizeOrder.indexOf(sizeValue.toUpperCase()),
          displayLabel: v.size_relation?.display_label || sizeValue
        });
      }
    });
    
    // Convert map to array and sort by sort_order
    return Array.from(sizeMap.values())
      .sort((a, b) => {
        // If both have sort_order, use that
        if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
          return a.sortOrder - b.sortOrder;
        }
        // Otherwise fallback to sizeOrder index
        const indexA = a.sortOrder !== undefined ? a.sortOrder : sizeOrder.indexOf(a.value.toUpperCase());
        const indexB = b.sortOrder !== undefined ? b.sortOrder : sizeOrder.indexOf(b.value.toUpperCase());
        return (indexA > -1 ? indexA : 99) - (indexB > -1 ? indexB : 99);
      })
      .map(item => item.value); // Return just the size values for compatibility
  }, [variants]);

  useEffect(() => {
    if (allSizes.length > 0 && !selectedSize) setSelectedSize(allSizes[0]);
  }, [allSizes, selectedSize]);

  const selectedVariant = useMemo(() => {
    if (!selectedSize) return null;
    // Handle both direct size property and size_relation object
    const match = variants.find(v => {
      const variantSize = v.size || v.size_relation?.value || v.size_relation?.display_label;
      return variantSize === selectedSize && v.color === selectedColor;
    });
    if (match) return match;
    const sizeMatch = variants.find(v => {
      const variantSize = v.size || v.size_relation?.value || v.size_relation?.display_label;
      return variantSize === selectedSize;
    });
    return sizeMatch || null;
  }, [variants, selectedSize, selectedColor]);

  // Get available stock count
  const availableStock = useMemo(() => {
    if (!selectedVariant) return 0;
    // Handle stock from API response (stock, totalstock, or inventory)
    const stock = selectedVariant.stock ?? selectedVariant.totalstock ?? selectedVariant.inventory ?? 0;
    return Number(stock) || 0;
  }, [selectedVariant]);

  const isOutOfStock = useMemo(() => {
    return availableStock <= 0;
  }, [availableStock]);

  // Reset quantity when stock changes or when it exceeds available stock
  useEffect(() => {
    if (availableStock > 0) {
      // If quantity exceeds available stock, cap it to available stock
      if (quantity > availableStock) {
        setQuantity(availableStock);
      }
      // If quantity is 0 but stock is available, set to 1
      if (quantity === 0) {
        setQuantity(1);
      }
    } else {
      // When out of stock, keep quantity at 1 but buttons will be disabled
      if (quantity !== 1) {
        setQuantity(1);
      }
    }
  }, [availableStock]);

  // Handle Add to Cart + Auto Open Side Drawer
  const handleAddToCart = () => {
    if (!selectedVariant || isOutOfStock) return;

    setStatus({ message: "Adding to bag...", type: "info" });
    
    addToCartMutation.mutate(
      { 
        sku: selectedVariant.sku, 
        quantity, 
        cart_id: localStorage.getItem("cart_id") || undefined 
      },
      {
        onSuccess: () => {
          setStatus({ message: "Successfully added!", type: "success" });
          
          setTimeout(() => {
            openCart(); 
            setStatus({ message: "", type: "" });
          }, 400);
        },
        onError: (err) => {
          setStatus({ 
            message: err?.response?.data?.message || "Failed to add item.", 
            type: "error" 
          });
        }
      }
    );
  };

  if (isLoading && !normalized) {
    return (
      <div className="p-detail-wrapper">
        <Breadcrumb customBreadcrumbs={customBreadcrumbs} />
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (isError || (!isLoading && !normalized)) {
    return (
      <div className="p-detail-wrapper">
        <Breadcrumb customBreadcrumbs={customBreadcrumbs} />
        <div className="p-error">Product not found.</div>
      </div>
    );
  }

  const { name, sku: pSku, description, price, images, discount_percentage } = normalized;
  // Convert price from string to number (API returns price as string like "1999")
  const priceNum = typeof price === 'string' ? parseFloat(price) : Number(price ?? 0);
  const disc = Number(discount_percentage ?? 0);
  const finalPrice = disc > 0 ? priceNum - (priceNum * disc) / 100 : priceNum;
  const gallery = images?.length ? images : [{ url: "/placeholder.jpg" }];

  return (
    <div className="p-detail-wrapper">
      <Breadcrumb customBreadcrumbs={customBreadcrumbs} />
      <div className="p-main-layout">
        {/* Gallery Section */}
        <div className="p-gallery-side">
          <div className="p-main-img">
            <img src={gallery[activeImage]?.url} alt={name} />
          </div>
          {gallery.length > 1 && (
            <div className="p-thumb-strip">
              {gallery.map((img, i) => (
                <div 
                  key={i} 
                  className={`p-thumb-item ${i === activeImage ? 'active' : ''}`} 
                  onClick={() => setActiveImage(i)}
                >
                  <img src={img.url} alt="thumbnail" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div className="p-info-side">
          <h1 className="p-title-text">{name}</h1>
          <div className="p-sku-text">SKU: {pSku}</div>

          <div className="p-price-block">
            <span className="p-current-price">Rs.{finalPrice.toLocaleString()}</span>
            {disc > 0 && <span className="p-old-price">Rs.{priceNum.toLocaleString()}</span>}
          </div>

          <div className="p-selection-area">
            <div className="p-option-row">
              <label className="p-label">SIZE</label>
              <div className="p-size-chips">
                {allSizes.map(sizeValue => {
                  // Find the variant to get display_label if available
                  const variant = variants.find(v => 
                    (v.size || v.size_relation?.value) === sizeValue
                  );
                  const displayText = variant?.size_relation?.display_label || sizeValue;
                  
                  return (
                    <button 
                      key={sizeValue} 
                      className={`p-size-chip ${selectedSize === sizeValue ? 'active' : ''}`} 
                      onClick={() => setSelectedSize(sizeValue)}
                      title={displayText !== sizeValue ? displayText : undefined}
                    >
                      {sizeValue.toLowerCase()}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Stock Information */}
          {selectedVariant && (
            <div className="p-stock-info">
              {isOutOfStock ? (
                <div className="p-inline-status error">⚠ Out of Stock</div>
              ) : (
                <div className="p-stock-count">
                   {availableStock <= 5 ? 'Limited Stock' : 'items'} remaining .... {availableStock}
                </div>
              )}
            </div>
          )}

          {/* Inline Status Alerts */}
          {status.message && !isOutOfStock && (
            <div className={`p-inline-status ${status.type}`}>{status.message}</div>
          )}

          <div className="p-action-gate">
            <div className="p-qty-box">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                disabled={isOutOfStock || quantity <= 1}
              >
                −
              </button>
              <span className="p-qty-display">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => Math.min(availableStock, q + 1))} 
                disabled={isOutOfStock || quantity >= availableStock}
              >
                +
              </button>
            </div>
            <button 
              className="p-add-btn" 
              onClick={handleAddToCart}
              disabled={!selectedVariant || isOutOfStock || addToCartMutation.isLoading}
            >
              {isOutOfStock ? "OUT OF STOCK" : addToCartMutation.isLoading ? "ADDING..." : "ADD TO CART"}
            </button>
          </div>

          <div className="p-description-block">
            <h3>Description</h3>
            <p>{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopProduct;