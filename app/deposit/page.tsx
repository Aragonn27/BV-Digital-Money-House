'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import Card from '@/components/Card/Card';
import Sidebar from '@/components/Sidebar';
import Button from '@/components/Button/Button';
import { cardService } from '@/services/cardService';
import { authService } from '@/services/authService';
import { Card as CardType } from '@/types';
import styles from './page.module.css';

export default function DepositPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { account, setAccount, isLoading: userLoading } = useUser();
  const router = useRouter();
  const [cards, setCards] = useState<CardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  console.log('DepositPage renderizado:', {
    isAuthenticated,
    authLoading,
    userLoading,
    accountId: account?.id,
    hasAccount: !!account
  });

  useEffect(() => {
    // Solo redirigir si ya terminó de cargar y no está autenticado
    if (!authLoading && !isAuthenticated) {
      console.log('No autenticado después de cargar, redirigiendo a /login');
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Cargar cuenta si no está disponible (igual que en dashboard)
  useEffect(() => {
    const loadAccount = async () => {
      if (!account && isAuthenticated && !authLoading && !userLoading) {
        try {
          console.log('DepositPage: Cargando cuenta...');
          const accountData = await authService.getAccount();
          console.log('DepositPage: Cuenta cargada:', accountData);
          setAccount(accountData);
        } catch (error) {
          console.error('DepositPage: Error al cargar cuenta:', error);
        }
      }
    };
    loadAccount();
  }, [account, isAuthenticated, authLoading, userLoading, setAccount]);

  useEffect(() => {
    console.log('useEffect de loadCards, account:', account?.id);
    if (account?.id) {
      loadCards();
    }
  }, [account]);

  const loadCards = async () => {
    if (!account?.id) return;
    
    console.log('loadCards iniciado para account:', account.id);
    try {
      const data = await cardService.getCards(account.id);
      console.log('Tarjetas cargadas:', data);
      setCards(data);
    } catch (error) {
      console.error('Error al cargar tarjetas:', error);
    } finally {
      setIsLoading(false);
      console.log('isLoading = false');
    }
  };

  const handleSelectCard = (cardId: number) => {
    console.log('Seleccionando tarjeta:', cardId);
    router.push(`/deposit/${cardId}`);
  };

  const handleDepositFromAccount = () => {
    console.log('Navegando a /deposit/account');
    router.push('/deposit/account');
  };

  const getCardType = (numberStart: string): string => {
    const firstDigit = numberStart.charAt(0);
    const firstTwoDigits = numberStart.substring(0, 2);
    
    if (firstDigit === '4') return 'Visa';
    if (parseInt(firstTwoDigits) >= 51 && parseInt(firstTwoDigits) <= 55) return 'Mastercard';
    if (firstTwoDigits === '34' || firstTwoDigits === '37') return 'AMEX';
    return 'Desconocida';
  };

  const maskCardNumber = (number: number): string => {
    const numberStr = number.toString();
    return `•••• ${numberStr.slice(-4)}`;
  };

  // Mostrar cargando mientras se inicializan los contextos
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

  // Si ya cargó pero no hay cuenta, mostrar error
  if (!account) {
    return (
      <div className={styles.container}>
        <Sidebar />
        <div className={styles.content}>
          <p>No se pudo cargar la información de la cuenta. Por favor, intenta nuevamente.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <h1 className={styles.title}>Cargar dinero</h1>
        
        <Card title="Transferencia bancaria">
          <p className={styles.description}>
            Copia tu CVU o alias para ingresar dinero desde otra cuenta
          </p>
          <Button onClick={handleDepositFromAccount} fullWidth>
            Ver CVU y Alias
          </Button>
        </Card>

        <div className={styles.section}>
          <h2 className={styles.subtitle}>Con tarjeta de débito o crédito</h2>
          {isLoading ? (
            <p className={styles.loading}>Cargando tarjetas...</p>
          ) : cards.length === 0 ? (
            <Card>
              <p className={styles.emptyState}>
                No tienes tarjetas asociadas. Agrega una tarjeta para poder cargar dinero.
              </p>
              <Button onClick={() => router.push('/cards/add')} fullWidth>
                Agregar tarjeta
              </Button>
            </Card>
          ) : (
            <div className={styles.cardsList}>
              {cards.map((card) => (
                <div
                  key={card.id}
                  className={styles.cardItem}
                  onClick={() => handleSelectCard(card.id)}
                >
                  <div className={styles.cardHeader}>
                    <span className={styles.cardType}>
                      {getCardType(card.number_id.toString())}
                    </span>
                  </div>
                  <p className={styles.cardNumber}>
                    {maskCardNumber(card.number_id)}
                  </p>
                  <div className={styles.cardInfo}>
                    <p>{card.first_last_name}</p>
                    <p>Vence: {card.expiration_date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
