'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import { authService } from '@/services/authService';
import Card from '@/components/Card/Card';
import Sidebar from '@/components/Sidebar';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import { cardService } from '@/services/cardService';
import { transactionService } from '@/services/transactionService';
import { Card as CardType } from '@/types';
import styles from './page.module.css';

export default function DepositWithCardPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { account, setAccount, refreshUserData, isLoading: userLoading } = useUser();
  const router = useRouter();
  const params = useParams();
  const cardId = params.id as string;
  
  const [card, setCard] = useState<CardType | null>(null);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

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
          console.log('DepositWithCardPage: Cargando cuenta...');
          const accountData = await authService.getAccount();
          console.log('DepositWithCardPage: Cuenta cargada:', accountData);
          setAccount(accountData);
        } catch (error) {
          console.error('DepositWithCardPage: Error al cargar cuenta:', error);
        }
      }
    };
    loadAccount();
  }, [account, isAuthenticated, authLoading, userLoading, setAccount]);

  useEffect(() => {
    if (account?.id && cardId) {
      loadCard();
    }
  }, [account, cardId]);

  const loadCard = async () => {
    if (!account?.id) return;
    
    try {
      const cards = await cardService.getCards(account.id);
      const selectedCard = cards.find((c: CardType) => c.id === parseInt(cardId));
      if (selectedCard) {
        setCard(selectedCard);
      } else {
        router.push('/deposit');
      }
    } catch (error) {
      console.error('Error al cargar tarjeta:', error);
      router.push('/deposit');
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAmount(value);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleSubmit ejecutado, amount:', amount);
    
    const amountNumber = parseFloat(amount);
    
    if (!amount || amountNumber <= 0) {
      setError('Ingresa un monto válido');
      return;
    }
    
    if (amountNumber < 100) {
      setError('El monto mínimo es $100');
      return;
    }
    
    if (amountNumber > 1000000) {
      setError('El monto máximo es $1.000.000');
      return;
    }
    
    console.log('Validación exitosa, mostrando confirmación');
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    if (!account?.id || !card) return;
    
    setIsSubmitting(true);
    try {
      const depositData = {
        amount: parseFloat(amount),
        dated: new Date().toISOString(),
        destination: account.cvu,
        origin: `Tarjeta **** ${card.number_id.toString().slice(-4)}`,
      };
      
      await transactionService.createDeposit(account.id, depositData);
      await refreshUserData();
      
      router.push('/deposit/success?amount=' + amount + '&origin=' + depositData.origin);
    } catch (error: any) {
      console.error('Error al realizar depósito:', error);
      
      // Si es error 401, el token expiró
      if (error.statusCode === 401) {
        setError('Tu sesión expiró. Por favor, vuelve a iniciar sesión.');
        setTimeout(() => {
          localStorage.clear();
          router.push('/login');
        }, 2000);
      } else {
        setError('Error al procesar el depósito. Intenta nuevamente.');
      }
      setShowConfirmation(false);
    } finally {
      setIsSubmitting(false);
    }
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

  const formatAmount = (value: string): string => {
    if (!value) return '';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(parseFloat(value));
  };

  if (!account || !card) {
    return (
      <div className={styles.container}>
        <Sidebar />
        <div className={styles.content}>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  if (showConfirmation) {
    return (
      <div className={styles.container}>
        <Sidebar />
        <div className={styles.content}>
          <h1 className={styles.title}>Confirmar operación</h1>
          
          <Card>
            <div className={styles.confirmationDetails}>
              <h3 className={styles.confirmTitle}>Resumen de la carga</h3>
              
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Monto:</span>
                <span className={styles.detailValue}>{formatAmount(amount)}</span>
              </div>
              
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Tarjeta:</span>
                <span className={styles.detailValue}>
                  {getCardType(card.number_id.toString())} {maskCardNumber(card.number_id)}
                </span>
              </div>
              
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Destino:</span>
                <span className={styles.detailValue}>Tu cuenta DMH</span>
              </div>
              
              <div className={styles.actions}>
                <Button 
                  variant="secondary" 
                  onClick={() => setShowConfirmation(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Procesando...' : 'Confirmar'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Cargar dinero</h1>
          <Button variant="secondary" onClick={() => router.push('/deposit')}>
            Volver
          </Button>
        </div>

        <div className={styles.cardPreview}>
          <div className={styles.cardType}>{getCardType(card.number_id.toString())}</div>
          <div className={styles.cardNumber}>{maskCardNumber(card.number_id)}</div>
          <div className={styles.cardName}>{card.first_last_name}</div>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              label="Monto a cargar"
              type="text"
              value={amount}
              onChange={handleAmountChange}
              error={error}
              placeholder="0"
              required
              autoFocus
            />
            
            {amount && !error && (
              <div className={styles.amountPreview}>
                {formatAmount(amount)}
              </div>
            )}

            <div className={styles.info}>
              <p>💡 Monto mínimo: $100</p>
              <p>💡 Monto máximo: $1.000.000</p>
            </div>

            <Button type="submit" fullWidth>
              Continuar
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
