import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import "./App.css";
import Test1 from "./pages/Test1.jsx";
import SobreMi from "./pages/SobreMi.jsx";

const NAV_ITEMS = [
  {
    label: "Información",
    items: [
      { label: "Sobre mí", to: "/sobre-mi" },
      { label: "Opción 2", to: "/" },
      { label: "Opción 3", to: "/" },
      { label: "Opción 4", to: "/" },
    ],
  },
  {
    label: "Herramientas",
    items: [
      { label: "Opción 1", to: "/" },
      { label: "Opción 2", to: "/" },
      { label: "Opción 3", to: "/" },
      { label: "Opción 4", to: "/" },
    ],
  },
  {
    label: "Experimentos",
    items: [
      { label: "Test 1",   to: "/test1" },
      { label: "Opción 2", to: "/" },
      { label: "Opción 3", to: "/" },
      { label: "Opción 4", to: "/" },
    ],
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
            <Link
              key={i}
              to={opt.to}
              className="ll-dropdown-link"
              onClick={onClose}
            >
              <span className="ll-link-index">0{i + 1}</span>
              {opt.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function Layout() {
  const [openMenu, setOpenMenu] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpenMenu(null);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggle = (i) => setOpenMenu(openMenu === i ? null : i);

  return (
    <div className="ll-root">
      <header className={`ll-navbar ${scrolled ? "ll-navbar--shadow" : ""}`}>
        <div className="ll-navbar-inner">
          <Link to="/" className="ll-brand">
            <span className="ll-brand-bracket">[</span>
            LuisLand
            <span className="ll-brand-bracket">]</span>
          </Link>

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

      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/sobre-mi"  element={<SobreMi />} />
        <Route path="/test1"     element={<Test1 />} />
      </Routes>
    </div>
  );
}

function Home() {
  return (
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
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
