# REPORT — převod Katalogu podpůrných opatření do Markdownu

Stav: **checkpoint po prvním dílčím katalogu** (`vseobecny` + `pas`). Zbylé dílčí katalogy (`mp`, `nks`, `sp`, `zp`, `tp`, `szn`, `szn-metodika`) navazují po odsouhlasení formátu a kalibraci délky destilátů.

## Metodika

Převod je plně skriptovaný (Python + PyMuPDF, `./scripts/`), aby byl reprodukovatelný a jednotný napříč katalogy:

- **Extrakce po blocích** s řazením podle pozice (řeší boxový layout, kde se úvod oblasti mísí s první kartou).
- **Čištění artefaktů:** slévání rozsekaných řádků do odstavců; odstranění rozdělovacích spojovníků a měkkých spojovníků (`­`, `\xad`), nulové mezery (`​`), řídicích znaků (`\x07`); normalizace nedělitelných mezer; odstranění běžících záhlaví/zápatí a čísel stránek (pásmo y ≥ 768 a známé fráze „KATALOG PODPŮRNÝCH OPATŘENÍ • …").
- **Mezerované nadpisy** („P R O J E V Y …") se rozpoznávají porovnáním textu bez mezer proti uzavřené množině sekcí (verzálkový guard proti záměně s odstavcem, který jen začíná stejným slovem).
- **Detekce karet a oblastí** z těla (ne z TOC — to je místy neúplné), s rekonciliací proti kotvám „Oblast podpory:".

## Souhrn per katalog

| Katalog | Oblasti / kapitoly | Karty | Full (odhad tokenů) | `_all.md` (odhad tokenů) |
|---|---|---|---|---|
| vseobecny | 13 kapitol | — | ~171 000 | — (jen `_prehled.md`) |
| pas | 10 oblastí | 45 (z toho 6 podkaret) | ~171 000 | **~24 600** |

Odhad tokenů = znaky ÷ 2,5 (konzervativní pro češtinu s diakritikou).

## Kontrola kvality

1. **Úplnost (pas):** počet karet == počet kotev „Oblast podpory:" ve **všech 10 oblastech** (celkem 45). Oblast 9 („Práce s třídním kolektivem") chybí v PDF záložkách (TOC skáče 4.8 → 4.10) — detekována z těla, jinak by její karty spadly do oblasti 8.
2. **Věrnost (vrstva 1):** namátkou ověřeny karty tp 1.1, pas 1.1, pas 8.3 — sekce kompletní, odstavce správně slité, bez zbytků záhlaví. Číslované seznamy (metodické zdroje) i odrážky zachovány.
3. **Destiláty (vrstva 2):** namátkou ověřena pas 8.3 proti plné kartě — žádná informace mimo zdroj, korektně vypuštěna legislativa/zdroje. Automatická kontrola: žádná karta nemá prázdné `projevy` ani zbloudilý „Stupeň" v jiné sekci.
4. **Technicky:** validní Markdown, jednotná hierarchie (`#` kapitola/katalog, `##` oblast, `###` karta, `####` sekce karty), frontmatter u full souborů, cesty v `manifest.json` ověřeny (existují na disku).

## Nalezené odchylky a jak byly řešeny

- **Podkarty (tříúrovňové kódy):** např. `3.2.3`, `3.5.1`, `9.1.5` — mají vlastní plnou sadu sekcí. Ve vrstvě 1 zachovány věrně jako `###` s příznakem *(podkarta)*; ve vrstvě 2 mají vlastní destilát. Označeny v manifestu `typ: podkarta`.
- **Nekonzistentní číslování v pas:** karta nesla prefix kapitoly (`4.2.9`) místo tvaru oblast.karta. Znormalizováno na `2.9` (zaznamenáno příznakem generátoru).
- **Titulky karet** jsou v PDF verzálkami; převedeny na větné psaní se zachováním zkratek (whitelist: IVP, ŠPZ, AAK, PAS…). Ojedinělé zkratky mimo whitelist mohou zůstat malými písmeny — viz „k lidské kontrole".
- **Běžící záhlaví v próze** (název kapitoly opakovaný dole na stránce) prosakoval do těla; odfiltrováno pásmem y a byla opravena záměna odstavce „Projevy chování žáka…" za nadpis sekce (zasáhlo 2 karty — přegenerováno a destiláty přepsány).

## Vyžaduje lidskou kontrolu / rozhodnutí

1. **Délka destilátů vs. rozpočet `_all.md`.** Karty mají 150–223 slov (cíl 100–250), ale `_all.md` pro pas vychází ~24,6k tokenů — **nad cílem ≤ 15k**. Pro 45 karet se ≤ 15k tokenů dá dosáhnout jen při ~110 slovech/kartu. **Rozhodnutí:** buď přitáhnout destiláty na ~100–130 slov (splní 15k, méně detailu), nebo akceptovat bohatší karty (~24k) a strop 15k brát jako orientační. Několik karet též mírně překračuje znakový strop ~1500 (nejvíc 10.1 = 1822).
2. **Zkratky:** v `_all.md` je použita legenda zkratek na začátku souboru (místo rozepsání při prvním výskytu) — jednodušší a robustní; potvrdit, že vyhovuje.
3. **Podkarty s nespojitým číslováním** (např. `3.5.1` a pak `3.5.7`, `3.5.8`) — čísla přebrána z PDF; doporučuji namátkové ověření, zda v předloze nechybí mezilehlé podkarty.
4. **Úvodní/přílohové kapitoly dílčích katalogů** (vymezení postižení, dopady, diagnostika, slovník) jsou převedeny do `data/full/<kat>/` jako `NN-*.md` nad rámec ilustrativní struktury v zadání — pro úplnost („nic nezkracuj"). Potvrdit, že to tak vyhovuje.
