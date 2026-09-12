"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import { Icon, type IconName } from "@/components/Icon/Icon";
import styles from "./AppShell.module.css";

const NAV: { href: string; label: string; short: string; icon: IconName }[] = [
  { href: "/", label: "Budżet", short: "Budżet", icon: "home" },
  { href: "/expenses", label: "Wydatki", short: "Wydatki", icon: "list" },
  { href: "/rooms", label: "Pomieszczenia", short: "Strefy", icon: "rooms" },
  { href: "/savings", label: "Oszczędności", short: "Oszcz.", icon: "piggy" },
  { href: "/settings", label: "Ustawienia", short: "Ustaw.", icon: "settings" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand}>
            <span className={styles.mark} aria-hidden="true">
              <svg viewBox="0 0 36 36" fill="none">
                <rect x="3" y="8" width="30" height="22" rx="3" />
                <path d="M3 16h30M15 8v22M24 16v14" />
                <circle cx="11" cy="12" r="1.1" fill="currentColor" stroke="none" />
              </svg>
            </span>
            <span className={styles.brandText}>
              <strong>DOM</strong>
              <em>wykończenie</em>
            </span>
          </Link>
          <nav className={styles.desktopNav} aria-label="Główne">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  isActive(pathname, item.href)
                    ? `${styles.navLink} ${styles.navLinkActive}`
                    : styles.navLink
                }
              >
                <Icon name={item.icon} size={16} />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="appMain">{children}</main>
      <nav className={styles.mobileNav} aria-label="Główne">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={
              isActive(pathname, item.href)
                ? `${styles.mobileLink} ${styles.mobileLinkActive}`
                : styles.mobileLink
            }
          >
            <Icon name={item.icon} size={20} />
            {item.short}
          </Link>
        ))}
      </nav>
    </div>
  );
}
