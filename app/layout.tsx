import type { Metadata } from 'next';
import './globals.css';
import { ModeProvider } from '@/lib/mode-context';

export const metadata: Metadata = {
  title: 'ClimaTwin India — AI-Powered Digital Twin of India\'s Climate',
  description: 'An AI-powered digital twin of India\'s climate system, integrating ISRO INSAT satellite data, IMD ground networks, and advanced AI models for real-time climate monitoring, forecasting, and what-if scenario simulation.',
  keywords: 'climate, digital twin, India, ISRO, INSAT, IMD, weather, forecast, monsoon, rainfall, temperature',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ModeProvider>
          {children}
        </ModeProvider>
      </body>
    </html>
  );
}
