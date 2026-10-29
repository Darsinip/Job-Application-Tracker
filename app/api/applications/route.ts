import { NextRequest, NextResponse } from 'next/server';
import { getAllApplications, createApplication } from '@/lib/storage';
import { validateApplication } from '@/lib/validation';
import { ApplicationStatus } from '@/types/application';

/**
 * GET /api/applications
 * Returns all applications, with optional filtering by status and search by company name
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');
    const searchQuery = searchParams.get('search');

    let applications = await getAllApplications();

    // Filter by status if provided and not 'All'
    if (statusFilter && statusFilter !== 'All') {
      applications = applications.filter(
        (app) => app.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Filter by company search query (case-insensitive)
    if (searchQuery && searchQuery.trim() !== '') {
      const query = searchQuery.trim().toLowerCase();
      applications = applications.filter((app) =>
        app.company.toLowerCase().includes(query) ||
        app.role.toLowerCase().includes(query)
      );
    }

    return NextResponse.json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve applications',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/applications
 * Creates a new job application with input validation
 */
export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid JSON request body',
        },
        { status: 400 }
      );
    }

    // Validate incoming payload
    const validation = validateApplication(body);
    if (!validation.isValid || !validation.data) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validation.errors,
        },
        { status: 400 }
      );
    }

    const created = await createApplication(validation.data);

    return NextResponse.json(
      {
        success: true,
        data: created,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create application',
      },
      { status: 500 }
    );
  }
}
