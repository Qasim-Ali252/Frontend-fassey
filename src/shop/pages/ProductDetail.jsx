// import React from "react";
// import { useParams } from "react-router-dom";
// import { useProductById } from "../../hooks/useProductById";
// import Navbar from "../components/Navbar";
// import Sidebar from "../components/Sidebar";
// import Footer from "../components/Footer";
// import "../styles/ProductDetail.css";

// const ProductDetail = () => {
//   const { id } = useParams();
//   const { data: product, isLoading } = useProductById(id);

//   if (isLoading) return <p>Loading product...</p>;
//   if (!product) return <p>Product not found</p>;

//   return (
//     <>
//       <Navbar />
//       <div className="product-detail-page">
//         <Sidebar />
//         <div className="product-detail-content">
//           <div className="product-images">
//             {product.images.map((img, idx) => (
//               <img key={idx} src={img.url} alt={product.name} />
//             ))}
//           </div>
//           <div className="product-info">
//             <h2>{product.name}</h2>
//             <p>{product.description}</p>
//             <p className="price">Rs {product.price}</p>
//             <p className="sku">SKU: {product.sku}</p>
//             <p className="category">Category: {product.category.name}</p>
//             <button className="add-to-cart-btn">Add to Muzammal</button>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default ProductDetail;
