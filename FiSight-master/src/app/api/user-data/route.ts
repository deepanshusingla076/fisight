import { NextRequest, NextResponse } from 'next/server';
import { createUserDataManager } from '@/lib/user-data-manager';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const userDataManager = createUserDataManager(userId);
    const userData = await userDataManager.initializeUserData();

    return NextResponse.json(userData);

  } catch (error) {
    console.error('❌ Error getting user data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get user data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, action, data } = await request.json();

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'User ID and action are required' },
        { status: 400 }
      );
    }

    const userDataManager = createUserDataManager(userId);

    switch (action) {
      case 'complete-onboarding':
        await userDataManager.completeOnboarding(data);
        return NextResponse.json({ success: true, message: 'Onboarding completed' });
      
      case 'connect-bank':
        await userDataManager.connectBankAccount(data);
        return NextResponse.json({ success: true, message: 'Bank account connected' });
      
      case 'get-dashboard':
        const dashboardData = await userDataManager.getDashboardData();
        return NextResponse.json(dashboardData);
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('❌ Error in user data API:', error);
    return NextResponse.json(
      { 
        error: 'User data operation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
