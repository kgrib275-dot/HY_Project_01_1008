"""회의 내용(JSON)으로 표준 회의록을 Word(.docx)와 HTML 두 가지 양식으로 만든다.

사용법
  python build_meeting_note.py spec.json [--out-dir 폴더] [--format both|docx|html]

spec.json 항목 (모두 선택, 값이 없는 섹션은 빠지고 번호는 자동으로 다시 매겨진다)
{
  "title":    "회의록",
  "subtitle": "프로젝트명 – 회의 제목",
  "author":   "작성자(문서 속성용)",
  "date":     "2026-10-14",                       // 파일명에 사용 (회의록_20261014)
  "basename": "회의록_20261014",                  // 지정하면 파일명을 직접 정함
  "overview": [["회의명","..."],["일시","..."],["참석","..."],["작성일","..."]],
  "purpose":  "회의 목적 한두 문장",
  "discussion": [ {"heading":"소주제","bullets":["...","..."]}, ... ],
  "decisions":  ["...", "..."],
  "actions":    [ {"content":"...","owner":"...","due":"..."} ],      // No는 자동. [내용,담당,기한] 배열도 가능
  "risks":      [ {"risk":"...","response":"..."} ],
  "confirm":    ["...", "..."],
  "section_titles": {"decisions":"결정 사항"}     // 섹션 제목을 바꾸고 싶을 때만
}
- 셀 · 문장 안의 줄바꿈은 \n. 서식(굵게 등)은 지원하지 않는다 (원본 양식과 동일).
- Python 3 표준 라이브러리만 사용한다.
"""
import argparse
import datetime
import html
import json
import os
import re
import sys
import zipfile
from xml.dom import minidom

sys.stdout.reconfigure(encoding="utf-8")
HERE = os.path.dirname(os.path.abspath(__file__))
TPL = os.path.join(HERE, "..", "templates")

SECTIONS = [  # (key, 기본 제목)
    ("overview", "회의 개요"), ("purpose", "회의 목적"), ("discussion", "주요 논의 내용"),
    ("decisions", "결정 사항"), ("actions", "Action Items"), ("risks", "리스크 및 이슈"),
    ("confirm", "확인 필요 사항"),
]
ALLOWED = {"title", "subtitle", "author", "date", "basename", "section_titles"} | {k for k, _ in SECTIONS}


# ---------------------------------------------------------------- 입력 검증
def load_spec(path):
    spec = json.load(open(path, encoding="utf-8"))
    unknown = set(spec) - ALLOWED
    if unknown:
        sys.exit(f"알 수 없는 항목: {sorted(unknown)}  (허용: {sorted(ALLOWED)})")
    spec.setdefault("title", "회의록")
    spec["actions"] = [_action(a) for a in spec.get("actions", [])]
    spec["risks"] = [_risk(r) for r in spec.get("risks", [])]
    spec["overview"] = [(str(a), str(b)) for a, b in spec.get("overview", [])]
    for d in spec.get("discussion", []):
        if "heading" not in d or "bullets" not in d:
            sys.exit("discussion 항목은 {heading, bullets} 형식이어야 합니다")
    return spec


def _action(a):
    if isinstance(a, dict):
        return (str(a.get("content", "")), str(a.get("owner", "")), str(a.get("due", "")))
    return tuple(str(v) for v in a)


def _risk(r):
    if isinstance(r, dict):
        return (str(r.get("risk", "")), str(r.get("response", "")))
    return tuple(str(v) for v in r)


def numbered_sections(spec):
    """값이 있는 섹션만 골라 번호 + 제목을 붙여 돌려준다."""
    titles = dict(SECTIONS)
    titles.update(spec.get("section_titles", {}))
    out, n = [], 0
    for key, _ in SECTIONS:
        if not spec.get(key):
            continue
        n += 1
        out.append((key, f"{n}. {titles[key]}"))
    return out


# ---------------------------------------------------------------- HTML
def build_html(spec):
    e = lambda s: html.escape(s, quote=False).replace("\n", "<br>")
    css = open(os.path.join(TPL, "meeting_note.css"), encoding="utf8").read()
    date = next((v for k, v in spec["overview"] if k == "작성일"), "")
    tag = f'{spec["title"]} - {re.sub(r"[ ]+", "", date).rstrip(".").replace(".", ".")}' if date else spec["title"]
    p = [f'<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
         f'<title>{e(tag)}</title>\n<style>\n{css}</style></head><body><main>\n<h1>{e(spec["title"])}</h1>']
    if spec.get("subtitle"):
        p.append(f'<div class="sub">{e(spec["subtitle"])}</div>')
    for key, head in numbered_sections(spec):
        p.append(f"\n<h2>{e(head)}</h2>" if key != "overview" else f"\n<h2>{e(head)}</h2>")
        if key == "overview":
            rows = "".join(f"<tr><th>{e(k)}</th><td>{e(v)}</td></tr>" for k, v in spec["overview"])
            p.append(f'<div class="tw"><table class="meta">{rows}</table></div>')
        elif key == "purpose":
            p.append(f"<p>{e(spec['purpose'])}</p>")
        elif key == "discussion":
            for d in spec["discussion"]:
                p.append(f"<h3>{e(d['heading'])}</h3><ul>" + "".join(f"<li>{e(b)}</li>" for b in d["bullets"]) + "</ul>")
        elif key in ("decisions", "confirm"):
            p.append("<ul>" + "".join(f"<li>{e(b)}</li>" for b in spec[key]) + "</ul>")
        elif key == "actions":
            rows = "".join(f"<tr><td>{i}</td><td>{e(c)}</td><td>{e(o)}</td><td>{e(d)}</td></tr>"
                           for i, (c, o, d) in enumerate(spec["actions"], 1))
            p.append(f'<div class="tw"><table><tr><th>No</th><th>내용</th><th>담당</th><th>기한</th></tr>{rows}</table></div>')
        elif key == "risks":
            rows = "".join(f"<tr><td>{e(a)}</td><td>{e(b)}</td></tr>" for a, b in spec["risks"])
            p.append(f'<div class="tw"><table><tr><th>리스크/이슈</th><th>대응 방향</th></tr>{rows}</table></div>')
    p.append("\n</main></body></html>\n")
    return "".join(p)


# ---------------------------------------------------------------- DOCX
FONT = '<w:rFonts w:ascii="Malgun Gothic" w:cs="Malgun Gothic" w:eastAsia="Malgun Gothic" w:hAnsi="Malgun Gothic"/>'
NAVY, GRAY = "1E3A5F", "6B7280"


def _t(s):
    return html.escape(s, quote=False)


def run(text, sz=20, bold=False, color=None):
    rpr = FONT + ("<w:b/><w:bCs/>" if bold else "") + (f'<w:color w:val="{color}"/>' if color else "") \
        + f'<w:sz w:val="{sz}"/><w:szCs w:val="{sz}"/>'
    return f'<w:r><w:rPr>{rpr}</w:rPr><w:t xml:space="preserve">{_t(text)}</w:t></w:r>'


def para(text, sz=20, bold=False, color=None, ppr=""):
    lines = text.split("\n")
    runs = "<w:r><w:br/></w:r>".join(run(l, sz, bold, color) for l in lines)
    return f'<w:p>{"<w:pPr>" + ppr + "</w:pPr>" if ppr else ""}{runs}</w:p>'


def h2(text):
    return para(text, 26, True, NAVY, '<w:pStyle w:val="Heading2"/><w:spacing w:after="120" w:before="300"/>')


def h3(text):
    return para(text, 22, True, None, '<w:spacing w:after="60" w:before="160"/>')


def bullet(text):
    return para(text, 20, False, None,
                '<w:pStyle w:val="ListParagraph"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="2"/></w:numPr><w:spacing w:after="40"/>')


BORD = "".join(f'<w:{s} w:val="single" w:color="BFBFBF" w:sz="4"/>' for s in ("top", "left", "bottom", "right"))
MAR = '<w:tcMar><w:top w:type="dxa" w:w="60"/><w:left w:type="dxa" w:w="100"/><w:bottom w:type="dxa" w:w="60"/><w:right w:type="dxa" w:w="100"/></w:tcMar>'
TBLB = "".join(f'<w:{s} w:val="single" w:color="auto" w:sz="4"/>' for s in ("top", "left", "bottom", "right", "insideH", "insideV"))


def cell(text, w, shaded=False):
    shd = '<w:shd w:fill="E8EDF3" w:color="auto" w:val="clear"/>' if shaded else ""
    ps = "".join(para(l, 20, shaded) for l in (text.split("\n") if text else [""]))
    return f'<w:tc><w:tcPr><w:tcW w:type="dxa" w:w="{w}"/><w:tcBorders>{BORD}</w:tcBorders>{shd}{MAR}</w:tcPr>{ps}</w:tc>'


def table(widths, rows, header=None, label_col=False):
    grid = "".join(f'<w:gridCol w:w="{w}"/>' for w in widths)
    trs = []
    if header:
        trs.append("<w:tr>" + "".join(cell(h, w, True) for h, w in zip(header, widths)) + "</w:tr>")
    for r in rows:
        trs.append("<w:tr>" + "".join(cell(v, w, label_col and i == 0) for i, (v, w) in enumerate(zip(r, widths))) + "</w:tr>")
    return f'<w:tbl><w:tblPr><w:tblW w:type="dxa" w:w="{sum(widths)}"/><w:tblBorders>{TBLB}</w:tblBorders></w:tblPr><w:tblGrid>{grid}</w:tblGrid>{"".join(trs)}</w:tbl>'


def build_docx(spec, out_path):
    body = [para(spec["title"], 40, True, NAVY, '<w:spacing w:after="60"/>')]
    if spec.get("subtitle"):
        body.append(para(spec["subtitle"], 20, False, GRAY, '<w:spacing w:after="200"/>'))
    for key, head in numbered_sections(spec):
        body.append(h2(head))
        if key == "overview":
            body.append(table([1800, 7838], spec["overview"], label_col=True))
        elif key == "purpose":
            body.append(para(spec["purpose"]))
        elif key == "discussion":
            for d in spec["discussion"]:
                body.append(h3(d["heading"]))
                body += [bullet(b) for b in d["bullets"]]
        elif key in ("decisions", "confirm"):
            body += [bullet(b) for b in spec[key]]
        elif key == "actions":
            rows = [(str(i), c, o, d) for i, (c, o, d) in enumerate(spec["actions"], 1)]
            body.append(table([600, 5238, 1900, 1900], rows, header=["No", "내용", "담당", "기한"]))
        elif key == "risks":
            body.append(table([4819, 4819], spec["risks"], header=["리스크/이슈", "대응 방향"]))
        if key in ("overview", "actions", "risks"):
            body.append('<w:p><w:pPr><w:spacing w:after="0"/></w:pPr></w:p>')

    zin = zipfile.ZipFile(os.path.join(TPL, "base.docx"))
    doc = zin.read("word/document.xml").decode("utf8")
    sect = re.search(r"<w:sectPr>.*?</w:sectPr>", doc, re.S).group(0)
    new_doc = doc[:doc.index("<w:body>")] + "<w:body>" + "".join(body) + sect + "</w:body></w:document>"
    minidom.parseString(new_doc.encode("utf8"))  # 형식 오류 사전 차단
    now = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    with zipfile.ZipFile(out_path, "w", zipfile.ZIP_DEFLATED) as zo:
        names = sorted((i.filename for i in zin.infolist() if not i.is_dir()), key=lambda n: (n != "[Content_Types].xml", n))
        for n in names:
            data = zin.read(n)
            if n == "word/document.xml":
                data = new_doc.encode("utf8")
            elif n == "docProps/core.xml":
                c = data.decode("utf8")
                author = _t(spec.get("author", "")) or "Un-named"
                c = re.sub(r"<dc:creator>.*?</dc:creator>", f"<dc:creator>{author}</dc:creator>", c)
                c = re.sub(r"<cp:lastModifiedBy>.*?</cp:lastModifiedBy>", f"<cp:lastModifiedBy>{author}</cp:lastModifiedBy>", c)
                c = re.sub(r"(<dcterms:(?:created|modified)[^>]*>).*?(</dcterms:)", rf"\g<1>{now}\g<2>", c)
                data = c.encode("utf8")
            zo.writestr(n, data)


# ---------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser(description="회의록(docx + html) 생성")
    ap.add_argument("spec")
    ap.add_argument("--out-dir", default=".")
    ap.add_argument("--format", choices=["both", "docx", "html"], default="both")
    a = ap.parse_args()
    spec = load_spec(a.spec)
    base = spec.get("basename")
    if not base:
        d = re.sub(r"\D", "", spec.get("date", ""))
        base = f'{spec["title"]}_{d}' if d else spec["title"]
    os.makedirs(a.out_dir, exist_ok=True)
    if a.format in ("both", "docx"):
        p = os.path.join(a.out_dir, base + ".docx")
        build_docx(spec, p)
        print("저장:", os.path.abspath(p))
    if a.format in ("both", "html"):
        p = os.path.join(a.out_dir, base + ".html")
        open(p, "w", encoding="utf-8", newline="\n").write(build_html(spec))
        print("저장:", os.path.abspath(p))
    miss = [k for k, _ in SECTIONS if not spec.get(k)]
    if miss:
        print("값이 없어 생략한 섹션:", ", ".join(miss))


if __name__ == "__main__":
    main()
