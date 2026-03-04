import Footer from '@/components/Footer';
import LoginRegister from '@/components/LoginRegister';

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="flex flex-1 items-center justify-center py-10">
        <LoginRegister />
      </div>
      <Footer />
    </div>
  );
}
