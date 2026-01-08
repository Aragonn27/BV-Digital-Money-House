'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import styles from './Header.module.css';

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Digital Money House
        </Link>

        <button
          className={styles.menuToggle}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`}>
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className={styles.navLink}>
                Dashboard
              </Link>
              <Link href="/profile" className={styles.navLink}>
                Perfil
              </Link>
              <Link href="/activity" className={styles.navLink}>
                Actividad
              </Link>
              <button onClick={logout} className={styles.button}>
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={styles.navLink}>
                Ingresar
              </Link>
              <Link href="/register">
                <button className={styles.button}>Crear Cuenta</button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
