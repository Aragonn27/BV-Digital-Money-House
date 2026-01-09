'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import styles from './Header.module.css';

export default function Header() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          DMH
        </Link>

        <nav className={styles.nav}>
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className={styles.navLink}>
                Dashboard
              </Link>
              <button onClick={logout} className={styles.logoutButton}>
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={styles.loginButton}>
                Ingresar
              </Link>
              <Link href="/register" className={styles.registerButton}>
                Crear cuenta
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
