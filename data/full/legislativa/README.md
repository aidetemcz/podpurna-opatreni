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

### Soubory

- `skolsky-zakon-svp.md` — § 16, § 16a, § 16b, § 17 (odst. 3), § 18, § 19 (podpůrná opatření,
  poradenská pomoc ŠPZ, revize, IVP, zmocnění k vyhlášce).
- `skolsky-zakon-odklad.md` — § 37 (odklad povinné školní docházky) — platné znění
  i znění účinné od 1. 9. 2029.

## Co zde NENÍ a je potřeba doplnit z jiných zdrojů

- **Vyhláška č. 27/2016 Sb., o vzdělávání žáků se speciálními vzdělávacími potřebami a žáků
  nadaných** — stanoví konkrétní výčet a stupně podpůrných opatření, **pravidla a rozsah
  využití asistenta pedagoga**, normovanou finanční náročnost a náležitosti IVP. Plný text
  zde zatím není (nebylo možné jej v tomto prostředí stáhnout). Konkrétní čísla (hodiny,
  rozsah, stupně) je nutné brát z této vyhlášky, nikoli dovozovat.
- **Zákon č. 563/2004 Sb., o pedagogických pracovnících** — vymezuje asistenta pedagoga jako
  pedagogického pracovníka (pracovněprávní vztah ke škole).
