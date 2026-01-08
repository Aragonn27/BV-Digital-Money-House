import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { UserProvider } from '@/context/UserContext';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Digital Money House - Billetera Virtual',
  description: 'Gestiona tu dinero de forma digital con Digital Money House',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <UserProvider>
            <div className="app-container">
              <Header />
              <main className="main-content">{children}</main>
              <Footer />
            </div>
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
