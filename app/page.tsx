import Link from 'next/link';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              De ahora en adelante, hacés<br />más con tu dinero
            </h1>
            <p className={styles.heroSubtitle}>
              Tu nueva <span className={styles.highlight}>billetera virtual</span>
            </p>
          </div>
        </div>

        <div className={styles.features}>
          <div className={styles.feature}>
            <h2 className={styles.featureTitle}>Transferí dinero</h2>
            <p className={styles.featureDescription}>
              Desde Digital Money House vas a poder transferir dinero a otras cuentas, así como
              también recibir transferencias y nuclear tu capital en nuestra billetera virtual
            </p>
          </div>

          <div className={styles.feature}>
            <h2 className={styles.featureTitle}>Pago de servicios</h2>
            <p className={styles.featureDescription}>
              Pagá mensualmente los servicios en 3 simples clicks. Facil, rápido y conveniente.
              Olvidate de las facturas en papel
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
