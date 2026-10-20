type ClientChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type GeminiPart = {
  text?: string;
};

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: GeminiPart[];
    };
  }>;
  error?: {
    message?: string;
  };
};

const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-3.5-flash";
const MAX_MESSAGE_LENGTH = 1200;
const MAX_HISTORY_MESSAGES = 12;

const systemInstruction = `
You are Pure Path Assist, the website chat assistant for the Pure Path Hajj and Umrah travel project.

Scope:
- Only answer questions directly related to Pure Path, Hajj or Umrah travel planning, Pure Path services, packages, visas, documents, flights, hotels, restaurants, transport, airport assistance, pilgrim guidance, travel insurance, or using this website.
- If the user asks about anything outside that scope, politely say you can only help with Pure Path pilgrimage travel planning.
- Do not claim live prices, exact availability, legal approval, medical advice, or religious rulings. For those, advise contacting Pure Path, an official authority, a medical professional, or a qualified scholar as appropriate.

Project context:
- Pure Path offers premium Hajj and Umrah pilgrimage planning.
- Core services include Umrah packages, Hajj programs, visa and documentation support, travel insurance, airport assistance, and pilgrim guidance.
- Umrah packages are usually 9-12 days with hotels in Makkah and Madinah, transportation, and guided ziyarah tours.
- Hajj programs are usually 20-30 days with Mina and Arafah arrangements, experienced mutawwif support, and movement management.
- Visa and documentation support usually includes fast processing, document verification, and family or senior assistance.
- The website includes pages for About, Packages, Services, Documents, Login, Register, and live package-related listings for hotels, restaurants, and flights.

Tone:
- Be warm, concise, practical, and clear.
- Ask one focused follow-up question when it helps move a booking or planning conversation forward.
`.trim();

const customPackageInstruction = `
Custom package mode:
- You are helping the pilgrim design a custom Hajj or Umrah package.
- Gather, one or two questions at a time: Hajj or Umrah, travel dates, trip length, number of travelers (adults, children, seniors), departure city, budget, hotel preference (distance to Haram, star level) in Makkah and Madinah, meals, flights, and special needs.
- Once you have enough details, reply with a clear package proposal: a short title, day split between Makkah and Madinah, hotels, flights, meals, transport, ziyarah, and support. Say prices are indicative and Pure Path will confirm availability and final pricing.
- End the proposal by inviting them to contact Pure Path to book.
`.trim();

function isClientChatMessage(value: unknown): value is ClientChatMessage {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    (candidate.role === "user" || candidate.role === "assistant") &&
    typeof candidate.content === "string" &&
    candidate.content.trim().length > 0
  );
}

function sanitizeMessages(value: unknown) {
  if (!Array.isArray(value)) {
    return null;
  }

  const messages = value
    .filter(isClientChatMessage)
    .slice(-MAX_HISTORY_MESSAGES)
    .map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [
        {
          text: message.content.trim().slice(0, MAX_MESSAGE_LENGTH),
        },
      ],
    }));

  const hasUserMessage = messages.some((message) => message.role === "user");

  return hasUserMessage ? messages : null;
}

function getGeminiReply(data: GeminiResponse) {
  return (
    data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("")
      .trim() ?? ""
  );
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.API_Key;

    if (!apiKey) {
      return Response.json(
        {
          success: false,
          message: "GEMINI_API_KEY is not configured on the server.",
        },
        { status: 500 },
      );
    }

    const body = (await request.json()) as Record<string, unknown>;
    const contents = sanitizeMessages(body.messages);
    const instruction =
      body.mode === "custom-package"
        ? `${systemInstruction}\n\n${customPackageInstruction}`
        : systemInstruction;

    if (!contents) {
      return Response.json(
        {
          success: false,
          message: "Send at least one user message.",
        },
        { status: 400 },
      );
    }

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: instruction }],
          },
          contents,
          generationConfig: {
            maxOutputTokens: body.mode === "custom-package" ? 1500 : 700,
          },
        }),
      },
    );

    const data = (await geminiResponse.json()) as GeminiResponse;

    if (!geminiResponse.ok) {
      return Response.json(
        {
          success: false,
          message:
            data.error?.message ?? "Gemini could not process the chat request.",
        },
        { status: geminiResponse.status },
      );
    }

    const reply = getGeminiReply(data);

    if (!reply) {
      return Response.json(
        {
          success: false,
          message: "Gemini returned an empty reply.",
        },
        { status: 502 },
      );
    }

    return Response.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to send chat message.",
      },
      { status: 500 },
    );
  }
}
