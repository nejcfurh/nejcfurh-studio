import { LocationSchema } from '@features/how-to-help-flow/schemas';
import { generateObject, google } from '@repo/ai-sdk';
import { z } from '@repo/validation';
import { NextResponse } from 'next/server';

const PlantSchema = z.object({
  name: z.string(),
  scientificName: z.string(),
  pollinators_support: z.array(z.string())
});

export type Plant = z.infer<typeof PlantSchema>;

const MAX_OUTPUT_TOKENS = 2048;

const PlantsResponse = z.object({
  plants: z.array(PlantSchema)
});

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const parsed = LocationSchema.safeParse(
      await request.json().catch(() => null)
    );

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Location information is required' },
        { status: 400 }
      );
    }

    const { locationCity, locationState, locationCountry } = parsed.data;

    const { object } = await generateObject({
      model: google('gemini-2.5-flash-lite'),
      system:
        'You are a horticultural expert specializing in native pollinator plants. Provide accurate, region-specific recommendations.',
      prompt: `Based on the location ${locationCity}, ${locationState}, ${locationCountry}, provide a list of 10 native pollinator plants that would thrive in this area. For each plant, include:
1. Common name
2. Scientific name
3. A list of 2-4 specific pollinators it supports (from: bees, butterflies, hummingbirds, moths, beetles, wasps, flies)`,
      schema: PlantsResponse,
      maxOutputTokens: MAX_OUTPUT_TOKENS
    });

    return NextResponse.json(object);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch pollinator plants' },
      { status: 500 }
    );
  }
}
