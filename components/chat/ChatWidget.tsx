"use client";

import FormattedText from "./FormattedText";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

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
    id: "welcome-widget",
    role: "assistant",
    content:
      "Assalamu alaikum. Ask me about Pure Path packages, documents, hotels, flights, or pilgrim support.",
  },
];

const promptChips = [
  "Documents for Umrah",
  "Hajj package help",
  "Hotels near Haram",
];

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function ChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(starterMessages);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      const box = messagesEndRef.current?.parentElement;
      box?.scrollTo({ top: box.scrollHeight, behavior: "smooth" });
    }
  }, [isOpen, messages, isSending]);

  if (pathname === "/chat") {
    return null;
  }

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
    setIsOpen(true);
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
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {isOpen && (
        <section
          aria-label="Pure Path chat popup"
          className="mb-4 flex h-[min(640px,calc(100svh-7rem))] w-[calc(100vw-2rem)] max-w-105 flex-col overflow-hidden rounded-lg border border-[#cfdcd6] bg-[#fbfbfa] shadow-2xl"
        >
          <div className="flex min-h-16 items-center justify-between gap-3 border-b border-[#d9e3df] bg-white px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold uppercase tracking-[0.14em] text-[#075f42]">
                Pure Path Assist
              </p>
              <p className="truncate text-xs text-[#40505a]">
                Pilgrimage planning chat
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="grid size-10 shrink-0 place-items-center rounded-full border border-[#d9e3df] text-[#17211f] transition hover:border-[#d89c34] hover:bg-[#fff7e8] hover:text-[#b7791f] focus:outline-none focus:ring-4 focus:ring-[#075f42]/20"
              aria-label="Close chat"
              title="Close chat"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.length === 1 && (
              <div className="grid gap-2">
                {promptChips.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => void sendMessage(prompt)}
                    disabled={isSending}
                    className="min-h-10 rounded-lg border border-[#d9e3df] bg-white px-3 text-left text-sm font-semibold text-[#17211f] transition enabled:hover:border-[#d89c34] enabled:hover:bg-[#fff7e8] enabled:hover:text-[#b7791f] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {messages.map((message) => (
              <article
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[86%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm leading-6 ${
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
                <div className="rounded-lg border border-[#d9e3df] bg-white px-3 py-2 text-sm font-semibold text-[#40505a]">
                  Thinking...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-[#d9e3df] bg-white p-3"
          >
            <div className="flex items-end gap-2">
              <label htmlFor="chat-widget-message" className="sr-only">
                Message
              </label>
              <textarea
                id="chat-widget-message"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={1200}
                rows={2}
                placeholder="Ask Pure Path..."
                className="min-h-12 flex-1 resize-none rounded-lg border border-[#cfdcd6] bg-[#fbfbfa] px-3 py-2 text-sm text-[#17211f] outline-none transition placeholder:text-[#728079] focus:border-[#075f42] focus:ring-4 focus:ring-[#075f42]/15"
              />
              <button
                type="submit"
                disabled={!input.trim() || isSending}
                className="grid size-12 shrink-0 place-items-center rounded-lg bg-[#075f42] text-white transition enabled:hover:bg-[#d89c34] enabled:hover:text-[#17211f] focus:outline-none focus:ring-4 focus:ring-[#075f42]/25 disabled:cursor-not-allowed disabled:bg-[#8ca69b]"
                aria-label="Send message"
                title="Send message"
              >
                <SendIcon />
              </button>
            </div>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="grid size-16 place-items-center rounded-full bg-[#075f42] text-white shadow-xl ring-4 ring-white transition hover:bg-[#d89c34] hover:text-[#17211f] focus:outline-none focus:ring-[#d89c34]/45"
        aria-label={isOpen ? "Close Pure Path chat" : "Open Pure Path chat"}
        title={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </button>
    </div>
  );
}

function ChatIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-8"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M21 12a8 8 0 0 1-8 8H7l-4 3 1.4-5A8 8 0 1 1 21 12Z" />
      <path d="M8 12h.01" />
      <path d="M12 12h.01" />
      <path d="M16 12h.01" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}
