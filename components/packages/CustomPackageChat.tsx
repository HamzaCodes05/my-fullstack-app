"use client";

import FormattedText from "@/components/chat/FormattedText";
import { FormEvent, useEffect, useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

const welcome: Message = {
  role: "assistant",
  content:
    "Assalamu alaikum. Tell me about your trip and I will build a custom package for you. Is this for Hajj or Umrah, and when are you hoping to travel?",
};

const steps = [
  ["1", "Tell us your trip", "Hajj or Umrah, dates, and who is travelling."],
  ["2", "Set your preferences", "Budget, hotel distance, meals, and flights."],
  ["3", "Get your package", "A tailored plan Pure Path confirms with you."],
];

const quickStarts = [
  "10-day Umrah for 4 people",
  "Budget Hajj package for a couple",
  "Senior-friendly Umrah near Haram",
];

export function CustomPackageChat() {
  const [messages, setMessages] = useState<Message[]>([welcome]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight });
  }, [messages, isSending]);

  async function send(event?: FormEvent, text = input) {
    event?.preventDefault();
    const content = text.trim();
    if (!content || isSending) return;

    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setIsSending(true);

    let reply: string;
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "custom-package", messages: next }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message);
      reply = data.reply;
    } catch (error) {
      reply =
        error instanceof Error && error.message
          ? error.message
          : "The assistant is unavailable right now.";
    }
    setMessages((current) => [...current, { role: "assistant", content: reply }]);
    setIsSending(false);
  }

  return (
    <section className="bg-white px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="flex flex-col rounded-2xl bg-[#075f42] p-7 text-white sm:p-9">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f0c978]">
            Custom Package
          </p>
          <h2 className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">
            Design your own journey with AI
          </h2>
          <p className="mt-4 leading-7 text-white/80">
            Not seeing the right fit? Chat with Pure Path Assist and get a
            package built around your dates, budget, and group.
          </p>

          <ol className="mt-8 space-y-5">
            {steps.map(([n, title, text]) => (
              <li key={n} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d89c34] text-sm font-bold text-[#17211f]">
                  {n}
                </span>
                <div>
                  <p className="font-bold">{title}</p>
                  <p className="text-sm leading-6 text-white/75">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </aside>

        <div className="flex flex-col overflow-hidden rounded-2xl border border-[#cfdcd6] bg-[#fbfbfa] shadow-xl">
          <div className="flex items-center gap-3 border-b border-[#d9e3df] bg-white px-5 py-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#075f42] font-serif text-lg text-white">
              P
            </span>
            <div className="flex-1">
              <p className="font-bold leading-tight text-[#17211f]">
                Pure Path Assist
              </p>
              <p className="flex items-center gap-1.5 text-xs text-[#40505a]">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Package designer
              </p>
            </div>
          </div>

          <div
            ref={boxRef}
            className="h-96 space-y-4 overflow-y-auto bg-[#f4f8f6] p-4 sm:p-6"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm sm:text-base ${
                    m.role === "user"
                      ? "rounded-br-sm bg-[#075f42] text-white"
                      : "rounded-bl-sm border border-[#d9e3df] bg-white text-[#17211f]"
                  }`}
                >
                  <FormattedText text={m.content} />
                </div>
              </div>
            ))}
            {isSending && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm border border-[#d9e3df] bg-white px-4 py-3 text-sm font-semibold text-[#40505a]">
                  Designing your package...
                </div>
              </div>
            )}
          </div>

          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 border-t border-[#d9e3df] bg-white px-4 pt-4">
              {quickStarts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => void send(undefined, q)}
                  className="rounded-full border border-[#d9e3df] bg-[#f8fbfb] px-3.5 py-1.5 text-sm font-semibold text-[#17211f] transition hover:border-[#d89c34] hover:bg-[#fff7e8] hover:text-[#b7791f]"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={send}
            className="flex gap-3 border-t border-[#d9e3df] bg-white p-4"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={1200}
              placeholder="e.g. 10-day Umrah for 4 people in March"
              className="min-w-0 flex-1 rounded-full border border-[#cfdcd6] bg-[#fbfbfa] px-5 py-3 outline-none focus:border-[#075f42] focus:ring-4 focus:ring-[#075f42]/15"
            />
            <button
              type="submit"
              disabled={!input.trim() || isSending}
              className="rounded-full bg-[#075f42] px-7 font-bold text-white transition enabled:hover:bg-[#d89c34] enabled:hover:text-[#17211f] disabled:bg-[#8ca69b]"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
