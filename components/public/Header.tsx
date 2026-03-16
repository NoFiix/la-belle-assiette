"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/menu", label: "Menu" },
  { href: "/evenements", label: "Evenements" },
  { href: "/galerie", label: "Galerie" },
  { href: "/restaurant", label: "Restaurant" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === "/";

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const hasBg = scrolled || !isHome;
  const headerBg = hasBg
    ? "bg-card/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.05)]"
    : "bg-transparent";
  const textColor = hasBg ? "text-text" : "text-white";

  return (
    <>
      <header
        className={`h-20 flex items-center justify-between px-6 md:px-8 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}
      >
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/images/logo/Logo_la-belle-assiette.jpg"
            alt="La Belle Assiette"
            width={150}
            height={50}
            priority
            className={`h-[40px] w-auto lg:h-[50px] rounded-sm transition-all duration-300 ${
              !hasBg ? "brightness-[10] contrast-50" : ""
            }`}
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8" aria-label="Navigation principale">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${textColor} ${
                pathname === link.href ? "active" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/reservation"
            className="hidden md:inline-block btn-gold text-[13px] py-2.5 px-5"
          >
            Reserver
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`lg:hidden p-2 ${textColor}`}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {menuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-primary flex flex-col items-center justify-center gap-8 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-serif text-3xl text-white/90 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/reservation" className="btn-gold mt-4">
            Reserver une table
          </Link>
        </div>
      )}
    </>
  );
}
