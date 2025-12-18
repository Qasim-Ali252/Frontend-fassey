import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IoChevronForwardOutline, IoHomeOutline } from 'react-icons/io5';
import './Breadcrumb.css';

const Breadcrumb = ({ customBreadcrumbs = null }) => {
  const location = useLocation();
  
  // If custom breadcrumbs are provided, use them
  if (customBreadcrumbs) {
    return (
      <nav className="breadcrumb-nav" aria-label="Breadcrumb">
        <ol className="breadcrumb-list">
          {customBreadcrumbs.map((crumb, index) => (
            <li key={index} className="breadcrumb-item">
              {index > 0 && <IoChevronForwardOutline className="breadcrumb-separator" />}
              {crumb.link && index < customBreadcrumbs.length - 1 ? (
                <Link to={crumb.link} className="breadcrumb-link">
                  {index === 0 && <IoHomeOutline className="home-icon" />}
                  {crumb.label}
                </Link>
              ) : (
                <span className="breadcrumb-current">
                  {index === 0 && <IoHomeOutline className="home-icon" />}
                  {crumb.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    );
  }

  // Auto-generate breadcrumbs from URL path
  const pathnames = location.pathname.split('/').filter(x => x);
  
  // Don't show breadcrumbs on homepage
  if (pathnames.length === 0) return null;

  // Route name mappings for better display
  const routeNames = {
    'shop': 'Shop',
    'men': 'Men',
    'women': 'Women',
    'kids': 'Kids',
    'shirts': 'Shirts',
    'hoodies': 'Hoodies',
    'pants': 'Pants',
    'product': 'Product',
    'cart': 'Shopping Cart',
    'checkout': 'Checkout',
    'profile': 'My Profile',
    'my-orders': 'My Orders',
    'order': 'Order',
    'search': 'Search Results',
    'about': 'About Us',
    'contact': 'Contact',
    'user': 'Account',
    'login': 'Login',
    'signup': 'Sign Up',
    'admin': 'Admin',
    'products': 'Products',
    'add': 'Add Product',
    'edit': 'Edit Product',
    'view': 'View Product',
    'categories': 'Categories',
    'orders': 'Orders',
    'customers': 'Customers',
    'inventory': 'Inventory',
    'settings': 'Settings'
  };

  const breadcrumbs = [
    { label: 'Home', link: '/' }
  ];

  let currentPath = '';
  pathnames.forEach((pathname, index) => {
    currentPath += `/${pathname}`;
    const isLast = index === pathnames.length - 1;
    
    // Get display name
    const displayName = routeNames[pathname.toLowerCase()] || 
                       pathname.charAt(0).toUpperCase() + pathname.slice(1);
    
    breadcrumbs.push({
      label: displayName,
      link: isLast ? null : currentPath
    });
  });

  return (
    <nav className="breadcrumb-nav" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {breadcrumbs.map((crumb, index) => (
          <li key={index} className="breadcrumb-item">
            {index > 0 && <IoChevronForwardOutline className="breadcrumb-separator" />}
            {crumb.link ? (
              <Link to={crumb.link} className="breadcrumb-link">
                {index === 0 && <IoHomeOutline className="home-icon" />}
                {crumb.label}
              </Link>
            ) : (
              <span className="breadcrumb-current">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;