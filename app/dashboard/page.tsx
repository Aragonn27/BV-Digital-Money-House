'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card/Card';
import { formatCurrency } from '@/utils/validations';
import styles from './page.module.css';

export default function DashboardPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { user, account, isLoading: userLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || userLoading) {
    return (
      <div className={styles.container}>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Hola, {user?.firstname || 'Usuario'}
      </h1>

      <div className={styles.grid}>
        <Card title="Saldo Disponible" className={styles.balanceCard}>
          <p className={styles.balance}>
            {account ? formatCurrency(account.available_amount) : '$0.00'}
          </p>
          <div className={styles.accountInfo}>
            <p>CVU: {account?.cvu || 'No disponible'}</p>
            <p>Alias: {account?.alias || 'No disponible'}</p>
          </div>
        </Card>

        <Card title="Acciones Rápidas">
          <div className={styles.actions}>
            <button
              className={styles.actionButton}
              onClick={() => router.push('/add-money')}
            >
              💰 Cargar Dinero
            </button>
            <button
              className={styles.actionButton}
              onClick={() => router.push('/pay-services')}
            >
              🧾 Pagar Servicios
            </button>
            <button
              className={styles.actionButton}
              onClick={() => router.push('/cards')}
            >
              💳 Mis Tarjetas
            </button>
            <button
              className={styles.actionButton}
              onClick={() => router.push('/activity')}
            >
              📊 Ver Actividad
            </button>
          </div>
        </Card>
      </div>

      <Card title="Últimos Movimientos" className={styles.transactionsCard}>
        <p className={styles.emptyState}>
          No hay movimientos recientes. Comienza a usar tu billetera para ver tu
          actividad aquí.
        </p>
      </Card>
    </div>
  );
}
