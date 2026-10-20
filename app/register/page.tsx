"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/PasswordInput";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message || "Registration failed.");
      setLoading(false);
      return;
    }

    setMessage("Registration successful.");

    router.push("/login");
  }

  return (
    <main className="pure-path-pattern flex min-h-screen items-center justify-center border-t border-[#d89c34] px-4 py-16">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-lg border border-white/18 bg-white/95 p-6 shadow-2xl shadow-black/20 backdrop-blur"
      >
        <h1 className="mb-6 text-2xl font-bold text-[#075f42]">Register</h1>

        {message && (
          <p className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
            {message}
          </p>
        )}

        <label className="mb-2 block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
          className="mb-4 w-full rounded border border-[#075f42]/20 px-3 py-2 text-gray-900 outline-none transition focus:border-[#d89c34] focus:ring-2 focus:ring-[#d89c34]/25"
          placeholder="Enter name"
        />

        <label className="mb-2 block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
          className="mb-4 w-full rounded border border-[#075f42]/20 px-3 py-2 text-gray-900 outline-none transition focus:border-[#d89c34] focus:ring-2 focus:ring-[#d89c34]/25"
          placeholder="Enter email"
        />

        <label className="mb-2 block text-sm font-medium text-gray-700">
          Password
        </label>
        <PasswordInput
                    value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
          className="mb-4"
          placeholder="Enter password"
        />

        <label className="mb-2 block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <PasswordInput
                    value={form.confirmPassword}
          onChange={(e) =>
            setForm({
              ...form,
              confirmPassword: e.target.value,
            })
          }
          className="mb-6"
          placeholder="Confirm password"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-[#075f42] px-4 py-2 font-medium text-white transition enabled:hover:bg-[#d89c34] enabled:hover:text-[#17211f] disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>
    </main>
  );
}
