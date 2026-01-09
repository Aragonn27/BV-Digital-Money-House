import Link from 'next/link';
import Button from '@/components/Button/Button';
import Card from '@/components/Card/Card';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>
              De ahora en adelante, hacés más con tu dinero
            </h1>
            <p className={styles.subtitle}>
              Tu nueva <span className={styles.highlight}>billetera virtual</span>
            </p>
          </div>
        </section>

        <section className={styles.features}>
          <Card className={styles.featureCard}>
            <h3 className={styles.featureTitle}>Transferí dinero</h3>
            <p className={styles.featureDescription}>
              Desde Digital Money House vas a poder transferir dinero a otras cuentas, así como
              también recibir transferencias y nuclear tu capital en nuestra billetera virtual
            </p>
          </Card>

          <Card className={styles.featureCard}>
            <h3 className={styles.featureTitle}>Pago de servicios</h3>
            <p className={styles.featureDescription}>
              Pagá mensualmente los servicios en 3 simples clicks. Facil, rápido y conveniente.
              Olvidate de las facturas en papel
            </p>
          </Card>
        </section>
      </main>
    </div>
  );
}
