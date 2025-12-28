import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/db/supabase';
import { hashPassword, generateToken } from '@/lib/utils/auth';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase env vars are set
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'CONFIGURATION_ERROR',
            message: 'Supabase not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your Vercel environment variables.',
          },
        },
        { status: 500 }
      );
    }

    // Check if JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set');
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'CONFIGURATION_ERROR',
            message: 'JWT secret not configured. Please set JWT_SECRET in your environment variables.',
          },
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { name, email, password } = registerSchema.parse(body);

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('"User"')
      .select('id, email')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: { code: 'USER_EXISTS', message: 'User with this email already exists' } },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const { data: user, error: insertError } = await supabase
      .from('"User"')
      .insert({
        name,
        email,
        password: hashedPassword,
      })
      .select('id, email, name, image, "createdAt"')
      .single();

    if (insertError) {
      if (insertError.code === '23505') { // Unique constraint violation
        return NextResponse.json(
          { success: false, error: { code: 'USER_EXISTS', message: 'User with this email already exists' } },
          { status: 400 }
        );
      }
      throw insertError;
    }

    if (!user) {
      throw new Error('Failed to create user');
    }

    // Generate token
    const token = generateToken(user.id, user.email);

    // Set auth cookie
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return NextResponse.json({
      success: true,
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.errors[0]?.message || 'Validation failed',
          },
        },
        { status: 400 }
      );
    }

    console.error('Registration error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to create account. Please try again.';
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint') || error.message.includes('duplicate')) {
        errorMessage = 'An account with this email already exists.';
      } else if (error.message.includes('connect') || error.message.includes('database')) {
        errorMessage = 'Database connection error. Please check your database configuration.';
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'REGISTRATION_FAILED',
          message: errorMessage,
        },
      },
      { status: 500 }
    );
  }
}
