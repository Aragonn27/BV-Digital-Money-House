import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { UserProvider } from '@/context/UserContext';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

const openSans = Open_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-primary',
});

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
      <body className={openSans.className}>
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
