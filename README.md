# 💰 FiSight - AI-Powered Financial Advisor

> your personal AI financial guru that actually gets it

## 🚀 what's this about?

FiSight is a next-gen financial planning platform that combines cutting-edge AI with real financial data to give you personalized advice. think of it as having a financial advisor in your pocket, but one that never sleeps and doesn't charge hourly rates.

## ✨ key features

### 🏠 landing page
- **multilingual support** - english/hindi with smooth switching
- **interactive AI chat demo** - try before you dive in
- **modern design** - clean, responsive, and mobile-first
- **smooth scrolling navigation** - because why not?

### 📊 dashboard
- **financial health score** - get a quick snapshot of your money situation
- **net worth tracking** - see your total wealth at a glance
- **recent transactions** - keep tabs on where your money goes
- **AI-powered insights** - personalized tips based on your spending

### 💡 AI advisor chat
- **real-time advice** - ask anything about your finances
- **personalized recommendations** - tailored to your actual data
- **financial health scoring** - track your progress over time
- **multiple conversation contexts** - remembers your previous chats

### 💼 investment tools
- **portfolio analysis** - see how your investments are performing
- **rebalancing suggestions** - AI tells you when to buy/sell
- **risk assessment** - understand your investment risk level
- **performance tracking** - monitor gains and losses

### 🏦 affordability calculator
- **big purchase planning** - can you afford that new car?
- **scenario simulation** - what if you take that loan?
- **long-term impact analysis** - see how decisions affect your future

### 📈 scenario planner
- **financial future modeling** - explore different life paths
- **goal tracking** - set and monitor financial targets
- **what-if analysis** - test major life decisions

### 👤 profile management
- **financial data input** - securely store your info
- **bank account linking** - connect your accounts (coming soon)
- **investment portfolio setup** - track all your assets
- **goal setting** - define what you're working toward

## 🛠 tech stack

- **framework**: Next.js 15.3.3 with App Router
- **ui**: Tailwind CSS + shadcn/ui components
- **animations**: Framer Motion for smooth interactions
- **ai**: Google Genkit for AI flows
- **language**: TypeScript throughout
- **email**: Nodemailer for contact forms
- **charts**: Recharts for data visualization

## 🚀 getting started

### prerequisites
- Node.js 18+ 
- npm or yarn

### installation

```bash
# clone the repo
git clone https://github.com/eyesee11/FiSight.git
cd FiSight

# install dependencies
npm install

# set up environment variables
cp .env.local.example .env.local
# edit .env.local with your keys

# run development server
npm run dev
```

### environment setup

create a `.env.local` file:

```env
# AI Configuration
GEMINI_API_KEY=your-gemini-api-key

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
SMTP_TO=contact@fisight.com

# App Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📱 features breakdown

### ai financial advisor
- natural language processing for financial queries
- personalized advice based on user financial data
- multi-turn conversations with context awareness
- financial health scoring and tracking

### bilingual support
- seamless english/hindi language switching
- localized content and cultural context
- indian financial scenarios and examples
- region-specific financial advice

### responsive design
- mobile-first approach
- works on all screen sizes
- touch-friendly interactions
- fast loading times

### security & privacy
- bank-level encryption for financial data
- no storage of sensitive banking credentials
- anonymized data processing
- gdpr compliant data handling

## 🔧 development

### project structure
```
src/
├── app/                 # next.js app router pages
├── components/          # reusable react components
│   ├── ui/             # base ui components
│   ├── landing/        # landing page components
│   ├── dashboard/      # dashboard components
│   └── shared/         # shared components
├── ai/                 # ai flows and configuration
├── lib/                # utility functions and types
├── contexts/           # react contexts
└── hooks/              # custom react hooks
```

### available scripts

```bash
npm run dev          # start development server
npm run build        # build for production
npm run start        # start production server
npm run lint         # run eslint
npm run type-check   # run typescript compiler
```

## 🎨 design system

- **colors**: modern blue/purple gradient theme
- **typography**: clean, readable fonts
- **spacing**: consistent 8px grid system
- **components**: shadcn/ui component library
- **animations**: subtle framer motion effects

## 🌐 deployment

### vercel (recommended)
```bash
# deploy to vercel
npm i -g vercel
vercel
```

### other platforms
- works with any node.js hosting platform
- docker support available
- static export possible for some features

## 🤝 contributing

we welcome contributions! here's how:

1. fork the repo
2. create a feature branch
3. make your changes
4. test thoroughly
5. submit a pull request

### development guidelines
- follow typescript best practices
- use meaningful commit messages
- test on multiple screen sizes
- ensure accessibility compliance

## 📄 license

MIT License - see [LICENSE](LICENSE) for details

## 🙋‍♀️ support

- 📧 email: support@fisight.com
- 🐛 bugs: [GitHub Issues](https://github.com/eyesee11/FiSight/issues)
- 💬 discussions: [GitHub Discussions](https://github.com/eyesee11/FiSight/discussions)

## 🔮 roadmap

- [ ] bank account integration
- [ ] cryptocurrency tracking
- [ ] tax planning features
- [ ] goal achievement gamification
- [ ] social sharing of progress
- [ ] mobile app (react native)

---

built with ❤️ for better financial futures