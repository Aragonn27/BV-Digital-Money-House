'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import Sidebar from '@/components/Sidebar';
import Card from '@/components/Card/Card';
import Button from '@/components/Button/Button';
import { serviceService } from '@/services/serviceService';
import { cardService } from '@/services/cardService';
import { Service, Card as CardType } from '@/types';
import styles from './page.module.css';

type PaymentMethod = {
  type: 'card' | 'account';
  id?: number;
  label: string;
  details?: string;
};

export default function PayServicePaymentPage() {
  const { isAuthenticated } = useAuth();
  const { account } = useUser();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const serviceId = Number(params.id);
  const accountNumber = searchParams.get('account') || '';

  const [service, setService] = useState<Service | null>(null);
  const [cards, setCards] = useState<CardType[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!accountNumber) {
      router.push(`/pay-services/${serviceId}`);
      return;
    }
    loadData();
  }, [serviceId, accountNumber]);

  const loadData = async () => {
    try {
      const [serviceData, cardsData] = await Promise.all([
        serviceService.getServiceById(serviceId),
        account?.id ? cardService.getCards(account.id) : Promise.resolve([]),
      ]);

      setService(serviceData);
      setCards(cardsData);

      // Construir métodos de pago
      const methods: PaymentMethod[] = [];

      // Agregar opción de dinero en cuenta
      if (account) {
        methods.push({
          type: 'account',
          label: 'Dinero en cuenta',
          details: `Disponible: $${account.available_amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`,
        });
      }

      // Agregar tarjetas
      cardsData.forEach((card) => {
        const cardType = getCardType(card.number_id.toString());
        methods.push({
          type: 'card',
          id: card.id,
          label: `${cardType} •••• ${card.number_id.toString().slice(-4)}`,
          details: card.first_last_name,
        });
      });

      setPaymentMethods(methods);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  const getCardType = (number: string): string => {
    const firstDigit = number.charAt(0);
    const firstTwoDigits = number.substring(0, 2);

    if (firstDigit === '4') return 'Visa';
    if (parseInt(firstTwoDigits) >= 51 && parseInt(firstTwoDigits) <= 55) return 'Mastercard';
    if (firstTwoDigits === '34' || firstTwoDigits === '37') return 'AMEX';
    return 'Tarjeta';
  };

  const handleSelectMethod = (method: PaymentMethod) => {
    setSelectedMethod(method);
  };

  const handleContinue = () => {
    if (!selectedMethod) {
      alert('Por favor selecciona un medio de pago');
      return;
    }

    // Solo permitimos pagar con dinero en cuenta según requerimientos
    if (selectedMethod.type !== 'account') {
      alert('Por el momento solo se pueden procesar pagos con dinero en cuenta.');
      return;
    }

    router.push(
      `/pay-services/${serviceId}/confirm?account=${accountNumber}&method=${selectedMethod.type}`
    );
  };

  const handleAddCard = () => {
    router.push('/cards/add');
  };

  if (isLoading || !service || !account) {
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
        <Button variant="secondary" onClick={() => router.back()} className={styles.backButton}>
          ← Volver
        </Button>

        <h1 className={styles.title}>Seleccionar Medio de Pago</h1>

        <Card className={styles.serviceCard}>
          <h3 className={styles.subtitle}>Servicio a Pagar</h3>
          <div className={styles.serviceInfo}>
            <p className={styles.serviceName}>{service.name}</p>
            <p className={styles.accountNumber}>Cuenta: {accountNumber}</p>
            {service.invoice_value > 0 && (
              <p className={styles.amount}>
                ${service.invoice_value.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </p>
            )}
          </div>
        </Card>

        <div className={styles.methodsSection}>
          <div className={styles.methodsHeader}>
            <h3 className={styles.subtitle}>Medios de Pago Disponibles</h3>
            <Button variant="secondary" onClick={handleAddCard}>
              + Agregar Tarjeta
            </Button>
          </div>

          {paymentMethods.length > 0 ? (
            <div className={styles.methodsList}>
              {paymentMethods.map((method, index) => (
                <Card
                  key={index}
                  className={`${styles.methodCard} ${
                    selectedMethod === method ? styles.methodCardSelected : ''
                  }`}
                  onClick={() => handleSelectMethod(method)}
                >
                  <div className={styles.methodInfo}>
                    <div className={styles.methodIcon}>
                      {method.type === 'account' ? '💰' : '💳'}
                    </div>
                    <div className={styles.methodDetails}>
                      <p className={styles.methodLabel}>{method.label}</p>
                      {method.details && (
                        <p className={styles.methodSubtext}>{method.details}</p>
                      )}
                    </div>
                  </div>
                  <div className={styles.methodCheckbox}>
                    {selectedMethod === method && <span className={styles.checkmark}>✓</span>}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className={styles.noMethods}>
              No tienes medios de pago disponibles. Agrega una tarjeta para continuar.
            </p>
          )}
        </div>

        <div className={styles.actions}>
          <Button onClick={handleContinue} disabled={!selectedMethod}>
            Continuar
          </Button>
        </div>

        {selectedMethod?.type === 'card' && (
          <div className={styles.warningBox}>
            <p>⚠️ Por el momento solo se pueden procesar pagos con dinero en cuenta.</p>
          </div>
        )}
      </div>
    </div>
  );
}
