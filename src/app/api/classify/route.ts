// app/api/classify/route.ts
// Internship classification endpoint
// Supports three modes:
//  - MOCK   : fixed response (for UI demos, free)
//  - RULES  : keyword-based classifier (free, local)
//  - OPENAI : real AI classification (requires OpenAI API key & billing)

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

// ----- MODE SELECTION (via .env.local) -----
const USE_MOCK_AI = process.env.USE_MOCK_AI === "true";
const USE_RULES = process.env.USE_RULES === "true";

// Simple keyword-based rules (extend as needed)
function rulesClassify(title: string, description: string, major: string) {
  const text = `${title} ${description}`.toLowerCase();
  const hit = (...keys: string[]) => keys.some(k => text.includes(k));

  // CS/Software majors
  if (/computer|cs|software/i.test(major)) {
    if (hit("react", "frontend", "ui", "css")) return { category: "Software Engineering", subcategory: "Frontend", confidence: 0.8 };
    if (hit("node", "api", "backend", "java", "spring")) return { category: "Software Engineering", subcategory: "Backend", confidence: 0.85 };
    if (hit("sql", "etl", "pipeline", "spark", "warehouse")) return { category: "Data", subcategory: "Data Engineering", confidence: 0.85 };
    if (hit("ml", "tensorflow", "pytorch", "nlp")) return { category: "Data", subcategory: "Machine Learning", confidence: 0.8 };
    if (hit("security", "threat", "soc", "incident")) return { category: "Cybersecurity", subcategory: "Security Analyst", confidence: 0.8 };
  }

  // Finance majors
  if (/finance/i.test(major)) {
    if (hit("m&a", "mergers", "acquisition")) return { category: "Investment Banking", subcategory: "M&A", confidence: 0.8 };
    if (hit("fp&a", "budget", "forecast")) return { category: "Corporate Finance", subcategory: "FP&A", confidence: 0.8 };
    if (hit("audit", "tax")) return { category: "Accounting", subcategory: hit("tax") ? "Tax" : "Audit", confidence: 0.75 };
  }

  return { category: "Other", subcategory: "Other", confidence: 0.4 };
}

// ---------- GET (health check) ----------
export async function GET() {
  const key = process.env.OPENAI_API_KEY || "";
  return NextResponse.json({
    mode: USE_MOCK_AI ? "MOCK" : USE_RULES ? "RULES" : "OPENAI",
    hasKey: Boolean(key),
  });
}

// ---------- POST (classification) ----------
export async function POST(req: NextRequest) {
  const { title, description, major } = await req.json();
  if (!title) {
    return NextResponse.json({ error: "Missing title" }, { status: 400 });
  }

  // MOCK mode: always return the same result
  if (USE_MOCK_AI) {
    return NextResponse.json({
      category: "Software Engineering",
      subcategory: "Backend",
      confidence: 0.97,
      source: "mock",
    });
  }

  // RULES mode: keyword-based classifier
  if (USE_RULES) {
    const r = rulesClassify(title, description || "", major || "");
    return NextResponse.json({ ...r, source: "rules" });
  }

  // OPENAI mode (requires key + billing)
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ category: "Other", subcategory: "Other", confidence: 0, source: "no_api_key" });
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      max_tokens: 40,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "Return only JSON {\"category\":\"...\",\"subcategory\":\"...\",\"confidence\":0..1}" },
        { role: "user", content: `Major: ${major || "Unknown"}\nTitle: ${title}\nDescription: ${description || "(none)"}` },
      ],
    });

    const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}");
    return NextResponse.json({
      category: parsed.category || "Other",
      subcategory: parsed.subcategory || "Other",
      confidence: parsed.confidence ?? 0.5,
      source: "ai",
    });
  } catch (err: any) {
    // On error, fallback to rules
    const r = rulesClassify(title, description || "", major || "");
    return NextResponse.json({ ...r, source: "rules_fallback", error: String(err?.message || err) });
  }
}
