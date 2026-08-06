'use client';

import { useEffect, useRef, useState } from 'react';
import { CATEGORIES, getCategory, type CategoryCode } from '@/lib/categories';

interface Msg {
  role: 'user' | 'assistant';
  content: string;
}

export default function Page() {
  const [category, setCategory] = useState<CategoryCode | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy]);

  function reset() {
    setCategory(null);
    setMessages([]);
    setInput('');
  }

  async function send() {
    const text = input.trim();
    if (!text || busy || !category) return;

    const next: Msg[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setBusy(true);
    if (taRef.current) taRef.current.style.height = 'auto';

    // Prázdná odpověď asistenta, do které streamujeme.
    setMessages((m) => [...m, { role: 'assistant', content: '' }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, messages: next }),
      });

      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({ error: 'Chyba serveru.' }));
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: 'assistant', content: `⚠️ ${err.error ?? 'Chyba serveru.'}` };
          return copy;
        });
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: 'assistant', content: acc };
          return copy;
        });
      }
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: 'assistant', content: '⚠️ Spojení se serverem selhalo.' };
        return copy;
      });
    } finally {
      setBusy(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  }

  function autoGrow(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
  }

  // ---- Výběr kategorie ----
  if (!category) {
    return (
      <main className="landing">
        <div className="wrap">
          <h1>Asistent pro individualizaci výuky</h1>
          <p className="lead">
            Pomůže vám individualizovat výuku a materiály pro žáka se speciálními vzdělávacími potřebami na
            základě Katalogu podpůrných opatření. Nejdřív vyberte, jaké znevýhodnění se u žáka řeší.
          </p>
          <div className="grid">
            {CATEGORIES.map((c) => (
              <button key={c.code} className="card-btn" onClick={() => setCategory(c.code)}>
                <div className="name">{c.nazev}</div>
                <div className="desc">{c.cil}</div>
              </button>
            ))}
          </div>
        </div>
      </main>
    );
  }

  const cat = getCategory(category);
  const lastAssistantEmpty =
    busy && messages.length > 0 && messages[messages.length - 1].role === 'assistant' && messages[messages.length - 1].content === '';

  // ---- Chat ----
  return (
    <main className="chat">
      <header className="topbar">
        <div className="wrap">
          <div className="title">
            Individualizace výuky
            <small>Cílová skupina: {cat?.nazev}</small>
          </div>
          <button className="linkbtn" onClick={reset}>
            Změnit skupinu
          </button>
        </div>
      </header>

      <div className="messages" ref={scrollRef}>
        <div className="wrap">
          {messages.length === 0 && (
            <div className="hint">
              Popište žáka a situaci (věk/stupeň, předmět, konkrétní obtíž) — navrhnu konkrétní podpůrná
              opatření z katalogu a pomůžu připravit materiály. Např.: „Mám žáka v 5. třídě, nezvládá delší
              samostatnou práci v matematice."
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>
              <div className="bubble">
                {m.content ||
                  (lastAssistantEmpty && i === messages.length - 1 ? (
                    <span className="dots">
                      <span>·</span>
                      <span>·</span>
                      <span>·</span>
                    </span>
                  ) : (
                    ''
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="composer">
        <div className="wrap">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
          >
            <textarea
              ref={taRef}
              value={input}
              onChange={autoGrow}
              onKeyDown={onKeyDown}
              placeholder="Napište zprávu… (Enter odešle, Shift+Enter nový řádek)"
              rows={1}
            />
            <button className="send" type="submit" disabled={busy || !input.trim()}>
              Odeslat
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
