<<<<<<< HEAD
# Internship-Tracker

A simple web app built with Next.js, TypeScript, and TailwindCSS to help track internship applications.
The app supports sorting, filtering, and optional AI-powered categorization of applications.

---------------------------------------------------------------------------------------------------------------------------------------------
**Features**

Add, edit, and delete internship applications
Track application status (Applied, Interviewing, Rejected)
Sort by date (newest/oldest first)
Filter by status, category, and subcategory
Dark / light mode toggle
Local storage persistence (data stays even after refresh)
(Optional) AI-powered categorization with OpenAI API

---------------------------------------------------------------------------------------------------------------------------------------------

**START**
# 1) Install
npm install

# 2) Run (choose one mode below, then:)
npm run dev
Create .env.local in the project root with one of the following:

A) MOCK (free, fixed output)
USE_MOCK_AI=true

B) RULES (free, keyword-based)
USE_RULES=true

C) OPENAI (paid, real model)
USE_MOCK_AI=false
USE_RULES=false
OPENAI_API_KEY=sk-...your-key...

Restart npm run dev after changing env values.
---------------------------------------------------------------------------------------------------------------------------------------------
**How It Works**

The UI posts { title, description, major } to /api/classify.
The API route picks a mode based on env:
MOCK: returns a constant label (great for screenshots and demos).
RULES: simple keyword matcher (no external calls).
OPENAI: calls OpenAI (gpt-4o-mini) and returns compact JSON.
The result (category, subcategory, confidence) is saved with the application and shown on the card.

<img width="1440" height="816" alt="Screenshot 2025-08-17 at 2 06 56 PM" src="https://github.com/user-attachments/assets/5e957127-d8cd-48bf-98f4-3bd514e6a13a" />

---------------------------------------------------------------------------------------------------------------------------------------------
**Why This Project**

Project highlights my skills in:

Frontend development with Next.js & TypeScript
State management with React hooks
Data persistence using local storage
Clean UI with TailwindCSS
Optional AI integration via API
=======
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
>>>>>>> 1f52e33 (Organized project structure under src/app and moved assets to public)
