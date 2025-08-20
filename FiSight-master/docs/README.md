# 💰 FiSight - Complete Documentation

> Your personal AI financial guru that actually gets it

## 📋 Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Features](#features)
4. [Setup Guides](#setup-guides)
5. [AI Integration](#ai-integration)
6. [Architecture](#architecture)
7. [Troubleshooting](#troubleshooting)
8. [Contributing](#contributing)

## 🚀 Overview

FiSight is a next-gen financial planning platform that combines cutting-edge AI with real financial data to give you personalized advice. Think of it as having a financial advisor in your pocket, but one that never sleeps and doesn't charge hourly rates.

### ✨ Key Features

#### 🏠 Landing Page
- **Multilingual support** - English/Hindi with smooth switching
- **Interactive AI chat demo** - Try before you dive in
- **Modern design** - Clean, responsive, and mobile-first
- **Smooth scrolling navigation** - Because why not?

#### 📊 Dashboard
- **Financial health score** - Get a quick snapshot of your money situation
- **Net worth tracking** - See your total wealth at a glance
- **Recent transactions** - Keep tabs on where your money goes
- **AI-powered insights** - Personalized tips based on your spending

#### 💡 AI Advisor Chat
- **Real-time advice** - Ask anything about your finances
- **Personalized recommendations** - Tailored to your actual data
- **Voice interaction** - Talk to your AI advisor naturally
- **Multiple conversation contexts** - Remembers your previous chats

#### 💼 Investment Tools
- **Portfolio analysis** - See how your investments are performing
- **Rebalancing suggestions** - AI tells you when to buy/sell
- **Risk assessment** - Understand your investment risk level
- **Performance tracking** - Monitor gains and losses

#### 🏦 Affordability Calculator
- **Big purchase planning** - Can you afford that new car?
- **Scenario simulation** - What if you take that loan?
- **Long-term impact analysis** - See how decisions affect your future

#### 📈 Scenario Planner
- **Financial future modeling** - Explore different life paths
- **Goal tracking** - Set and monitor financial targets
- **What-if analysis** - Test major life decisions

#### 👤 Profile Management
- **Financial data input** - Securely store your info
- **Bank account linking** - Connect your accounts
- **Investment portfolio setup** - Track all your assets
- **Goal setting** - Define what you're working toward

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Firebase account
- Google AI Studio API key

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd FiSight-master
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Update `.env.local` with your credentials:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Google AI
GOOGLE_AI_API_KEY=your-google-ai-api-key
```

4. **Start development server**
```bash
npm run dev
```

Visit [http://localhost:9002](http://localhost:9002) to see your application.

## 🔧 Setup Guides

### 🔥 Firebase Authentication Setup

#### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication

#### 2. Configure Authentication Providers
1. **Email/Password**: 
   - Go to Authentication > Sign-in method
   - Enable "Email/Password" provider

2. **Google Authentication**:
   - Enable "Google" provider
   - Configure OAuth consent screen in Google Cloud Console
   - Add authorized domains (localhost for dev, your domain for prod)

#### 3. Get Configuration
- Go to Project Settings > General
- Add a web app
- Copy the config values to your `.env.local`

### 🤖 AI Integration Setup

#### 1. Google AI Studio
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Create an API key
3. Add to your `.env.local` as `GOOGLE_AI_API_KEY`

#### 2. Genkit Development Server
```bash
# Start Genkit development server
npm run genkit:dev

# Or with auto-restart
npm run genkit:watch
```

#### 3. AI Features Configuration
The AI system includes:
- **Financial trend analysis** - Analyze spending patterns
- **Investment rebalancing** - Portfolio optimization suggestions
- **Scenario simulation** - Model financial decisions
- **Affordability analysis** - Assess purchase impact
- **Chatbot interactions** - Natural language financial advice

### 📧 Email Configuration

Email functionality is configured through Nodemailer. Update the email configuration in `src/lib/email.ts`:

```typescript
const transporter = nodemailer.createTransporter({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

Add to your `.env.local`:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Authentication**: Firebase Auth
- **AI**: Google Gemini, Genkit
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Voice**: Web Speech API

### Project Structure
```
FiSight-master/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── (main)/            # Main app pages
│   │   │   ├── dashboard/     # Dashboard page
│   │   │   ├── ai-chat/       # AI chat interface
│   │   │   ├── investments/   # Investment tools
│   │   │   ├── scenarios/     # Scenario planner
│   │   │   ├── affordability/ # Affordability calculator
│   │   │   └── profile/       # User profile
│   │   ├── api/               # API routes
│   │   └── login/             # Authentication page
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components
│   │   ├── shared/           # Shared components
│   │   ├── dashboard/        # Dashboard components
│   │   ├── landing/          # Landing page components
│   │   └── auth/             # Authentication components
│   ├── ai/                   # AI configuration and flows
│   ├── contexts/             # React contexts
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility libraries
│   └── firebase/             # Firebase configuration
├── docs/                     # Documentation
├── public/                   # Static assets
└── scripts/                  # Build scripts
```

### Core Components

#### AI Flows
- `affordability-analysis.ts` - Analyze purchase affordability
- `analyze-financial-trends.ts` - Spending pattern analysis
- `investment-rebalancing-suggestions.ts` - Portfolio optimization
- `simulate-financial-scenarios.ts` - Future scenario modeling
- `financial-advisor-chatbot.ts` - Conversational AI

#### Key Features
- **Voice Assistant** - Speech recognition and synthesis
- **Responsive Design** - Mobile-first approach
- **Real-time Updates** - Live financial data
- **Multilingual Support** - English/Hindi switching
- **Dark/Light Mode** - User preference themes

## 🔍 Troubleshooting

### Common Issues

#### 1. Firebase Authentication Errors
- **Error**: "Firebase: Error (auth/unauthorized-domain)"
  - **Solution**: Add your domain to Firebase Console > Authentication > Settings > Authorized domains

#### 2. AI API Errors
- **Error**: "Google AI API key invalid"
  - **Solution**: Verify your API key in Google AI Studio and update `.env.local`

#### 3. Voice Assistant Not Working
- **Error**: "Speech recognition not available"
  - **Solution**: Ensure you're using HTTPS (or localhost) and grant microphone permissions

#### 4. Build Errors
- **Error**: TypeScript compilation errors
  - **Solution**: Run `npm run typecheck` to identify and fix type issues

#### 5. Performance Issues
- **Issue**: Slow page loads
  - **Solution**: Check bundle analyzer and optimize imports

### Development Tips

1. **Hot Reload**: Use `npm run dev` for development with hot reload
2. **Type Checking**: Run `npm run typecheck` before commits
3. **Lint**: Use `npm run lint` to maintain code quality
4. **AI Development**: Use `npm run genkit:watch` for AI flow development

### Production Deployment

1. **Build the application**
```bash
npm run build
```

2. **Start production server**
```bash
npm start
```

3. **Environment Variables**: Ensure all production environment variables are set

## 🎨 Design System

### Colors
- **Primary**: `hsl(210, 70%, 50%)` - #3399FF (Trustworthy blue)
- **Background**: `hsl(210, 20%, 95%)` - #F0F8FF (Light professional)
- **Accent**: `hsl(180, 85%, 40%)` - #0AD9D9 (Refreshing cyan)

### Typography
- **Headlines**: 'Space Grotesk' - Modern, computerized feel
- **Body**: 'Inter' - Neutral, machine-readable

### Components
- Clean and intuitive layout
- Financial information front and center
- Accessible chat from any screen
- Simple, clean icons for financial categories

## 📱 Features Walkthrough

### Landing Page
- Hero section with value proposition
- Interactive AI chat demo
- Feature showcase
- Contact and FAQ sections
- Language toggle (EN/HI)

### Dashboard
- Financial health overview
- Net worth card with trends
- Recent transactions
- Quick action buttons
- AI insights panel

### AI Chat
- Natural language interface
- Voice input/output
- Context-aware responses
- Financial advice and analysis
- Transaction queries

### Investment Tools
- Portfolio overview
- Asset allocation charts
- Performance metrics
- Rebalancing suggestions
- Risk analysis

### Profile Management
- Personal information
- Financial goals
- Account linking
- Investment preferences
- Notification settings

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
```bash
git checkout -b feature/amazing-feature
```

3. **Make your changes**
4. **Run tests and type checking**
```bash
npm run typecheck
npm run lint
```

5. **Commit your changes**
```bash
git commit -m 'Add some amazing feature'
```

6. **Push to the branch**
```bash
git push origin feature/amazing-feature
```

7. **Open a Pull Request**

### Code Standards

- Use TypeScript for all new code
- Follow the existing file structure
- Add proper type definitions
- Include JSDoc comments for complex functions
- Test your changes thoroughly

### AI Flow Development

When creating new AI flows:

1. Create flow in `src/ai/flows/`
2. Export from `src/ai/genkit.ts`
3. Add types to `src/lib/types.ts`
4. Test with Genkit dev server

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- [Live Demo](https://fisight.vercel.app) (if deployed)
- [Firebase Console](https://console.firebase.google.com/)
- [Google AI Studio](https://aistudio.google.com/)
- [Next.js Documentation](https://nextjs.org/docs)

---

*Last updated: July 28, 2025*
*This documentation covers all aspects of the FiSight application setup and development.*
