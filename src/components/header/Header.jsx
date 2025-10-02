import React, { useEffect, useRef, useState } from "react";
import "./h.css";
import { Menu, X, Play, Pause } from "lucide-react";

/**
 * Header Slideshow component with autoplay toggle
 *
 * - Autoplay enabled by default
 * - Pause on hover / when mobile menu open
 * - Manual navigation temporarily pauses autoplay for 3s
 * - Play/Pause control to enable/disable autoplay
 */

const scrollToSection = (id, closeMenu) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
  if (closeMenu) closeMenu();
};

const Header = () => {
  // slide images (replace or add more URLs)
  const slides = [
    "https://i.imgur.com/BlXVwKs.jpeg", // your provided image
    "https://i.imgur.com/j2XOUbU.jpeg", // sample fallback
  ];
  const intervalMs = 4000; // 5 seconds
  const [index, setIndex] = useState(0);

  // playback controls
  const [autoplay, setAutoplay] = useState(true); // autoplay enabled by default
  const [paused, setPaused] = useState(false); // temporary pause (hover / interactions / mobile menu)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const intervalRef = useRef(null);
  const resumeTimeoutRef = useRef(null);

  // start/stop interval depending on autoplay & paused
  useEffect(() => {
    stopTimer();
    if (autoplay && !paused) {
      intervalRef.current = setInterval(() => {
        setIndex((i) => (i + 1) % slides.length);
      }, intervalMs);
    }
    return () => {
      stopTimer();
    };
    // depend on autoplay and paused and slides length
  }, [autoplay, paused, slides.length]);

  useEffect(() => {
    return () => {
      stopTimer();
      clearResumeTimeout();
    };
    // cleanup on unmount
  }, []);

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const clearResumeTimeout = () => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  };

  // temporarily pause autoplay (for user interactions) and resume after 3s if autoplay enabled
  const tempPause = (ms = 1000) => {
    // if autoplay is off, no need to set temporary pause
    if (!autoplay) return;
    setPaused(true);
    clearResumeTimeout();
    resumeTimeoutRef.current = setTimeout(() => {
      setPaused(false);
      resumeTimeoutRef.current = null;
    }, ms);
  };

  const goTo = (i) => {
    setIndex(i % slides.length);
    tempPause();
  };
  const prev = () => {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
    tempPause();
  };
  const next = () => {
    setIndex((i) => (i + 1) % slides.length);
    tempPause();
  };

  // toggle mobile menu and pause/resume based on menu state
  const toggleMobileMenu = () => {
    const newOpen = !mobileMenuOpen;
    setMobileMenuOpen(newOpen);
    // if opening menu => pause; if closing => unpause (only if autoplay enabled)
    if (newOpen) {
      setPaused(true);
      clearResumeTimeout();
    } else {
      // small delay to avoid immediate resume before user interacts
      if (autoplay) {
        clearResumeTimeout();
        resumeTimeoutRef.current = setTimeout(() => {
          setPaused(false);
          resumeTimeoutRef.current = null;
        }, 500);
      } else {
        setPaused(false);
      }
    }
  };

  return (
    <header
      className="header_container"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        // resume only if autoplay is enabled
        if (autoplay) setPaused(false);
      }}
    >
      {/* Background slides layer */}
      <div className="slides" aria-hidden="true">
        {slides.map((src, i) => (
          <div
            key={i}
            className={`slide ${i === index ? "active" : ""}`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
        <div className="overlay" />
      </div>

      {/* Desktop Nav */}
      <div className="nav desktop-nav">
        <div className="navs">
          <div
            className="nav_list"
            onClick={() => scrollToSection("dettagli")}
            style={{ cursor: "pointer" }}
          >
            <h2 className="nav_title">DETTAGLI</h2>
          </div>
          <div
            className="nav_list"
            onClick={() => scrollToSection("regalo")}
            style={{ cursor: "pointer" }}
          >
            <h2 className="nav_title">REGALO</h2>
          </div>
          <div
            className="nav_list"
            onClick={() => scrollToSection("album")}
            style={{ cursor: "pointer" }}
          >
            <h2 className="nav_title">FOTO</h2>
          </div>
        </div>
      </div>

      {/* Mobile Nav Icon */}
      <div className="mobile-nav-icon" onClick={toggleMobileMenu}>
        {mobileMenuOpen ? (
          <X className="saq" color="#000" size={32} />
        ) : (
          <Menu className="saq " size={32} />
        )}
      </div>

      {/* Mobile Nav Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-menu">
          <div className="doee">
            <div
              className="mobile-nav_list"
              onClick={() => scrollToSection("dettagli", () => setMobileMenuOpen(false))}
            >
              DETTAGLI
            </div>
            <div
              className="mobile-nav_list"
              onClick={() => scrollToSection("regalo", () => setMobileMenuOpen(false))}
            >
              REGALO
            </div>
            <div
              className="mobile-nav_list"
              onClick={() => scrollToSection("album", () => setMobileMenuOpen(false))}
            >
              FOTO
            </div>
          </div>
        </div>
      )}

      {/* Top decoration images */}
      <div className="header_top">
        <img src="https://i.imgur.com/8wInKXb.png" className="toper" alt="" />
      </div>
      <div className="header_toper">
        <img src="https://i.imgur.com/8wInKXb.png" className="topers" alt="" />
      </div>

      {/* Main content */}
      <div className="header_grid">
        <div className="header_sub">
          <div className="couple_name_section">
            <h2 className="coupler">Maria Rosaria</h2>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "",
                textAlign: "center",
                justifyContent: "center",
              }}
            >
              <h2
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
                className="coupler dance"
              >
                <span className="couplers">&</span>
                Vincenzo
              </h2>
            </div>
          </div>
        </div>
        <div className="header_sub don">{/* optional image or decoration */}</div>
      </div>

      {/* Date Section */}
      <div className="date_bottom">
        <div className="date_sub"></div>
        <div className="date_sub">
          <div className="date_card">
            <div className="date_sub_card d">
              <h2 className="point">VENERDì</h2>
            </div>
            <div className="date_sub_card">
              <h2 className="points">19</h2>
            </div>
            <div className="date_sub_card d m">
              <h2 className="point">DICEMBRE</h2>
            </div>
          </div>
        </div>
      </div>

      {/* slideshow controls */}
      <div className="slideshow-controls">
        <button
          className="nav-btn prev"
          aria-label="Previous slide"
          onClick={() => {
            prev();
          }}
        >
          ‹
        </button>

        <div className="dots" role="tablist" aria-label="Slide dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === index ? "active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          className="nav-btn next"
          aria-label="Next slide"
          onClick={() => {
            next();
          }}
        >
          ›
        </button>

    
      </div>
    </header>
  );
};

export default Header;
