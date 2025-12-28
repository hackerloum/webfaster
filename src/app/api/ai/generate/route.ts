import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/lib/services/ai-service';
import { APIResponse, AIGenerationResponse } from '@/lib/types/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, options } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json<APIResponse<never>>(
        {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'Prompt is required and must be a string',
          },
        },
        { status: 400 }
      );
    }

    const aiService = new AIService();
    const startTime = Date.now();
    const website = await aiService.generateWebsite(prompt, options);
    const generationTime = Date.now() - startTime;

    const response: APIResponse<AIGenerationResponse> = {
      success: true,
      data: {
        website,
        tokensUsed: 0, // Would be calculated from OpenAI response
        generationTime,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json<APIResponse<never>>(
      {
        success: false,
        error: {
          code: 'GENERATION_FAILED',
          message: error instanceof Error ? error.message : 'Failed to generate website',
        },
      },
      { status: 500 }
    );
  }
}
