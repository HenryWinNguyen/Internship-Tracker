# Internship-Tracker

A Next.js app to track internship applications and auto-categorize them (free local modes or optional OpenAI).

---------------------------------------------------------------------------------------------------------------------------------------------
**Features**

Add, edit, and delete internship applications
Category → Subcategory badges on each card
Filters: Status, Category, Subcategory + sorting
Persistent storage (localStorage) — no backend DB required
Optional application link button per entry
Dark/light toggle
Pluggable AI backend with three modes:
MOCK – fixed result for UI demos (free)
RULES – lightweight keyword classifier (free)
OPENAI – real model classification via OpenAI API (paid/optional)
Tech Stack
Next.js (App Router) + TypeScript
Tailwind CSS
Local Persistance with localStorage
API route: app/api/classify/route.ts

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

