'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Card from '@/components/Card/Card';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import { isValidEmail } from '@/utils/validations';
import styles from './page.module.css';

export default function LoginPage() {
  const { login } = useAuth();
  const [step, setStep] = useState<1 | 2>(1); // Paso 1: email, Paso 2: contraseña
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = () => {
    if (!email) {
      setErrors({ email: 'El email es requerido' });
      return false;
    }
    if (!isValidEmail(email)) {
      setErrors({ email: 'Email inválido' });
      return false;
    }
    setErrors({});
    return true;
  };

  const validatePassword = () => {
    if (!password) {
      setErrors({ password: 'La contraseña es requerida' });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleEmailSubmit = (e: FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (validateEmail()) {
      setStep(2);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validatePassword()) return;

    setIsLoading(true);
    try {
      await login({ email, password });
    } catch (error: any) {
      if (error.statusCode === 401) {
        setApiError('Email o contraseña incorrectos');
      } else if (error.statusCode === 404) {
        setApiError('Usuario no encontrado. ¿Necesitas registrarte?');
      } else {
        setApiError(error.message || 'Error al iniciar sesión. Por favor, intenta nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card title={step === 1 ? "Iniciar Sesión" : "Ingresa tu contraseña"}>
        {apiError && <div className={styles.error}>{apiError}</div>}
        
        {step === 1 ? (
          // Paso 1: Ingresar email
          <form onSubmit={handleEmailSubmit} className={styles.form}>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              required
              autoFocus
            />

            <Button type="submit" fullWidth>
              Continuar
            </Button>

            <p className={styles.link}>
              ¿No tienes cuenta? <Link href="/register">Regístrate aquí</Link>
            </p>
          </form>
        ) : (
          // Paso 2: Ingresar contraseña
          <form onSubmit={handlePasswordSubmit} className={styles.form}>
            <p className={styles.emailDisplay}>
              <strong>Email:</strong> {email}
              <button
                type="button"
                onClick={() => setStep(1)}
                className={styles.changeEmail}
              >
                Cambiar
              </button>
            </p>

            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              required
              autoFocus
            />

            <Button type="submit" disabled={isLoading} fullWidth>
              {isLoading ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
