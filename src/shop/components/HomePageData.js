// src/shop/components/HomePageData.js

// 🛑 STEP 1: IMPORT all images using the ES Module syntax.
// The path '../../assets/' is correct for reaching the assets folder from this file.
import heroImage from '../../assets/hero-image.webp';
import coupleImage from '../../assets/couple-image.jpg';
import hoodieImage from '../../assets/hoodie-image.jpeg';
import kidImage from '../../assets/kid-image.jpeg';

// --- 1. Hero/Slider Data ---
export const SLIDER_DATA = [
    { 
        id: 1, 
        text: "BE YOU!", 
        subtitle: "FALL/WINTER '25", 
        // 🛑 STEP 2: Use the imported variable name here (e.g., heroImage)
        imageUrl: heroImage, 
    },
];

// --- 2. Product Grid/Category Section Data ---
export const CATEGORY_GRID_DATA = [
    { 
        id: 1, 
        title: "SHOP NOW", 
        link: "/shop/all", 
        imageUrl: coupleImage, 
    },
    { 
        id: 2, 
        title: "HOODIE", 
        link: "/shop/hoodie", 
        imageUrl: hoodieImage, 
    },
    { 
        id: 3, 
        title: "SHOP KIDS", 
        link: "/shop/kids", 
        imageUrl: kidImage, 
    },
];