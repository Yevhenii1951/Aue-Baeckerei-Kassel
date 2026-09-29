"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { NavLink } from "./siteNavigation";

export type { NavLink } from "./siteNavigation";

type MobileMenuProps = {
  links: NavLink[];
  menuLabel: string;
  closeLabel: string;
  brandLabel: string;
};

export function MobileMenu({
  links,
  menuLabel,
  closeLabel,
  brandLabel,
}: MobileMenuProps): React.ReactElement {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls="mobile-menu-drawer"
        aria-label={menuLabel}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-cream transition-colors duration-300 hover:bg-white/10 lg:hidden"
      >
        <svg
          aria-hidden="true"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      <div
        id="mobile-menu-drawer"
        aria-hidden={!open}
        className={`fixed inset-0 z-50 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          role="presentation"
          className={`absolute inset-0 touch-none bg-brand-deep/60 transition-opacity duration-300 ${
            open ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label={menuLabel}
          className={`absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-paper shadow-panel transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-brand-deep/10 px-4 py-3">
            <span className="font-display text-xl font-semibold text-brand-deep">
              {brandLabel}
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={closeLabel}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-brand-deep/70 transition-colors duration-300 hover:bg-cream"
            >
              <svg
                aria-hidden="true"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-4 py-4">
            <ul className="space-y-1">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block min-h-11 rounded-lg px-3 py-3 font-display text-2xl font-medium text-ink transition-colors duration-300 hover:bg-cream hover:text-brand-deep"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
