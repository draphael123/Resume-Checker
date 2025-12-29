import { NextRequest, NextResponse } from 'next/server';
import { parseResume } from '@/lib/resumeParser';
import { matchResumeToRoles } from '@/lib/roleMatcher';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const personName = formData.get('name') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Parse the resume
    const parsedResume = await parseResume(file);
    
    // Override name if provided
    if (personName) {
      parsedResume.name = personName;
    }

    // Match to roles
    const matches = matchResumeToRoles(parsedResume);

    return NextResponse.json({
      resume: parsedResume,
      matches,
    });
  } catch (error) {
    console.error('Error analyzing resume:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to analyze resume' },
      { status: 500 }
    );
  }
}

