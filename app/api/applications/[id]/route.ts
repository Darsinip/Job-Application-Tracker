import { NextRequest, NextResponse } from 'next/server';
import { getApplicationById, updateApplication, deleteApplication } from '@/lib/storage';
import { validateApplication } from '@/lib/validation';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/applications/[id]
 * Retrieves a single application by ID
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const application = await getApplicationById(id);

    if (!application) {
      return NextResponse.json(
        {
          success: false,
          error: `Application with ID '${id}' not found`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error('Error fetching application by ID:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve application',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/applications/[id]
 * Updates an existing application with validation
 */
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    // Check existence first
    const existing = await getApplicationById(id);
    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error: `Application with ID '${id}' not found`,
        },
        { status: 404 }
      );
    }

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

    // Validate update payload
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

    const updated = await updateApplication(id, validation.data);

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update application',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/applications/[id]
 * Removes an application by ID
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const success = await deleteApplication(id);
    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: `Application with ID '${id}' not found`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Application deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting application:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete application',
      },
      { status: 500 }
    );
  }
}
