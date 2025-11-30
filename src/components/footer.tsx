"use client";

import React from 'react';

const Footer = () => {
  const openMail = () => {
    window.location.href = 'mailto:ryuosada12@gmail.com';
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 text-[#f5f5f0] py-4 bg-transparent">
      <div className="max-w-6xl mx-auto px-6">
        {/* Desktop Version - Full Text */}
        <div className="hidden md:flex flex-row items-center justify-center gap-8">
          {/* Email */}
          <button
            onClick={openMail}
            className="text-sm text-[#f5f5f0] hover:text-[#00A4FF] transition-colors duration-200 relative"
          >
            ryuosada12@gmail.com
          </button>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/ryu-osada"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#f5f5f0] hover:text-[#00A4FF] transition-colors duration-200"
          >
            LinkedIn
          </a>

          {/* CV Download */}
          <a
            href="/fichier/CV_Ryu_OSADA.pdf"
            download="CV_Ryu_OSADA.pdf"
            className="inline-flex items-center gap-2 bg-[#00A4FF]/10 border border-[#00A4FF]/40 text-[#8abaff] hover:bg-[#00A4FF]/20 hover:text-[#f5f5f0] px-4 py-2 rounded-full text-sm transition-all duration-200"
          >
            <span>Download CV</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            </svg>
          </a>
        </div>

        {/* Mobile Version - Small Icons */}
        <div className="flex md:hidden items-center justify-center">
          <div className="flex items-center gap-3 bg-[#000021]/95 px-4 py-2 rounded-full border border-[#00A4FF]/40 backdrop-blur-md shadow-[0_0_20px_rgba(0,164,255,0.2)]">
            {/* Email Icon */}
            <button
              onClick={openMail}
              className="footer-icon"
              aria-label="Email"
            >
              <img src="/images/mail.svg" alt="Email" width="16" height="16" />
            </button>

            {/* LinkedIn Icon */}
            <a
              href="https://www.linkedin.com/in/ryu-osada"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-icon"
              aria-label="LinkedIn"
            >
              <img src="/images/linkedin.svg" alt="LinkedIn" width="16" height="16" />
            </a>

            {/* CV Download Icon */}
            <a
              href="/fichier/CV_Ryu_OSADA.pdf"
              download="CV_Ryu_OSADA.pdf"
              className="footer-icon"
              aria-label="Download CV"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
