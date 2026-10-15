"""프로젝트의 스킬(.claude/skills)을 사용자 전역 폴더(~/.claude/skills)로 동기화한다.

원본(이 폴더)을 고친 뒤 이 스크립트를 한 번 실행하면 전역 복사본이 원본과 똑같아진다.

사용법
  python sync_to_global.py                 모든 스킬 동기화
  python sync_to_global.py MeetingNote     지정한 스킬만
  python sync_to_global.py --dry-run       바뀔 내용만 보여주고 실제로는 복사하지 않음
  python sync_to_global.py --dest 경로     전역 폴더 대신 다른 폴더로 (시험용)

동작 규칙
- SKILL.md가 있는 폴더만 스킬로 본다 (README.md 등은 복사하지 않음).
- 원본에서 지운 파일은 전역 복사본에서도 지운다 (해당 스킬 폴더 안에서만).
- 전역 폴더의 다른 스킬은 절대 건드리지 않는다.
- 전역에 같은 이름이지만 SKILL.md가 없는 폴더가 있으면 덮어쓰지 않고 건너뛴다.
- __pycache__ 는 복사하지 않는다.
- Python 3 표준 라이브러리만 사용한다.
"""
import argparse
import filecmp
import os
import shutil
import sys

sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")
SRC = os.path.dirname(os.path.abspath(__file__))
SKIP_DIRS = {"__pycache__"}


def files_of(root):
    out = {}
    for d, dirs, fs in os.walk(root):
        dirs[:] = [x for x in dirs if x not in SKIP_DIRS]
        for f in fs:
            if f.endswith(".pyc"):
                continue
            p = os.path.join(d, f)
            out[os.path.relpath(p, root).replace(os.sep, "/")] = p
    return out


def sync_one(name, dest_root, dry):
    src, dst = os.path.join(SRC, name), os.path.join(dest_root, name)
    if os.path.isdir(dst) and not os.path.exists(os.path.join(dst, "SKILL.md")):
        print(f"[건너뜀] {name}: 전역에 같은 이름의 폴더가 있지만 스킬(SKILL.md)이 아니라서 덮어쓰지 않음")
        return 0
    s, d = files_of(src), files_of(dst) if os.path.isdir(dst) else {}
    added = [r for r in s if r not in d]
    changed = [r for r in s if r in d and not filecmp.cmp(s[r], d[r], shallow=False)]
    removed = [r for r in d if r not in s]
    if not (added or changed or removed):
        print(f"[변경 없음] {name}")
        return 0
    print(f"[{'예정' if dry else '동기화'}] {name}: 추가 {len(added)} · 수정 {len(changed)} · 삭제 {len(removed)}")
    for tag, rels in (("+", added), ("~", changed), ("-", removed)):
        for r in rels:
            print(f"    {tag} {r}")
    if dry:
        return len(added) + len(changed) + len(removed)
    for r in added + changed:
        os.makedirs(os.path.dirname(os.path.join(dst, r)), exist_ok=True)
        shutil.copy2(s[r], os.path.join(dst, r))
    for r in removed:
        os.remove(d[r])
    for dirpath, dirnames, filenames in os.walk(dst, topdown=False):  # 비어 버린 하위 폴더 정리
        if dirpath != dst and not os.listdir(dirpath):
            os.rmdir(dirpath)
    return len(added) + len(changed) + len(removed)


def main():
    ap = argparse.ArgumentParser(description="프로젝트 스킬 → 전역 스킬 동기화")
    ap.add_argument("names", nargs="*", help="동기화할 스킬 이름 (생략 시 전부)")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--dest", default=os.path.join(os.path.expanduser("~"), ".claude", "skills"))
    a = ap.parse_args()
    dest = os.path.abspath(a.dest)
    if os.path.normcase(dest) == os.path.normcase(SRC):
        sys.exit("원본과 대상이 같은 폴더입니다.")
    skills = sorted(n for n in os.listdir(SRC) if os.path.exists(os.path.join(SRC, n, "SKILL.md")))
    bad = [n for n in a.names if n not in skills]
    if bad:
        sys.exit(f"원본에 없는 스킬: {bad}  (있는 스킬: {skills})")
    targets = a.names or skills
    print(f"원본: {SRC}\n대상: {dest}{'  (dry-run: 실제 복사 안 함)' if a.dry_run else ''}\n")
    os.makedirs(dest, exist_ok=True)
    total = sum(sync_one(n, dest, a.dry_run) for n in targets)
    print(f"\n완료: 스킬 {len(targets)}개 확인, 파일 변경 {total}건" + (" (예정)" if a.dry_run else ""))
    if total and not a.dry_run:
        print("※ 실행 중인 Claude Code는 스킬 목록을 시작할 때 한 번만 읽으므로, 새로 시작해야 반영됩니다.")


if __name__ == "__main__":
    main()
