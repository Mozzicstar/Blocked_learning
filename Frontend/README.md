# BlockedLearning Frontend 🎨

> **A futuristic, blockchain-powered learning experience.**

Welcome to the frontend of **BlockedLearning**. This is not just another LMS; it's a Web3-native educational platform designed with a "Glassmorphism" and "Neon" aesthetic to immerse users in the future of learning.

Built with **Next.js 15**, **TailwindCSS**, and **Framer Motion**, it features a seamless integration of on-chain identity (WalletConnect) and off-chain AI mentorship.

## ✨ Key Features

### 1. 🌌 Immersive UI/UX

- **Aurora Backgrounds**: Dynamic, shader-like background animations that react to the theme.
- **Glassmorphism**: Premium frosted glass effects on cards and modals.
- **Micro-interactions**: Smooth hover states and transitions powered by `framer-motion`.
- **Dark/Light Mode**: A carefully curated neon-dark mode and a vibrant-light mode.

### 2. 🤖 AI Mentor Integration ("CheckMate")

- **Context-Aware Chat**: The mentor knows exactly which module you are viewing.
- **Floating Interface**: An unobtrusive, always-available AI assistant.
- **Real-time Guidance**: Suggests next steps based on your progress.

### 3. 🔗 Web3 Native

- **WalletConnect**: Seamless login with any crypto wallet.
- **Token Gated**: Access courses based on on-chain ownership (mocked for MVP).
- **IP Registration**: Creators can upload courses that are automatically registered as IP on the **Camp Network**.

### 4. 📚 Course Experience

- **Theater Mode**: A distraction-free video player for immersive learning.
- **Interactive Curriculum**: Track progress module-by-module.
- **Creator Studio**: A multi-step editor for uploading content and minting IP.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [TailwindCSS](https://tailwindcss.com/) + CSS Variables
- **Animation**: [Framer Motion](https://www.framer.com/motion/) + [OGL](https://github.com/oframe/ogl) (for WebGL shaders)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Web3**: [Web3Modal](https://web3modal.com/) + [Wagmi](https://wagmi.sh/) + [Viem](https://viem.sh/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

1.  **Install Dependencies**

    ```bash
    npm install
    ```

2.  **Run Development Server**

    ```bash
    npm run dev
    ```

3.  **Open in Browser**
    Navigate to [http://localhost:3000](http://localhost:3000).

## 📂 Project Structure

```
app/
├── (routes)/          # Main application routes (Dashboard, Courses)
│   ├── dashboard/     # User progress & stats
│   ├── courses/       # Course player & details
│   └── creator/       # Course upload studio
├── api/               # Next.js API routes (proxies)
└── globals.css        # Global variables & tailwind directives

components/
├── ui/                # Reusable Shadcn UI components
├── course/            # Course-specific components (Player, List)
├── dashboard/         # Dashboard widgets (Grid, Stats)
├── creator/           # Upload wizard components
└── landing/           # Landing page sections

store/                 # Zustand state slices (User, Course, Mentor)
lib/                   # Utilities & Mock Data
```

## 🎨 Design System

We use a set of global CSS variables to maintain consistency.

- **Primary**: Neon Blue (`#00D5FF`) to Purple (`#6C2EFF`) gradients.
- **Background**: Deep space black for dark mode, crisp white for light mode.
- **Cards**: Translucent backgrounds with subtle borders.

---

_Built with ❤️ for the TechyJaunt × Camp Buildathon._
