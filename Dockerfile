# ==========================================
# [Stage 1] 프론트엔드(React) 빌드 스테이지
# ==========================================
FROM node:18-alpine AS frontend-builder

# 작업 디렉토리 설정
WORKDIR /app/frontend

# 패키지 설치 파일 복사 및 의존성 설치
COPY frontend/package*.json ./
RUN npm install

# 프론트엔드 소스 전체 복사 후 프로덕션 빌드 실행
COPY frontend/ ./
RUN npm run build
# 빌드 결과물 경로: /app/frontend/dist (Vite 기준)


# ==========================================
# [Stage 2] 백엔드(FastAPI) 및 최종 통합 런타임 스테이지
# ==========================================
# numpy 2.5+ 및 최신 라이브러리 호환을 위해 Python 3.12 버전으로 상향
FROM python:3.12-slim

# 작업 디렉토리 설정
WORKDIR /app

# 백엔드 파이썬 패키지 의존성 파일 복사 및 설치
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# 백엔드 소스코드 전체 복사
COPY backend/ ./

# [핵심] Stage 1에서 빌드된 프론트엔드 결과물(dist)을 
# 백엔드가 정적 파일로 서빙할 수 있는 위치(예: /app/static)로 복사
COPY --from=frontend-builder /app/frontend/dist /app/static

# FastAPI 서버 포트 개방
EXPOSE 8000

# 컨테이너 실행 시 Uvicorn 서버 구동 (main.py의 app 객체 실행)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]