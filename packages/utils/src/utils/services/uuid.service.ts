import { v4 as uuidV4, v5 as uuidv5 } from 'uuid';

import { UUID_NAMESPACE } from '../constants';

export const generateUUID = (
  params: {
    input?: string;
  } = {}
): string => {
  const { input } = params;

  if (!input) {
    return uuidV4();
  }

  return uuidv5(input, UUID_NAMESPACE);
};
