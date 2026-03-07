'use client';

import Form from '@/components/admin/ui/Form';
import FormRow from '@/components/admin/ui/FormRow';
import Input from '@/components/admin/ui/Input';
import Spinner from '@/components/admin/ui/Spinner';
import React from 'react';

import { useSettings } from './useSettings';
import { useUpdateSetting } from './useUpdateSetting';

function UpdateSettingsForm(): React.ReactElement | null {
  const {
    isPending,
    settings: {
      minBookingLength,
      maxBookingLength,
      maxNumberGuestsPerBooking,
      breakfastPrice
    } = {} as Record<string, undefined>
  } = useSettings();

  const { isUpdating, updateSetting } = useUpdateSetting();

  if (isPending) return <Spinner />;

  function handleUpdate(e: React.FocusEvent<HTMLInputElement>, field: string) {
    const { value } = e.target;
    if (!value) return;
    updateSetting({ [field]: value });
  }

  return (
    <Form>
      <FormRow label="Minimum nights/booking">
        <Input
          type="number"
          id="min-nights"
          disabled={isUpdating}
          defaultValue={minBookingLength}
          onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
            handleUpdate(e, 'minBookingLength')
          }
        />
      </FormRow>

      <FormRow label="Maximum nights/booking">
        <Input
          type="number"
          id="max-nights"
          disabled={isUpdating}
          defaultValue={maxBookingLength}
          onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
            handleUpdate(e, 'maxBookingLength')
          }
        />
      </FormRow>

      <FormRow label="Maximum guests/booking">
        <Input
          type="number"
          id="max-guests"
          disabled={isUpdating}
          defaultValue={maxNumberGuestsPerBooking}
          onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
            handleUpdate(e, 'maxNumberGuestsPerBooking')
          }
        />
      </FormRow>

      <FormRow label="Breakfast price">
        <Input
          type="number"
          id="breakfast-price"
          disabled={isUpdating}
          defaultValue={breakfastPrice}
          onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
            handleUpdate(e, 'breakfastPrice')
          }
        />
      </FormRow>
    </Form>
  );
}

export default UpdateSettingsForm;
