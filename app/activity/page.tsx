'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import Card from '@/components/Card/Card';
import Sidebar from '@/components/Sidebar';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import { transactionService } from '@/services/transactionService';
import { Transaction } from '@/types';
import styles from './page.module.css';

function ActivityContent() {
  const { isAuthenticated } = useAuth();
  const { account } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [searchParams]);

  const loadTransactions = async () => {
    if (!account?.id) return;
    
    setIsLoading(true);
    try {
      const data = await transactionService.getTransactions(account.id, {
        search: searchTerm || undefined,
      });
      setTransactions(data);
    } catch (error) {
      console.error('Error al cargar transacciones:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (account?.id) {
      loadTransactions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadTransactions();
  };

  const handleClearFilter = () => {
    setSearchTerm('');
    router.push('/activity');
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getTransactionIcon = (type: string): string => {
    switch (type) {
      case 'deposit':
        return '⬇️';
      case 'payment':
        return '💳';
      case 'transfer':
        return '↔️';
      default:
        return '💰';
    }
  };

  const getTransactionLabel = (type: string): string => {
    switch (type) {
      case 'deposit':
        return 'Ingreso';
      case 'payment':
        return 'Pago';
      case 'transfer':
        return 'Transferencia';
      default:
        return 'Operación';
    }
  };

  if (!account) {
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
        <h1 className={styles.title}>Mi Actividad</h1>

        <Card>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <Input
              label="Buscar transacciones"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por descripción, monto, etc..."
            />
            <div className={styles.searchActions}>
              <Button type="submit">Buscar</Button>
              {searchTerm && (
                <Button type="button" variant="secondary" onClick={handleClearFilter}>
                  Limpiar Filtro
                </Button>
              )}
            </div>
          </form>
        </Card>

        {isLoading ? (
          <p className={styles.loading}>Cargando transacciones...</p>
        ) : transactions.length > 0 ? (
          <div className={styles.transactionsList}>
            {transactions.map((transaction) => (
              <Card key={transaction.id} className={styles.transactionCard}>
                <div className={styles.transactionHeader}>
                  <div className={styles.transactionIcon}>
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div className={styles.transactionInfo}>
                    <h3 className={styles.transactionDescription}>
                      {transaction.description}
                    </h3>
                    <p className={styles.transactionType}>
                      {getTransactionLabel(transaction.type)}
                    </p>
                    <p className={styles.transactionDate}>
                      {formatDate(transaction.dated)}
                    </p>
                  </div>
                  <div className={styles.transactionAmount}>
                    <span
                      className={
                        transaction.type === 'deposit'
                          ? styles.amountPositive
                          : styles.amountNegative
                      }
                    >
                      {transaction.type === 'deposit' ? '+' : '-'}$
                      {transaction.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className={styles.transactionDetails}>
                  {transaction.origin && (
                    <p>
                      <strong>Origen:</strong> {transaction.origin}
                    </p>
                  )}
                  {transaction.destination && (
                    <p>
                      <strong>Destino:</strong> {transaction.destination}
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <p className={styles.emptyState}>
              {searchTerm
                ? 'No se encontraron transacciones con ese criterio'
                : 'No hay transacciones para mostrar'}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function ActivityPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ActivityContent />
    </Suspense>
  );
}
