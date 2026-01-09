import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.text}>
          © 2022 Digital Money House
        </p>
      </div>
    </footer>
  );
}
