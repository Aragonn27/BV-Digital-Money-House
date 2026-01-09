'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import Sidebar from '@/components/Sidebar';
import Card from '@/components/Card/Card';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import { serviceService } from '@/services/serviceService';
import { Service } from '@/types';
import styles from './page.module.css';

export default function PayServiceAccountPage() {
  const { isAuthenticated } = useAuth();
  const { account } = useUser();
  const router = useRouter();
  const params = useParams();
  const serviceId = Number(params.id);

  const [service, setService] = useState<Service | null>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    loadService();
  }, [serviceId]);

  const loadService = async () => {
    try {
      const data = await serviceService.getServiceById(serviceId);
      setService(data);
    } catch (error: any) {
      console.error('Error al cargar servicio:', error);
      
      // Si es 404, usar datos de ejemplo según el ID
      if (error.statusCode === 404) {
        console.warn('API no disponible, usando datos de ejemplo para servicio', serviceId);
        const mockServices: Service[] = [
          { id: 1, name: 'Netflix', date: '2024-01-01', invoice_value: 5999 },
          { id: 2, name: 'Spotify', date: '2024-01-01', invoice_value: 2999 },
          { id: 3, name: 'Disney+', date: '2024-01-01', invoice_value: 4999 },
          { id: 4, name: 'HBO Max', date: '2024-01-01', invoice_value: 5499 },
          { id: 5, name: 'Amazon Prime', date: '2024-01-01', invoice_value: 4299 },
          { id: 6, name: 'Edesur', date: '2024-01-01', invoice_value: 15000 },
          { id: 7, name: 'Metrogas', date: '2024-01-01', invoice_value: 8500 },
          { id: 8, name: 'Aysa', date: '2024-01-01', invoice_value: 3200 },
          { id: 9, name: 'Telecom', date: '2024-01-01', invoice_value: 12000 },
          { id: 10, name: 'Movistar', date: '2024-01-01', invoice_value: 9800 },
        ];
        const mockService = mockServices.find(s => s.id === serviceId);
        if (mockService) {
          setService(mockService);
        } else {
          alert('Servicio no encontrado');
          router.push('/pay-services');
        }
      } else {
        alert('Error al cargar el servicio. Por favor, inicia sesión nuevamente.');
        router.push('/pay-services');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    setError('');

    if (!accountNumber.trim()) {
      setError('El número de cuenta es requerido');
      return;
    }

    // Validación simple: al menos 8 caracteres
    if (accountNumber.length < 8) {
      setError('Número de cuenta inválido. Debe tener al menos 8 caracteres.');
      return;
    }

    // Simulación: números que terminan en 00 no tienen facturas pendientes
    if (accountNumber.endsWith('00')) {
      setError('No hay facturas pendientes de pago para este número de cuenta.');
      return;
    }

    // Si pasa las validaciones, continuar al pago
    router.push(`/pay-services/${serviceId}/payment?account=${accountNumber}`);
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

        <h1 className={styles.title}>Pagar {service.name}</h1>

        <Card>
          <div className={styles.serviceDetails}>
            <h3 className={styles.subtitle}>Información del Servicio</h3>
            <div className={styles.detailRow}>
              <span className={styles.label}>Servicio:</span>
              <span className={styles.value}>{service.name}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Fecha:</span>
              <span className={styles.value}>
                {new Date(service.date).toLocaleDateString('es-AR')}
              </span>
            </div>
            {service.invoice_value > 0 && (
              <div className={styles.detailRow}>
                <span className={styles.label}>Monto factura:</span>
                <span className={styles.valueAmount}>
                  ${service.invoice_value.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}
          </div>

          <div className={styles.formSection}>
            <h3 className={styles.subtitle}>Número de Cuenta</h3>
            <p className={styles.description}>
              Ingresa el número de cuenta asociado a este servicio para continuar con el pago.
            </p>
            <Input
              label="Número de Cuenta"
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Ej: 12345678"
              error={error}
              required
            />
            <div className={styles.actions}>
              <Button onClick={handleContinue}>
                Continuar
              </Button>
            </div>
          </div>
        </Card>

        <div className={styles.infoBox}>
          <p className={styles.infoText}>
            💡 <strong>Nota:</strong> Para probar la funcionalidad:
          </p>
          <ul className={styles.infoList}>
            <li>Números de cuenta válidos: cualquier número con 8 o más dígitos</li>
            <li>Números sin facturas pendientes: aquellos que terminan en "00"</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
