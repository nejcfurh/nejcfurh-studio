'use client';

import ButtonIcon from '@/components/admin/ui/ButtonIcon';
import SpinnerMini from '@/components/admin/ui/SpinnerMini';
import { HiArrowRightOnRectangle } from 'react-icons/hi2';

import { useLogout } from './useLogout';

function Logout(): React.ReactElement {
  const { logout, isPending } = useLogout();
  return (
    <ButtonIcon disabled={isPending} onClick={() => logout()}>
      {!isPending ? <HiArrowRightOnRectangle /> : <SpinnerMini />}
    </ButtonIcon>
  );
}

export default Logout;
