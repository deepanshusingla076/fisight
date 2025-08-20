// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  enableNetwork, 
  disableNetwork, 
  connectFirestoreEmulator,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Validate required config
const requiredKeys = ['apiKey', 'authDomain', 'projectId'];
const missingKeys = requiredKeys.filter(key => !firebaseConfig[key]);

if (missingKeys.length > 0) {
  console.error('Missing Firebase configuration keys:', missingKeys);
  console.log('Available config:', Object.keys(firebaseConfig));
  throw new Error(`Missing Firebase configuration: ${missingKeys.join(', ')}`);
}

// Initialize Firebase with better error handling
let app;
let analytics = null;
let auth;
let db;

try {
  console.log('🔥 Initializing Firebase with project:', firebaseConfig.projectId);
  app = initializeApp(firebaseConfig);
  
  // Initialize auth first
  auth = getAuth(app);
  
  // Initialize Firestore with better offline handling
  db = getFirestore(app);
  
  // Only initialize analytics in browser
  if (typeof window !== 'undefined') {
    try {
      analytics = getAnalytics(app);
    } catch (analyticsError) {
      console.warn('Analytics initialization failed:', analyticsError);
    }
  }
  
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Error initializing Firebase:', error);
  
  // Create mock objects for development
  if (typeof window !== 'undefined') {
    console.warn('🔧 Creating mock Firebase objects for development');
    // This allows the app to continue running even if Firebase fails
  }
  throw error;
}

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Authentication functions with better error handling
export const signInWithGooglePopup = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log('✅ Google sign-in successful:', result.user.uid);
    return result;
  } catch (error) {
    // Handle specific Firebase errors more gracefully
    if (error.code === 'auth/popup-closed-by-user') {
      console.log('ℹ️ User closed the popup - sign-in canceled');
      throw new Error('Sign-in was canceled');
    } else if (error.code === 'auth/popup-blocked') {
      console.warn('⚠️ Popup was blocked by browser');
      throw new Error('Popup was blocked - please allow popups for this site');
    } else if (error.code === 'auth/cancelled-popup-request') {
      console.log('ℹ️ Multiple popup requests - previous popup canceled');
      throw new Error('Sign-in was canceled');
    } else {
      console.error('❌ Google sign-in error:', error.code, error.message);
      throw error;
    }
  }
};

export const signInWithEmail = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    console.log('Attempting email sign-in for:', email);
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ Email sign-in successful:', result.user.uid);
    return result;
  } catch (error) {
    // Ensure error is always an object with code/message
    let code = 'unknown';
    let message = 'Unknown error';
    if (error && typeof error === 'object') {
      code = error.code || code;
      message = error.message || message;
    }
    console.error('❌ Email sign-in error:', { code, message, email });
    // Re-throw with proper error structure
    const authError = new Error(message);
    authError.code = code;
    throw authError;
  }
};

export const createUserWithEmail = async (email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result;
  } catch (error) {
    console.error('Create user error:', error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

export const onAuthStateChangedListener = (callback) => 
  onAuthStateChanged(auth, callback);

// Firestore functions
export const createUserDocumentFromAuth = async (userAuth, additionalInformation = {}) => {
  if (!userAuth) return false;
  
  try {
    console.log('🔄 Creating/checking user document for:', userAuth.email);
    
    // Always use offline mode for demo
    if (typeof window !== 'undefined') {
      const existingData = localStorage.getItem(`user_data_${userAuth.uid}`);
      
      if (!existingData) {
        console.log('📝 Creating new local user profile');
        const userData = {
          uid: userAuth.uid,
          displayName: userAuth.displayName || 'Demo User',
          email: userAuth.email,
          createdAt: new Date().toISOString(),
          profile: {
            annualIncome: 75000,
            monthlyExpenses: 4500,
            assets: "25000",
            liabilities: "15000",
            creditScore: 720,
            riskTolerance: "medium",
            financialGoals: ["Emergency Fund", "Home Purchase", "Retirement"],
            bankAccounts: [],
            isProfileComplete: true
          },
          settings: {
            currency: "USD",
            notifications: true,
            theme: "light"
          },
          ...additionalInformation
        };
        
        localStorage.setItem(`user_data_${userAuth.uid}`, JSON.stringify(userData));
        console.log('✅ Local user profile created successfully');
        return true; // New user
      } else {
        console.log('ℹ️ Existing local user profile found');
        return false; // Existing user
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error in user document creation:', error);
    return false; // Don't throw to prevent auth flow breaking
  }
};

// ===============================
// FINANCIAL DATA SERVICE FUNCTIONS
// ===============================

// 1. USER PROFILE FUNCTIONS
export const updateUserProfile = async (userId, profileData) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      profile: profileData,
      updatedAt: serverTimestamp()
    });
    console.log('✅ User profile updated successfully');
    return true;
  } catch (error) {
    console.error('❌ Error updating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    console.log('📋 Getting user profile for:', userId);
    
    // Use local storage for demo mode
    if (typeof window !== 'undefined') {
      const localData = localStorage.getItem(`user_data_${userId}`);
      if (localData) {
        console.log('📱 Using local user data');
        return JSON.parse(localData);
      }
    }
    
    // If no local data, create demo profile
    const demoProfile = {
      uid: userId,
      displayName: 'Demo User',
      email: 'demo@fisight.app',
      createdAt: new Date(),
      profile: {
        annualIncome: 75000,
        monthlyExpenses: 4500,
        assets: "25000",
        liabilities: "15000",
        creditScore: 720,
        riskTolerance: 'medium',
        financialGoals: ['Emergency Fund', 'Home Purchase', 'Retirement'],
        bankAccounts: [],
        isProfileComplete: true
      },
      settings: {
        currency: "USD",
        notifications: true,
        theme: "light"
      }
    };
    
    // Save demo profile to local storage
    if (typeof window !== 'undefined') {
      localStorage.setItem(`user_data_${userId}`, JSON.stringify(demoProfile));
    }
    
    console.log('✅ Demo profile created and returned');
    return demoProfile;
  } catch (error) {
    console.error('❌ Error fetching user profile:', error);
    throw error;
  }
};

// 2. TRANSACTIONS FUNCTIONS
export const addTransaction = async (userId, transactionData) => {
  try {
    const transactionsRef = collection(db, 'users', userId, 'transactions');
    const newTransaction = {
      ...transactionData,
      createdAt: serverTimestamp(),
      id: crypto.randomUUID()
    };
    
    const docRef = await addDoc(transactionsRef, newTransaction);
    console.log('✅ Transaction added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error adding transaction:', error);
    throw error;
  }
};

export const getUserTransactions = async (userId, limitCount = 50) => {
  try {
    const transactionsRef = collection(db, 'users', userId, 'transactions');
    const q = query(
      transactionsRef, 
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const transactions = [];
    
    querySnapshot.forEach((doc) => {
      transactions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return transactions;
  } catch (error) {
    console.error('❌ Error fetching transactions:', error);
    throw error;
  }
};

export const updateTransaction = async (userId, transactionId, updateData) => {
  try {
    const transactionRef = doc(db, 'users', userId, 'transactions', transactionId);
    await updateDoc(transactionRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
    console.log('✅ Transaction updated successfully');
    return true;
  } catch (error) {
    console.error('❌ Error updating transaction:', error);
    throw error;
  }
};

export const deleteTransaction = async (userId, transactionId) => {
  try {
    const transactionRef = doc(db, 'users', userId, 'transactions', transactionId);
    await deleteDoc(transactionRef);
    console.log('✅ Transaction deleted successfully');
    return true;
  } catch (error) {
    console.error('❌ Error deleting transaction:', error);
    throw error;
  }
};

// 3. FINANCIAL GOALS FUNCTIONS
export const addFinancialGoal = async (userId, goalData) => {
  try {
    const goalsRef = collection(db, 'users', userId, 'goals');
    const newGoal = {
      ...goalData,
      createdAt: serverTimestamp(),
      id: crypto.randomUUID(),
      status: 'active' // active, completed, paused
    };
    
    const docRef = await addDoc(goalsRef, newGoal);
    console.log('✅ Financial goal added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error adding financial goal:', error);
    throw error;
  }
};

export const getUserGoals = async (userId) => {
  try {
    const goalsRef = collection(db, 'users', userId, 'goals');
    const q = query(goalsRef, orderBy('createdAt', 'desc'));
    
    const querySnapshot = await getDocs(q);
    const goals = [];
    
    querySnapshot.forEach((doc) => {
      goals.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return goals;
  } catch (error) {
    console.error('❌ Error fetching goals:', error);
    throw error;
  }
};

export const updateGoalProgress = async (userId, goalId, currentAmount) => {
  try {
    const goalRef = doc(db, 'users', userId, 'goals', goalId);
    await updateDoc(goalRef, {
      currentAmount,
      updatedAt: serverTimestamp()
    });
    console.log('✅ Goal progress updated successfully');
    return true;
  } catch (error) {
    console.error('❌ Error updating goal progress:', error);
    throw error;
  }
};

// 4. INVESTMENTS FUNCTIONS
export const addInvestment = async (userId, investmentData) => {
  try {
    const investmentsRef = collection(db, 'users', userId, 'investments');
    const newInvestment = {
      ...investmentData,
      createdAt: serverTimestamp(),
      id: crypto.randomUUID()
    };
    
    const docRef = await addDoc(investmentsRef, newInvestment);
    console.log('✅ Investment added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error adding investment:', error);
    throw error;
  }
};

export const getUserInvestments = async (userId) => {
  try {
    const investmentsRef = collection(db, 'users', userId, 'investments');
    const q = query(investmentsRef, orderBy('createdAt', 'desc'));
    
    const querySnapshot = await getDocs(q);
    const investments = [];
    
    querySnapshot.forEach((doc) => {
      investments.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return investments;
  } catch (error) {
    console.error('❌ Error fetching investments:', error);
    throw error;
  }
};

// 5. REAL-TIME LISTENERS
export const subscribeToUserProfile = (userId, callback) => {
  const userDocRef = doc(db, 'users', userId);
  return onSnapshot(userDocRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    }
  });
};

export const subscribeToTransactions = (userId, callback) => {
  const transactionsRef = collection(db, 'users', userId, 'transactions');
  const q = query(transactionsRef, orderBy('createdAt', 'desc'), limit(10));
  
  return onSnapshot(q, (querySnapshot) => {
    const transactions = [];
    querySnapshot.forEach((doc) => {
      transactions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    callback(transactions);
  });
};

// 6. ANALYTICS & CALCULATIONS
export const calculateNetWorth = async (userId) => {
  try {
    const userProfile = await getUserProfile(userId);
    const investments = await getUserInvestments(userId);
    
    // Calculate total investment value
    const totalInvestments = investments.reduce((sum, investment) => {
      return sum + (investment.currentValue || investment.value || 0);
    }, 0);
    
    // Get assets and liabilities from profile
    const assets = parseFloat(userProfile.profile?.assets || 0);
    const liabilities = parseFloat(userProfile.profile?.liabilities || 0);
    
    const netWorth = assets + totalInvestments - liabilities;
    
    return {
      netWorth,
      assets: assets + totalInvestments,
      liabilities,
      investments: totalInvestments
    };
  } catch (error) {
    console.error('❌ Error calculating net worth:', error);
    throw error;
  }
};

export const getMonthlySpending = async (userId) => {
  try {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    const transactionsRef = collection(db, 'users', userId, 'transactions');
    const q = query(
      transactionsRef,
      where('type', '==', 'expense'),
      where('createdAt', '>=', Timestamp.fromDate(firstDayOfMonth)),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    let totalSpending = 0;
    const categorySpending = {};
    
    querySnapshot.forEach((doc) => {
      const transaction = doc.data();
      const amount = transaction.amount || 0;
      const category = transaction.category || 'other';
      
      totalSpending += amount;
      categorySpending[category] = (categorySpending[category] || 0) + amount;
    });
    
    return {
      total: totalSpending,
      byCategory: categorySpending
    };
  } catch (error) {
    console.error('❌ Error calculating monthly spending:', error);
    throw error;
  }
};

export { app, analytics, auth, db };