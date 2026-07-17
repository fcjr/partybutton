import { useEffect, useState } from "react";

type PartyStatus = {
  party: boolean;
  updatedAt: string | null;
};

export default function App() {
  const [status, setStatus] = useState<PartyStatus | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/v1/party");
        if (!res.ok) return;
        const data: PartyStatus = await res.json();
        if (!cancelled) setStatus(data);
      } catch {
        // network hiccup — keep last known state
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const party = status?.party ?? false;

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center gap-8 transition-colors duration-700 ${
        party
          ? "animate-party bg-fuchsia-600"
          : "bg-zinc-950"
      }`}
    >
      <div className={`text-8xl ${party ? "animate-bounce" : "grayscale opacity-40"}`}>
        🪩
      </div>
      <h1
        className={`text-center text-5xl font-black tracking-tight sm:text-7xl ${
          party ? "text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.8)]" : "text-zinc-600"
        }`}
      >
        {status === null ? "…" : party ? "PARTY MODE: ON" : "party mode: off"}
      </h1>
      {status?.updatedAt && (
        <p className={party ? "text-fuchsia-100" : "text-zinc-600"}>
          last toggled {new Date(status.updatedAt).toLocaleString()}
        </p>
      )}
      <a
        href="/docs"
        className={`text-sm underline underline-offset-4 ${
          party ? "text-fuchsia-100 hover:text-white" : "text-zinc-500 hover:text-zinc-300"
        }`}
      >
        API docs
      </a>
    </main>
  );
}
