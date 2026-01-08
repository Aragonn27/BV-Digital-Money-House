'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const router = useRouter();
  const { logout } = useAuth();
  const { user } = useUser();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const menuItems = [
    { label: 'Inicio', path: '/dashboard', icon: '🏠' },
    { label: 'Mi Perfil', path: '/profile', icon: '👤' },
    { label: 'Actividad', path: '/activity', icon: '📊' },
    { label: 'Pagar Servicios', path: '/pay-services', icon: '💳' },
    { label: 'Tarjetas', path: '/cards', icon: '💳' },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header} onClick={() => router.push('/dashboard')}>
        <h2 className={styles.userName}>
          {user?.firstname} {user?.lastname}
        </h2>
      </div>

      <nav className={styles.nav}>
        <ul className={styles.menu}>
          {menuItems.map((item) => (
            <li key={item.path} className={styles.menuItem}>
              <button
                onClick={() => router.push(item.path)}
                className={styles.menuButton}
              >
                <span className={styles.icon}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.footer}>
        <button onClick={handleLogout} className={styles.logoutButton}>
          <span className={styles.icon}>🚪</span>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
