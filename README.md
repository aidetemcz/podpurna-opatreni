# Asistent pro individualizaci výuky

Konverzační prototyp pro učitele — pomáhá individualizovat výuku a materiály pro žáka se speciálními vzdělávacími potřebami na základě **Katalogu podpůrných opatření**. Next.js (App Router) + oficiální Anthropic SDK, nasazení na Vercelu.

## Jak to pracuje s katalogem

Data jsou ve složce `data/` (převedená z PDF, viz `data/REPORT.md`) ve dvou vrstvách:

- **Deterministický výběr** — učitel zvolí typ znevýhodnění žáka; appka vloží destilovanou vrstvu příslušné kategorie (`data/cards/<kat>/_prehled.md` + `_all.md`) do **system promptu** (ne RAG). Velký blok katalogu je v promptu s `cache_control`, takže opakované tahy konverzace čtou z cache.
- **Agentické dočítání** *(fáze 2, připravujeme)* — model dostane rejstřík (`data/index.md` / `manifest.json`) a tool pro vyžádání plné karty z `data/full/`.

## Nastavení na Vercelu

V nastavení projektu (Settings → Environment Variables) přidej:

| Proměnná | Hodnota |
|---|---|
| `ANTHROPIC_API_KEY` | tvůj Anthropic API klíč (`sk-ant-…`) |
| `ANTHROPIC_MODEL` | *(volitelné)* výchozí `claude-sonnet-5`; pro vyšší kvalitu `claude-opus-5` |

Po nastavení klíče a pushnutí větve Vercel nasadí náhled automaticky.

## Lokální vývoj

```bash
npm install
cp .env.example .env.local   # doplň ANTHROPIC_API_KEY
npm run dev                  # http://localhost:3000
```

## Struktura

```
app/
  page.tsx            výběr kategorie + chat (client)
  api/chat/route.ts   streamované volání Claude (Node runtime)
  layout.tsx, globals.css
lib/
  categories.ts       7 dílčích katalogů (cílové skupiny)
  catalog.ts          načtení destilované vrstvy z data/cards/
  prompt.ts           sestavení system promptu (+ prompt caching)
data/                 převedený katalog (full + cards + manifest/index)
scripts/              extrakční pipeline (PDF → Markdown)
```

## Stav / další kroky

- **Fáze 0+1 (hotovo):** výběr kategorie, destilát v system promptu, streamovaný chat.
- **Fáze 2:** tool `get_card` pro agentické dočítání plných karet + rejstřík v promptu.
- **Fáze 3:** profil žáka (stupeň, předmět), export materiálů, více žáků / uložení.
