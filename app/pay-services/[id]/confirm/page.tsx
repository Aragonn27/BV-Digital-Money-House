'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import Sidebar from '@/components/Sidebar';
import Card from '@/components/Card/Card';
import Button from '@/components/Button/Button';
import { serviceService } from '@/services/serviceService';
import { Service } from '@/types';
import styles from './page.module.css';

export default function PayServiceConfirmPage() {
  const { isAuthenticated } = useAuth();
  const { account, refreshUserData } = useUser();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const serviceId = Number(params.id);
  const accountNumber = searchParams.get('account') || '';
  const paymentMethod = searchParams.get('method') || '';

  const [service, setService] = useState<Service | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!accountNumber || paymentMethod !== 'account') {
      router.push(`/pay-services/${serviceId}`);
      return;
    }
    loadService();
  }, [serviceId, accountNumber, paymentMethod]);

  const loadService = async () => {
    try {
      const data = await serviceService.getServiceById(serviceId);
      setService(data);
    } catch (error) {
      console.error('Error al cargar servicio:', error);
      alert('Error al cargar el servicio');
      router.push('/pay-services');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!service || !account) return;

    // Verificar fondos suficientes
    if (account.available_amount < service.invoice_value) {
      alert(`Fondos insuficientes. Saldo disponible: $${account.available_amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`);
      return;
    }

    setIsProcessing(true);

    try {
      const paymentData = {
        amount: service.invoice_value,
        dated: new Date().toISOString(),
        destination: service.name,
        origin: 'Dinero en cuenta',
      };

      await serviceService.payService(account.id, paymentData);

      // Actualizar datos del usuario
      await refreshUserData();

      // Redirigir a página de éxito
      router.push(`/pay-services/${serviceId}/success?account=${accountNumber}&amount=${service.invoice_value}`);
    } catch (error: any) {
      console.error('Error al procesar pago:', error);
      
      // Manejar error 401 (token expirado)
      if (error?.message?.includes('401')) {
        return; // El apiClient ya redirigió al login
      }
      
      alert('Error al procesar el pago. Por favor intenta nuevamente.');
    } finally {
      setIsProcessing(false);
    }
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

  const hasSufficientFunds = account.available_amount >= service.invoice_value;

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <Button variant="secondary" onClick={() => router.back()} className={styles.backButton}>
          ← Volver
        </Button>

        <h1 className={styles.title}>Confirmar Pago</h1>

        <Card className={styles.confirmCard}>
          <h3 className={styles.subtitle}>Resumen del Pago</h3>

          <div className={styles.detailsSection}>
            <div className={styles.detailRow}>
              <span className={styles.label}>Servicio:</span>
              <span className={styles.value}>{service.name}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Número de Cuenta:</span>
              <span className={styles.value}>{accountNumber}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Medio de Pago:</span>
              <span className={styles.value}>Dinero en cuenta</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Fecha:</span>
              <span className={styles.value}>
                {new Date().toLocaleDateString('es-AR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Hora:</span>
              <span className={styles.value}>
                {new Date().toLocaleTimeString('es-AR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>

          <div className={styles.amountSection}>
            <div className={styles.amountRow}>
              <span className={styles.amountLabel}>Monto a pagar:</span>
              <span className={styles.amountValue}>
                ${service.invoice_value.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className={styles.balanceRow}>
              <span className={styles.balanceLabel}>Saldo disponible:</span>
              <span className={hasSufficientFunds ? styles.balanceValueOk : styles.balanceValueError}>
                ${account.available_amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            {hasSufficientFunds && (
              <div className={styles.balanceRow}>
                <span className={styles.balanceLabel}>Saldo restante:</span>
                <span className={styles.balanceValueOk}>
                  ${(account.available_amount - service.invoice_value).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}
          </div>

          {!hasSufficientFunds && (
            <div className={styles.errorBox}>
              <p className={styles.errorText}>
                ⚠️ Fondos insuficientes para realizar este pago.
              </p>
              <p className={styles.errorSubtext}>
                Necesitas ${(service.invoice_value - account.available_amount).toLocaleString('es-AR', { minimumFractionDigits: 2 })} adicionales.
              </p>
            </div>
          )}
        </Card>

        <div className={styles.actions}>
          <Button
            onClick={handleConfirm}
            disabled={isProcessing || !hasSufficientFunds}
          >
            {isProcessing ? 'Procesando...' : 'Confirmar Pago'}
          </Button>
          <Button variant="secondary" onClick={() => router.back()} disabled={isProcessing}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}
