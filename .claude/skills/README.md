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
2. Python 3 (`MeetingNote`는 추가 설치 불필요). 제안서 · 화면설계서 검증용: `pip install defusedxml lxml`
3. PPTX 편집 도구는 Claude의 `anthropic-skills:pptx` 스킬을 사용합니다. `/skills`에 `pptx`가 보여야 합니다. 안 보이면 관리자에게 문의하세요.
4. 목록에 스킬이 안 보이면 Claude Code를 다시 시작합니다.

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
├── README.md
├── proposal_01/      SKILL.md · template.pptx · slide_map.md · scripts/
├── UIWireframes_01/  SKILL.md · template.pptx · slide_map.md · scripts/ (build_deck.py · dump_text.py)
└── MeetingNote/      SKILL.md · templates/ (base.docx · css) · examples/ · scripts/build_meeting_note.py
```
