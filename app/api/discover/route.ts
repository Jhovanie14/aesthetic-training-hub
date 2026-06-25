import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { Specialism } from "@/types";
import {
  DISCOVER_SPECIALISMS,
  keywordFallback,
  type DiscoverResult,
} from "@/lib/discover";

const SYSTEM = `You map a student's natural-language description of what they want to learn in aesthetics to a controlled list of clinical specialisms.

Rules:
- Only choose from the specialisms provided in the tool schema.
- Return the most relevant specialisms first.
- Return an empty list if nothing genuinely matches — do not guess.
- The student describes an outcome (e.g. "make clients look more rested"); translate it into the technique that achieves it.`;

function isSpecialism(value: unknown): value is Specialism {
  return (
    typeof value === "string" &&
    (DISCOVER_SPECIALISMS as string[]).includes(value)
  );
}

export async function POST(request: Request): Promise<Response> {
  let query = "";
  try {
    const body = await request.json();
    query = typeof body?.query === "string" ? body.query.trim() : "";
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!query) {
    return NextResponse.json({ error: "Empty query." }, { status: 400 });
  }

  // No key configured (e.g. a fresh checkout) — degrade gracefully.
  if (!process.env.ANTHROPIC_API_KEY) {
    const result: DiscoverResult = {
      specialisms: keywordFallback(query),
      source: "fallback",
    };
    return NextResponse.json(result);
  }

  try {
    const client = new Anthropic();

    const message = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 256,
      system: SYSTEM,
      tools: [
        {
          name: "set_specialisms",
          description:
            "Record the specialisms that best match the student's described learning goal.",
          input_schema: {
            type: "object",
            properties: {
              specialisms: {
                type: "array",
                description: "Matching specialisms, most relevant first.",
                items: { type: "string", enum: DISCOVER_SPECIALISMS },
              },
            },
            required: ["specialisms"],
            additionalProperties: false,
          },
        },
      ],
      tool_choice: { type: "tool", name: "set_specialisms" },
      messages: [{ role: "user", content: query }],
    });

    const toolUse = message.content.find((block) => block.type === "tool_use");
    const raw =
      toolUse && "input" in toolUse
        ? (toolUse.input as { specialisms?: unknown }).specialisms
        : undefined;

    const validated = Array.isArray(raw) ? raw.filter(isSpecialism) : [];
    // De-duplicate while preserving the model's ordering.
    const specialisms = [...new Set(validated)];

    const result: DiscoverResult = { specialisms, source: "llm" };
    return NextResponse.json(result);
  } catch {
    // Any model/transport failure falls back to the local matcher so the
    // feature never hard-breaks the page.
    const result: DiscoverResult = {
      specialisms: keywordFallback(query),
      source: "fallback",
    };
    return NextResponse.json(result);
  }
}
