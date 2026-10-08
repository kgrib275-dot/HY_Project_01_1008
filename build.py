import os
import subprocess
import sys

# 0. 빌드 전 실행 중인 기존 main.exe 강제 종료 (파일 잠금 방지)
print("🔄 기존 실행 중인 main.exe 프로세스 종료 중...")
os.system("taskkill /f /im main.exe 2> nul")

# 프로젝트 루트 경로 설정
root_dir = os.path.dirname(os.path.abspath(__file__))
frontend_dir = os.path.join(root_dir, "frontend")
backend_dir = os.path.join(root_dir, "backend")

# 백엔드 가상환경(venv) 내부에 있는 PyInstaller 경로 명시
pyinstaller_path = os.path.join(backend_dir, "venv", "Scripts", "pyinstaller.exe")

print("==========================================")
print("🚀 [1/2] 프론트엔드 빌드 시작 (npm run build)...")
print("==========================================")
frontend_result = subprocess.run(["npm", "run", "build"], cwd=frontend_dir, shell=True)

if frontend_result.returncode != 0:
    print("❌ 프론트엔드 빌드 중 오류가 발생했습니다.")
    sys.exit(1)
print("✅ 프론트엔드 빌드 완료!\n")

print("==========================================")
print("📦 [2/2] PyInstaller 패키징 시작 (main.exe 생성)...")
print("==========================================")

# 가상환경의 pyinstaller를 사용하여 패키징 실행
pyinstaller_cmd = [
    pyinstaller_path,
    "--onefile",
    "--add-data", "../frontend/dist;frontend/dist",
    "main.py"
]

backend_result = subprocess.run(pyinstaller_cmd, cwd=backend_dir, shell=True)

if backend_result.returncode != 0:
    print("❌ PyInstaller 패키징 중 오류가 발생했습니다.")
    sys.exit(1)

print("==========================================")
print("🎉 모든 빌드 및 패키징이 성공적으로 완료되었습니다!")
exe_path = os.path.join(backend_dir, "dist", "main.exe")
print(f"👉 생성된 실행 파일 위치: {exe_path}")
print("==========================================")

# 3. 새로 빌드된 최신 main.exe 자동 실행
if os.path.exists(exe_path):
    print("🚀 최신 버전의 서비스를 실행합니다 (새 콘솔 창 오픈)...")
    # Windows에서 독립된 새 콘솔창을 띄워 Uvicorn 서버 로그를 실시간으로 확인할 수 있게 함
    subprocess.Popen([exe_path], creationflags=subprocess.CREATE_NEW_CONSOLE)
else:
    print(f"⚠️ 실행 파일을 찾을 수 없습니다: {exe_path}")