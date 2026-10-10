import { z } from '@repo/validation';

const locationField = z.string().trim().min(1).max(100);

export const LocationSchema = z.object({
  locationCity: locationField,
  locationState: locationField,
  locationCountry: locationField
});

export const PlanRequestSchema = LocationSchema.extend({
  timeInAWeek: z.string().trim().min(1).max(50),
  // The pollinator-plants route returns 10 plants to pick from.
  whatMattersMost: z.array(z.string().trim().min(1).max(100)).min(1).max(10)
});
