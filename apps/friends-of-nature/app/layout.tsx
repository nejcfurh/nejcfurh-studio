import type { Metadata } from 'next';
import localFont from 'next/font/local';


import './globals.css';

const PPMoriRegular = localFont({
  src: '../public/fonts/PPMori-Regular.otf'
});

export const metadata: Metadata = {
  title: 'Friends of Nature',
  description: 'by Wonder'
};

const RootLayout = ({
  children
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactNode => {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/piz6hxo.css" />
      </head>
        <body className={`antialiased bg-white ${PPMoriRegular.className}`}>
          {children}
        </body>
    </html>
  );
};

export default RootLayout;
