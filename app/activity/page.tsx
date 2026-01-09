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

type PeriodFilter = 'all' | 'today' | 'yesterday' | 'week' | '15days' | 'month' | '3months';
type TypeFilter = 'all' | 'deposit' | 'payment' | 'transfer';
type AmountFilter = 'all' | '0-1000' | '1000-5000' | '5000-20000' | '20000-100000' | '100000+';

function ActivityContent() {
  const { isAuthenticated } = useAuth();
  const { account } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [amountFilter, setAmountFilter] = useState<AmountFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;

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
  }, [account]);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions, searchTerm, periodFilter, typeFilter, amountFilter]);

  const applyFilters = () => {
    let filtered = [...transactions];
    
    console.log('Aplicando filtros:', {
      totalTransactions: transactions.length,
      periodFilter,
      typeFilter,
      amountFilter,
      searchTerm
    });

    // Filtro por búsqueda
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(search) ||
          t.origin?.toLowerCase().includes(search) ||
          t.destination?.toLowerCase().includes(search)
      );
      console.log('Después de búsqueda:', filtered.length);
    }

    // Filtro por período
    if (periodFilter !== 'all') {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      console.log('Fecha actual:', now);
      console.log('Inicio del día:', startOfDay);
      
      filtered = filtered.filter((t) => {
        const transactionDate = new Date(t.dated);
        
        switch (periodFilter) {
          case 'today':
            const isToday = transactionDate >= startOfDay;
            console.log('Transacción:', t.id, 'Fecha:', t.dated, 'Es hoy?:', isToday);
            return isToday;
          case 'yesterday':
            const yesterday = new Date(startOfDay);
            yesterday.setDate(yesterday.getDate() - 1);
            return transactionDate >= yesterday && transactionDate < startOfDay;
          case 'week':
            const weekAgo = new Date(startOfDay);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return transactionDate >= weekAgo;
          case '15days':
            const fifteenDaysAgo = new Date(startOfDay);
            fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
            return transactionDate >= fifteenDaysAgo;
          case 'month':
            const monthAgo = new Date(startOfDay);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return transactionDate >= monthAgo;
          case '3months':
            const threeMonthsAgo = new Date(startOfDay);
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
            return transactionDate >= threeMonthsAgo;
          default:
            return true;
        }
      });
      console.log('Después de período:', filtered.length);
    }

    // Filtro por tipo
    if (typeFilter !== 'all') {
      filtered = filtered.filter((t) => {
        const transactionType = t.type.toLowerCase();
        console.log('Transacción tipo:', t.type, 'Filtro:', typeFilter, 'Match:', transactionType === typeFilter);
        return transactionType === typeFilter;
      });
      console.log('Después de tipo:', filtered.length);
    }

    // Filtro por monto
    if (amountFilter !== 'all') {
      filtered = filtered.filter((t) => {
        const amount = t.amount;
        
        switch (amountFilter) {
          case '0-1000':
            return amount >= 0 && amount <= 1000;
          case '1000-5000':
            return amount > 1000 && amount <= 5000;
          case '5000-20000':
            return amount > 5000 && amount <= 20000;
          case '20000-100000':
            return amount > 20000 && amount <= 100000;
          case '100000+':
            return amount > 100000;
          default:
            return true;
        }
      });
      console.log('Después de monto:', filtered.length);
    }

    // Ordenar por fecha (más reciente primero)
    filtered.sort((a, b) => new Date(b.dated).getTime() - new Date(a.dated).getTime());

    console.log('Total filtradas:', filtered.length);
    setFilteredTransactions(filtered);
    setCurrentPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setPeriodFilter('all');
    setTypeFilter('all');
    setAmountFilter('all');
    setCurrentPage(1);
  };

  const handleViewDetail = (transactionId: number) => {
    router.push(`/activity/${transactionId}`);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionIcon = (type: string): string => {
    const normalizedType = type.toLowerCase();
    switch (normalizedType) {
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
    const normalizedType = type.toLowerCase();
    switch (normalizedType) {
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

  // Paginación
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  const hasActiveFilters = searchTerm || periodFilter !== 'all' || typeFilter !== 'all' || amountFilter !== 'all';

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
              placeholder="Buscar por descripción..."
            />
          </form>

          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Período</label>
              <select
                className={styles.filterSelect}
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value as PeriodFilter)}
              >
                <option value="all">Todos</option>
                <option value="today">Hoy</option>
                <option value="yesterday">Ayer</option>
                <option value="week">Última semana</option>
                <option value="15days">Últimos 15 días</option>
                <option value="month">Último mes</option>
                <option value="3months">Últimos 3 meses</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Tipo</label>
              <select
                className={styles.filterSelect}
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
              >
                <option value="all">Todos</option>
                <option value="deposit">Ingresos</option>
                <option value="payment">Pagos</option>
                <option value="transfer">Transferencias</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Monto</label>
              <select
                className={styles.filterSelect}
                value={amountFilter}
                onChange={(e) => setAmountFilter(e.target.value as AmountFilter)}
              >
                <option value="all">Todos</option>
                <option value="0-1000">$0 - $1.000</option>
                <option value="1000-5000">$1.000 - $5.000</option>
                <option value="5000-20000">$5.000 - $20.000</option>
                <option value="20000-100000">$20.000 - $100.000</option>
                <option value="100000+">Más de $100.000</option>
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className={styles.filterActions}>
              <Button type="button" variant="secondary" onClick={handleClearFilters}>
                🗑️ Limpiar filtros
              </Button>
            </div>
          )}
        </Card>

        <div className={styles.resultsInfo}>
          <p>
            Mostrando {currentTransactions.length} de {filteredTransactions.length} transacciones
          </p>
        </div>

        {isLoading ? (
          <p className={styles.loading}>Cargando transacciones...</p>
        ) : currentTransactions.length > 0 ? (
          <>
            <div className={styles.transactionsList}>
              {currentTransactions.map((transaction) => (
                <Card
                  key={transaction.id}
                  className={styles.transactionCard}
                  onClick={() => handleViewDetail(transaction.id)}
                >
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
                          transaction.type.toLowerCase() === 'deposit'
                            ? styles.amountPositive
                            : styles.amountNegative
                        }
                      >
                        {transaction.type.toLowerCase() === 'deposit' ? '+' : '-'}$
                        {transaction.amount.toLocaleString('es-AR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <Button
                  variant="secondary"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  ← Anterior
                </Button>
                <span className={styles.pageInfo}>
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="secondary"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente →
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card>
            <p className={styles.emptyState}>
              {hasActiveFilters
                ? 'No se encontraron transacciones con los filtros aplicados'
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
