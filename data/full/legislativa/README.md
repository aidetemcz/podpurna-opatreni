# Legislativní rámec — zdrojová (věrná) vrstva

Tato složka obsahuje **věrně přepsané** části právních předpisů, ze kterých vychází
destilovaný legislativní rámec v `data/cards/legislativa/`. Slouží jako zdroj pravdy —
při pochybnostech o znění vždy upřednostni text zde, resp. oficiální Sbírku zákonů.

## Zdroje

- **Zákon č. 561/2004 Sb., o předškolním, základním, středním, vyšším odborném a jiném
  vzdělávání (školský zákon)** — ve znění úplného znění ke dni **1. 9. 2025**, zpracovaného
  MŠMT jako *informativní materiál* (`katalog-pdf/skolskyzakon_ke_dni_1.9.2025.pdf`).
  Toto úplné znění již zahrnuje tzv. **odkladovou novelu** (novela školského zákona, květen 2025).
  Právně závazné znění vyplývá výhradně ze Sbírky zákonů.

- **Vyhláška č. 27/2016 Sb., o vzdělávání žáků se speciálními vzdělávacími potřebami a žáků
  nadaných** — ve znění k **1. 9. 2026** (verze 11). Prováděcí předpis k § 19 školského zákona;
  stanoví pravidla stupňů, **rozsah využití asistenta pedagoga**, náležitosti IVP a doporučení
  a (v příloze č. 1) normovanou finanční náročnost. Zdroj: text předaný provozovatelem
  (původně zakonyprolidi.cz).

### Soubory

- `skolsky-zakon-svp.md` — § 16, § 16a, § 16b, § 17 (odst. 3), § 18, § 19 (podpůrná opatření,
  poradenská pomoc ŠPZ, revize, IVP, zmocnění k vyhlášce).
- `skolsky-zakon-odklad.md` — § 37 (odklad povinné školní docházky) — platné znění
  i znění účinné od 1. 9. 2029.
- `vyhlaska-27-2016.md` — § 2, 3, 4, 4a, 5, 5a, 15, 16, 17 (podpůrná opatření a stupně, IVP,
  asistent pedagoga vč. limitu 36 h, doporučení a jeho platnost, organizace vzdělávání) + popis
  přílohy č. 1.

## Co zde NENÍ a je potřeba doplnit z jiných zdrojů

- **Příloha č. 1 vyhlášky 27/2016 Sb.** — rozsáhlá normativní tabulka (části A, B, C) s úplným
  výčtem opatření, jejich zařazením do stupňů a normovanou finanční náročností — zde je jen
  popsána, ne přepsána celá. Úplné znění přílohy je ve zdrojovém dokumentu vyhlášky.
- **Zákon č. 563/2004 Sb., o pedagogických pracovnících** — vymezuje asistenta pedagoga jako
  pedagogického pracovníka (pracovněprávní vztah ke škole); § 20 rozlišuje dvě úrovně předpokladů.
