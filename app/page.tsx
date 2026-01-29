"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [result, setResult] = useState<string | null>(null);

  async function submit() {
    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    const data = await res.json();
    setResult(data.url);
  }

  return (
    <main style={{ padding: "2rem" }}>
      <textarea
        rows={10}
        cols={60}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <br />
      <button onClick={submit}>Create Paste</button>

      {result && (
        <p>
          Link: <a href={result}>{result}</a>
        </p>
      )}
    </main>
  );
}
