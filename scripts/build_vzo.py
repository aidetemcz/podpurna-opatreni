# -*- coding: utf-8 -*-
"""Vrstva 1 (full) pro Metodiku práce se žákem se vzácným onemocněním
(Michalík a kol., 2012). Prozaická struktura (kapitoly 1–13 + Úvod/Závěr),
bez záložkového TOC. Čistí čísla stránek, projektovou patičku, dělení slov
a ligaturové artefakty (fi/fl)."""
import fitz, re, sys, os
sys.path.insert(0, os.path.dirname(__file__))
from parse_dilci import join_para, has_bullets, split_bullets
from build_prose import is_prose_heading, looks_author

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'data', 'full', 'vzo')
PDF = os.path.join(ROOT, 'katalog-pdf', 'Metodika_prace_zak_se_vzacnym_onemocnenim_verze_elektr-web.pdf')

LIG = {'ﬀ': 'ff', 'ﬁ': 'fi', 'ﬂ': 'fl', 'ﬃ': 'ffi', 'ﬄ': 'ffl'}


def nows(s):
    return re.sub(r'\s+', '', s).upper()


def fix_ligatures(t):
    for k, v in LIG.items():
        t = t.replace(k, v)
    t = re.sub(r'(?<=[A-Za-zÁ-Žá-ž])(ffi|ffl|ff|fi|fl) (?=[-a-zá-ž])', r'\1', t)
    return t


def clean_block(txt):
    lines = []
    for line in txt.split('\n'):
        l = line.replace('\x07', '').replace('​', '').replace('\xad', '')
        s = l.strip()
        if re.fullmatch(r'\d{1,3}', s):
            continue  # samostatné číslo stránky
        n = nows(s)
        # projektová patička / zápatí
        if 'CZ.1.07/1.2.00' in s:
            continue
        if n == nows('Speciální vzdělávací potřeby dětí a žáků se vzácnými onemocněními'):
            continue
        if n == nows('Metodika práce se žákem se vzácným onemocněním'):
            continue
        lines.append(l)
    return fix_ligatures('\n'.join(lines))


def collect(doc, p0, p1):
    out = []
    for pi in range(p0, p1):
        for b in doc[pi].get_text('blocks', sort=True):
            x0, y0, x1, y1, txt, bno, bt = b
            if bt != 0:
                continue
            txt = clean_block(txt)
            if not txt.strip():
                continue
            out.append((pi, y0, x0, txt))
    out.sort(key=lambda r: (r[0], r[1], r[2]))
    return out


def build(doc, p0, p1, title, sig):
    blocks = collect(doc, p0, p1)
    out = [f'# {title}\n']
    last_level = 1
    skipped_heading = False
    for pi, y0, x0, txt in blocks:
        n = re.sub(r'^\d{1,3}', '', nows(txt))
        if not skipped_heading and sig and n.startswith(sig[:12]):
            skipped_heading = True  # vynech stylizovaný nadpis kapitoly (máme vlastní H1)
            continue
        if looks_author(txt):
            out.append(f'*{re.sub(chr(92)+"s+"," ",txt).strip()}*\n')
            continue
        # číslovaný podnadpis na vlastním řádku (i s malým písmenem: "4.1 charakteristika…")
        s = txt.strip()
        mnum = re.match(r'^(\d+\.\d+(?:\.\d+)?)\s+(.+)$', s)
        if mnum and '\n' not in s and len(s) < 80 and not s.rstrip().endswith('.'):
            hnum, ht = mnum.group(1), mnum.group(2).strip()
            level = hnum.count('.') + 1
            last_level = min(level, 6)
            out.append(f'\n{"#"*min(level + 1, 6)} {hnum} {ht[0].upper() + ht[1:]}\n')
            continue
        h = is_prose_heading(txt)
        if h:
            level, hnum, htext = h
            hl = min(level, 6) if hnum is not None else min(last_level + 1, 6)
            last_level = hl
            prefix = f'{hnum} ' if hnum else ''
            out.append(f'\n{"#"*max(hl,2)} {prefix}{htext}\n')
            continue
        if has_bullets(txt):
            lead, items = split_bullets(txt)
            if lead:
                out.append(join_para(lead))
            for it in items:
                out.append(f'- {it}')
            out.append('')
        else:
            p = join_para(txt)
            if p:
                out.append(p + '\n')
    return '\n'.join(out)


def frontmatter(kapitola):
    return ('---\n'
            'katalog: "vzo"\n'
            f'kapitola: "{kapitola}"\n'
            'zdroj: "Metodika_prace_zak_se_vzacnym_onemocnenim_verze_elektr-web.pdf"\n'
            'vrstva: "full"\n'
            'typ: "kapitola"\n'
            '---\n\n')


def collapse(md):
    return re.sub(r'\n{3,}', '\n\n', md).strip() + '\n'


# (soubor, titulek, pdf_start, pdf_end, signatura-nadpisu)
CHAPTERS = [
    ('01-uvod.md', 'Úvod', 6, 7, 'ÚVOD'),
    ('02-pojem-svp-a-obecne-podminky.md', 'Pojem speciálních vzdělávacích potřeb a obecné podmínky vzdělávání dětí se vzácným onemocněním', 7, 13, 'POJEMSPECIÁL'),
    ('03-faktory-provazejici-vzdelavani.md', 'Faktory provázející vzdělávání dítěte se vzácným onemocněním ve škole', 13, 18, 'FAKTORYPROVÁ'),
    ('04-specifika-komunikace.md', 'Specifika komunikace účastníků vzdělávání ve vztahu ke vzácným onemocněním', 18, 22, 'SPECIFIKAKOM'),
    ('05-cysticka-fibroza.md', 'Metodika práce s dítětem s cystickou fibrózou', 22, 32, 'METODIKAPRÁC'),
    ('06-galaktosemie.md', 'Metodika práce s dítětem s galaktosemií', 32, 47, 'METODIKAPRÁC'),
    ('07-mukopolysacharidoza.md', 'Metodika práce s dítětem s mukopolysacharidózou', 47, 62, 'METODIKAPRÁC'),
    ('08-fenylketonurie.md', 'Metodika práce se žákem s fenylketonurií', 62, 72, 'METODIKAPRÁC'),
    ('09-prader-willi-syndrom.md', 'Metodika práce s dítětem s Prader–Willi syndromem', 72, 82, 'METODIKAPRÁC'),
    ('10-rettuv-syndrom.md', 'Metodika práce s dítětem s Rettovým syndromem', 82, 95, 'METODIKAPRÁC'),
    ('11-spinalni-muskularni-atrofie.md', 'Metodika práce s dítětem se spinální muskulární atrofií (SMA)', 95, 106, 'METODIKAPRÁC'),
    ('12-touretteuv-syndrom.md', 'Metodika práce s dítětem s Touretteovým syndromem', 106, 120, 'METODIKAPRÁC'),
    ('13-williamsuv-syndrom.md', 'Metodika práce se žákem s Williamsovým syndromem', 120, 131, 'METODIKAPRÁC'),
    ('14-technicke-prostredky-vzdalena-vyuka.md', 'Technické prostředky pro vzdálenou výuku dítěte se vzácným onemocněním', 131, 133, 'TECHNICKÉPRO'),
    ('15-zaver.md', 'Závěr', 133, 134, 'ZÁVĚR'),
]


def main():
    doc = fitz.open(PDF)
    os.makedirs(OUT, exist_ok=True)
    for fname, title, p0, p1, sig in CHAPTERS:
        md = build(doc, p0, p1, title, sig)
        open(os.path.join(OUT, fname), 'w', encoding='utf-8').write(frontmatter(title) + collapse(md))
        print(f'{fname}: {p1-p0} stran, {len(md)} znaků')
    doc.close()


if __name__ == '__main__':
    main()
