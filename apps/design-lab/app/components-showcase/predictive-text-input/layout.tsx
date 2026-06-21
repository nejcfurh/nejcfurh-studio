import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Predictive Text Input | Design Lab',
  description: 'Predictive text input component.'
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
