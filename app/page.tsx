'use client';

import { useEffect, useRef, useState } from 'react';
import { CATEGORIES, getCategory, type CategoryCode } from '@/lib/categories';
import { Logo } from './Logo';

interface Msg {
  role: 'user' | 'assistant';
  content: string;
}

export default function Page() {
  const [category, setCategory] = useState<CategoryCode | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy]);

  function pickCategory(code: CategoryCode) {
    setCategory(code);
    setMessages([]);
    setInput('');
    setNavOpen(false);
  }

  function goHome() {
    setCategory(null);
    setMessages([]);
    setInput('');
    setNavOpen(false);
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

  const cat = category ? getCategory(category) : undefined;
  const lastAssistantEmpty =
    busy &&
    messages.length > 0 &&
    messages[messages.length - 1].role === 'assistant' &&
    messages[messages.length - 1].content === '';

  return (
    <div className="app">
      {/* ---------- Levý panel: skupiny ---------- */}
      <aside className={`sidebar ${navOpen ? 'open' : ''}`}>
        <button className="brand" onClick={goHome} aria-label="Zpět na úvod">
          <Logo size={44} />
          <div className="brand-text">
            <span className="brand-title">Asistent výuky</span>
            <span className="brand-sub">Katalog podpůrných opatření</span>
          </div>
        </button>

        <div className="nav-label">Skupiny žáků</div>
        <nav className="nav">
          {CATEGORIES.map((c) => (
            <button
              key={c.code}
              className={`nav-item ${category === c.code ? 'active' : ''}`}
              onClick={() => pickCategory(c.code)}
            >
              <span className="nav-name">{c.nazev}</span>
              <span className="nav-desc">{c.cil}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-foot">
          <a href="https://aidetem.cz/" target="_blank" rel="noopener noreferrer" className="foot-brand">
            AI dětem
          </a>
          <p className="foot-note">
            Konverzační chatboti využívají data{' '}
            <a href="http://katalogpo.upol.cz/" target="_blank" rel="noopener noreferrer">
              Katalogu podpůrných opatření
            </a>{' '}
            od týmu Pedagogické fakulty Univerzity Palackého v Olomouci.
          </p>
          <a
            href="https://www.upol.cz/"
            target="_blank"
            rel="noopener noreferrer"
            className="foot-upol"
            aria-label="Univerzita Palackého v Olomouci"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/upol-logo.png" alt="Univerzita Palackého v Olomouci" />
          </a>
        </div>
      </aside>

      {navOpen && <div className="scrim" onClick={() => setNavOpen(false)} />}

      {/* ---------- Hlavní oblast ---------- */}
      <main className="main">
        <header className="topbar">
          <button className="menu-btn" aria-label="Skupiny" onClick={() => setNavOpen((o) => !o)}>
            <span />
            <span />
            <span />
          </button>
          <div className="topbar-title">
            {cat ? (
              <>
                Individualizace výuky
                <small>Skupina: {cat.nazev}</small>
              </>
            ) : (
              <>Vyberte skupinu žáků</>
            )}
          </div>
        </header>

        {!category ? (
          <div className="welcome">
            <div className="welcome-inner">
              <Logo size={64} />
              <h1>Asistent pro individualizaci výuky</h1>
              <p className="lead">
                Pomůže vám individualizovat výuku a materiály pro žáka se speciálními vzdělávacími
                potřebami na základě Katalogu podpůrných opatření. Vlevo vyberte, jaké znevýhodnění se
                u žáka řeší.
              </p>
              <div className="welcome-grid">
                {CATEGORIES.map((c) => (
                  <button key={c.code} className="welcome-card" onClick={() => pickCategory(c.code)}>
                    <span className="wc-name">{c.nazev}</span>
                    <span className="wc-desc">{c.cil}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="messages" ref={scrollRef}>
              <div className="thread">
                {messages.length === 0 && (
                  <div className="hint">
                    Popište žáka a situaci (věk/stupeň, předmět, konkrétní obtíž) — navrhnu konkrétní
                    podpůrná opatření z katalogu a pomůžu připravit materiály. Např.: „Mám žáka v 5.
                    třídě, nezvládá delší samostatnou práci v matematice."
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
              <form
                className="thread"
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
          </>
        )}
      </main>
    </div>
  );
}
