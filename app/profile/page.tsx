'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import Card from '@/components/Card/Card';
import Sidebar from '@/components/Sidebar';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import { userService } from '@/services/userService';
import styles from './page.module.css';

export default function ProfilePage() {
  const { isAuthenticated } = useAuth();
  const { user, account, refreshUserData } = useUser();
  const router = useRouter();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAlias, setIsEditingAlias] = useState(false);
  const [profileData, setProfileData] = useState({
    firstname: '',
    lastname: '',
    phone: '',
  });
  const [aliasData, setAliasData] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setProfileData({
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        phone: user.phone || '',
      });
    }
    if (account) {
      setAliasData(account.alias || '');
    }
  }, [user, account]);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      await userService.updateUserInfo(user.id, profileData);
      await refreshUserData();
      setIsEditingProfile(false);
      alert('Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      alert('Error al actualizar el perfil');
    }
  };

  const handleSaveAlias = async () => {
    if (!account) return;
    
    // Validar formato X.X.X
    const aliasParts = aliasData.split('.');
    if (aliasParts.length !== 3 || aliasParts.some(part => !part.trim())) {
      alert('El alias debe tener el formato X.X.X (3 palabras separadas por puntos)');
      return;
    }

    try {
      await userService.updateAccountAlias(account.id, aliasData);
      await refreshUserData();
      setIsEditingAlias(false);
      alert('Alias actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar alias:', error);
      alert('Error al actualizar el alias');
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(`${label} copiado al portapapeles`);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  if (!user || !account) {
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
        <h1 className={styles.title}>Mi Perfil</h1>

        <Card title="Datos Personales">
          {isEditingProfile ? (
            <div className={styles.form}>
              <Input
                label="Nombre"
                value={profileData.firstname}
                onChange={(e) =>
                  setProfileData({ ...profileData, firstname: e.target.value })
                }
              />
              <Input
                label="Apellido"
                value={profileData.lastname}
                onChange={(e) =>
                  setProfileData({ ...profileData, lastname: e.target.value })
                }
              />
              <Input
                label="Teléfono"
                value={profileData.phone}
                onChange={(e) =>
                  setProfileData({ ...profileData, phone: e.target.value })
                }
              />
              <div className={styles.actions}>
                <Button onClick={handleSaveProfile}>Guardar</Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsEditingProfile(false);
                    setProfileData({
                      firstname: user.firstname || '',
                      lastname: user.lastname || '',
                      phone: user.phone || '',
                    });
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className={styles.info}>
              <div className={styles.infoRow}>
                <span className={styles.label}>Nombre:</span>
                <span>{user.firstname}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Apellido:</span>
                <span>{user.lastname}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Email:</span>
                <span>{user.email}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>DNI:</span>
                <span>{user.dni}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Teléfono:</span>
                <span>{user.phone}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Contraseña:</span>
                <span>••••••••</span>
              </div>
              <Button onClick={() => setIsEditingProfile(true)}>
                Editar Datos
              </Button>
            </div>
          )}
        </Card>

        <Card title="Datos de Cuenta">
          <div className={styles.info}>
            <div className={styles.infoRow}>
              <div>
                <span className={styles.label}>CVU:</span>
                <span className={styles.cvu}>{account.cvu}</span>
              </div>
              <button
                className={styles.copyButton}
                onClick={() => copyToClipboard(account.cvu, 'CVU')}
              >
                📋 Copiar
              </button>
            </div>

            {isEditingAlias ? (
              <div className={styles.aliasEdit}>
                <Input
                  label="Alias (formato: palabra.palabra.palabra)"
                  value={aliasData}
                  onChange={(e) => setAliasData(e.target.value)}
                  placeholder="ejemplo.cuenta.dmh"
                />
                <div className={styles.actions}>
                  <Button onClick={handleSaveAlias}>Guardar Alias</Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setIsEditingAlias(false);
                      setAliasData(account.alias || '');
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className={styles.infoRow}>
                <div>
                  <span className={styles.label}>Alias:</span>
                  <span className={styles.alias}>{account.alias}</span>
                </div>
                <div className={styles.buttonGroup}>
                  <button
                    className={styles.copyButton}
                    onClick={() => copyToClipboard(account.alias, 'Alias')}
                  >
                    📋 Copiar
                  </button>
                  <Button onClick={() => setIsEditingAlias(true)}>
                    Editar Alias
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card title="Medios de Pago">
          <div className={styles.info}>
            <p className={styles.cardsInfo}>
              Administra tus tarjetas de crédito y débito
            </p>
            <Button onClick={() => router.push('/cards')}>
              Gestionar Medios de Pago
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
