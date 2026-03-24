import { useState, useEffect, useRef } from "react";
import "./App.css";

const NAV_ITEMS = [
  {
    label: "Información",
    items: ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
  },
  {
    label: "Herramientas",
    items: ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
  },
  {
    label: "Experimentos",
    items: ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
  },
];

function DropdownMenu({ item, isOpen, onToggle, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div className="ll-nav-item" ref={ref}>
      <button
        className={`ll-nav-btn ${isOpen ? "active" : ""}`}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        {item.label}
        <span className={`ll-chevron ${isOpen ? "open" : ""}`}>›</span>
      </button>

      <div className={`ll-dropdown ${isOpen ? "visible" : ""}`}>
        <div className="ll-dropdown-inner">
          {item.items.map((opt, i) => (
            <a key={i} href="#" className="ll-dropdown-link" onClick={onClose}>
              <span className="ll-link-index">0{i + 1}</span>
              {opt}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [openMenu, setOpenMenu] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggle = (i) => setOpenMenu(openMenu === i ? null : i);

  return (
    <div className="ll-root">
      {/* ── NAVBAR ── */}
      <header className={`ll-navbar ${scrolled ? "ll-navbar--shadow" : ""}`}>
        <div className="ll-navbar-inner">
          {/* Brand */}
          <a href="#" className="ll-brand">
            <span className="ll-brand-bracket">[</span>
            LuisLand
            <span className="ll-brand-bracket">]</span>
          </a>

          {/* Nav */}
          <nav className="ll-nav">
            {NAV_ITEMS.map((item, i) => (
              <DropdownMenu
                key={i}
                item={item}
                isOpen={openMenu === i}
                onToggle={() => toggle(i)}
                onClose={() => setOpenMenu(null)}
              />
            ))}
          </nav>
        </div>
      </header>

      {/* ── HERO ── */}
      <main className="ll-hero">
        <div className="ll-hero-grid" aria-hidden="true" />

        <div className="ll-hero-content">
          <p className="ll-hero-eyebrow">// Sistema activo</p>
          <h1 className="ll-hero-title">
            Bienvenido,
            <br />
            <span className="ll-hero-accent">visitante</span>
          </h1>
          <div className="ll-hero-line" />
        </div>

        <div className="ll-scanline" aria-hidden="true" />
      </main>
    </div>
  );
}
