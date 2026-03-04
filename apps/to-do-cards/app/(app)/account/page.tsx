import AccountInformation from '@/components/AccountInformation';
import { getAccountInfo } from '@/lib/actions/account';

export default async function AccountPage() {
  const user = await getAccountInfo();

  return <AccountInformation user={user} />;
}
