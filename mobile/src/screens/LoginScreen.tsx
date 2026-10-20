import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { useAuth } from "../auth/AuthContext";
import { API_BASE_URL } from "../config";
import type { ScreenProps } from "../types";
import { Card, PasswordInput, PrimaryButton, ScreenScroll } from "../components/ui";

export function LoginScreen({ onNavigate }: ScreenProps) {
  const { login } = useAuth();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (loading) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // On success the auth gate swaps to the signed-in shell automatically.
      await login(form.username, form.password);
    } catch (error) {
      setMessage(
        error instanceof Error && error.message
          ? /fetch|network/i.test(error.message)
            ? `Could not reach ${API_BASE_URL} (${error.message}).`
            : error.message
          : `Could not reach ${API_BASE_URL}. Start the Next.js app before testing auth.`,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenScroll className="bg-gray-100">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="min-h-[560px] justify-center px-5 py-11"
      >
        <Card tone="white" borderTone="white" className="gap-[18px]">
          <Text className="text-2xl font-extrabold leading-[30px] text-[#111827]">
            Login
          </Text>

          {message ? (
            <Text className="rounded-lg bg-pure-dangerBg p-3 text-sm font-bold leading-5 text-pure-danger">
              {message}
            </Text>
          ) : null}

          <View className="gap-2">
            <Text className="text-sm font-extrabold text-pure-ink">Email</Text>
            <TextInput
              value={form.username}
              onChangeText={(username) =>
                setForm((current) => ({ ...current, username }))
              }
              placeholder="Enter email"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              className="min-h-[52px] rounded-lg border border-[#cfd9d5] bg-pure-white px-3.5 text-base text-pure-ink placeholder:text-[#7a8782]"
            />
          </View>

          <View className="gap-2">
            <Text className="text-sm font-extrabold text-pure-ink">
              Password
            </Text>
            <PasswordInput
              value={form.password}
              onChangeText={(password) =>
                setForm((current) => ({ ...current, password }))
              }
              placeholder="Enter password"
              className="min-h-[52px] rounded-lg border border-[#cfd9d5] bg-pure-white px-3.5 text-base text-pure-ink placeholder:text-[#7a8782]"
              onSubmitEditing={handleSubmit}
            />
          </View>

          <PrimaryButton
            label={loading ? "Logging in..." : "Login"}
            onPress={handleSubmit}
            variant="black"
            className="min-h-[46px] rounded-md"
          />

          <Pressable
            accessibilityRole="button"
            onPress={() => onNavigate("register")}
            className="min-h-11 items-center justify-center active:opacity-70"
          >
            <Text className="text-center text-sm text-pure-muted">
              Don&apos;t have an account?{" "}
              <Text className="font-black text-pure-green">Register</Text>
            </Text>
          </Pressable>
        </Card>
      </KeyboardAvoidingView>
    </ScreenScroll>
  );
}
