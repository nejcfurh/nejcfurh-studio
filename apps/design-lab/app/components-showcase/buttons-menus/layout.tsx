import { Metadata } from 'next';

import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'Buttons and Interactions',
  description: 'Buttons and interactions component'
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
