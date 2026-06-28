import { auth } from '@/auth';
import NavbarClient from '@/components/NavbarClient';
import { logoutAction } from '@/lib/actions/auth';

export default async function Navbar() {
  const session = await auth();

  return <NavbarClient isAuthed={!!session} logoutAction={logoutAction} />;
}
