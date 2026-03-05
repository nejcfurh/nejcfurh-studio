import ContactButtons from '@/components/ContactButtons';
import TechStack from '@/components/TechStack';
import { aboutContact } from '@/lib/utils/constants';

export default function ContactPage() {
  return (
    <div className="contact-me-box">
      <p className="contact-me">{aboutContact}</p>
      <TechStack />
      <ContactButtons />
    </div>
  );
}
