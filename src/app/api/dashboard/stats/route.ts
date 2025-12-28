import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/utils/auth';
import { supabase } from '@/lib/db/supabase';
import { APIResponse } from '@/lib/types';

export async function GET() {
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

    // Fetch all projects for stats
    const { data: projects, error: projectsError } = await supabase
      .from('Project')
      .select('id, createdAt, updatedAt')
      .eq('userId', currentUser.userId);

    if (projectsError) {
      console.error('Error fetching projects for stats:', projectsError);
    }

    const totalProjects = projects?.length || 0;
    
    // Calculate projects created this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const projectsThisWeek = projects?.filter(
      (p) => new Date(p.createdAt) >= oneWeekAgo
    ).length || 0;

    // Get user info for name
    const { data: user, error: userError } = await supabase
      .from('User')
      .select('id, name, email')
      .eq('id', currentUser.userId)
      .maybeSingle();

    if (userError) {
      console.error('Error fetching user:', userError);
    }

    // Calculate total views (if we had a views field, for now we'll use a placeholder)
    // In the future, you might want to add a views field to Project or track views separately
    const totalViews = 0; // Placeholder - implement when you add view tracking

    // Calculate published sites (projects with status published)
    // For now, we'll assume all projects are draft unless you add a status field
    const publishedSites = 0; // Placeholder - implement when you add status field

    const response: APIResponse<{
      totalProjects: number;
      projectsThisWeek: number;
      totalViews: number;
      publishedSites: number;
      userName: string | null;
      userEmail: string;
    }> = {
      success: true,
      data: {
        totalProjects,
        projectsThisWeek,
        totalViews,
        publishedSites,
        userName: user?.name || null,
        userEmail: user?.email || currentUser.email,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return NextResponse.json<APIResponse<never>>(
      {
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: 'Failed to fetch dashboard stats',
        },
      },
      { status: 500 }
    );
  }
}
