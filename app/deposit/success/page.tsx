'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import Card from '@/components/Card/Card';
import Sidebar from '@/components/Sidebar';
import Button from '@/components/Button/Button';
import styles from './page.module.css';

export default function DepositSuccessPage() {
  const { isAuthenticated } = useAuth();
  const { refreshUserData } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const amount = searchParams.get('amount');
  const origin = searchParams.get('origin');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      // Refrescar datos del usuario para mostrar el saldo actualizado
      refreshUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, router]);

  const formatAmount = (value: string | null): string => {
    if (!value) return '$0';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(parseFloat(value));
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <div className={styles.successIcon}>✓</div>
        <h1 className={styles.title}>¡Carga exitosa!</h1>
        
        <Card>
          <div className={styles.details}>
            <div className={styles.amountSection}>
              <span className={styles.amountLabel}>Monto cargado</span>
              <span className={styles.amount}>{formatAmount(amount)}</span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Origen:</span>
              <span className={styles.detailValue}>{origin || 'Tarjeta'}</span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Fecha:</span>
              <span className={styles.detailValue}>
                {new Date().toLocaleDateString('es-AR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>

          <div className={styles.actions}>
            <Button onClick={() => router.push('/dashboard?refresh=' + Date.now())} fullWidth>
              Ir al inicio
            </Button>
            <Button variant="secondary" onClick={() => router.push('/deposit')} fullWidth>
              Nueva carga
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
