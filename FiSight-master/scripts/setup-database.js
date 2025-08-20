require('dotenv').config({ path: '.env.local' });

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, collection } = require('firebase/firestore');

console.log('🔥 Setting up Firebase Firestore sample data...');
console.log('📋 Checking environment variables...');

// Firebase configuration (use your actual config)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Validate configuration
console.log('🔍 Validating Firebase configuration...');
const requiredKeys = ['apiKey', 'authDomain', 'projectId'];
const missingKeys = requiredKeys.filter(key => !firebaseConfig[key]);

if (missingKeys.length > 0) {
  console.error('❌ Missing Firebase configuration keys:', missingKeys);
  console.error('Please check your .env.local file');
  process.exit(1);
}

console.log('✅ Firebase configuration validated');
console.log('🎯 Project ID:', firebaseConfig.projectId);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function setupSampleData() {
  console.log('� Creating sample data...');
  
  try {
    // Sample user ID (you can replace with actual user ID)
    const sampleUserId = 'demo-user-123';
    
    // 1. Create sample user profile
    console.log('📝 Creating sample user profile...');
    await setDoc(doc(db, 'users', sampleUserId), {
      displayName: 'Demo User',
      email: 'demo@fisight.com',
      createdAt: new Date(),
      profile: {
        annualIncome: 75000,
        monthlyExpenses: 4500,
        assets: '50000',
        liabilities: '25000',
        creditScore: 720,
        riskTolerance: 'medium',
        financialGoals: ['Emergency Fund', 'House Down Payment', 'Retirement'],
        bankAccounts: [
          {
            id: 'acc-1',
            bankName: 'Chase',
            accountType: 'checking',
            accountNumber: '****1234',
            balance: 15000,
            isConnected: true
          },
          {
            id: 'acc-2',
            bankName: 'Wells Fargo',
            accountType: 'savings',
            accountNumber: '****5678',
            balance: 35000,
            isConnected: true
          }
        ],
        isProfileComplete: true
      },
      settings: {
        currency: 'USD',
        notifications: true,
        theme: 'light'
      }
    });

    // 2. Create sample transactions
    console.log('💰 Creating sample transactions...');
    const transactions = [
      {
        id: 'trans-1',
        description: 'Monthly Salary',
        amount: 6250,
        category: 'Salary',
        type: 'income',
        date: '2025-08-01',
        accountId: 'acc-1',
        createdAt: new Date('2025-08-01')
      },
      {
        id: 'trans-2',
        description: 'Grocery Store',
        amount: 150,
        category: 'Groceries',
        type: 'expense',
        date: '2025-08-05',
        accountId: 'acc-1',
        createdAt: new Date('2025-08-05')
      },
      {
        id: 'trans-3',
        description: 'Electric Bill',
        amount: 120,
        category: 'Utilities',
        type: 'expense',
        date: '2025-08-03',
        accountId: 'acc-1',
        createdAt: new Date('2025-08-03')
      },
      {
        id: 'trans-4',
        description: 'Netflix Subscription',
        amount: 15,
        category: 'Entertainment',
        type: 'expense',
        date: '2025-08-01',
        accountId: 'acc-1',
        isRecurring: true,
        createdAt: new Date('2025-08-01')
      },
      {
        id: 'trans-5',
        description: 'Gas Station',
        amount: 45,
        category: 'Transport',
        type: 'expense',
        date: '2025-08-06',
        accountId: 'acc-1',
        createdAt: new Date('2025-08-06')
      }
    ];

    for (const transaction of transactions) {
      await setDoc(doc(db, 'users', sampleUserId, 'transactions', transaction.id), transaction);
    }

    // 3. Create sample financial goals
    console.log('🎯 Creating sample financial goals...');
    const goals = [
      {
        id: 'goal-1',
        name: 'Emergency Fund',
        description: 'Save 6 months of expenses for emergencies',
        targetAmount: 27000,
        currentAmount: 15000,
        deadline: '2025-12-31',
        priority: 'high',
        category: 'emergency_fund',
        status: 'active',
        createdAt: new Date()
      },
      {
        id: 'goal-2',
        name: 'House Down Payment',
        description: 'Save for 20% down payment on a $400k house',
        targetAmount: 80000,
        currentAmount: 35000,
        deadline: '2026-06-30',
        priority: 'high',
        category: 'house',
        status: 'active',
        createdAt: new Date()
      },
      {
        id: 'goal-3',
        name: 'Vacation to Europe',
        description: 'Two-week vacation to Europe',
        targetAmount: 8000,
        currentAmount: 2500,
        deadline: '2025-09-15',
        priority: 'medium',
        category: 'vacation',
        status: 'active',
        createdAt: new Date()
      }
    ];

    for (const goal of goals) {
      await setDoc(doc(db, 'users', sampleUserId, 'goals', goal.id), goal);
    }

    // 4. Create sample investments
    console.log('📈 Creating sample investments...');
    const investments = [
      {
        id: 'inv-1',
        name: 'Apple Inc.',
        symbol: 'AAPL',
        type: 'stock',
        quantity: 50,
        purchasePrice: 150,
        currentValue: 180,
        purchaseDate: '2024-01-15',
        performance: 20.0,
        createdAt: new Date('2024-01-15')
      },
      {
        id: 'inv-2',
        name: 'Vanguard S&P 500 ETF',
        symbol: 'VOO',
        type: 'etf',
        quantity: 100,
        purchasePrice: 400,
        currentValue: 420,
        purchaseDate: '2024-03-01',
        performance: 5.0,
        createdAt: new Date('2024-03-01')
      },
      {
        id: 'inv-3',
        name: 'Bitcoin',
        symbol: 'BTC',
        type: 'crypto',
        quantity: 0.5,
        purchasePrice: 45000,
        currentValue: 48000,
        purchaseDate: '2024-02-10',
        performance: 6.67,
        createdAt: new Date('2024-02-10')
      }
    ];

    for (const investment of investments) {
      await setDoc(doc(db, 'users', sampleUserId, 'investments', investment.id), investment);
    }

    console.log('✅ Sample data setup completed successfully!');
    console.log('📊 Created:');
    console.log(`   - 1 user profile`);
    console.log(`   - ${transactions.length} transactions`);
    console.log(`   - ${goals.length} financial goals`);
    console.log(`   - ${investments.length} investments`);
    console.log('');
    console.log('🎉 Your Firebase Firestore is now ready for FiSight!');
    console.log('🔗 You can now test the app with this sample data.');

  } catch (error) {
    console.error('❌ Error setting up sample data:', error);
    console.log('💡 Make sure your Firebase configuration is correct in .env.local');
  }
}

// Run the setup
if (require.main === module) {
  setupSampleData();
}

module.exports = { setupSampleData };