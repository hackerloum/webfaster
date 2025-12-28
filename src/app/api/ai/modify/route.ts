import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/lib/services/ai-service';
import { APIResponse, AISectionModificationResponse } from '@/lib/types/api';
import { Section } from '@/lib/types/website';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { section, instruction } = body;

    if (!section || !instruction) {
      return NextResponse.json<APIResponse<never>>(
        {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'Section and instruction are required',
          },
        },
        { status: 400 }
      );
    }

    const aiService = new AIService();
    const modifiedSection = await aiService.modifySection(section as Section, instruction);

    const response: APIResponse<AISectionModificationResponse> = {
      success: true,
      data: {
        section: modifiedSection,
        explanation: 'Section modified successfully',
        tokensUsed: 0,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Modification error:', error);
    return NextResponse.json<APIResponse<never>>(
      {
        success: false,
        error: {
          code: 'MODIFICATION_FAILED',
          message: error instanceof Error ? error.message : 'Failed to modify section',
        },
      },
      { status: 500 }
    );
  }
}
