import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.text}>
          © 2026 Digital Money House. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
