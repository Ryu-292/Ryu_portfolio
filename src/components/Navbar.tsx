"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLUListElement>(null);
  const toggleRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        toggleRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !toggleRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="nav-container">
        {/* Logo */}
        <div className="logo">
          <Link href="/">
            <Image
              src="/images/logo/Logo.png"
              alt="Homepage"
              fill
              priority
            />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div
          ref={toggleRef}
          className="toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        {/* Navigation Menu */}
        <ul ref={menuRef} className={`menu ${menuOpen ? "active" : ""}`}>
          <li className="section">
            <Link href="/" className="navi-link" onClick={closeMenu}>
              Home
            </Link>
          </li>

          <li className="section">
            <Link href="/projects" className="navi-link" onClick={closeMenu}>
              Projects
            </Link>
          </li>

          <li className="section">
            <Link href="/mylab" className="navi-link" onClick={closeMenu}>
              My Lab
            </Link>
          </li>
        </ul>
      </div>
    </header>

  );
}
