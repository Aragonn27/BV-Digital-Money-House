'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Card from '@/components/Card/Card';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import {
  isValidEmail,
  isValidPassword,
  isValidDNI,
  isValidPhone,
} from '@/utils/validations';
import styles from './page.module.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstname: '',
    lastname: '',
    dni: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstname) newErrors.firstname = 'El nombre es requerido';
    if (!formData.lastname) newErrors.lastname = 'El apellido es requerido';

    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (!isValidPassword(formData.password)) {
      newErrors.password =
        'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.dni) {
      newErrors.dni = 'El DNI es requerido';
    } else if (!isValidDNI(formData.dni)) {
      newErrors.dni = 'DNI inválido (debe tener 7-8 dígitos)';
    }

    if (!formData.phone) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = 'Teléfono inválido (debe tener 10 dígitos)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) return;

    setIsLoading(true);
    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstname: formData.firstname,
        lastname: formData.lastname,
        dni: parseInt(formData.dni),
        phone: formData.phone,
      });
      // Si el registro es exitoso, mostrar mensaje y redirigir
      alert('Cuenta creada exitosamente. Ahora puedes iniciar sesión.');
    } catch (error: any) {
      if (error.statusCode === 409) {
        setApiError('Este email ya está registrado. Por favor, inicia sesión o usa otro email.');
      } else {
        setApiError(error.message || 'Error al registrarse. Por favor, intenta nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className={styles.container}>
      <Card title="Crear Cuenta">
        {apiError && <div className={styles.error}>{apiError}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <Input
              label="Nombre"
              value={formData.firstname}
              onChange={(e) => handleChange('firstname', e.target.value)}
              error={errors.firstname}
              required
            />

            <Input
              label="Apellido"
              value={formData.lastname}
              onChange={(e) => handleChange('lastname', e.target.value)}
              error={errors.lastname}
              required
            />
          </div>

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
            required
          />

          <div className={styles.row}>
            <Input
              label="DNI"
              type="text"
              value={formData.dni}
              onChange={(e) => handleChange('dni', e.target.value)}
              error={errors.dni}
              placeholder="12345678"
              required
            />

            <Input
              label="Teléfono"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              error={errors.phone}
              placeholder="1123456789"
              required
            />
          </div>

          <Input
            label="Contraseña"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            error={errors.password}
            required
          />

          <Input
            label="Confirmar Contraseña"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            error={errors.confirmPassword}
            required
          />

          <Button type="submit" disabled={isLoading} fullWidth>
            {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </Button>
        </form>

        <p className={styles.link}>
          ¿Ya tienes cuenta? <Link href="/login">Inicia sesión aquí</Link>
        </p>
      </Card>
    </div>
  );
}
