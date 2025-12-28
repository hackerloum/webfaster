import { NextRequest, NextResponse } from 'next/server';
import { APIResponse, WebsiteStructure } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    // In production, fetch from database
    const projects: WebsiteStructure[] = [];

    const response: APIResponse<WebsiteStructure[]> = {
      success: true,
      data: projects,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json<APIResponse<never>>(
      {
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: 'Failed to fetch projects',
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const website = body as WebsiteStructure;

    // In production, save to database
    const response: APIResponse<WebsiteStructure> = {
      success: true,
      data: website,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    return NextResponse.json<APIResponse<never>>(
      {
        success: false,
        error: {
          code: 'SAVE_FAILED',
          message: 'Failed to save project',
        },
      },
      { status: 500 }
    );
  }
}
