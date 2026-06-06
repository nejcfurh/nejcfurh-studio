import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buttons and Interactions | Design Lab',
  description: 'Buttons and interactions component.'
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
