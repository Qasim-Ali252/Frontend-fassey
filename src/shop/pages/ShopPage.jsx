import React, { useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import Breadcrumb from '../../components/Breadcrumb';
import '../styles/ShopPage.css';

const ShopPage = () => {
    const { gender: pathGender, category: pathCategory } = useParams();
    const [searchParams] = useSearchParams();

    // 1. DERIVED STATE: Get filters from URL instantly
    const queryGender = searchParams.get('gender');
    const queryCategory = searchParams.get('category');
    
    // Normalize gender: Prefer query param, then path, default to MEN
    const activeGender = useMemo(
        () => (queryGender || pathGender || 'MEN').toUpperCase(),
        [queryGender, pathGender]
    );
    
    // Normalize category: "shirts" -> "Shirts"
    const activeCategory = useMemo(() => {
        const cat = queryCategory || pathCategory || 'View All';
        if (cat.toLowerCase() === 'view all') return null;
        return cat.charAt(0).toUpperCase() + cat.slice(1);
    }, [queryCategory, pathCategory]);

    // Create custom breadcrumbs for shop page
    const customBreadcrumbs = useMemo(() => {
        const breadcrumbs = [
            { label: 'Home', link: '/' },
            { label: 'Shop', link: '/shop' }
        ];
        
        if (activeGender && activeGender !== 'ALL') {
            breadcrumbs.push({ 
                label: activeGender.charAt(0).toUpperCase() + activeGender.slice(1).toLowerCase(), 
                link: `/shop/${activeGender.toLowerCase()}` 
            });
        }
        
        if (activeCategory) {
            breadcrumbs.push({ 
                label: activeCategory,
                link: null // Current page, no link
            });
        }
        
        return breadcrumbs;
    }, [activeGender, activeCategory]);

    return (
        <div className="shop-page-wrapper">
            {/* Custom breadcrumb for shop filtering */}
            <Breadcrumb customBreadcrumbs={customBreadcrumbs} />

            <main className="shop-page-main">
                {/* ProductGrid will receive these props and load data via React Query */}
                <ProductGrid 
                    gender={activeGender}
                    category={activeCategory} 
                />
            </main>
        </div>
    );
};

export default ShopPage;