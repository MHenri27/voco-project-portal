"use client";

import { useEffect } from "react";

// Last-resort boundary for errors in the root layout itself. It renders its own
// html/body, so styles are inline to stay independent of the normal layout.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="et">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "1.5rem",
          textAlign: "center",
          background: "#ffffff",
          color: "#0c1326",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: 700, margin: 0 }}>Tekkis ootamatu viga</h1>
        <p style={{ color: "#3b455c", maxWidth: "28rem" }}>
          Rakendus ei suutnud laadida. Palun proovi lehte uuesti laadida.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: "0.5rem",
            background: "#4b6bfb",
            color: "#ffffff",
            border: "none",
            borderRadius: "999px",
            padding: "0.7rem 1.5rem",
            fontSize: "0.95rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Proovi uuesti
        </button>
      </body>
    </html>
  );
}
