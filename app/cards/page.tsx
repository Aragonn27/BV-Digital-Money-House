'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import Card from '@/components/Card/Card';
import Sidebar from '@/components/Sidebar';
import Button from '@/components/Button/Button';
import { cardService } from '@/services/cardService';
import { Card as CardType } from '@/types';
import styles from './page.module.css';

const MAX_CARDS = 10;

export default function CardsPage() {
  const { isAuthenticated } = useAuth();
  const { account } = useUser();
  const router = useRouter();
  const [cards, setCards] = useState<CardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (account?.id) {
      loadCards();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  const loadCards = async () => {
    if (!account?.id) return;
    
    try {
      const data = await cardService.getCards(account.id);
      setCards(data);
    } catch (error) {
      console.error('Error al cargar tarjetas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCard = () => {
    if (cards.length >= MAX_CARDS) {
      alert(`Has alcanzado el límite máximo de ${MAX_CARDS} tarjetas`);
      return;
    }
    router.push('/cards/add');
  };

  const handleDeleteCard = async (cardId: number) => {
    if (!account?.id) return;
    
    if (!confirm('¿Estás seguro de que deseas eliminar esta tarjeta?')) {
      return;
    }

    try {
      await cardService.deleteCard(account.id, cardId);
      await loadCards();
      alert('Tarjeta eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar tarjeta:', error);
      alert('Error al eliminar la tarjeta');
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
        <div className={styles.header}>
          <h1 className={styles.title}>Gestión de Medios de Pago</h1>
          <Button onClick={handleAddCard}>
            + Alta de Tarjeta
          </Button>
        </div>

        {isLoading ? (
          <p className={styles.loading}>Cargando tarjetas...</p>
        ) : cards.length > 0 ? (
          <>
            <p className={styles.subtitle}>
              Tarjetas asociadas: {cards.length} / {MAX_CARDS}
            </p>
            <div className={styles.cardsList}>
              {cards.map((card) => (
                <Card key={card.id} className={styles.cardItem}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardType}>
                      {getCardType(card.number_id.toString())}
                    </div>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteCard(card.id)}
                      title="Eliminar tarjeta"
                    >
                      🗑️
                    </button>
                  </div>
                  <div className={styles.cardNumber}>
                    {maskCardNumber(card.number_id)}
                  </div>
                  <div className={styles.cardInfo}>
                    <p>{card.first_last_name}</p>
                    <p>Vence: {card.expiration_date}</p>
                  </div>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <Card>
            <p className={styles.emptyState}>
              No tienes tarjetas asociadas
            </p>
            <Button onClick={handleAddCard}>
              Agregar Primera Tarjeta
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
