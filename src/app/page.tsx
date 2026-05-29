"use client";

import { invokeNative } from "@/utils/nativeBridge";

export default function Home() {
  const handleTestBridge = async (action: string) => {
    try {
      const result = await invokeNative(action);
      alert(`Native Result: ${JSON.stringify(result, null, 2)}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      alert(`Error: ${message}`);
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-md mx-auto">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">HomeOrbit Hybrid</h1>
        <p className="text-gray-500 mt-2">Bridge Testing Dashboard</p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        <button
          onClick={() => handleTestBridge('GET_DEVICE_INFO')}
          className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold shadow-sm active:scale-95 transition-transform"
        >
          Get Device Info
        </button>

        <button
          onClick={() => handleTestBridge('GET_LOCATION')}
          className="w-full py-4 bg-green-600 text-white rounded-xl font-semibold shadow-sm active:scale-95 transition-transform"
        >
          Request Location
        </button>

        <button
          onClick={() => handleTestBridge('TAKE_PHOTO')}
          className="w-full py-4 bg-purple-600 text-white rounded-xl font-semibold shadow-sm active:scale-95 transition-transform"
        >
          Launch Native Camera
        </button>

        <button
          onClick={() => handleTestBridge('HAPTIC_FEEDBACK')}
          className="w-full py-4 bg-orange-600 text-white rounded-xl font-semibold shadow-sm active:scale-95 transition-transform"
        >
          Test Haptic Feedback
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded-xl">
        <h2 className="text-sm font-medium text-gray-500 uppercase mb-2">Bridge Status</h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-800">Ready for Native Commands</span>
        </div>
      </div>
    </div>
  );
}
