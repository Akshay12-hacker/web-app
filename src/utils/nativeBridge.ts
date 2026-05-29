/**
 * Native Bridge Utility
 * This handles communication between the Next.js Web App and the React Native Shell.
 */

export interface NativeResponse {
  messageId: string;
  data?: unknown;
  error?: string;
}

export type NativePayload = Record<string, unknown>;

export const invokeNative = <T = unknown>(action: string, payload: NativePayload = {}): Promise<T> => {
  return new Promise((resolve, reject) => {
    // 1. Check if we are in a browser environment and the bridge exists
    if (typeof window === 'undefined') {
      return reject(new Error("Native bridge is only available in the browser."));
    }

    if (!window.ReactNativeWebView) {
      console.warn("ReactNativeWebView bridge not found. Are you running in a standard browser?");
      return reject(new Error("Native bridge not found."));
    }

    // 2. Generate a unique ID for this request/response cycle
    const messageId = Math.random().toString(36).substring(7);

    // 3. Set up a listener for the native response
    const handleNativeResponse = (event: MessageEvent<string | NativeResponse>) => {
      try {
        // Handle both stringified and object messages depending on WebView config
        const response: NativeResponse = typeof event.data === 'string' 
          ? JSON.parse(event.data) 
          : event.data;

        if (response.messageId === messageId) {
          // Remove listener once message is received
          window.removeEventListener('message', handleNativeResponse);

          if (response.error) {
            reject(new Error(response.error));
          } else {
            resolve(response.data as T);
          }
        }
      } catch {
        // Ignore non-JSON messages or unrelated messages
      }
    };

    window.addEventListener('message', handleNativeResponse);

    // 4. Post the message to the Native Shell
    window.ReactNativeWebView.postMessage(JSON.stringify({
      messageId,
      action,
      payload
    }));

    // 5. (Optional) Set a timeout to prevent hanging promises
    setTimeout(() => {
      window.removeEventListener('message', handleNativeResponse);
      reject(new Error(`Native action "${action}" timed out after 10s.`));
    }, 10000);
  });
};

/**
 * Global Window interface extension for TypeScript
 */
declare global {
  interface Window {
    ReactNativeWebView: {
      postMessage: (message: string) => void;
    };
    HomeOrbitNative?: {
      initialData: {
        session?: unknown;
        user?: unknown;
        config?: unknown;
      };
      isNative: boolean;
      platform: string;
    };
  }
}
