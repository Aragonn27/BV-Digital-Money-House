'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import { authService } from '@/services/authService';
import Card from '@/components/Card/Card';
import Sidebar from '@/components/Sidebar';
import Button from '@/components/Button/Button';
import styles from './page.module.css';

export default function DepositFromAccountPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { account, setAccount, isLoading: userLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Cargar cuenta si no está disponible
  useEffect(() => {
    const loadAccount = async () => {
      if (!account && isAuthenticated && !authLoading && !userLoading) {
        try {
          console.log('DepositFromAccountPage: Cargando cuenta...');
          const accountData = await authService.getAccount();
          console.log('DepositFromAccountPage: Cuenta cargada:', accountData);
          setAccount(accountData);
        } catch (error) {
          console.error('DepositFromAccountPage: Error al cargar cuenta:', error);
        }
      }
    };
    loadAccount();
  }, [account, isAuthenticated, authLoading, userLoading, setAccount]);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(`${label} copiado al portapapeles ✓`);
    } catch (err) {
      console.error('Error al copiar:', err);
      alert('No se pudo copiar al portapapeles');
    }
  };

  // Mostrar cargando mientras se inicializan los contextos
  if (authLoading || userLoading || !account) {
    return (
      <div className={styles.container}>
        <Sidebar />
        <div className={styles.content}>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Ingresar dinero desde otra cuenta</h1>
          <Button variant="secondary" onClick={() => router.push('/deposit')}>
            Volver
          </Button>
        </div>

        <Card>
          <div className={styles.instructions}>
            <h3 className={styles.instructionsTitle}>
              📋 Copia tu CVU o Alias
            </h3>
            <p className={styles.instructionsText}>
              Comparte estos datos con quien vaya a transferirte dinero o úsalos para transferir desde tu cuenta bancaria.
            </p>
          </div>

          <div className={styles.accountData}>
            <div className={styles.dataRow}>
              <div className={styles.dataInfo}>
                <span className={styles.dataLabel}>CVU</span>
                <span className={styles.dataValue}>{account.cvu}</span>
              </div>
              <Button
                onClick={() => copyToClipboard(account.cvu, 'CVU')}
                variant="secondary"
              >
                📋 Copiar
              </Button>
            </div>

            <div className={styles.dataRow}>
              <div className={styles.dataInfo}>
                <span className={styles.dataLabel}>Alias</span>
                <span className={styles.dataValue}>{account.alias}</span>
              </div>
              <Button
                onClick={() => copyToClipboard(account.alias, 'Alias')}
                variant="secondary"
              >
                📋 Copiar
              </Button>
            </div>
          </div>

          <div className={styles.tips}>
            <h4 className={styles.tipsTitle}>💡 Información útil</h4>
            <ul className={styles.tipsList}>
              <li>El CVU es tu Clave Virtual Uniforme, único para tu cuenta</li>
              <li>El Alias es más fácil de recordar y compartir</li>
              <li>Ambos sirven para recibir transferencias</li>
              <li>No compartas estos datos con personas desconocidas</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
