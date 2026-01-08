import Link from 'next/link';
import Button from '@/components/Button/Button';
import Card from '@/components/Card/Card';
import styles from './page.module.css';

export default function Home() {
  return (
    <div>
      <section className={styles.hero}>
        <h1 className={styles.title}>Bienvenido a Digital Money House</h1>
        <p className={styles.subtitle}>
          Tu billetera virtual para gestionar tu dinero de forma simple y segura
        </p>
        <div className={styles.ctaButtons}>
          <Link href="/register">
            <Button variant="primary">Crear Cuenta</Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary">Iniciar Sesión</Button>
          </Link>
        </div>
      </section>

      <section className={styles.features}>
        <Card>
          <div className={styles.featureIcon}>💳</div>
          <h3 className={styles.featureTitle}>Tarjetas</h3>
          <p className={styles.featureDescription}>
            Asocia tus tarjetas de crédito y débito para gestionar tus pagos
          </p>
        </Card>

        <Card>
          <div className={styles.featureIcon}>💰</div>
          <h3 className={styles.featureTitle}>Cargar Saldo</h3>
          <p className={styles.featureDescription}>
            Recarga tu billetera fácilmente desde tus medios de pago
          </p>
        </Card>

        <Card>
          <div className={styles.featureIcon}>📊</div>
          <h3 className={styles.featureTitle}>Actividad</h3>
          <p className={styles.featureDescription}>
            Consulta todos tus movimientos y mantén el control de tus finanzas
          </p>
        </Card>

        <Card>
          <div className={styles.featureIcon}>🔒</div>
          <h3 className={styles.featureTitle}>Seguridad</h3>
          <p className={styles.featureDescription}>
            Tu información protegida con los más altos estándares de seguridad
          </p>
        </Card>

        <Card>
          <div className={styles.featureIcon}>🧾</div>
          <h3 className={styles.featureTitle}>Paga Servicios</h3>
          <p className={styles.featureDescription}>
            Paga tus servicios directamente desde tu billetera virtual
          </p>
        </Card>

        <Card>
          <div className={styles.featureIcon}>📱</div>
          <h3 className={styles.featureTitle}>CVU Único</h3>
          <p className={styles.featureDescription}>
            Tu Cuenta Virtual Uniforme para todas tus transacciones
          </p>
        </Card>
      </section>

      <section className={styles.info}>
        <h2 className={styles.infoTitle}>¿Qué es Digital Money House?</h2>
        <p className={styles.infoText}>
          Digital Money House es una billetera virtual que te permite gestionar tu dinero
          de forma digital. Podrás cargar saldo, pagar servicios, asociar tarjetas y
          realizar un seguimiento completo de todas tus transacciones. Todo desde una
          plataforma segura y fácil de usar.
        </p>
      </section>
    </div>
  );
}
