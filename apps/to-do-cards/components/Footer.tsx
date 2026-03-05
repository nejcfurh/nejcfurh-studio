import { footerCopyright } from '@/lib/utils/constants';

export default function Footer() {
  return (
    <footer className="py-6 text-center">
      <p className="link-footer text-sm">{footerCopyright}</p>
    </footer>
  );
}
