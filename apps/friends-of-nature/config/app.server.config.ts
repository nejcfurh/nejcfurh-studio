import { z } from 'zod';

const AppServerConfigValidation = z.object({
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1)
});

export const appServerConfig = AppServerConfigValidation.parse(process.env);
