import os
import sys
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI(title="Hyosung Trade AX API", version="1.0")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# 1. API 엔드포인트 정의
# ==========================================
@app.get("/api/health")
def health_check():
    return {"status": "success", "message": "FastAPI 연결 완료"}


# ==========================================
# 2. 프론트엔드 경로 설정 (강제 지정 방식)
# ==========================================
candidate_paths = [
    os.path.abspath(os.path.join(os.path.dirname(__file__), "static")),          # /app/static (도커 기본 복사 위치)
    os.path.abspath(os.path.join(os.path.dirname(__file__), "frontend/dist")),   # 백엔드 내 폴더
    os.path.abspath("/app/static"),                                            # 절대 경로 static
    os.path.abspath("/app/frontend/dist"),                                     # 절대 경로 dist
    os.path.abspath(os.path.join(os.path.dirname(__file__), "../frontend/dist")) # 로컬 개발 환경
]

frontend_dist = None
for path in candidate_paths:
    if os.path.exists(path) and os.path.exists(os.path.join(path, "index.html")):
        frontend_dist = path
        break

if frontend_dist:
    print(f"-> 프론트엔드 빌드 경로 발견: {frontend_dist}")
    
    assets_path = os.path.join(frontend_dist, "assets")
    if os.path.exists(assets_path):
        app.mount("/assets", StaticFiles(directory=assets_path), name="assets")

    # SPA 라우팅
    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        target_path = os.path.join(frontend_dist, full_path)
        if os.path.exists(target_path) and os.path.isfile(target_path):
            return FileResponse(target_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))
else:
    @app.get("/")
    def read_root():
        return {
            "message": "프론트엔드 빌드 폴더를 찾을 수 없습니다.",
            "checked_paths": candidate_paths
        }


# ==========================================
# 3. 단일 실행 파일(.exe) 구동을 위한 엔트리포인트
# ==========================================
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)