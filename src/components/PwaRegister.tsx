"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PwaRegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    ) {
      setIsInstalled(true);
      return;
    }

    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[PWA] Service Worker registered:", reg.scope);
        })
        .catch((err) => {
          console.error("[PWA] Service Worker registration failed:", err);
        });
    }

    // Capture install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Check if user dismissed banner recently
      const dismissed = localStorage.getItem("pwa_prompt_dismissed");
      if (!dismissed) {
        setShowInstallBanner(true);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallBanner(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    localStorage.setItem("pwa_prompt_dismissed", "true");
  };

  if (!showInstallBanner || isInstalled) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        maxWidth: "380px",
        width: "calc(100% - 48px)",
        background: "rgba(12, 21, 36, 0.95)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(56, 189, 248, 0.3)",
        borderRadius: "16px",
        padding: "16px 20px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(56, 189, 248, 0.15)",
        animation: "pwaSlideUp 0.4s ease-out",
        color: "#ffffff",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div
          style={{
            position: "relative",
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            overflow: "hidden",
            flexShrink: 0,
            border: "1px solid rgba(255,255,255,0.15)",
            background: "#070e1c",
          }}
        >
          <Image
            src="/logo.png"
            alt="Logo Sabedoria Digital"
            fill
            sizes="48px"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4
            style={{
              margin: 0,
              fontSize: "0.95rem",
              fontWeight: 700,
              color: "#f8fafc",
              letterSpacing: "-0.01em",
            }}
          >
            Instalar Aplicativo
          </h4>
          <p
            style={{
              margin: "3px 0 0",
              fontSize: "0.8rem",
              color: "#94a3b8",
              lineHeight: 1.3,
            }}
          >
            Acesse seus livros e aulas com rapidez mesmo offline.
          </p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "14px",
          justifyContent: "flex-end",
        }}
      >
        <button
          onClick={handleDismiss}
          style={{
            background: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            color: "#94a3b8",
            padding: "8px 14px",
            borderRadius: "8px",
            fontSize: "0.82rem",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Agora não
        </button>
        <button
          onClick={handleInstallClick}
          style={{
            background: "linear-gradient(135deg, #0284c7, #38bdf8)",
            border: "none",
            color: "#ffffff",
            padding: "8px 18px",
            borderRadius: "8px",
            fontSize: "0.82rem",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(2, 132, 199, 0.4)",
          }}
        >
          Instalar App
        </button>
      </div>
    </div>
  );
}
