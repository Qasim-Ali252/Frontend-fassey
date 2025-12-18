// src/shop/components/SearchBar.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoSearchOutline } from 'react-icons/io5';
import '../styles/SearchBar.css';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (query.trim()) {
            // Navigate to the /search route and pass the query as a URL parameter
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
            // Optionally clear the input after submission
            setQuery('');
        }
    };

    return (
        <form className="search-bar-form" onSubmit={handleSubmit}>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products..."
                aria-label="Search products"
                className="search-input"
            />
            <button type="submit" className="search-button" aria-label="Search">
                <IoSearchOutline size={20} />
            </button>
        </form>
    );
};

export default SearchBar;