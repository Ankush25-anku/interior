"use client";

import { createContext, useContext, useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/layout/PageTransition";

const ReadyContext = createContext(false);

// components rendered inside routed page content (e.g. Hero's entrance
// timeline) can't receive `ready` as a prop from AppShell — they're mounted
// through {children}, not authored by AppShell — so it travels via context
// instead. The loading screen itself only ever mounts once per app session:
// AppShell lives in the root layout and isn't remounted on route changes.
export const useReady = () => useContext(ReadyContext);

export default function AppShell({ children }) {
  const [ready, setReady] = useState(false);

  return (
    <ReadyContext.Provider value={ready}>
      {!ready && <LoadingScreen onComplete={() => setReady(true)} />}
      <Navbar ready={ready} />
      <PageTransition>{children}</PageTransition>
      <Footer />
    </ReadyContext.Provider>
  );
}
