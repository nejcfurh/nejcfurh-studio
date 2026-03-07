'use client';

import UpdateSettingsForm from '@/components/admin/features/settings/UpdateSettingsForm';
import Heading from '@/components/admin/ui/Heading';
import Row from '@/components/admin/ui/Row';

function Settings(): React.ReactElement {
  return (
    <Row>
      <Heading as="h1">{'Settings'.toUpperCase()}</Heading>
      <UpdateSettingsForm />
    </Row>
  );
}

export default Settings;
