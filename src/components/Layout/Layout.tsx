"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Layout.module.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.logo}>
            Revista<span>.</span>
          </Link>
          <nav className={styles.nav}>
            {[{ href: "/", label: "Início" }, { href: "/artigos", label: "Artigos" }].map(({ href, label }) => (
              <Link key={href} href={href}
                className={`${styles.navLink} ${pathname === href ? styles.navLinkAtivo : ""}`}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span className={styles.footerLogo}>Revista.</span>
          <p className={styles.footerCopy}>© {new Date().getFullYear()} Revista — Blog de Ideias</p>
        </div>
      </footer>
    </div>
  );
}
