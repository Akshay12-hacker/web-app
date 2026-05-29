"use client";

import { useEffect, useState, createContext, useContext } from "react";

interface NativeContextType {
  isNative: boolean;
  platform: string;
  initialData: NativeInitialData | null;
}

export interface NativeInitialData {
  session?: unknown;
  user?: unknown;
  config?: unknown;
}

const NativeContext = createContext<NativeContextType>({
  isNative: false,
  platform: "web",
  initialData: null,
});

export const useNative = () => useContext(NativeContext);

export function NativeProvider({ children }: { children: React.ReactNode }) {
  const [nativeState] = useState<NativeContextType>(() => {
    if (typeof window === "undefined" || !window.HomeOrbitNative) {
      return {
        isNative: false,
        platform: "web",
        initialData: null,
      };
    }

    return {
      isNative: window.HomeOrbitNative.isNative,
      platform: window.HomeOrbitNative.platform,
      initialData: window.HomeOrbitNative.initialData,
    };
  });

  useEffect(() => {
    if (nativeState.initialData?.session) {
      console.log("Native Session Detected:", nativeState.initialData.session);
      // Here you would typically set your web app's auth state or cookie.
    }
  }, [nativeState.initialData]);

  return (
    <NativeContext.Provider value={nativeState}>
      {children}
    </NativeContext.Provider>
  );
}
