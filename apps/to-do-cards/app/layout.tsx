import type { Metadata } from 'next';
import { Toaster } from 'sonner';

import './globals.css';

export const metadata: Metadata = {
  title: 'ToDoCards',
  description:
    'A to-do list web application with expandable cards, built with Next.js, MongoDB, and Tailwind CSS.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;200;300;400;500;700&family=Poppins:wght@400;600;700&family=Montserrat:wght@100;200;400;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
        />
      </head>
      <body className="antialiased">
        {children}
        <Toaster position="top-center" richColors />
        <div id="portal" />
      </body>
    </html>
  );
}
