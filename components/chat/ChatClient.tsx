"use client";

import FormattedText from "./FormattedText";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ChatApiResponse = {
  success: boolean;
  reply?: string;
  message?: string;
};

const starterMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Assalamu alaikum. I can help with Pure Path Hajj and Umrah packages, documents, hotels, flights, restaurants, and travel support.",
  },
];

const promptChips = [
  "What documents do I need for Umrah?",
  "Compare Hajj and Umrah packages",
  "Do you help with hotels near Haram?",
];

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function ChatClient() {
  const [messages, setMessages] = useState<ChatMessage[]>(starterMessages);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const box = messagesEndRef.current?.parentElement;
    box?.scrollTo({ top: box.scrollHeight, behavior: "smooth" });
  }, [messages, isSending]);

  async function sendMessage(messageText: string) {
    const content = messageText.trim();

    if (!content || isSending) {
      return;
    }

    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      content,
    };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({
            role,
            content,
          })),
        }),
      });

      const data = (await response.json()) as ChatApiResponse;

      if (!response.ok || !data.success || !data.reply) {
        throw new Error(data.message ?? "Chat request failed.");
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: createId(),
          role: "assistant",
          content: data.reply!,
        },
      ]);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "The assistant is unavailable right now.";

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: createId(),
          role: "assistant",
          content: message,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(input);
    }
  }

  return (
    <section className="relative z-10 mx-auto flex min-h-[calc(100svh-5rem)] w-full max-w-7xl flex-col px-5 pb-6 pt-28 sm:px-8 lg:px-12">
      <div className="grid flex-1 gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-stretch">
        <aside className="flex flex-col justify-end rounded-lg border border-[#d9e3df] bg-white/86 p-6 shadow-sm backdrop-blur">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#075f42]">
            Pure Path Assist
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-[#202020] sm:text-5xl">
            Plan the journey with a clear next step
          </h1>
          <p className="mt-5 text-base leading-7 text-[#40505a]">
            Get focused help for Hajj, Umrah, documents, hotels, flights,
            restaurants, transportation, and pilgrim support.
          </p>

          <div className="mt-8 grid gap-3">
            {promptChips.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => void sendMessage(prompt)}
                disabled={isSending}
                className="min-h-12 rounded-lg border border-[#d9e3df] bg-[#f8fbfb] px-4 text-left text-sm font-semibold text-[#17211f] transition enabled:hover:border-[#d89c34] enabled:hover:bg-[#fff7e8] enabled:hover:text-[#b7791f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {prompt}
              </button>
            ))}
          </div>
        </aside>

        <div className="flex min-h-155 flex-col overflow-hidden rounded-lg border border-[#cfdcd6] bg-[#fbfbfa] shadow-xl">
          <div className="flex items-center justify-between border-b border-[#d9e3df] bg-white px-5 py-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#075f42]">
                Chat
              </p>
              <p className="mt-1 text-sm text-[#40505a]">
                Project-scoped pilgrimage planning
              </p>
            </div>
            <span className="rounded-full border border-[#d9e3df] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#075f42]">
              Gemini
            </span>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
            {messages.map((message) => (
              <article
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[88%] whitespace-pre-wrap rounded-lg px-4 py-3 text-sm leading-6 sm:max-w-[76%] sm:text-base ${
                    message.role === "user"
                      ? "bg-[#075f42] text-white"
                      : "border border-[#d9e3df] bg-white text-[#17211f]"
                  }`}
                >
                  <FormattedText text={message.content} />
                </div>
              </article>
            ))}

            {isSending && (
              <div className="flex justify-start">
                <div className="rounded-lg border border-[#d9e3df] bg-white px-4 py-3 text-sm font-semibold text-[#40505a]">
                  Thinking...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-[#d9e3df] bg-white p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <label htmlFor="chat-message" className="sr-only">
                Message
              </label>
              <textarea
                id="chat-message"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={1200}
                rows={3}
                placeholder="Ask about Pure Path packages, documents, hotels, flights..."
                className="min-h-24 flex-1 resize-none rounded-lg border border-[#cfdcd6] bg-[#fbfbfa] px-4 py-3 text-base text-[#17211f] outline-none transition placeholder:text-[#728079] focus:border-[#075f42] focus:ring-4 focus:ring-[#075f42]/15"
              />
              <button
                type="submit"
                disabled={!input.trim() || isSending}
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#075f42] px-7 text-base font-bold text-white transition enabled:hover:bg-[#d89c34] enabled:hover:text-[#17211f] focus:outline-none focus:ring-4 focus:ring-[#075f42]/25 disabled:cursor-not-allowed disabled:bg-[#8ca69b]"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
