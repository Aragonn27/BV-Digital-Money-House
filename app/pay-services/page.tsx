'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import Sidebar from '@/components/Sidebar';
import Card from '@/components/Card/Card';
import Input from '@/components/Input/Input';
import { serviceService } from '@/services/serviceService';
import { Service } from '@/types';
import styles from './page.module.css';

export default function PayServicesPage() {
  const { isAuthenticated } = useAuth();
  const { account } = useUser();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredServices(services);
    } else {
      const filtered = services.filter((service) =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredServices(filtered);
    }
  }, [searchTerm, services]);

  const loadServices = async () => {
    try {
      const data = await serviceService.getServices();
      setServices(data);
      setFilteredServices(data);
    } catch (error: any) {
      console.error('Error al cargar servicios:', error);
      
      // Si es 404, mostrar servicios de ejemplo
      if (error.statusCode === 404) {
        console.warn('API no disponible, usando datos de ejemplo');
        const mockServices: Service[] = [
          { id: 1, name: 'Netflix', date: '2024-01-01', invoice_value: 5999 },
          { id: 2, name: 'Spotify', date: '2024-01-01', invoice_value: 2999 },
          { id: 3, name: 'Disney+', date: '2024-01-01', invoice_value: 4999 },
          { id: 4, name: 'HBO Max', date: '2024-01-01', invoice_value: 5499 },
          { id: 5, name: 'Amazon Prime', date: '2024-01-01', invoice_value: 4299 },
          { id: 6, name: 'Edesur', date: '2024-01-01', invoice_value: 15000 },
          { id: 7, name: 'Metrogas', date: '2024-01-01', invoice_value: 8500 },
          { id: 8, name: 'Aysa', date: '2024-01-01', invoice_value: 3200 },
          { id: 9, name: 'Telecom', date: '2024-01-01', invoice_value: 12000 },
          { id: 10, name: 'Movistar', date: '2024-01-01', invoice_value: 9800 },
        ];
        setServices(mockServices);
        setFilteredServices(mockServices);
      } else {
        alert('Error al cargar los servicios. Por favor, inicia sesión nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectService = (serviceId: number) => {
    router.push(`/pay-services/${serviceId}`);
  };

  if (!account) {
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
        <h1 className={styles.title}>Pagar Servicios</h1>

        <div className={styles.searchSection}>
          <Input
            label="Buscar servicio"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre del servicio..."
          />
        </div>

        {isLoading ? (
          <p className={styles.loading}>Cargando servicios...</p>
        ) : filteredServices.length > 0 ? (
          <>
            <p className={styles.resultsCount}>
              {filteredServices.length} servicio{filteredServices.length !== 1 ? 's' : ''} encontrado{filteredServices.length !== 1 ? 's' : ''}
            </p>
            <div className={styles.servicesList}>
              {filteredServices.map((service) => (
                <Card
                  key={service.id}
                  className={styles.serviceCard}
                  onClick={() => handleSelectService(service.id)}
                >
                  <div className={styles.serviceInfo}>
                    <h3 className={styles.serviceName}>{service.name}</h3>
                    <p className={styles.serviceDate}>
                      Fecha: {new Date(service.date).toLocaleDateString('es-AR')}
                    </p>
                    {service.invoice_value > 0 && (
                      <p className={styles.serviceAmount}>
                        Monto factura: ${service.invoice_value.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                      </p>
                    )}
                  </div>
                  <div className={styles.serviceArrow}>→</div>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <p className={styles.noResults}>
            No se encontraron servicios{searchTerm ? ` para "${searchTerm}"` : ''}
          </p>
        )}
      </div>
    </div>
  );
}
