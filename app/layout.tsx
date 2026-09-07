import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export async function generateMetadata(): Promise<Metadata> {
  const language = (await cookies()).get('macrolab-language')?.value;
  return language === 'it'
    ? {
        title: 'MacroLab — Simulatore economico',
        description:
          'Esplora gli effetti delle politiche su produzione, occupazione, prezzi, disuguaglianza e finanze pubbliche con un modello trasparente.',
      }
    : {
        title: 'MacroLab — Economy Simulator',
        description:
          'Explore how economic policies affect output, jobs, prices, inequality, and public finances in a transparent country simulator.',
      };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const language =
    (await cookies()).get('macrolab-language')?.value === 'it' ? 'it' : 'en';
  return (
    <html lang={language}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
