import subprocess
import sys

IMAGE_NAME = "project-01-app:latest"
CONTAINER_NAME = "project-01-container"
PORT_MAPPING = "8000:8000"

def run_command(cmd):
    print(f"\n[실행 명령어] {cmd}")
    process = subprocess.Popen(cmd, shell=True)
    process.communicate()
    if process.returncode != 0:
        print(f"[오류] 명령어 실행 실패: {cmd}")
        sys.exit(process.returncode)

def main():
    print("🚀 도커 기반 빌드 및 배포 자동화 스크립트 시작")

    # 1. 기존 컨테이너가 실행 중이거나 존재하면 강제 삭제
    print(f"-> 기존 컨테이너({CONTAINER_NAME}) 정리 중...")
    subprocess.run(f"docker rm -f {CONTAINER_NAME}", shell=True, capture_output=True)

    # 2. 도커 이미지 빌드 (--no-cache 적용으로 신규 작업 내용 완벽 반영)
    print(f"-> 도커 이미지 빌드 중 ({IMAGE_NAME})...")
    run_command(f"docker build --no-cache -t {IMAGE_NAME} .")

    # 3. 새로운 도커 컨테이너 실행
    print(f"-> 도커 컨테이너 실행 중 ({CONTAINER_NAME})...")
    run_command(f"docker run -d --name {CONTAINER_NAME} -p {PORT_MAPPING} {IMAGE_NAME}")

    print("\n" + "="*50)
    print("✨ 배포 완료! 아래 주소로 접속하세요:")
    print("👉 웹 서비스 접속: http://localhost:8000")
    print("👉 API 헬스체크: http://localhost:8000/api/health")
    print("="*50)

if __name__ == "__main__":
    main()