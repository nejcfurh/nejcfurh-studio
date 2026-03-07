'use client';

import { updateSetting as updateSettingApi } from '@/lib/services/apiSettings';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export function useUpdateSetting() {
  const queryClient = useQueryClient();

  const { mutate: updateSetting, isPending: isUpdating } = useMutation({
    mutationFn: updateSettingApi,
    onSuccess: () => {
      toast.success('Setting successfully edited!');
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
    onError: () => {
      toast.error('err.message');
    }
  });

  return { updateSetting, isUpdating };
}
