# FiSight Development Troubleshooting Guide

## 🔧 Common Issues and Solutions

### 🔥 Firebase Connection Issues

#### **Problem**: `5 NOT_FOUND` or `Firestore unavailable` errors

**Symptoms:**
```
[2025-08-10T16:57:53.464Z] @firebase/firestore: Firestore (11.10.0): GrpcConnection RPC 'Listen' stream error. Code: 5 Message: 5 NOT_FOUND
Could not reach Cloud Firestore backend. Connection failed 1 times.
```

**Solutions:**

1. **Check Firebase Project Configuration**
   ```bash
   # Verify your .env.local file has correct Firebase config
   cat .env.local | grep FIREBASE
   ```

2. **Create New Firebase Project** (if project doesn't exist)
   ```bash
   # Go to https://console.firebase.google.com/
   # Create new project
   # Enable Firestore Database
   # Enable Authentication
   # Copy new config to .env.local
   ```

3. **Fix Firestore Rules**
   ```javascript
   // In Firebase Console > Firestore Database > Rules
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
         match /{subcollection=**} {
           allow read, write: if request.auth != null && request.auth.uid == userId;
         }
       }
     }
   }
   ```

4. **Enable Offline Mode** (for development)
   ```typescript
   // The app automatically falls back to demo data when Firebase is unavailable
   // This allows development without requiring Firebase setup
   ```

### 📱 Dashboard Not Loading

#### **Problem**: Dashboard shows loading state or empty cards

**Solutions:**

1. **Check Console for Errors**
   ```bash
   # Open browser dev tools (F12)
   # Check Console tab for JavaScript errors
   # Check Network tab for failed API requests
   ```

2. **Restart Development Server**
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   # or
   yarn dev
   ```

3. **Clear Browser Cache**
   ```bash
   # Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
   # Or clear browser data for localhost:9002
   ```

4. **Check User Authentication**
   ```javascript
   // In browser console, check if user is logged in:
   console.log('User:', JSON.parse(localStorage.getItem('user') || 'null'));
   ```

### 🔐 Authentication Issues

#### **Problem**: Cannot sign in or sign up

**Solutions:**

1. **Enable Authentication Methods**
   ```bash
   # Go to Firebase Console > Authentication > Sign-in method
   # Enable Email/Password
   # Enable Google (optional)
   ```

2. **Check Domain Authorization**
   ```bash
   # In Firebase Console > Authentication > Settings
   # Add localhost:9002 to authorized domains
   ```

3. **Verify API Keys**
   ```bash
   # Check if Firebase config keys are correct
   grep NEXT_PUBLIC_FIREBASE .env.local
   ```

### 🤖 AI Features Not Working

#### **Problem**: AI chat or insights not responding

**Solutions:**

1. **Check API Key**
   ```bash
   # Verify Google AI API key is set
   echo $GOOGLE_AI_API_KEY
   # or check .env.local
   grep GOOGLE_AI_API_KEY .env.local
   ```

2. **Get New API Key**
   ```bash
   # Go to https://makersuite.google.com/app/apikey
   # Create new API key
   # Add to .env.local
   ```

3. **Check API Quota**
   ```bash
   # Check Google Cloud Console for API usage limits
   # Verify billing is enabled for production use
   ```

### 💰 Financial Data Issues

#### **Problem**: Transactions or balance data not showing

**Solutions:**

1. **Use Demo Data**
   ```typescript
   // The app automatically provides demo data when:
   // - Firebase is unavailable
   // - User is new
   // - Bank connection fails
   ```

2. **Reset User Data**
   ```bash
   # Clear localStorage in browser
   localStorage.clear();
   # Refresh page
   ```

3. **Check API Endpoints**
   ```bash
   # Test user data API
   curl http://localhost:9002/api/user-data?userId=test
   ```

## 🛠 Development Setup Issues

### Node.js Version Issues

```bash
# Check Node.js version (requires 18+)
node --version

# Install correct version using nvm (recommended)
nvm install 18
nvm use 18
```

### Package Installation Issues

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# For permission issues on macOS/Linux
sudo npm install -g npm@latest
```

### Port Already in Use

```bash
# Kill process using port 9002
lsof -ti:9002 | xargs kill -9

# Or use different port
npm run dev -- -p 3000
```

### TypeScript Errors

```bash
# Check TypeScript configuration
npx tsc --noEmit

# Fix import errors
npm install @types/node @types/react @types/react-dom

# Restart TypeScript server in VS Code
Ctrl+Shift+P > TypeScript: Restart TS Server
```

## 🔄 Reset and Fresh Start

### Complete Reset

```bash
# 1. Stop development server
# Ctrl+C

# 2. Clear all data
rm -rf node_modules
rm -rf .next
rm package-lock.json

# 3. Clear browser data
# Go to browser settings > Clear browsing data
# Select "All time" and check all boxes

# 4. Reinstall dependencies
npm install

# 5. Start fresh
npm run dev
```

### Environment Reset

```bash
# Create new .env.local with minimal config
cat > .env.local << EOF
# Minimal configuration for development
GOOGLE_AI_API_KEY=your_gemini_api_key
NEXTAUTH_SECRET=development-secret-key
NEXTAUTH_URL=http://localhost:9002

# Optional: Add Firebase config when ready
# NEXT_PUBLIC_FIREBASE_API_KEY=
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=
EOF
```

## 📊 Performance Issues

### Slow Loading

```bash
# Use Turbopack for faster builds (already enabled)
npm run dev

# Check bundle analyzer
npm run analyze

# Optimize images
# Convert images to WebP format
# Use next/image component
```

### Memory Issues

```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run dev

# Or in package.json scripts:
"dev": "NODE_OPTIONS='--max-old-space-size=4096' next dev --turbopack -p 9002"
```

## 🧪 Testing Issues

### Tests Not Running

```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Run tests with verbose output
npm test -- --verbose

# Update snapshots
npm test -- --updateSnapshot
```

### Mock Data Issues

```bash
# Clear test database
# Reset mock data
# Check test configuration
```

## 🚀 Production Deployment Issues

### Build Errors

```bash
# Check for build errors
npm run build

# Check for type errors
npm run type-check

# Check for linting errors
npm run lint
```

### Environment Variables

```bash
# Verify all required env vars are set in production
# Check deployment platform settings (Vercel, Netlify, etc.)
# Ensure API keys are valid for production use
```

## 📞 Getting Help

### Debug Information

When asking for help, please provide:

1. **Error Messages**: Full console logs
2. **Environment**: OS, Node.js version, browser
3. **Steps to Reproduce**: What you were doing when error occurred
4. **Configuration**: Relevant parts of .env.local (without sensitive data)

### Useful Commands

```bash
# Check system info
node --version
npm --version
npx envinfo --binaries --npmPackages react,next

# Check logs
npm run dev 2>&1 | tee debug.log

# Check network requests
# Open browser dev tools > Network tab
```

### Contact

- **GitHub Issues**: [Create an issue](https://github.com/yourusername/fisight/issues)
- **Discord**: Join our development community
- **Email**: dev-support@fisight.app

---

**Remember**: FiSight is designed to work offline with demo data, so most features should work even without Firebase setup!
