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
        <div className="logo group">
          <Link href="/" className="block w-full h-full">
            <Image
              src="/images/logo/Logo.png"
              alt="Homepage"
              fill
              priority
              className="transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-6 group-hover:drop-shadow-lg filter group-hover:brightness-110"
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
