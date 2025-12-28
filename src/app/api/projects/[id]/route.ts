import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { APIResponse, WebsiteStructure } from '@/lib/types';
import { verifyToken } from '@/lib/utils/auth';
import { supabase } from '@/lib/db/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

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

    // Fetch project from database
    const { data: project, error } = await supabase
      .from('Project')
      .select('id, title, description, data, createdAt, updatedAt, userId')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching project:', error);
      return NextResponse.json<APIResponse<never>>(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Project not found',
          },
        },
        { status: 404 }
      );
    }

    if (!project) {
      return NextResponse.json<APIResponse<never>>(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Project not found',
          },
        },
        { status: 404 }
      );
    }

    // Verify user owns the project
    if (project.userId !== currentUser.userId) {
      return NextResponse.json<APIResponse<never>>(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You do not have access to this project',
          },
        },
        { status: 403 }
      );
    }

    // Return the website data (stored in the data field)
    // The data field contains the full WebsiteStructure
    const websiteData = project.data as WebsiteStructure;
    
    // Ensure the website data has the correct ID
    if (websiteData && !websiteData.id) {
      websiteData.id = project.id;
    }

    const response: APIResponse<WebsiteStructure> = {
      success: true,
      data: websiteData,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Get project error:', error);
    return NextResponse.json<APIResponse<never>>(
      {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Project not found',
        },
      },
      { status: 404 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

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

    const body = await request.json();
    const website = body as WebsiteStructure;

    // Verify user owns the project
    const { data: existingProject, error: fetchError } = await supabase
      .from('Project')
      .select('userId')
      .eq('id', id)
      .single();

    if (fetchError || !existingProject) {
      return NextResponse.json<APIResponse<never>>(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Project not found',
          },
        },
        { status: 404 }
      );
    }

    if (existingProject.userId !== currentUser.userId) {
      return NextResponse.json<APIResponse<never>>(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You do not have access to this project',
          },
        },
        { status: 403 }
      );
    }

    // Update project in database
    const { data: updatedProject, error: updateError } = await supabase
      .from('Project')
      .update({
        title: website.metadata?.title || 'Untitled Project',
        description: website.metadata?.description || null,
        data: website,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating project:', updateError);
      return NextResponse.json<APIResponse<never>>(
        {
          success: false,
          error: {
            code: 'UPDATE_FAILED',
            message: 'Failed to update project',
          },
        },
        { status: 500 }
      );
    }

    const response: APIResponse<WebsiteStructure> = {
      success: true,
      data: website,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json<APIResponse<never>>(
      {
        success: false,
        error: {
          code: 'UPDATE_FAILED',
          message: 'Failed to update project',
        },
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // In production, delete from database
    const response: APIResponse<never> = {
      success: true,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json<APIResponse<never>>(
      {
        success: false,
        error: {
          code: 'DELETE_FAILED',
          message: 'Failed to delete project',
        },
      },
      { status: 500 }
    );
  }
}
