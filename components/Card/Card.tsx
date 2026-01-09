import { ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: ReactNode;
  title?: string;
  className?: string;
  onClick?: () => void;
}

export default function Card({ children, title, className = '', onClick }: CardProps) {
  const handleClick = onClick ? { onClick, style: { cursor: 'pointer' } } : {};
  
  return (
    <div className={`${styles.card} ${className}`} {...handleClick}>
      {title && <h2 className={styles.title}>{title}</h2>}
      {children}
    </div>
  );
}
