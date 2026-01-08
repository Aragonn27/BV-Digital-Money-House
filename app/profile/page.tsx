'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import Card from '@/components/Card/Card';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import { useState } from 'react';
import styles from './page.module.css';

export default function ProfilePage() {
  const { isAuthenticated } = useAuth();
  const { user, setUser } = useUser();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    // Aquí iría la lógica para actualizar el perfil
    setIsEditing(false);
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Mi Perfil</h1>

      <Card>
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>
            {user.firstname?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2>{`${user.firstname} ${user.lastname}`}</h2>
            <p className={styles.email}>{user.email}</p>
          </div>
        </div>

        <div className={styles.infoSection}>
          <h3>Información Personal</h3>
          
          {isEditing ? (
            <div className={styles.form}>
              <Input
                label="Nombre"
                value={formData.firstname}
                onChange={(e) =>
                  setFormData({ ...formData, firstname: e.target.value })
                }
              />
              <Input
                label="Apellido"
                value={formData.lastname}
                onChange={(e) =>
                  setFormData({ ...formData, lastname: e.target.value })
                }
              />
              <Input
                label="Teléfono"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
              <div className={styles.actions}>
                <Button onClick={handleSave}>Guardar</Button>
                <Button
                  variant="secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className={styles.info}>
              <div className={styles.infoRow}>
                <span className={styles.label}>DNI:</span>
                <span>{user.dni}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Teléfono:</span>
                <span>{user.phone}</span>
              </div>
              <Button onClick={() => setIsEditing(true)}>Editar Perfil</Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
