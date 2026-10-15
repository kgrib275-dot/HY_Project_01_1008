"""슬라이드 텍스트 덤프 (markitdown 미설치 환경용).

사용법
  python dump_text.py deck.pptx [슬라이드번호...]            슬라이드별 문단 요약
  python dump_text.py deck.pptx --runs 20 [번호...]          build_deck.py 용 텍스트 인덱스(0부터) 목록
"""
import re
import sys
import zipfile

sys.stdout.reconfigure(encoding="utf-8")


def main():
    args = sys.argv[1:]
    if not args:
        print(__doc__)
        sys.exit(1)
    path, rest = args[0], args[1:]
    runs = "--runs" in rest
    only = {int(a) for a in rest if a.isdigit()}
    z = zipfile.ZipFile(path)
    slides = sorted(
        (n for n in z.namelist() if re.match(r"ppt/slides/slide\d+\.xml$", n)),
        key=lambda s: int(re.findall(r"\d+", s)[0]),
    )
    for s in slides:
        num = int(re.findall(r"\d+", s)[0])
        if only and num not in only:
            continue
        x = z.read(s).decode("utf8")
        if runs:
            ts = [a or b for a, b in re.findall(r"<a:t>([^<]*)</a:t>|<a:t xml:space=\"preserve\">([^<]*)</a:t>", x)]
            print(f"=== slide{num}: " + " ¦ ".join(f"{i}:{t}" for i, t in enumerate(ts)))
            continue
        rel = z.read(s.replace("slides/", "slides/_rels/") + ".rels").decode("utf8")
        layout = re.findall(r"slideLayout\d+", rel)
        paras = re.findall(r"<a:p>.*?</a:p>|<a:p .*?</a:p>", x, re.S)
        txt = ["".join(re.findall(r"<a:t[^>]*>([^<]*)</a:t>", p)) for p in paras]
        txt = [t for t in txt if t.strip()]
        extra = [k for k in ("a:tbl", "p:pic") if k in x]
        print(f"--- slide{num}.xml {layout} {extra}:", " | ".join(txt))


if __name__ == "__main__":
    main()
