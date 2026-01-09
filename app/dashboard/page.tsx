'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Card from '@/components/Card/Card';
import Sidebar from '@/components/Sidebar';
import { transactionService } from '@/services/transactionService';
import { authService } from '@/services/authService';
import { Transaction } from '@/types';
import styles from './page.module.css';

export default function DashboardPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { user, account, setAccount, refreshUserData, isLoading: userLoading } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const refreshParam = searchParams.get('refresh');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const hasRefreshed = useRef(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Cargar cuenta si no está disponible
  useEffect(() => {
    const loadAccount = async () => {
      if (!account && isAuthenticated && !authLoading) {
        try {
          console.log('Dashboard: Cargando cuenta...');
          const accountData = await authService.getAccount();
          console.log('Dashboard: Cuenta cargada:', accountData);
          setAccount(accountData);
        } catch (error) {
          console.error('Dashboard: Error al cargar cuenta:', error);
        }
      }
    };
    loadAccount();
  }, [account, isAuthenticated, authLoading, setAccount]);

  useEffect(() => {
    if (account?.id && user?.id) {
      loadTransactions();
      // Refrescar datos del usuario para obtener saldo actualizado
      refreshUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account?.id, refreshParam]);

  const loadTransactions = async () => {
    if (!account?.id) return;
    
    setLoadingTransactions(true);
    try {
      const data = await transactionService.getTransactions(account.id, { limit: 10 });
      setTransactions(data);
    } catch (error: any) {
      console.error('Error al cargar transacciones:', error);
      // No hacer nada más, apiClient ya maneja el 401
    } finally {
      setLoadingTransactions(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/activity?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(`${label} copiado al portapapeles`);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  if (authLoading || userLoading) {
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
        <h1 className={styles.title}>
          Hola, {user?.firstname || 'Usuario'}
        </h1>

        <div className={styles.grid}>
          <Card title="Dinero Disponible" className={styles.balanceCard}>
            <p className={styles.balance}>
              ${account ? account.available_amount.toFixed(2) : '0.00'}
            </p>
            <div className={styles.accountInfo}>
              <div className={styles.infoRow}>
                <span>CVU: {account?.cvu || 'No disponible'}</span>
                <button 
                  className={styles.copyButton}
                  onClick={() => copyToClipboard(account?.cvu || '', 'CVU')}
                  title="Copiar CVU"
                >
                  📋
                </button>
              </div>
              <div className={styles.infoRow}>
                <span>Alias: {account?.alias || 'No disponible'}</span>
                <button 
                  className={styles.copyButton}
                  onClick={() => copyToClipboard(account?.alias || '', 'Alias')}
                  title="Copiar Alias"
                >
                  📋
                </button>
              </div>
            </div>
            <div className={styles.quickActions}>
              <button
                className={styles.primaryButton}
                onClick={() => {
                  console.log('Navegando a /deposit');
                  router.push('/deposit');
                }}
              >
                💰 Cargar dinero
              </button>
              <button
                className={styles.primaryButton}
                onClick={() => {
                  console.log('Navegando a /pay-services');
                  router.push('/pay-services');
                }}
              >
                💳 Pagar servicios
              </button>
            </div>
          </Card>
        </div>

        <Card title="Últimos Movimientos" className={styles.transactionsCard}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              type="text"
              placeholder="Buscar en mi actividad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              Buscar
            </button>
          </form>

          {loadingTransactions ? (
            <p className={styles.loading}>Cargando transacciones...</p>
          ) : transactions.length > 0 ? (
            <>
              <div className={styles.transactionsList}>
                {transactions.map((transaction) => (
                  <div key={transaction.id} className={styles.transactionItem}>
                    <div className={styles.transactionInfo}>
                      <p className={styles.transactionDescription}>
                        {transaction.description}
                      </p>
                      <p className={styles.transactionDate}>
                        {new Date(transaction.dated).toLocaleDateString('es-AR')}
                      </p>
                    </div>
                    <div className={styles.transactionAmount}>
                      <span className={
                        transaction.type === 'deposit' 
                          ? styles.amountPositive 
                          : styles.amountNegative
                      }>
                        {transaction.type === 'deposit' ? '+' : '-'}
                        ${transaction.amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className={styles.viewAllButton}
                onClick={() => router.push('/activity')}
              >
                Ver toda la actividad
              </button>
            </>
          ) : (
            <p className={styles.emptyState}>
              No hay movimientos recientes. Comienza a usar tu billetera para ver tu
              actividad aquí.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
