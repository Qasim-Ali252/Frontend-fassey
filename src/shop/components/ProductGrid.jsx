// src/shop/components/ProductGrid.jsx

import React from 'react';
import { useQuery } from "@tanstack/react-query";
import ProductCard from './ProductCard'; 
import ProductSkeleton from './ProductSkeleton'; // Import the skeleton
import { fetchProducts } from '../../api/productApi';
import '../styles/ProductGrid.css';

const ProductGrid = ({ gender, category }) => {
    const { data: products, isLoading, isError, error } = useQuery({
        queryKey: ['products', { gender, category }],
        queryFn: () => fetchProducts(gender, category),
        keepPreviousData: true,
    });

    // --- ENHANCED LOADING: Use Skeletons ---
    if (isLoading) {
        return (
            <div className="product-grid">
                {Array.from({ length: 8 }).map((_, idx) => (
                    <ProductSkeleton key={idx} />
                ))}
            </div>
        );
    }

    // --- ENHANCED ERROR: Clearer message ---
    if (isError) {
        return (
            <div className="product-grid-error">
                <p>Unable to load products: {error.message}</p>
                <button onClick={() => window.location.reload()}>Try Again</button>
            </div>
        );
    }
    
    if (!products || products.length === 0) {
        return <div className="product-grid-empty">No products found for this selection.</div>;
    }

    return (
        <div className="product-grid">
            {products.map((product) => (
                <ProductCard key={product.sku || product._id} product={product} />
            ))}
        </div>
    );
};

export default ProductGrid;