import subprocess
import sys

def run_command(cmd):
    print(f"\n[실행 명령어] {cmd}")
    process = subprocess.Popen(cmd, shell=True)
    process.communicate()
    if process.returncode != 0:
        print(f"[오류] 명령어 실행 실패: {cmd}")
        return False
    return True

def main():
    print("🚀 Git 자동 푸시 및 GitHub Actions 트리거 스크립트 시작\n")

    # 1. 원격 저장소의 최신 내용 먼저 받아오기 (충돌 방지)
    print("-> 원격 저장소 최신 내용 동기화 중 (git pull)...")
    pull_result = subprocess.run("git pull origin main --rebase", shell=True)
    if pull_result.returncode != 0:
        print("\n[⚠️ 경고] git pull 과정에서 충돌이 발생했거나 수동 확인이 필요할 수 있습니다.")

    # 2. 사용자로부터 커밋 메시지 입력받기
    commit_msg = input("\n📝 커밋 메시지를 입력하세요 (기본값: 'feat: update project'): ").strip()
    if not commit_msg:
        commit_msg = "feat: update project"

    # 3. 변경된 모든 파일 스테이징 (git add .)
    print("-> 변경된 파일 스테이징 중 (git add .)...")
    if not run_command("git add ."):
        return

    # 4. 커밋 생성 (git commit -m "...")
    print(f"-> 커밋 생성 중 (메시지: '{commit_msg}')...")
    commit_result = subprocess.run(f'git commit -m "{commit_msg}"', shell=True)
    if commit_result.returncode != 0:
        print("\n⚠️ 커밋할 변경 사항이 없거나 이미 최신 상태입니다. 푸시를 계속 진행합니다.")

    # 5. 깃허브 원격 저장소로 푸시 (git push origin main)
    print("-> GitHub 원격 저장소(main)로 푸시 중...")
    if not run_command("git push origin main"):
        return

    print("\n" + "="*50)
    print("✨ 깃허브 푸시 완료!")
    print("👉 이제 GitHub 저장소의 [Actions] 탭으로 이동하시면")
    print("   자동으로 빌드 및 도커 허브 푸시 파이프라인이 실행되는 것을 확인하실 수 있습니다!")
    print("="*50)

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"\n[치명적 오류 발생]: {e}")
    
    # 창이 바로 닫히지 않도록 대기
    input("\n[안내] 작업을 종료하려면 엔터 키를 누르세요...")