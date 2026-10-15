"""양식(template.pptx)에서 슬라이드를 고르고 텍스트를 교체해 새 .pptx를 만든다.

사용법:  python build_deck.py spec.json

spec.json 예시
{
  "template": "../template.pptx",          // 생략 시 이 스크립트 옆 ../template.pptx
  "output":   "C:/경로/결과.pptx",
  "keep":     [1, 2, 3, 20, 50],           // 남길 원본 슬라이드 번호(이 순서대로 배치). 생략 시 전체
  "edits": {
    "1":  { "0": "효성 무역PG", "3": "2026. 10. 15" },   // "원본 슬라이드 번호": { "텍스트 인덱스": "새 텍스트" }
    "20": { "5": "무엇이든 물어보세요" }
  }
}

- 텍스트 인덱스는 `python dump_text.py template.pptx --runs 20` 으로 확인한다 (0부터, 슬라이드 안 <a:t> 순서).
- 서식(폰트 · 색 · 크기 · 도형)은 건드리지 않고 글자만 바꾼다. 같은 슬라이드를 두 번 쓰는 것은 지원하지 않는다.
- 슬라이드 삭제 후 정리(clean.py)와 검증(validate.py)은 pptx 스킬의 스크립트를 자동으로 찾아 실행한다.
  못 찾으면 환경변수 PPTX_SKILL_DIR(= .../pptx 폴더)을 지정한다.
- 필요: Python 3 표준 라이브러리만 사용 (검증 단계만 defusedxml · lxml 필요).
"""
import glob
import html
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import zipfile

sys.stdout.reconfigure(encoding="utf-8")
TEXT = re.compile(r'(<a:t(?: xml:space="preserve")?>)([^<]*)(</a:t>)')


def find_pptx_scripts():
    cands = []
    if os.environ.get("PPTX_SKILL_DIR"):
        cands.append(os.path.join(os.environ["PPTX_SKILL_DIR"], "scripts"))
    home = os.path.expanduser("~")
    cands += glob.glob(os.path.join(home, ".claude", "skills", "**", "pptx", "scripts"), recursive=True)
    cands += glob.glob(os.path.join(home, ".claude", "plugins", "**", "pptx", "scripts"), recursive=True)
    for c in cands:
        if os.path.exists(os.path.join(c, "clean.py")):
            return c
    return None


def main():
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(1)
    spec_path = os.path.abspath(sys.argv[1])
    spec = json.load(open(spec_path, encoding="utf-8"))
    base = os.path.dirname(os.path.abspath(__file__))
    tpl = os.path.abspath(os.path.join(os.path.dirname(spec_path), spec["template"])) if "template" in spec \
        else os.path.join(base, "..", "template.pptx")
    out = os.path.abspath(os.path.join(os.path.dirname(spec_path), spec["output"]))
    edits = {int(k): {int(i): t for i, t in v.items()} for k, v in spec.get("edits", {}).items()}

    work = tempfile.mkdtemp(prefix="deck_")
    zipfile.ZipFile(tpl).extractall(work)

    # 전체 슬라이드 번호 → sldId 요소
    pres_p = os.path.join(work, "ppt", "presentation.xml")
    rels_p = os.path.join(work, "ppt", "_rels", "presentation.xml.rels")
    pres = open(pres_p, encoding="utf8").read()
    rels = open(rels_p, encoding="utf8").read()
    rid2num = {}
    for m in re.finditer(r"<Relationship [^>]*/>", rels):
        t = re.search(r'Target="slides/slide(\d+)\.xml"', m.group(0))
        i = re.search(r'Id="(rId\d+)"', m.group(0))
        if t and i:
            rid2num[i.group(1)] = int(t.group(1))
    sld = {}
    for m in re.finditer(r"<p:sldId [^>]*/>", pres):
        sld[rid2num[re.search(r'r:id="(rId\d+)"', m.group(0)).group(1)]] = m.group(0)
    keep = [int(n) for n in spec.get("keep", sorted(sld))]
    missing = [n for n in keep if n not in sld]
    if missing:
        sys.exit(f"원본에 없는 슬라이드 번호: {missing}")
    if len(set(keep)) != len(keep):
        sys.exit("keep에 중복된 슬라이드 번호가 있습니다")

    for n, m in edits.items():
        if n not in keep:
            print(f"[경고] 슬라이드 {n}은 keep에 없어 edits를 무시합니다")
            continue
        p = os.path.join(work, "ppt", "slides", f"slide{n}.xml")
        x = open(p, encoding="utf8").read()
        cnt = [-1]

        def sub(mo):
            cnt[0] += 1
            if cnt[0] in m:
                return mo.group(1) + html.escape(m[cnt[0]], quote=False) + mo.group(3)
            return mo.group(0)
        x = TEXT.sub(sub, x)
        bad = [i for i in m if i > cnt[0]]
        if bad:
            sys.exit(f"슬라이드 {n}: 텍스트 인덱스 {bad} 없음 (최대 {cnt[0]})")
        open(p, "w", encoding="utf8", newline="").write(x)

    # sldIdLst 재구성 (keep 순서)
    lst = re.search(r"<p:sldIdLst>.*?</p:sldIdLst>", pres, re.S).group(0)
    new_lst = "<p:sldIdLst>" + "".join(sld[n] for n in keep) + "</p:sldIdLst>"
    open(pres_p, "w", encoding="utf8", newline="").write(pres.replace(lst, new_lst))

    scripts = find_pptx_scripts()
    if scripts:
        subprocess.run([sys.executable, os.path.join(scripts, "clean.py"), work], check=True,
                       stdout=subprocess.DEVNULL)
    else:
        print("[경고] pptx 스킬의 clean.py를 못 찾았습니다. 삭제한 슬라이드가 파일에 남아 있을 수 있습니다.")

    os.makedirs(os.path.dirname(out), exist_ok=True)
    if os.path.exists(out):
        os.remove(out)
    names = [os.path.relpath(os.path.join(r, f), work).replace(os.sep, "/") for r, _, fs in os.walk(work) for f in fs]
    names.sort(key=lambda n: (n != "[Content_Types].xml", n))
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
        for n in names:
            z.write(os.path.join(work, n), n)
    shutil.rmtree(work, ignore_errors=True)
    print(f"저장: {out}  (슬라이드 {len(keep)}장)")

    if scripts:
        r = subprocess.run([sys.executable, os.path.join(scripts, "office", "validate.py"), out, "--original", tpl],
                           capture_output=True, text=True, encoding="utf-8")
        print((r.stdout.strip().splitlines() or ["(검증 출력 없음)"])[-1])
        if r.returncode != 0:
            print(r.stdout[-1500:], r.stderr[-500:])


if __name__ == "__main__":
    main()
