import { generateObject, google } from '@repo/shared/ai-sdk';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export const maxDuration = 30;

const TaskSchema = z.object({
  taskTitle: z.string(),
  detailedInstructions: z.string(),
  estimatedTime: z.string()
});

const WeekSchema = z.object({
  week: z.string(),
  title: z.string(),
  tasks: z.array(TaskSchema),
  explanation: z.string()
});

const ResponseSchema = z.object({
  weeks: z.array(WeekSchema)
});

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const {
      locationCity,
      locationState,
      locationCountry,
      timeInAWeek,
      whatMattersMost
    } = await request.json();

    if (
      !locationCity ||
      !locationState ||
      !locationCountry ||
      !timeInAWeek ||
      !whatMattersMost
    ) {
      return NextResponse.json(
        {
          error: 'Location, time commitment, and selected plants are required'
        },
        { status: 400 }
      );
    }

    const { object } = await generateObject({
      model: google('gemini-2.5-flash-lite'),
      system:
        'You are a horticultural and conservation planning expert specializing in native pollinator gardens and ecosystem restoration. Provide detailed, region-specific, and actionable conservation plans.',
      prompt: `Based on the details provided, please generate a customized 6‑week conservation plan for a ${locationState} backyard supporting native pollinators. The plan should consider the following:

- Available time per week: ${timeInAWeek}
- Location: ${locationState}
- Native pollinator plants already present in the backyard: ${JSON.stringify(whatMattersMost)}

Create a detailed, motivating, and engaging plan with one or two interesting tasks per week that are achievable within ${timeInAWeek}. Start with immediate action in Week 1 (for example, planting a native pollinator plant) to inspire the user right away, and then progress with tasks that build on that success.

For each week, include:
1. A title for the week.
2. A list of one or two specific tasks. Each task should include a short taskTitle, detailed step-by-step instructions (use \\n for line breaks), and an estimatedTime in minutes.
3. A brief explanation of how the tasks contribute to native pollinator conservation.

Include tasks that go beyond planting: taking pictures, looking for invasive plants, making fertilizer, reading "Nature's Best Hope", enjoying your garden, re-planting local plants, and planning for bigger changes.

For Week 6, include a task about "Prepare for Next Steps" mentioning continued support.`,
      schema: ResponseSchema
    });

    return NextResponse.json(object);
  } catch (error) {
    console.error('Error generating conservation plan:', error);

    return NextResponse.json(
      { error: 'Failed to generate conservation plan' },
      { status: 500 }
    );
  }
}
