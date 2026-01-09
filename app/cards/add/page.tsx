'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import Card from '@/components/Card/Card';
import Sidebar from '@/components/Sidebar';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import { cardService } from '@/services/cardService';
import styles from './page.module.css';

export default function AddCardPage() {
  const { isAuthenticated } = useAuth();
  const { account } = useUser();
  const router = useRouter();
  const [formData, setFormData] = useState({
    number_id: '',
    cod: '',
    expiration_date: '',
    first_last_name: '',
  });
  const [cardType, setCardType] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (formData.number_id.length >= 4) {
      const type = detectCardType(formData.number_id);
      setCardType(type);
    } else {
      setCardType('');
    }
  }, [formData.number_id]);

  const detectCardType = (number: string): string => {
    const firstDigit = number.charAt(0);
    const firstTwoDigits = number.substring(0, 2);
    
    if (firstDigit === '4') return 'Visa';
    if (parseInt(firstTwoDigits) >= 51 && parseInt(firstTwoDigits) <= 55) return 'Mastercard';
    if (firstTwoDigits === '34' || firstTwoDigits === '37') return 'AMEX';
    return 'Desconocida';
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.number_id.length < 13 || formData.number_id.length > 19) {
      newErrors.number_id = 'Número de tarjeta inválido';
    }

    if (formData.cod.length !== 3 && formData.cod.length !== 4) {
      newErrors.cod = 'CVV debe tener 3 o 4 dígitos';
    }

    if (!formData.expiration_date.match(/^(0[1-9]|1[0-2])\/\d{4}$/)) {
      newErrors.expiration_date = 'Formato inválido (MM/YYYY)';
    }

    // Validar que el año empiece con 20
    const year = formData.expiration_date.split('/')[1];
    if (year && !year.startsWith('20')) {
      newErrors.expiration_date = 'El año debe empezar con 20XX';
    }

    if (formData.first_last_name.trim().length < 3) {
      newErrors.first_last_name = 'Nombre inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !account?.id) return;

    setIsSubmitting(true);
    try {
      await cardService.addCard(account.id, {
        number_id: parseInt(formData.number_id),
        cod: parseInt(formData.cod),
        expiration_date: formData.expiration_date,
        first_last_name: formData.first_last_name,
      });
      
      alert('Tarjeta agregada correctamente');
      router.push('/cards');
    } catch (error) {
      console.error('Error al agregar tarjeta:', error);
      alert('Error al agregar la tarjeta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 19) {
      setFormData({ ...formData, number_id: value });
    }
  };

  const handleCodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setFormData({ ...formData, cod: value });
    }
  };

  const handleExpirationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 6);
    }
    if (value.length <= 7) {
      setFormData({ ...formData, expiration_date: value });
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
        <div className={styles.header}>
          <h1 className={styles.title}>Alta de Tarjeta</h1>
          <Button variant="secondary" onClick={() => router.back()}>
            Volver
          </Button>
        </div>

        {cardType && (
          <div className={styles.cardTypeIndicator}>
            <p>Tipo de tarjeta detectado: <strong>{cardType}</strong></p>
          </div>
        )}

        <Card>
          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              label="Número de Tarjeta"
              type="text"
              value={formData.number_id}
              onChange={handleNumberChange}
              placeholder="1234567890123456"
              error={errors.number_id}
              required
            />

            <Input
              label="Nombre en la Tarjeta"
              type="text"
              value={formData.first_last_name}
              onChange={(e) =>
                setFormData({ ...formData, first_last_name: e.target.value.toUpperCase() })
              }
              placeholder="JUAN PEREZ"
              error={errors.first_last_name}
              required
            />

            <div className={styles.row}>
              <Input
                label="Fecha de Vencimiento (MM/YYYY)"
                type="text"
                value={formData.expiration_date}
                onChange={handleExpirationChange}
                placeholder="12/2025"
                error={errors.expiration_date}
                required
              />

              <Input
                label="CVV"
                type="text"
                value={formData.cod}
                onChange={handleCodChange}
                placeholder="123"
                error={errors.cod}
                required
              />
            </div>

            <div className={styles.actions}>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : 'Agregar Tarjeta'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
