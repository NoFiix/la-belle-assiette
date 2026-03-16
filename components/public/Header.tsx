"use client";

import { useState, useEffect } from "react";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 shadow-sm backdrop-blur-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/images/logo/Logo_la-belle-assiette.jpg"
            alt="La Belle Assiette"
            width={150}
            height={50}
            priority
            className="h-[40px] w-auto lg:h-[50px]"
          />
        </Link>

        {/* Navigation desktop */}
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Navigation principale">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-sm font-medium tracking-wide text-text-light transition-colors hover:text-primary after:absolute after:bottom-[-4px] after:left-0 after:h-[1px] after:w-0 after:bg-secondary after:transition-all hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/reservation"
            className="rounded-sm bg-secondary px-6 py-2.5 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-secondary-dark"
          >
            Reserver
          </Link>
        </nav>

        {/* Bouton burger mobile */}
        <button
          type="button"
          className="relative z-50 flex h-10 w-10 items-center justify-center lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          <div className="flex w-6 flex-col gap-1.5">
            <span
              className={`block h-0.5 w-full bg-primary transition-all duration-300 ${
                isMenuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-full bg-primary transition-all duration-300 ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-full bg-primary transition-all duration-300 ${
                isMenuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* Menu mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-background transition-opacity duration-300 lg:hidden ${
          isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isMenuOpen}
      >
        <nav
          className="flex h-full flex-col items-center justify-center gap-8"
          aria-label="Navigation mobile"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-heading text-2xl font-semibold text-primary transition-colors hover:text-secondary"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/reservation"
            className="mt-4 rounded-sm bg-secondary px-8 py-3 text-lg font-semibold tracking-wide text-white transition-colors hover:bg-secondary-dark"
            onClick={() => setIsMenuOpen(false)}
          >
            Reserver
          </Link>
        </nav>
      </div>
    </header>
  );
}
