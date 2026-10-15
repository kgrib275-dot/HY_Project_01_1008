import subprocess
import sys

BRANCH = "main"
MAX_FILE_MB = 5
# 스테이징 대상에 들어가면 안 되는 경로 (비밀값 · 환경 · 산출물)
FORBIDDEN_PARTS = (".env", "node_modules/", "venv/", "__pycache__/", "proposals/", "wireframes/")


def git(*args, check=True):
    """셸을 거치지 않고 git을 실행한다 (커밋 메시지의 따옴표 등이 깨지지 않음)."""
    result = subprocess.run(["git", *args], capture_output=True, text=True, encoding="utf-8", errors="replace")
    if check and result.returncode != 0:
        print(f"\n[오류] git {' '.join(args)}\n{(result.stderr or result.stdout).strip()}")
        sys.exit(1)
    return result


def confirm(question):
    return input(f"{question} [y/N]: ").strip().lower() == "y"


def main():
    print("🚀 Git 안전 푸시 스크립트 (푸시 = GitHub Actions 배포 트리거)\n")

    # 1. 브랜치 확인
    branch = git("rev-parse", "--abbrev-ref", "HEAD").stdout.strip()
    if branch != BRANCH:
        print(f"[중단] 현재 브랜치가 '{branch}' 입니다. '{BRANCH}' 에서만 실행할 수 있습니다.")
        return

    # 2. 진행 중인 rebase/merge 충돌이 있으면 중단
    unmerged = git("diff", "--name-only", "--diff-filter=U").stdout.split()
    if unmerged:
        print("[중단] 해결되지 않은 충돌 파일이 있습니다:\n  " + "\n  ".join(unmerged))
        return

    # 3. 변경 파일 스테이징 (.gitignore 존중) 후 목록 확인
    git("add", "-A")
    staged = git("diff", "--cached", "--name-status").stdout.strip()
    names = git("diff", "--cached", "--name-only").stdout.splitlines()

    risky = [n for n in names if any(part in n for part in FORBIDDEN_PARTS) and not n.endswith(".env.example")]
    if risky:
        print("[중단] 올리면 안 되는 경로가 스테이징되었습니다:\n  " + "\n  ".join(risky))
        git("reset", "-q")
        print("스테이징을 취소했습니다. .gitignore를 확인하세요.")
        return

    # 대용량 파일 점검
    big = []
    for n in names:
        size = git("cat-file", "-s", f":{n}", check=False).stdout.strip()
        if size.isdigit() and int(size) > MAX_FILE_MB * 1024 * 1024:
            big.append(f"{n} ({int(size) / 1024 / 1024:.1f}MB)")
    if big:
        print(f"[경고] {MAX_FILE_MB}MB 초과 파일:\n  " + "\n  ".join(big))
        if not confirm("그래도 계속할까요?"):
            git("reset", "-q")
            print("스테이징을 취소했습니다.")
            return

    # 4. 커밋 (변경이 있을 때만)
    if staged:
        print("커밋 대상:\n" + staged + "\n")
        commit_msg = input("📝 커밋 메시지 (기본값: 'feat: update project'): ").strip() or "feat: update project"
        if not confirm(f"위 {len(names)}개 파일을 커밋할까요?"):
            git("reset", "-q")
            print("스테이징을 취소했습니다.")
            return
        git("commit", "-m", commit_msg)
        print("-> 커밋 완료")
    else:
        print("커밋할 변경 사항이 없습니다. 푸시만 진행합니다.")

    # 5. 원격 최신 내용 반영 (실패 시 중단, 충돌은 직접 해결)
    print("-> 원격 최신 내용 가져오는 중 (git pull --rebase)...")
    pull = git("pull", "origin", BRANCH, "--rebase", check=False)
    if pull.returncode != 0:
        print("\n[중단] pull --rebase 실패 (충돌 가능성). 푸시하지 않았습니다.")
        print((pull.stderr or pull.stdout).strip())
        print("\n충돌을 해결한 뒤 'git rebase --continue' 하거나, 'git rebase --abort' 로 되돌리세요.")
        return

    # 6. 푸시 직전 확인 (푸시 = 이미지 빌드 · 배포)
    ahead = git("log", f"origin/{BRANCH}..HEAD", "--oneline", check=False).stdout.strip()
    print("\n푸시될 커밋:\n" + (ahead or "(없음)"))
    if not ahead:
        print("푸시할 커밋이 없습니다.")
        return
    if not confirm("GitHub로 푸시하고 배포 파이프라인을 실행할까요?"):
        print("푸시를 취소했습니다. 커밋은 로컬에 남아 있습니다.")
        return
    git("push", "origin", BRANCH)

    print("\n" + "=" * 50)
    print("✨ 깃허브 푸시 완료!")
    print("👉 GitHub 저장소의 [Actions] 탭에서 빌드 · 도커 허브 푸시 진행 상황을 확인하세요.")
    print("=" * 50)


if __name__ == "__main__":
    try:
        main()
    except SystemExit:
        pass
    except Exception as e:
        print(f"\n[치명적 오류 발생]: {e}")

    input("\n[안내] 작업을 종료하려면 엔터 키를 누르세요...")
