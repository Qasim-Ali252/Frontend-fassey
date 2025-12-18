// src/shop/pages/SearchResultsPage.jsx

import React from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchProducts } from "../../api/productApi";
import ProductCard from "../components/ProductCard";
import Breadcrumb from "../../components/Breadcrumb";
import "../styles/SearchResultsPage.css";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

    // React Query hook to fetch search results
  const {
    data: results = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    // Key changes when 'query' changes to refetch data
    queryKey: ["searchResults", query],
    queryFn: () => searchProducts(query),
    enabled: !!query, // Only run the query if a search query exists
    staleTime: 1000 * 60 * 5, // Cache results for 5 minutes
    // Avoid unnecessary extra calls
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  const hasResults = Array.isArray(results) && results.length > 0;

  const searchBreadcrumbs = [
    { label: 'Home', link: '/' },
    { label: 'Search Results', link: null }
  ];

  return (
    <div className="search-results-container">
      <Breadcrumb customBreadcrumbs={searchBreadcrumbs} />
      <h2>{query ? `Search Results for "${query}"` : "Enter a search term"}</h2>

      {isLoading && query && (
        <div className="loading-state">Searching for products...</div>
      )}

      {isError && (
        <div className="error-state">
          Something went wrong while fetching search results.
          <br />
          <span className="error-detail">
            {error?.message || "Please try again."}
          </span>
        </div>
      )}

      {/* Successful call (no error) */}
      {!isLoading && !isError && query && (
        <>
          <p className="result-count">
            {hasResults
              ? `Found ${results.length} ${
                  results.length === 1 ? "product" : "products"
                }`
              : "Nothing found"}
          </p>

          {hasResults ? (
            <div className="product-grid">
              {results.map((product) => (
                <ProductCard key={product.sku || product.name} product={product} />
              ))}
            </div>
          ) : (
            <div className="no-results-state">
              <p>Nothing found for your search. Try a different keyword.</p>
              <Link to="/shop" className="btn-primary">
                Browse All Products
              </Link>
            </div>
          )}
        </>
      )}

      {/* Display prompt if no query is present (e.g., user navigated directly to /search) */}
      {!query && (
        <div className="no-query-state">
          <p>Use the search bar above to find specific products.</p>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;