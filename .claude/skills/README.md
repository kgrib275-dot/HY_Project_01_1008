# 팀 공용 Claude 스킬 (Project_01_1008)

이 저장소를 받으면 Claude Code에서 바로 쓸 수 있는 스킬입니다. 별도 설치는 필요 없습니다.

| 스킬 | 용도 | 호출 예 |
|---|---|---|
| `proposal_01` | 데이터 · 프로젝트 내용을 **표준 제안서**(PPTX, 70p 양식)로 | `/proposal_01 Trade IQ 요약형 제안서 만들어줘` |
| `UIWireframes_01` | 서비스 · 화면 내용을 **표준 화면설계서**(PPTX, 50p 양식 · 와이어프레임)로 | `/UIWireframes_01 Trade IQ 화면 목록으로 화면설계서 만들어줘` |
| `MeetingNote` | 회의 녹취록 · 메모를 **표준 회의록**(Word + HTML 두 가지)으로 | `/MeetingNote 아래 녹취록으로 회의록 만들어줘 …` |

제안서 · 화면설계서는 같은 ID 체계(FN · REQ · 화면 ID)를 쓰므로, 제안서를 먼저 만든 뒤 화면설계서를 만들면 ID가 이어집니다.

## 사용 전 준비 (처음 1회)
1. 이 저장소를 clone 또는 pull 한 뒤 **저장소 폴더에서** Claude Code를 실행합니다 (스킬은 이 폴더 안에서만 인식됩니다).
2. Python 3가 설치돼 있어야 합니다.
3. 패키지(`defusedxml` 등)는 **미리 설치할 필요가 없습니다.** 제안서 · 화면설계서 스킬은 시작할 때 필요한 패키지를 확인하고, 없으면 Claude가 설치한 뒤 진행합니다. (`MeetingNote`는 설치할 것이 없습니다.)
4. 제안서 · 화면설계서는 Claude의 `anthropic-skills:pptx` 스킬을 사용합니다. 이 스킬이 없는 계정이면 Claude가 알려 주며, 그 경우 생성은 되지만 정리 · 검증 단계는 생략됩니다.
5. 목록에 스킬이 안 보이면 Claude Code를 다시 시작합니다.

## 모든 프로젝트에서 쓰려면 (내 PC 전역 설치)
기본은 이 저장소 폴더에서만 스킬이 보입니다. 어느 폴더에서든 쓰고 싶으면 내 PC의 전역 폴더(`~/.claude/skills`)에 동기화합니다.

1. `git pull`로 최신 상태를 받습니다.
2. `.claude/skills/sync_to_global.bat`을 **더블클릭**합니다. (또는 `python sync_to_global.py`)
3. Claude Code를 새로 시작하고 `/`를 입력해 세 스킬이 보이는지 확인합니다.

- 스킬이 업데이트되면 `git pull` 후 같은 방법으로 다시 실행합니다.
- 먼저 확인만 하려면 `python sync_to_global.py --dry-run`, 한 스킬만 하려면 `python sync_to_global.py MeetingNote`.
- 전역 폴더의 다른 스킬은 건드리지 않습니다. 단, 전역 복사본을 직접 고치면 다음 동기화 때 원본으로 덮어써집니다. 수정은 항상 이 저장소의 원본에서 합니다.
- 결과물 폴더(`proposals/` · `wireframes/` · `meetings/`)는 **실행한 프로젝트 안에** 생깁니다. 다른 프로젝트에서 쓸 때는 그 프로젝트의 `.gitignore`에 넣어 두세요 (회의록에는 고객 정보가 들어갈 수 있습니다).

자세한 설명과 문제 해결은 `스킬_사용가이드.html`을 브라우저로 열어 보세요.

## 사용 방법
- `/스킬이름` 뒤에 **내용(데이터 · 메모 · 파일 경로)** 을 함께 줍니다. 스킬이 입력을 표로 요약해 확인을 받은 뒤 생성합니다.
- 결과물 위치: 제안서 `proposals/`, 화면설계서 `wireframes/`, 회의록 `meetings/`(또는 지정한 폴더). 이 폴더들은 git에 올라가지 않습니다.
- 입력에 없는 수치는 지어내지 않고 `[N%]`, `[000]` 같은 자리표시자로 남깁니다. 마지막 보고의 "미확정 항목"을 채워 주세요.

## 알아 둘 점
- 양식 안의 예시 문장은 "사내 AI Assistant" 사업 기준입니다. 다른 성격의 사업이면 해당 문장이 대부분 교체됩니다.
- 렌더링 도구(LibreOffice · PowerPoint)가 없는 PC에서는 글자 넘침을 확인하지 못합니다. 결과 파일을 PowerPoint에서 열어 확인해 주세요.
- 양식(`template.pptx`)은 수정하지 말고, 양식을 바꿔야 하면 PR로 교체합니다.
- 스킬 내용을 고치려면 각 폴더의 `SKILL.md`를 수정하고 PR을 올려 주세요.

## 폴더 구조
```
.claude/skills/
├── README.md · 스킬_사용가이드.html
├── sync_to_global.py · .bat   (전역 동기화)
├── proposal_01/      SKILL.md · template.pptx · slide_map.md · scripts/
├── UIWireframes_01/  SKILL.md · template.pptx · slide_map.md · scripts/ (build_deck.py · dump_text.py)
└── MeetingNote/      SKILL.md · templates/ (base.docx · css) · examples/ · scripts/build_meeting_note.py
```
