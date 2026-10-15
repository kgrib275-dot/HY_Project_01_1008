# Trade IQ — 효성무역 PG 영업기회 발굴 AX

효성무역 무역PG의 영업기회 발굴 업무를 AI로 지원하는 웹 애플리케이션 프로토타입입니다.
리뷰 기준일: 2026-10-15 (브랜치 `main`, 커밋 `46b21ed` + 미커밋 변경).

## 1. 한눈에 보기

| 구분 | 내용 |
|---|---|
| 프론트엔드 | React 18 + Vite 5 (`frontend/`) |
| 백엔드 | FastAPI + Uvicorn (`backend/main.py`, 현재 `/api/health` + 정적 서빙만 존재) |
| 배포 | Docker 멀티스테이지 → DockerHub(`hy-project`), 또는 PyInstaller 단일 `main.exe` |
| CI/CD | GitHub Actions(`.github/workflows/deploy.yml`): `main` 푸시 시 이미지 빌드·푸시 |
| 저장소 | https://github.com/kgrib275-dot/HY_Project_01_1008 |

## 2. 디렉터리 구조

```
Project_01_1008/
├─ backend/
│  ├─ main.py            FastAPI 앱 (헬스체크, SPA 정적 서빙, CORS)
│  ├─ main.spec          PyInstaller 설정 (frontend/dist 번들)
│  └─ requirements.txt   fastapi, uvicorn, pydantic, python-multipart
├─ frontend/
│  └─ src/
│     ├─ App.jsx         UI 전체 (9개 탭, 약 1,745줄)
│     └─ data/initialData.js   샘플 데이터 · 생성 함수 · 포맷 헬퍼
├─ Dockerfile            [1] node 빌드 → [2] python 런타임에 dist를 /app/static으로 복사
├─ docker-compose.yaml   개발용 (main.py만 마운트 + --reload)
├─ build.py              npm build → PyInstaller → main.exe
├─ build_docker.py       도커 이미지 빌드/실행 보조
├─ git_push.py           stash → pull → push 자동화
├─ .env / .env.example   비밀값 / 템플릿(값 비움)
├─ guide.html, 프로젝트 통합 실행 가이드(...).txt   실행 매뉴얼
├─ proposals/            생성된 제안서 PPTX (git 제외)
└─ .claude/skills/       팀 공용 스킬: proposal_01, UIWireframes_01, MeetingNote
```

## 3. 실행 방법

- **로컬 개발**: `cd frontend && npm install && npm run dev` (포트 8000), 백엔드는 `cd backend && uvicorn main:app --reload --port 8001`
- **Docker**: `docker build -t hy-project:latest . && docker run -p 8000:8000 hy-project:latest` → http://localhost:8000
- **Compose(개발)**: `docker compose up --build`
- **Windows exe**: `python build.py` → `backend/dist/main.exe`
- **환경변수**: `.env.example`을 `.env`로 복사해 채웁니다. `CORS_ORIGINS`(쉼표 구분)를 지정하면 해당 출처만 허용합니다.

## 4. 프론트엔드 리뷰

화면은 `activeTab` 상태로 전환되는 9개 탭으로 구성됩니다.

| 탭 | 내용 |
|---|---|
| desk | 영업기회 발굴 대시보드 |
| opportunities | 영업기회 파이프라인 관리(등록, 상태 변경, 이력, Next Action) |
| accounts | 고객사 · 글로벌 시장 환경 |
| network | 해외법인 현장 인텔리전스 로그 |
| explore | 무역 통관 데이터 탐색기(100건 생성 데이터, 엑셀 미리보기) |
| pipeline | 영업 전환율 · GP 매출 시뮬레이터 |
| reports | AI 분석 리포트 · 지식 자산화 |
| checklist | 프로젝트 전체 실무 체크리스트 |
| agents | AI Agent 챗(세션 다중 관리, 프리셋 질문) |

**강점**
- 영업 업무 흐름(발굴 → 관리 → 시뮬레이션 → 리포트)이 한 화면 체계에 일관되게 담겨 있어 제안서 · 시연용으로 설득력이 있습니다.
- 감사 로그, 이력, 체크리스트 등 현업 관점의 세부 요소가 반영되어 있습니다.

**한계 · 리스크**
- 모든 데이터가 샘플이고 `localStorage`(`trade_iq_*` 키)에만 저장됩니다. 브라우저 · 사용자 간 공유가 안 되고 용량 한도(약 5MB)가 있습니다.
- AI Agent, 요약, 스코어링은 화면 목업이며 실제 LLM 호출이 없습니다. `.env`의 Gemini · 네이버 · Reddit 키는 아직 사용처가 없습니다.
- `App.jsx` 한 컴포넌트에 상태 · 로직 · 9개 화면이 모두 있습니다. 데이터 상수는 이번에 `data/initialData.js`로 분리했지만, 탭별 컴포넌트 분리는 남아 있습니다.
- 인라인 스타일이 많아 `App.css`/`index.css`가 사실상 쓰이지 않습니다. 테스트 코드는 없습니다.
- 로그인 · 권한이 없고 사용자 프로필도 localStorage입니다.

## 5. 백엔드 리뷰

- 현재 API는 `GET /api/health` 하나이고, 나머지 경로는 SPA(`index.html`)로 폴백합니다.
- 프론트 경로 탐색이 5곳 후보(Docker, exe, 로컬)를 순회해 환경별로 유연하게 동작합니다.
- 기획된 기능(뉴스 수집, 요약, 스코어링, 벡터화, Teams 웹훅, AI Agent)이 구현되지 않았습니다. 다음 단계의 핵심입니다.

## 6. 인프라 · 배포 리뷰

- Dockerfile은 멀티스테이지로 잘 구성되어 있으나 `npm install` 대신 `npm ci`가 재현성에 유리합니다. Node 18은 EOL이므로 20 이상을 권장합니다.
- CI는 빌드 후 푸시만 하고 테스트 · 린트 단계가 없습니다.
- `.env`의 `DEPLOY_*`로 보아 원격 서버(SSH) 배포를 계획했지만, 자동 배포 스크립트는 저장소에 없습니다.
- 이전의 `github/workflows/deploy.yaml`(이미지명 `project-01-app`)은 `.github/`의 정식 워크플로(`hy-project`)와 중복되는 사본이라 저장소에서 추적을 해제했습니다. 로컬 파일은 남아 있습니다.

## 7. 보안 리뷰

- `.env`는 한 번도 커밋된 적이 없음을 확인했습니다(`git log --all -- .env` 결과 없음). 다만 키와 SSH 비밀번호가 평문이므로 공유 · 백업 시 주의하고, 다른 프로젝트(hana_p)와 같은 키를 재사용 중이라는 점도 유의해야 합니다.
- CORS는 기존 `*` + credentials 조합이었습니다. 이제 `CORS_ORIGINS`가 있으면 해당 출처만 허용하고 credentials를 켜며, 없으면 `*` + credentials 꺼짐입니다. 운영 배포 시에는 반드시 지정하세요.
- 현재 인증이 없으므로 실제 데이터 · 외부 API를 붙이기 전에 인증 방식을 먼저 정해야 합니다.

## 8. 이번 정비 내역 (2026-10-15)

1. `backend/venv`(5,007개), `backend/build`, `backend/dist`, `__pycache__`, `frontend/.vite`의 git 추적 해제 (5,051 → 26개 파일). 로컬 파일은 유지.
2. `.env` 이력 점검(커밋된 적 없음), `.env.example` 추가, `.gitignore` 보강.
3. `.dockerignore` 추가 (node_modules, venv, .env, 산출물 제외).
4. `docker-compose.yaml` 수정: `.:/app` 통째 마운트가 `/app/static`을 가리던 문제와 `backend.main` 경로 불일치를 해결.
5. `requirements.txt`를 UTF-16 → UTF-8로 변환하고 미사용 패키지(streamlit, pandas, requests) 제거.
6. CORS 환경변수화, `App.jsx`에서 데이터 · 헬퍼 278줄을 `data/initialData.js`로 분리 (`npm run build` 통과).

**아직 남은 정리 (삭제 권한 확인 필요)**: `frontend/src/App - 복사본.jsx`(1,450줄 이전 버전 사본, git 이력에 있어 복구 가능)와 루트 `github/` 폴더의 삭제는 보류했습니다.

## 9. 권장 로드맵

1. 백엔드 API 설계: 영업기회 CRUD + DB(SQLite → PostgreSQL), `localStorage` 대체
2. Gemini 연동 AI Agent, 뉴스 수집(네이버) → 요약 · 스코어링 파이프라인
3. `App.jsx`를 탭별 컴포넌트 · 커스텀 훅으로 분리, 테스트(Vitest) 도입
4. CI에 lint · build 검증 추가, 인증 · 권한 도입

## 10. 추가 점검 결과 (2026-10-15, 읽기 전용 점검 · 코드 수정 없음)

**`App.jsx` 로직**
- CSV 다운로드(`handleDownloadActualExcel`): `encodeURI`는 `#`, `%`를 인코딩하지 않아 셀 값에 `#`가 있으면 파일이 그 지점에서 잘립니다. `Blob` + `URL.createObjectURL`로 바꾸는 것이 안전합니다. `=`, `+`, `@`로 시작하는 값은 엑셀 수식으로 실행될 수 있어(CSV 인젝션) 앞에 `'`를 붙이는 처리가 필요합니다.
- PDF 내보내기(`handleExportPdf`): 제목 · 본문을 이스케이프 없이 HTML 문자열에 삽입해 `document.write`합니다. 사용자가 리포트에 `<script>`를 넣으면 인쇄 창에서 실행됩니다. 이스케이프 필요.
- 감사 로그(`addAuditLog`)를 `setState` 업데이터 함수 안에서 호출합니다(체크리스트 상태 변경 등). StrictMode 개발 모드에서는 업데이터가 두 번 실행되어 로그가 중복 기록됩니다.
- 탐색 DB(`exploreDatabase`)는 로드할 때마다 `generate100ExploreItems()`로 다시 만들고 `localStorage`에 덮어씁니다. 사용자 변경이 없는 데이터를 매번 저장하는 낭비이며 `setExploreDatabase`는 쓰이지 않습니다(ESLint 오류).
- AI Agent(`handleSendMessage`)는 고정 답변 · 입력 문구를 끼워 넣은 문장을 반환하며, 근거로 "Tendata 글로벌 통관 DB 교차 검증"이라고 표기합니다. 실제 분석이 아니므로 시연 · 제안 시 혼동되지 않도록 "샘플 응답" 표시가 필요합니다.
- 리스트 `key`로 배열 인덱스를 쓰는 곳이 여럿 있어 정렬 · 삭제 시 상태가 어긋날 수 있습니다. 인라인 스타일이 420곳입니다.
- ESLint: `React` 미사용 import, `setExploreDatabase` 미사용 2건(사본 파일 포함 5건).

**스크립트**
- `git_push.py`: `git stash` → `pull --rebase` → `stash pop` 후 **`git add .` 전체 커밋 · 푸시**합니다. `pull`이나 `stash pop`이 충돌해도 실패를 검사하지 않고 계속 진행하므로 충돌 마커가 커밋될 수 있습니다. 커밋 메시지를 쉘 문자열에 직접 넣어 `"`가 있으면 깨집니다. 또한 푸시가 곧 배포이므로 의도치 않은 파일(산출물 · 고객 자료)이 올라가지 않도록 `.gitignore`가 중요합니다(이번에 보강함).
- `build.py`: `taskkill /f /im main.exe`로 실행 중 프로세스를 강제 종료하고 빌드 후 exe를 자동 실행합니다. 설계 의도대로 동작하며 큰 문제는 없습니다. 단 `venv` 경로가 하드코딩이라 venv가 없으면 실패합니다.
- `build_docker.py`: 같은 이름의 컨테이너를 `docker rm -f`로 매번 삭제 후 `--no-cache` 빌드합니다. 로컬 개발용으로는 괜찮지만 느립니다.

**스킬(`.claude/skills`)**
- `proposal_01`, `UIWireframes_01`, `MeetingNote` 모두 외부 전송, 비밀값 접근, 삭제 명령 없이 로컬 파일 생성 용도입니다. `rm -f`는 PPTX 재압축 임시 파일 처리 한 곳뿐입니다.
- 공유 저장소에 템플릿(.pptx · .docx)이 포함되어 있어 용량이 있습니다. 산출물 폴더(`proposals/`)는 `.gitignore`로 제외됩니다.

**의존성 취약점**
- `npm audit`: moderate 1 · high 1건, 모두 `vite ≤6.4.2` / `esbuild ≤0.24.2`(개발 서버가 임의 웹사이트의 요청을 받을 수 있는 문제)입니다. **개발 서버 한정**이며 운영 이미지(정적 빌드)에는 영향이 없습니다. 해결은 vite 메이저 업그레이드(`--force`)가 필요해 별도 작업으로 두었습니다.
- Python: `pip-audit`이 설치돼 있지 않아 점검하지 않았습니다. 패키지가 4개뿐이고 모두 `>=` 범위라, 운영 전에는 버전을 고정(lock)하는 것이 좋습니다.

## 11. 조치 내역 (2026-10-15, 10장 후속)

- **CSV 다운로드**: `Blob` 방식으로 교체해 `#`로 파일이 잘리는 문제를 해결했고, 모든 셀을 따옴표로 감싸며 `=`, `+`, `-`, `@` 시작 값 앞에 `'`를 붙여 CSV 인젝션을 막았습니다.
- **PDF 내보내기**: 제목 · 날짜 · 작성자 · 본문 · 소속 · 이름을 `escapeHtml`로 이스케이프한 뒤 삽입합니다.
- **감사 로그 중복**: 영업기회 상태 변경, 체크리스트 상태 변경에서 `addAuditLog`를 `setState` 업데이터 밖으로 옮겼습니다.
- **탐색 DB**: 미사용 `setExploreDatabase`와 매 로드마다 하던 `localStorage` 쓰기를 제거했습니다.
- **ESLint**: `src/App.jsx`, `src/data`, `src/main.jsx`는 오류 0건입니다(`React` 미사용 import 제거). 사본 파일 `App - 복사본.jsx`의 3건은 삭제 대기 중입니다.
- **`git_push.py` 재작성**:
  - `main` 브랜치에서만 실행합니다.
  - `git stash`를 없앴고, 모든 git 명령의 실패를 확인합니다. `pull --rebase`가 실패하면 푸시하지 않고 중단합니다.
  - 스테이징 후 `.env`, `venv/`, `node_modules/`, `proposals/` 등이 섞이면 중단하고, 5MB 초과 파일은 경고합니다.
  - 커밋 대상 목록 확인, 푸시될 커밋 목록 확인, 푸시 직전 확인 질문(배포가 시작됨)을 거칩니다.
  - 커밋 메시지는 셸을 거치지 않고 전달해 따옴표가 있어도 안전합니다.
- 검증: `npm run build` 통과, `git_push.py`는 문법 검사만 했고 실제 푸시 흐름은 실행해 보지 않았습니다.
