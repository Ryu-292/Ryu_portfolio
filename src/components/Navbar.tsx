"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

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
          className="toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        {/* Navigation Menu */}
        <ul className={`menu ${menuOpen ? "active" : ""}`}>
          <li className="section">
            <Link href="/" className="navi-link">
              Home
            </Link>
          </li>

          <li className="section">
            <Link href="/projects" className="navi-link">
              Projects
            </Link>
          </li>

          <li className="section">
            <Link href="/mylab" className="navi-link">
              My Lab
            </Link>
          </li>
        </ul>
      </div>
    </header>

  );
}
