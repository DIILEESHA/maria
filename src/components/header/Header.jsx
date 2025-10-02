import React, { useState } from "react";
import "./h.css";
import "./lo.css";
import { Menu, X } from "lucide-react";

const scrollToSection = (id, closeMenu) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
  if (closeMenu) closeMenu();
};

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="header_container">
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
            <h2 className="nav_title"> FOTO</h2>
          </div>
        </div>
      </div>

      {/* Mobile Nav Icon */}
      <div
        className="mobile-nav-icon"
        onClick={() => setMobileMenuOpen((v) => !v)}
      >
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
              onClick={() =>
                scrollToSection("dettagli", () => setMobileMenuOpen(false))
              }
            >
              DETTAGLI
            </div>
            <div
              className="mobile-nav_list"
              onClick={() =>
                scrollToSection("regalo", () => setMobileMenuOpen(false))
              }
            >
              REGALO
            </div>
            <div
              className="mobile-nav_list"
              onClick={() =>
                scrollToSection("album", () => setMobileMenuOpen(false))
              }
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

      {/* Couple Names + Image */}
      <div className="header_grid">
        <div className="header_sub">
          <div className="couple_name_section">
            <h2 className="coupler">Maria Rosaria</h2>
            <h2 className="couplers">&</h2>
            <h2 className="coupler dance">Vincenzo</h2>
          </div>
        </div>
        <div className="header_sub don">
          <img
            src="https://i.imgur.com/j2XOUbU.jpeg"
            alt=""
            className="header_img"
          />
        </div>
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
    </div>
  );
};

export default Header;
