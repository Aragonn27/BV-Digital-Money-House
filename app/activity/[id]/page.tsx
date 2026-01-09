'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import Card from '@/components/Card/Card';
import Sidebar from '@/components/Sidebar';
import Button from '@/components/Button/Button';
import { transactionService } from '@/services/transactionService';
import { Transaction } from '@/types';
import jsPDF from 'jspdf';
import styles from './page.module.css';

export default function TransactionDetailPage() {
  const { isAuthenticated } = useAuth();
  const { account } = useUser();
  const router = useRouter();
  const params = useParams();
  const transactionId = params.id as string;
  
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (account?.id && transactionId) {
      loadTransaction();
    }
  }, [account, transactionId]);

  const loadTransaction = async () => {
    if (!account?.id) return;
    
    try {
      const transactions = await transactionService.getTransactions(account.id, {});
      const found = transactions.find((t: Transaction) => t.id === parseInt(transactionId));
      
      if (found) {
        setTransaction(found);
      } else {
        router.push('/activity');
      }
    } catch (error: any) {
      console.error('Error al cargar transacción:', error);
      
      // Si el token expiró, redirigir al login
      if (error.statusCode === 401) {
        localStorage.clear();
        router.push('/login');
      } else {
        router.push('/activity');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadReceipt = () => {
    if (!transaction) return;
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPos = 20;

    // Colores
    const primaryColor = [193, 253, 53]; // #C1FD35
    const darkGray = [32, 31, 34]; // #201F22
    const lightGray = [102, 102, 102];
    const greenColor = [0, 166, 80];
    const orangeColor = [255, 107, 0];

    // Header con logo
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Digital Money House', pageWidth / 2, 18, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Tu billetera virtual', pageWidth / 2, 28, { align: 'center' });

    yPos = 55;

    // Título
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Comprobante de ' + getTransactionLabel(transaction.type), pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 15;

    // Estado
    doc.setTextColor(greenColor[0], greenColor[1], greenColor[2]);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(getTransactionStatus(transaction.type), pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 20;

    // Monto grande
    const isPositive = transaction.type === 'deposit';
    if (isPositive) {
      doc.setTextColor(greenColor[0], greenColor[1], greenColor[2]);
    } else {
      doc.setTextColor(orangeColor[0], orangeColor[1], orangeColor[2]);
    }
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    const amountText = (isPositive ? '+' : '-') + '$' + transaction.amount.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    doc.text(amountText, pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 25;

    // Línea separadora
    doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    
    yPos += 15;

    // Detalles
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    const addDetail = (label: string, value: string) => {
      doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.setFont('helvetica', 'normal');
      doc.text(label, margin, yPos);
      
      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      doc.setFont('helvetica', 'bold');
      doc.text(value, pageWidth - margin, yPos, { align: 'right' });
      
      yPos += 12;
    };

    addDetail('Número de operación:', '#' + transaction.id.toString().padStart(8, '0'));
    addDetail('Fecha y hora:', formatDate(transaction.dated));
    addDetail('Descripción:', transaction.description);
    
    if (transaction.origin) {
      addDetail('Origen:', transaction.origin);
    }
    
    if (transaction.destination) {
      addDetail('Destino:', transaction.destination);
    }

    yPos += 10;

    // Línea separadora
    doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    
    yPos += 15;

    // Footer
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const generatedDate = new Date().toLocaleDateString('es-AR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    doc.text('Documento generado el ' + generatedDate, pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 7;
    doc.text('Este comprobante es válido como constancia de la operación realizada', pageWidth / 2, yPos, { align: 'center' });

    // Guardar PDF
    doc.save(`comprobante-${transaction.id}.pdf`);
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
        return 'Ingreso de dinero';
      case 'payment':
        return 'Pago de servicio';
      case 'transfer':
        return 'Transferencia';
      default:
        return 'Operación';
    }
  };

  const getTransactionStatus = (type: string): string => {
    return 'Aprobada';
  };

  if (isLoading || !transaction) {
    return (
      <div className={styles.container}>
        <Sidebar />
        <div className={styles.content}>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  const isPositive = transaction.type.toLowerCase() === 'deposit';

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Detalle de transacción</h1>
          <Button variant="secondary" onClick={() => router.push('/activity')}>
            Volver
          </Button>
        </div>

        <div className={styles.statusBadge}>
          <span className={styles.statusIcon}>✓</span>
          <span className={styles.statusText}>{getTransactionStatus(transaction.type)}</span>
        </div>

        <Card>
          <div className={styles.details}>
            <div className={styles.iconSection}>
              <div className={styles.bigIcon}>{getTransactionIcon(transaction.type)}</div>
              <h2 className={styles.transactionType}>{getTransactionLabel(transaction.type)}</h2>
            </div>

            <div className={styles.amountSection}>
              <span className={styles.amountLabel}>Monto</span>
              <span className={isPositive ? styles.amountPositive : styles.amountNegative}>
                {isPositive ? '+' : '-'}$
                {transaction.amount.toLocaleString('es-AR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className={styles.infoGrid}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Número de operación</span>
                <span className={styles.infoValue}>#{transaction.id.toString().padStart(8, '0')}</span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Fecha y hora</span>
                <span className={styles.infoValue}>{formatDate(transaction.dated)}</span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Descripción</span>
                <span className={styles.infoValue}>{transaction.description}</span>
              </div>

              {transaction.origin && (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Origen</span>
                  <span className={styles.infoValue}>{transaction.origin}</span>
                </div>
              )}

              {transaction.destination && (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Destino</span>
                  <span className={styles.infoValue}>{transaction.destination}</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        <div className={styles.actions}>
          <Button onClick={handleDownloadReceipt} fullWidth>
            💾 Descargar comprobante
          </Button>
          <Button onClick={() => window.print()} variant="secondary" fullWidth>
            🖨️ Imprimir comprobante
          </Button>
        </div>
      </div>
    </div>
  );
}
