"use client";

import { useState } from "react";
import Link from "next/link";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Packages", href: "/packages" },
  { label: "Services", href: "/services" },
  { label: "Chat", href: "/chat" },
];

export function LandingHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    // Hard navigation so the proxy re-checks the (now cleared) cookies.
    window.location.assign("/login");
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="absolute inset-x-0 top-0 z-20 border-b border-[#dfcfb5]/80 bg-white/20 backdrop-blur-[2px]">
      <nav
        className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-5 px-5 sm:px-8 lg:px-12"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          onClick={closeMenu}
          className="font-serif text-4xl font-semibold leading-none text-[#075f42]"
        >
          Pure Path
        </Link>

        <div className="hidden items-center gap-9 text-md font-medium text-black md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={closeMenu}
              className="inline-flex items-center gap-2 transition hover:text-[#b7791f]"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Link
          href="/contact"
          onClick={closeMenu}
          className="hidden min-h-12 items-center justify-center rounded-full bg-[#075f42] px-5 text-base font-semibold text-white transition hover:bg-[#d89c34] hover:text-[#17211f] focus:outline-none focus:ring-4 focus:ring-[#075f42]/25 md:inline-flex lg:min-h-14 lg:px-8 lg:text-lg"
        >
          Contact Us
        </Link>

        <button
          type="button"
          onClick={logout}
          className="hidden min-h-12 items-center justify-center rounded-full border border-[#075f42] px-5 text-base font-semibold text-[#075f42] transition hover:bg-[#075f42] hover:text-white md:inline-flex"
        >
          Logout
        </button>

        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className="flex size-12 shrink-0 flex-col items-center justify-center gap-1.5 rounded-full border border-[#dfcfb5] bg-white/90 text-[#075f42] shadow-sm transition hover:border-[#d89c34] hover:text-[#b7791f] focus:outline-none focus:ring-4 focus:ring-[#075f42]/20 md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span className="h-0.5 w-5 rounded-full bg-current" />
          <span className="h-0.5 w-5 rounded-full bg-current" />
          <span className="h-0.5 w-5 rounded-full bg-current" />
        </button>
      </nav>

      {menuOpen ? (
        <div className="mx-5 mb-4 rounded-lg border border-[#dfcfb5] bg-white/95 p-3 shadow-xl md:hidden">
          <div className="grid gap-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                className="flex min-h-12 items-center rounded-lg border border-[#d9e3df] px-4 text-base font-bold text-[#17211f] transition hover:border-[#d89c34] hover:bg-[#fff7e8] hover:text-[#b7791f]"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={closeMenu}
              className="flex min-h-12 items-center justify-center rounded-lg bg-[#075f42] px-4 text-base font-bold text-white transition hover:bg-[#d89c34] hover:text-[#17211f] focus:outline-none focus:ring-4 focus:ring-[#075f42]/25"
            >
              Contact Us
            </Link>
            <button
              type="button"
              onClick={logout}
              className="flex min-h-12 items-center justify-center rounded-lg border border-[#075f42] px-4 text-base font-bold text-[#075f42]"
            >
              Logout
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
