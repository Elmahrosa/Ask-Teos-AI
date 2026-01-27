// LOCKED FILE (v0 shouldn't edit this file)

import { useState, useEffect } from "react";
import { PI_NETWORK_CONFIG, BACKEND_URLS } from "@/lib/system-config";

interface PiAuthResult {
  accessToken: string;
  user: {
    uid: string;
    username: string;
  };
}

declare global {
  interface Window {
    Pi: {
      init: (config: { version: string; sandbox?: boolean }) => Promise<void>;
      authenticate: (scopes: string[]) => Promise<PiAuthResult>;
    };
  }
}

// Function to dynamically load Pi SDK script
const loadPiSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    if (!PI_NETWORK_CONFIG.SDK_URL) {
      throw new Error("SDK URL is not set");
    }
    script.src = PI_NETWORK_CONFIG.SDK_URL;
    script.async = true;

    script.onload = () => {
      console.log("✅ Pi SDK script loaded successfully");
      resolve();
    };

    script.onerror = () => {
      console.error("❌ Failed to load Pi SDK script");
      reject(new Error("Failed to load Pi SDK script"));
    };

    document.head.appendChild(script);
  });
};

export const usePiNetworkAuthentication = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMessage, setAuthMessage] = useState("Initializing Pi Network...");
  const [piAccessToken, setPiAccessToken] = useState<string | null>(null);

  const authenticateAndLogin = async (): Promise<void> => {
    setAuthMessage("Authenticating with Pi Network...");
    console.log("Starting authentication...");
    const piAuthResult = await window.Pi.authenticate(["username", "roles"]);

    setAuthMessage("Logging in to backend...");
    const loginRes = await fetch(BACKEND_URLS.LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pi_auth_token: piAuthResult.accessToken }),
    });

    if (!loginRes.ok) {
      throw new Error(`Backend login failed with status: ${loginRes.status}`);
    }

    await loginRes.json();
    console.log("✅ Backend login successful");

    if (piAuthResult?.accessToken) {
      setPiAccessToken(piAuthResult.accessToken);
    }
  };

  const initializePiAndAuthenticate = async () => {
    try {
      // Step 1: Load Pi SDK script
      setAuthMessage("Loading Pi Network SDK...");
      await loadPiSDK();

      // Step 2: Verify Pi object is available
      if (typeof window.Pi === "undefined") {
        throw new Error("Pi object not available after script load");
      }

      // Step 3: Initialize Pi Network
      setAuthMessage("Initializing Pi Network...");
      await window.Pi.init({
        version: "2.0",
        sandbox: PI_NETWORK_CONFIG.SANDBOX,
      });

      // Step 4: Authenticate and login
      await authenticateAndLogin();

      // Step 5: Success
      setIsAuthenticated(true);
    } catch (err) {
      console.error("❌ Pi Network initialization failed:", err);
      setAuthMessage(
        "Failed to authenticate or login. Please refresh and try again."
      );
    }
  };

  useEffect(() => {
    initializePiAndAuthenticate();
  }, []);

  return {
    isAuthenticated,
    authMessage,
    piAccessToken,
    reinitialize: initializePiAndAuthenticate,
  };
};
