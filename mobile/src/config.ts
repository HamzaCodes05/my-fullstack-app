import Constants from "expo-constants";
import { NativeModules, Platform } from "react-native";

declare const process: {
  env?: {
    EXPO_PUBLIC_API_BASE_URL?: string;
    EXPO_PUBLIC_API_HOST?: string;
    EXPO_PUBLIC_API_PORT?: string;
  };
};

const API_PORT = process.env?.EXPO_PUBLIC_API_PORT ?? "3000";

function getMetroHost() {
  // "192.168.x.x:8081" -- the dev machine Expo is serving from.
  const hostUri = Constants.expoConfig?.hostUri ?? Constants.linkingUri;
  const fromExpo = hostUri?.match(/^(?:[a-z][a-z\d+.-]*:\/\/)?([^/:?]+)/i)?.[1];

  if (fromExpo) {
    return fromExpo;
  }

  const scriptURL = NativeModules.SourceCode?.scriptURL;

  if (typeof scriptURL !== "string") {
    return null;
  }

  return scriptURL.match(/^[a-z][a-z\d+.-]*:\/\/([^/:]+)/i)?.[1] ?? null;
}

function normalizeHost(host: string) {
  if (
    Platform.OS === "android" &&
    (host === "localhost" || host === "127.0.0.1")
  ) {
    return "10.0.2.2";
  }

  return host;
}

function isLocalApiHost(host: string) {
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "10.0.2.2" ||
    host.startsWith("10.") ||
    host.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(host)
  );
}

const explicitBaseUrl = process.env?.EXPO_PUBLIC_API_BASE_URL;
const explicitHost = process.env?.EXPO_PUBLIC_API_HOST;
const metroHost = getMetroHost();
const apiHost = normalizeHost(
  explicitHost ?? (metroHost && isLocalApiHost(metroHost) ? metroHost : ""),
);

export const API_BASE_URL = explicitBaseUrl ?? `http://${apiHost}:${API_PORT}`;
