import React, { useState, useEffect } from "react";
import "../styles/HeroSlider.css";

// Online images for slider
const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1600185365480-3a9c3b6bbd33?auto=format&fit=crop&w=1400&q=80",
    title: "New Arrivals",
    subtitle: "Check out our latest collection",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1593032465179-fc0f3ee1f04c?auto=format&fit=crop&w=1400&q=80",
    title: "Summer Sale",
    subtitle: "Up to 50% off selected items",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1616599091521-05f36e2c716f?auto=format&fit=crop&w=1400&q=80",
    title: "Trending Now",
    subtitle: "Popular outfits for men & women",
  },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);

  return (
    <div className="hero-slider">
      {slides.map((slide, index) => (
        <div key={slide.id} className={`slide ${index === current ? "active" : ""}`}>
          <img src={slide.image} alt={slide.title} />
          <div className="slide-text">
            <h2>{slide.title}</h2>
            <p>{slide.subtitle}</p>
          </div>
        </div>
      ))}

      {/* Navigation arrows */}
      <button className="arrow prev" onClick={prevSlide} aria-label="Previous Slide">
        &#10094;
      </button>
      <button className="arrow next" onClick={nextSlide} aria-label="Next Slide">
        &#10095;
      </button>

      {/* Dots navigation */}
      <div className="dots">
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={`dot ${idx === current ? "active" : ""}`}
            onClick={() => setCurrent(idx)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
