import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { APIResponse, WebsiteStructure } from '@/lib/types';
import { verifyToken } from '@/lib/utils/auth';
import { supabase } from '@/lib/db/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json<APIResponse<never>>(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Not authenticated',
          },
        },
        { status: 401 }
      );
    }

    const currentUser = verifyToken(token);
    if (!currentUser) {
      return NextResponse.json<APIResponse<never>>(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Invalid token',
          },
        },
        { status: 401 }
      );
    }

    // Fetch projects for the authenticated user
    const { data: projects, error } = await supabase
      .from('Project')
      .select('id, title, description, data, createdAt, updatedAt')
      .eq('userId', currentUser.userId)
      .order('updatedAt', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
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

    const response: APIResponse<Array<{
      id: string;
      title: string;
      description: string | null;
      data: WebsiteStructure;
      createdAt: string;
      updatedAt: string;
    }>> = {
      success: true,
      data: projects || [],
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Get projects error:', error);
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
