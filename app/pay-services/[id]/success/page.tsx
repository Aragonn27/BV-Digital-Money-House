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
import jsPDF from 'jspdf';
import styles from './page.module.css';

export default function PayServiceSuccessPage() {
  const { isAuthenticated } = useAuth();
  const { account } = useUser();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const serviceId = Number(params.id);
  const accountNumber = searchParams.get('account') || '';
  const amount = parseFloat(searchParams.get('amount') || '0');

  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [transactionDate] = useState(new Date());

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!accountNumber || !amount) {
      router.push('/pay-services');
      return;
    }
    loadService();
  }, [serviceId, accountNumber, amount]);

  const loadService = async () => {
    try {
      const data = await serviceService.getServiceById(serviceId);
      setService(data);
    } catch (error) {
      console.error('Error al cargar servicio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadReceipt = () => {
    if (!service || !account) return;

    const doc = new jsPDF();

    // Header
    doc.setFillColor(193, 253, 53);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(32, 31, 34);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Digital Money House', 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Comprobante de Pago de Servicio', 105, 30, { align: 'center' });

    // Estado
    doc.setTextColor(76, 175, 80);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('APROBADA', 105, 55, { align: 'center' });

    // Monto
    doc.setTextColor(193, 253, 53);
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.text(
      `$${amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`,
      105,
      75,
      { align: 'center' }
    );

    // Detalles
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    let y = 95;
    const lineHeight = 10;

    const details = [
      { label: 'Servicio', value: service.name },
      { label: 'Numero de Cuenta', value: accountNumber },
      { label: 'Medio de Pago', value: 'Dinero en cuenta' },
      { label: 'Fecha', value: transactionDate.toLocaleDateString('es-AR') },
      { label: 'Hora', value: transactionDate.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) },
      { label: 'Usuario', value: `${account.user_id}` },
      { label: 'CVU', value: account.cvu },
    ];

    details.forEach((detail) => {
      doc.setFont('helvetica', 'bold');
      doc.text(detail.label + ':', 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text(detail.value, 80, y);
      y += lineHeight;
    });

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Generado el ${new Date().toLocaleDateString('es-AR')} a las ${new Date().toLocaleTimeString('es-AR')}`,
      105,
      280,
      { align: 'center' }
    );

    doc.save(`comprobante-pago-${serviceId}-${Date.now()}.pdf`);
  };

  const handlePrint = () => {
    window.print();
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
        <div className={styles.successIcon}>✓</div>
        <h1 className={styles.title}>¡Pago Exitoso!</h1>
        <p className={styles.subtitle}>Tu pago se ha procesado correctamente</p>

        <Card className={styles.receiptCard}>
          <div className={styles.statusBadge}>APROBADA</div>

          <div className={styles.amountSection}>
            <p className={styles.amountLabel}>Monto Pagado</p>
            <p className={styles.amountValue}>
              ${amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className={styles.detailsSection}>
            <h3 className={styles.sectionTitle}>Detalles de la Transacción</h3>
            
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
                {transactionDate.toLocaleDateString('es-AR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Hora:</span>
              <span className={styles.value}>
                {transactionDate.toLocaleTimeString('es-AR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Nuevo Saldo:</span>
              <span className={styles.valueHighlight}>
                ${account.available_amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className={styles.actionsSection}>
            <Button onClick={handleDownloadReceipt}>
              Descargar Comprobante
            </Button>
            <Button variant="secondary" onClick={handlePrint}>
              Imprimir
            </Button>
          </div>
        </Card>

        <div className={styles.navigationButtons}>
          <Button onClick={() => router.push('/dashboard')}>
            Ir al Inicio
          </Button>
          <Button variant="secondary" onClick={() => router.push('/pay-services')}>
            Nuevo Pago
          </Button>
        </div>
      </div>
    </div>
  );
}
