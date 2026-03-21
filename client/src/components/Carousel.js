import { useState, useEffect, useCallback, useRef } from "react";
import "../styles/carousel.css";

// Mock news/announcement slides — replace with API calls
const SLIDES = [
  {
    id: 1,
    tag: "Announcement",
    title: "CSE introduces new trading hours effective August 2025",
    description:
      "The Colombo Stock Exchange will extend trading hours from 9:30 AM to 3:00 PM starting August 1, 2025.",
    image: "/images/carousel/pexels-pixabay-534216.jpg",
  },
  {
    id: 2,
    tag: "Market Update",
    title: "ASPI crosses 13,800 mark for the first time this quarter",
    description:
      "Strong buying interest in banking and diversified sectors pushed the All Share Price Index past the 13,800 level.",
    image: "/images/carousel/images.jpg",
  },
  {
    id: 3,
    tag: "IPO",
    title: "New IPO listing: ABC Holdings PLC opens for subscription",
    description:
      "ABC Holdings PLC has opened its Initial Public Offering for public subscription from July 15 to July 22, 2025.",
    image: "/images/carousel/pexels-pixabay-534216.jpg",
  },
  {
    id: 4,
    tag: "Notice",
    title: "Market closed on July 18 for public holiday",
    description:
      "The CSE will remain closed on Friday, July 18, 2025 in observance of a public holiday.",
    image: "/images/carousel/images.jpg",
  },
];

const AUTO_PLAY_INTERVAL = 5000;

export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length),
    [],
  );

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % SLIDES.length),
    [],
  );

  const dragStart = useRef(null);

  const onPointerDown = (e) => {
    dragStart.current = e.clientX;
    setPaused(true);
  };

  const onPointerUp = (e) => {
    if (dragStart.current === null) return;
    const delta = e.clientX - dragStart.current;
    if (delta > 50) prev();
    else if (delta < -50) next();
    dragStart.current = null;
    setPaused(false);
  };

  // Auto-play — pauses on hover/focus
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, AUTO_PLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [paused, next]);

  return (
    // WCAG 2, 1.3.1: role="region" + aria-label identifies carousel as landmark
    <section
      className="carousel"
      aria-label="CSE news and announcements"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      // WCAG 2, 2.1.1: pause auto-play when keyboard focus enters
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* WCAG 2, 2.1.1: drag/swipe to navigate slides */}
      <div
        className="carousel-track"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        style={{ cursor: "grab" }}
      >
        {SLIDES.map((slide, i) => (
          <div
            key={slide.id}
            className={`carousel-slide ${i === current ? "slide-active" : ""}`}
            // WCAG 2, 4.1.2: aria-hidden hides inactive slides from screen readers
            aria-hidden={i !== current}
            // WCAG 2, 1.3.1: role + aria-roledescription for each slide
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${i + 1} of ${SLIDES.length}: ${slide.title}`}
          >
            {/* WCAG 2, 1.1.1: img alt describes slide content for screen readers */}
            <img src={slide.image} alt={slide.title} className="slide-image" />
            {/* Overlay so text is readable over the image (WCAG 2, 1.4.3) */}
            <div className="slide-overlay">
              <p className="slide-title">{slide.title}</p>
              <p className="slide-description">{slide.description}</p>
            </div>
          </div>
        ))}
        {/* WCAG 2, 1.3.1: dot indicators overlaid on image at bottom center */}
        <div className="carousel-dots" role="tablist" aria-label="Slide indicators">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.id}
              role="tab"
              className={`carousel-dot ${i === current ? "dot-active" : ""}`}
              onClick={() => setCurrent(i)}
              // WCAG 2, 4.1.2: aria-selected communicates active state
              aria-selected={i === current}
              // WCAG 2, 1.4.1: active dot uses size change + color, not color alone
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
