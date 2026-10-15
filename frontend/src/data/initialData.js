export const initialOpportunities = [
  {
    id: 1,
    type: 'Cross-sell',
    title: 'ABC Chemicals – TiO2 Cross-sell 기회',
    company: 'ABC Chemicals',
    region: '멕시코',
    item: 'TiO2',
    score: 87,
    expectedGP: '8.7억원/년',
    status: '신규 제안',
    date: '2026.07.21',
    hypothesis: 'Supplier X의 Rutile Grade TiO2 제품으로 100~200톤 테스트 공급을 제안하고, 품질 승인 후 연간 계약으로 확대하여 5~10억원의 추가 매출을 확보할 수 있는 Cross-sell 기회입니다.',
    demand: '미국 B사 최근 12개월간 PP 수입량 증가 추세 확인',
    productFit: '효성 Supplier X 제품과 스펙 유사도 92%',
    access: '기존 PP 거래 관계 및 현지 법인 네트워크 보유',
    history: [
      { date: '2026-07-21 10:00', action: 'AI 기회 자동 발굴', user: 'System' },
      { date: '2026-07-22 14:30', action: '상태 변경: 신규 제안', user: '김성환 차장' }
    ],
    nextActionList: [
      { task: '고객 상세 규격 (Grade, 입도 등) 확인', owner: '멕시코 법인', risk: '높음', done: false },
      { task: '기존 공급사 계약 조건 및 잔여 기간 확인', owner: '멕시코 법인', risk: '높음', done: false },
      { task: 'Supplier X 제품 사양서 및 인증서 확인', owner: '구매팀', risk: '중간', done: false },
      { task: '멕시코 도착 기준 운임 및 관세 시뮬레이션', owner: '물류팀', risk: '중간', done: false }
    ]
  },
  {
    id: 2,
    type: '신규 Buyer',
    title: '신규 Buyer DEF Industries – PP Resin',
    company: 'DEF Industries',
    region: '미국',
    item: 'PP Resin',
    score: 88,
    expectedGP: '6.2억원/년',
    status: '신규 제안',
    date: '2026.07.20',
    hypothesis: '최근 12개월 수입량 210% 증가한 신규 Buyer로, 효성 공급 가능 Grade 3종과 매칭되어 초기 Spot 공급 제안이 적정합니다.',
    demand: '최근 1년 PP 수입량 3,000t → 10,000t (+233%)',
    productFit: '효성 취급 Grade H123과 스펙 유사도 92%',
    access: '기존 고객 C사의 관계사, 담당자 접점 확보',
    history: [
      { date: '2026-07-20 09:15', action: 'AI 기회 자동 발굴', user: 'System' }
    ],
    nextActionList: [
      { task: 'DEF사 담당자 컨택 포인트 확인', owner: '미국 법인', risk: '높음', done: false },
      { task: '효성 H123 Grade 샘플 발송 일정 조율', owner: '화학팀', risk: '중간', done: false }
    ]
  },
  {
    id: 3,
    type: '공급사 신규시장',
    title: 'Supplier Y – 멕시코 시장 진출',
    company: 'Supplier Y',
    region: '멕시코',
    item: 'PET Chip',
    score: 84,
    expectedGP: '5.1억원/년',
    status: '검토 중',
    date: '2026.07.19',
    hypothesis: '베트남 공급사 Y의 신규 라인 물량과 멕시코 Buyer 5개를 연결하여 신규 시장 진출 및 물류 효율화를 도모합니다.',
    demand: '멕시코 현지 PET Chip 수입 수요 견조',
    productFit: '베트남 공장 생산 CAPA 및 가격 경쟁력 우수',
    access: '현지 법인 창고 및 물류 인프라 연계 가능',
    history: [
      { date: '2026-07-19 11:20', action: 'AI 기회 자동 발굴', user: 'System' }
    ],
    nextActionList: [
      { task: '베트남 공장 가용 물량 확약서 수취', owner: '구매팀', risk: '높음', done: false },
      { task: '멕시코 현지 창고 보관료 산정', owner: '물류팀', risk: '낮음', done: false }
    ]
  }
];

export const initialMarketAccountsData = [
  { company: 'ABC Chemicals', country: '멕시코', item: 'TiO2', importVol: '2,400톤/년', growth: '+18%', status: '관심 타깃', creditRating: 'A+', mainContact: 'Carlos Mendoza (구매이사)', contactPhone: '+52 55 1234 5678', recentIssue: '신규 공장 증설에 따른 원료 다변화 검토 중', schedule: '2026-10-20T14:00', manager: '김성환 차장' },
  { company: 'DEF Industries', country: '미국', item: 'PP Resin', importVol: '10,000톤/년', growth: '+233%', status: '신규 제안중', creditRating: 'AA-', mainContact: 'John Smith (Sourcing Mgr)', contactPhone: '+1 212 555 0198', recentIssue: '친환경 패키징 원료 전환 프로젝트 진행 중', schedule: '2026-10-22T10:30', manager: '미국법인 John' },
  { company: 'GHI Polymer', country: '브라질', item: 'PC', importVol: '5,500톤/년', growth: '+22%', status: '검토 대기', creditRating: 'B+', mainContact: 'Lucas Silva (Director)', contactPhone: '+55 11 9876 5432', recentIssue: '환율 변동에 따른 3개월 단기 계약 선호', schedule: '2026-10-25T16:00', manager: '중남미팀 박과장' },
  { company: 'JKL Corp', country: '인도', item: 'PET Chip', importVol: '3,800톤/년', growth: '+15%', status: '기존 거래', creditRating: 'A', mainContact: 'Rajesh Kumar (Supply Head)', contactPhone: '+91 22 5555 4321', recentIssue: '정기 오더 물량 10% 확대 요청 완료', schedule: '2026-10-28T11:00', manager: '아시아팀 이대리' }
];

export const initialIntelligenceLogs = [
  { 
    id: 101, 
    branch: '멕시코 법인 (MX)', 
    time: '1시간 전', 
    category: '고객 니즈', 
    content: 'ABC사 신규 공장 증설에 따라 TiO2 추가 소요 발생 예상, 현지 영업 파트너 접촉 중', 
    author: '김성환 차장', 
    updatedAt: '2026-10-13 06:42' 
  },
  { 
    id: 102, 
    branch: '베트남 법인 (VN)', 
    time: '3시간 전', 
    category: '공급사 정보', 
    content: 'Supplier Y, PET Chip 신규 라인 가동 개시 및 수출 가능 물량 확보 완료', 
    author: '김성환 차장', 
    updatedAt: '2026-10-13 06:42' 
  },
  { 
    id: 103, 
    branch: '미국 법인 (US)', 
    time: '5시간 전', 
    category: '시장 동향', 
    content: '미국내 친환경 패키징 수요 증가로 리사이클 폴리머 관세 면제 검토 소식', 
    author: '김성환 차장', 
    updatedAt: '2026-10-13 06:42' 
  },
  { 
    id: 104, 
    branch: '유럽 법인 (EU)', 
    time: '8시간 전', 
    category: '규제 대응', 
    content: 'EU 탄소국경조정제도(CBAM) 강화에 따른 친환경 인증 폴리머 수요 급증', 
    author: '김성환 차장', 
    updatedAt: '2026-10-13 06:42' 
  }
];

export const initialChecklistItems = [
  { id: '1.1', category: '데이터 수집 및 파이프라인', title: '외부 DB 솔루션 및 샘플 스키마 확보', desc: '외부 통관 DB(Tendata 등) 선정 상태 및 백엔드 테이블 설계를 위한 Raw Data 샘플 스키마 공유 일자 확인', reason: '백엔드 DB 테이블 설계, 데이터 타입 정의, ETL 적재 파이프라인의 사전 구축 목적', status: '대기', date: '2026-10-16', note: '커니 측에서 샘플 스키마 엑셀 전달 완료 (1차 회의 반영)' },
  { id: '1.2', category: '데이터 수집 및 파이프라인', title: '외부 데이터 수집 방식 확정', desc: '외부 데이터 연계 방식(Open API, Batch File, Web Crawling 등)의 기술 구성 및 인터페이스 확정', reason: '수집 방식에 따른 서버 사양, 인프라 네트워크, 보안/방화벽 정책 및 Batch Scheduler 결정 필요', status: '대기', date: '2026-10-19', note: 'API 대신 야간 Batch 방식(SFTP) 적용 잠정 합의 (2차 회의 반영)' },
  { id: '1.3', category: '데이터 수집 및 파이프라인', title: '외부 API 호출 제약 및 보안 정책 확인', desc: 'API Daily/Monthly Call Limit, 크롤링 차단(Bot Block) 대응책 및 유료 DB 라이선스 사용 정책 확인', reason: 'API 호출 한도 초과, 차단 리스크, 유료 DB 라이선스 약관 위반 방지 가이드 수립 목적', status: '대기', date: '2026-10-19', note: '보안 가이드라인 준수 여부 점검 예정 (2차 회의 반영)' },
  { id: '1.4', category: '데이터 수집 및 파이프라인', title: '사내 데이터 추출 방식 및 연계 주기 확정', desc: 'ERP, CRM, 견적/Lost Deal 등 사내 데이터 수집 방식(DB Direct, API, Batch) 및 갱신 주기 확정', reason: '사내 레거시 시스템 연동 방식 및 갱신 주기에 맞춘 사내 DB 인터페이스 개발 필요', status: '대기', date: '2026-10-19', note: 'ERP 데이터 이관 파이프라인 세팅 전 (1차 회의 반영)' },
  { id: '1.5', category: '데이터 수집 및 파이프라인', title: '민감 무역 데이터 암호화 및 비식별화 정의', desc: 'B/L 내 거래처명, 단가, 개인정보(담당자 연락처) DB 저장 시 암호화(AES-256) 및 비식별화 룰 확인', reason: '개인정보보호법 준수 및 기업 무역 비밀 데이터 외부 유출 방지 목적', status: '대기', date: '2026-10-16', note: 'DB 암호화 컬럼 정의서 초안 승인 완료 (1차 회의 반영)' },

  { id: '2.1', category: '데이터 매핑 및 마스터 정제', title: '외부-내부 사명 매칭 룰 수립', desc: '외부 통관 사명(영문/약어/오타)과 사내 ERP/CRM 마스터 간 매칭 알고리즘 및 임계치(Threshold) 수립 확인', reason: '영문 표기 불일치로 인한 오매칭 방지 및 정확한 단일 고객 뷰(Customer 360) 구축 목적', status: '대기', date: '2026-10-19', note: 'Entity Resolution 임계치 0.88로 상향 조정 협의 중 (2차 회의 반영)' },
  { id: '2.2', category: '데이터 매핑 및 마스터 정제', title: 'HS Code ↔ 사내 제품 매핑 룰북 확보', desc: 'HS Code 6자리 매핑 모호성 극복을 위한 B/L 품목설명(Text) 파싱 룰 및 거래 이력 기반 매핑 기준서 전달 확인', reason: '포괄적인 HS Code 6자리 한계 극복을 위한 B/L 텍스트 파싱 룰 및 거래 이력 매핑 기준 확보 필요', status: '대기', date: '2026-10-19', note: '품목 정규화 Dictionary 확보 대기 (2차 회의 반영)' },
  { id: '2.3', category: '데이터 매핑 및 마스터 정제', title: '수기 예외 관리자 UI 스펙 반영', desc: 'Entity Resolution 및 품목 매칭 실패/저신뢰 건을 현업/관리자가 수기 정제·확정할 예외 관리 화면 기획 반영 확인', reason: '자동 매칭 실패 예외 데이터를 현업/관리자가 직접 조회·정제·확정하는 관리 화면 반영 필수', status: '대기', date: '2026-10-19', note: '기획서 내 예외 처리 UI 명세 대기 (1차 회의 반영)' },
  { id: '2.4', category: '데이터 매핑 및 마스터 정제', title: '신규 데이터 마스터 등록 및 동기화 방안', desc: '신규 해외 거래처/HS Code 발생 시 마스터 DB 반영 및 동기화 주기 명세 확인', reason: '신규 데이터 누락 방지 및 최신 마스터 유지보수 체계 수립 목적', status: '대기', date: '2026-10-19', note: '마스터 업데이트 주기 협의 필요 (1차 회의 반영)' },

  { id: '3.1', category: '추천 알고리즘 및 스코어링', title: 'Opportunity Score 정량 가중치 산식 룰북 확보', desc: '추천 적합도 점수(예: 87점) 산출 변수 및 가중치 공식(Formula)의 엑셀 수식 형태 수령 일정 확인', reason: '추천 적합도 점수 산출 변수별 가중치 수식을 백엔드 추천 엔진에 정량 로직으로 구현 목적', status: '대기', date: '2026-10-19', note: '백엔드 엔진 적용용 수식 룰북 대기 (2차 회의 반영)' },
  { id: '3.2', category: '추천 알고리즘 및 스코어링', title: "Product Fit '규격 유사도' Fallback 룰 수립", desc: "통관 데이터 상 상세 스펙/Grade 누락 시 LLM 환각 방지를 위한 예외 처리 및 '추정' 라벨 표기 룰 확인", reason: "통관 서류 상 스펙 누락 시 LLM의 자의적 유사도 환각 방지 및 '추정' 라벨 표기 룰 적용 필요", status: '대기', date: '2026-10-19', note: 'LLM 환각 방지 가드레일 포함 검토 예정 (2차 회의 반영)' },
  { id: '3.3', category: '추천 알고리즘 및 스코어링', title: '도착원가 및 마진 시뮬레이션 수식 수령', desc: '운임, 관세(FTA), 환율, 원가를 조합하여 마진을 계산하는 백엔드 시뮬레이션 정량 산식 제공 여부 확인', reason: '운임, 관세, 환율, 사내 원가 조합 기반 마진 계산 백엔드 시뮬레이션 로직 구현 목적', status: '대기', date: '2026-10-19', note: '무역물류팀 산식 검증 완료 룰 대기 (1차 회의 반영)' },
  { id: '3.4', category: '추천 알고리즘 및 스코어링', title: 'AI 추천 결과 정렬 및 다면적 필터링 스펙', desc: 'Score순, 거래규모순, 최근거래일순 정렬 및 국가/HS Code/마진율 조건 검색 필터링 스펙 확인', reason: '영업사원 선호도 및 전략 품목 우선순위에 맞춘 추천 카드 정렬 조회 기능 보장', status: '대기', date: '2026-10-19', note: '필터링/정렬 UI 명세 점검 예정 (2차 회의 반영)' },

  { id: '4.1', category: 'LLM 에이전트 및 검증', title: '거래 가설 출력 구조 명세 정의', desc: 'LLM 거래 가설 생성 시 프론트엔드/백엔드가 파싱 가능한 구조화된 JSON Schema 출력 정의서 전달 확인', reason: 'LLM의 자유 양식 문장 생성으로 인한 파싱 오류 방지 및 구조화된 JSON 데이터 출력 제약 필요', status: '대기', date: '2026-10-19', note: 'JSON Schema 초안 검토 중 (1차 회의 반영)' },
  { id: '4.2', category: 'LLM 에이전트 및 검증', title: 'LLM 환각 방지 프롬프트 가드레일 수립', desc: '자의적 해석을 막기 위한 프롬프트 가드레일 및 근거 데이터 ID 필수 인용(Citation) 규칙 수립 여부 확인', reason: 'LLM 자의적 답변 방지 및 원천 데이터 범위 내 근거 ID 필수 인용 가드레일 수립 목적', status: '대기', date: '2026-10-19', note: '시스템 프롬프트 명세 제출 대기 (2차 회의 반영)' },
  { id: '4.3', category: 'LLM 에이전트 및 검증', title: '원천 데이터 역추적 화면 스펙 반영', desc: '기회 카드에서 추천 근거가 된 외부 B/L 원본 데이터 및 사내 거래 이력을 팝업 조회(Drill-down)하는 UI 스펙 확인', reason: '추천 기회 카드의 근거 B/L 원본 및 사내 거래 이력 팝업 직접 조회(Drill-down) UI 구현 필요', status: '대기', date: '2026-10-19', note: '원천 B/L 조회 팝업 스펙 대기 (1차 회의 반영)' },
  { id: '4.4', category: 'LLM 에이전트 및 검증', title: 'LLM API 응답 지연 및 토큰 비용 최적화', desc: 'LLM API 호출 타임아웃 처리, 비동기 큐(Queue) 구성 및 캐싱(Caching) 전략 명세 확인', reason: '대량 가설 생성 시 화면 먹통 방지 및 Cloud/LLM API 과금 비용 최적화 목적', status: '대기', date: '2026-10-19', note: '캐싱/비동기 응답 설계 점검 예정 (2차 회의 반영)' },
  { id: '4.5', category: 'LLM 에이전트 및 검증', title: 'LLM 가설 생성 실패 시 예외 처리 Fallback UI', desc: 'LLM API 오류 또는 Token Limit 초과 발생 시 챗봇/가설 영역의 대체 가이드 문구 및 Retry 버튼 스펙 확인', reason: 'LLM 응답 오류 발생 시 사용자 화면 튕김(Crash) 방지 및 시스템 안정성 확보', status: '대기', date: '2026-10-19', note: 'Fallback UI 및 Retry 스펙 확인 예정 (1차 회의 반영)' },

  { id: '5.1', category: '화면 및 현업 프로세스 연동', title: '해외법인 정보 수집 최소화 입력 폼 기획', desc: '해외 주재원/영업사원의 수기 입력 부하를 최소화하는 선택형 중심 모바일/웹 UI 기획 반영 여부 확인', reason: '해외 주재원 및 영업사원의 수기 입력 부하 경감을 위한 선택형 중심 UI 제공 목적', status: '대기', date: '2026-10-19', note: '입력 폼 간소화 명세서 대기 (1차 회의 반영)' },
  { id: '5.2', category: '화면 및 현업 프로세스 연동', title: '검증 체크리스트 사내 CRM 연동 기획', desc: 'AI 추천 기회의 후속 검증 Task가 사내 CRM 영업기회(Pipeline) 데이터로 자동 연계되는지 확인', reason: 'AI 추천 후 영업사원 검증 Task의 사내 CRM 영업 기회(Pipeline) 자동 연계 목적', status: '대기', date: '2026-10-19', note: 'CRM API 연동 명세 대기 (1차 회의 반영)' },
  { id: '5.3', category: '화면 및 현업 프로세스 연동', title: '현업 피드백 저장 및 재학습 루프 설계', desc: '영업사원의 추천 채택/기각/오류 신고 피드백을 저장하고 추천 로직 재학습에 활용할 피드백 DB 구조 확인', reason: '영업사원 피드백(채택/기각/오류) 축적 및 추천 로직 재학습을 위한 피드백 DB 구조 설계 필요', status: '대기', date: '2026-10-19', note: '피드백 DB 테이블 설계 대기 (1차 회의 반영)' },
  { id: '5.4', category: '화면 및 현업 프로세스 연동', title: '개발 기획 산출물 Hand-off 및 PRD 수령 일정', desc: 'M2 초 개발 착수를 위한 커니의 서비스 기획서(PRD/와이어프레임) 및 데이터 정의서 Hand-off 일정 확정', reason: '개발 지연(Death March) 방지를 위한 기획-개발 간 정교한 마일스톤 전달 일정 보장 목적', status: '대기', date: '2026-10-28', note: '10월 28일까지 PRD 초안 공유 완료 예정 (2차 회의 반영)' },
  { id: '5.5', category: '화면 및 현업 프로세스 연동', title: '사용자 권한(Role)별 화면 접근 제어 스펙', desc: '본사 관리자, 국내 영업, 해외 주재원 등 사용자 역할(Role)별 데이터 조회 범위 및 기능 제한 스펙 확인', reason: '사내 민감 영업 정보 및 도착원가 데이터의 인가되지 않은 사용자 접근 차단', status: '대기', date: '2026-10-19', note: '권한별 접근 제어 매트릭스 확인 예정 (1차 회의 반영)' }
];

export const agentPresetQuestions = [
  {
    q: '미국 시장에서 최근 6개월간 PP Resin 수입량이 가장 급증한 상위 3개사는 어디인가요?',
    answer: '미국 내 통관 데이터 분석 결과, DEF Industries(+233%), Alpha Corp(+185%), Beta Petro(+142%) 순으로 수입량이 급증했습니다. 특히 DEF Industries는 효성 취급 Grade와 스펙 유사도가 92%로 즉시 공략이 가능합니다.',
    reason: 'Tendata 미국 관세청 수입 선적 물량 집계 DB 및 효성 CRM Product Fit 매칭 알고리즘 적용',
    links: [
      { label: 'Tendata 미국 수입 통관 원본 데이터', url: '#' },
      { label: '효성 화학부문 H123 Grade 스펙 시트', url: '#' }
    ]
  },
  {
    q: '멕시코 법인 관할 지역 내 TiO2 Cross-sell 가능 고객사를 추천해주세요.',
    answer: 'ABC Chemicals가 가장 유력합니다. 기존에 당사와 PP 부문에서 거래 관계가 있으나, 최근 신규 공장 증설로 TiO2 수입 소요가 연간 2,400톤 이상으로 증가하여 Cross-sell 성공 확률이 87%로 산출되었습니다.',
    reason: '멕시코 법인 현장 인텔리전스 피드 및 기존 Buyer 거래 품목 White Space 분석 결과',
    links: [
      { label: 'ABC Chemicals 최근 미팅 룸 로깅', url: '#' },
      { label: 'TiO2 글로벌 가격 추이 리포트', url: '#' }
    ]
  },
  {
    q: '베트남 Supplier Y의 멕시코 시장 진출 시 예상되는 물류비 및 관세 이점은 무엇인가요?',
    answer: '베트남 공장 출하 후 멕시코 만 자사 창고 입고 시, 기존 중국산 대비 해상 운임은 약 12% 절감되며, 태평양 연안 물류 허브를 통한 내륙 운송 기간을 5일 단축할 수 있습니다.',
    reason: '글로벌 해상운임 지수(FBX) 및 멕시코 현지 물류 인프라 연계 시뮬레이션 결과',
    links: [
      { label: '베트남-멕시코 물류 최적화 시뮬레이션', url: '#' },
      { label: 'Supplier Y CAPA 확약서', url: '#' }
    ]
  },
  {
    q: '브라질 시장의 폴리카보네이트(PC) 수입 의존도와 주요 경쟁사 동향을 알려주세요.',
    answer: '브라질은 전체 PC 수요의 93%를 수입에 의존하고 있으며, 주 공급사는 독일 및 미국계 화학사입니다. 최근 납기 지연 이슈가 빈발하여 아시아권 대체 공급선에 대한 수요가 급증하고 있습니다.',
    reason: '남미 무역 통계 협회 브라질 권역 수입 리포트 및 현지 법인 파트너사 보고서',
    links: [
      { label: '브라질 PC 수입선 다변화 분석 가이드', url: '#' }
    ]
  }
];

export const generate100ExploreItems = () => {
  const database = {
    '390210': { 
      hsCode: '3902.10', 
      name: '폴리프로필렌 (PP) 원료', 
      buyer: '미국 B사 / DEF Industries', 
      supplier: '효성 Supplier X (중국/베트남)', 
      volume: '10,000톤', 
      amount: '$14,500,000', 
      shipDate: '2026.10.01', 
      country: '미국 (US)', 
      tariff: '무관세 (FTA 적용)', 
      landedCost: '$1,480 / 톤', 
      trend: '상승세 (+14%)' 
    },
    '320611': { 
      hsCode: '3206.11', 
      name: '이산화티타늄 (TiO2) 안료', 
      buyer: '멕시코 ABC Chemicals', 
      supplier: 'Supplier A (미국/독일)', 
      volume: '2,400톤', 
      amount: '$6,720,000', 
      shipDate: '2026.09.25', 
      country: '멕시코 (MX)', 
      tariff: '관세 6% (남미공동시장)', 
      landedCost: '$2,850 / 톤', 
      trend: '안정세 (보합)' 
    },
    '390740': { 
      hsCode: '3907.40', 
      name: '폴리카보네이트 (PC) / PET', 
      buyer: '브라질 GHI Polymer', 
      supplier: '베트남 Supplier Y', 
      volume: '5,500톤', 
      amount: '$10,560,000', 
      shipDate: '2026.10.05', 
      country: '브라질 (BR)', 
      tariff: '관세 8%', 
      landedCost: '$1,950 / 톤', 
      trend: '급증세 (+22%)' 
    }
  };
  
  const categories = ['합성수지', '정밀화학', '무기원료', '섬유원료', '기능성소재'];
  const buyers = ['Alpha Corp', 'Beta Industries', 'Delta Global', 'Omega Tech', 'Sigma Solutions'];
  const suppliers = ['Supplier A', 'Supplier X', 'Supplier Y', 'Global Chem', 'Asia Petro'];
  const countries = ['미국 (US)', '멕시코 (MX)', '브라질 (BR)', '인도 (IN)', '베트남 (VN)', '독일 (DE)'];

  for (let i = 1; i <= 97; i++) {
    const codeNum = 3903 + i;
    const code = codeNum.toString();
    if (!database[code]) {
      database[code] = {
        hsCode: `${3900 + (i % 10)}.${10 + (i % 8)}`,
        name: `${categories[i % categories.length]} 품목군 ${i}호`,
        buyer: buyers[i % buyers.length],
        supplier: suppliers[i % suppliers.length],
        volume: `${(i * 350).toLocaleString()}톤`,
        amount: `$${(i * 450000).toLocaleString()}`,
        shipDate: `2026.08.${(i % 28) + 1}`,
        country: countries[i % countries.length],
        tariff: i % 2 === 0 ? '무관세 (FTA)' : '일반관세 4.5%',
        landedCost: `$${(1200 + (i * 12)) % 4500} / 톤`,
        trend: i % 2 === 0 ? '상승세 (+8%)' : '안정세 (보합)'
      };
    }
  }
  return database;
};

// 엑셀 미리보기 셀 데이터 포맷팅 헬퍼 함수 (배열/객체 파라미터 노출 방지)
export const formatExcelCellValue = (val) => {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
    return String(val);
  }
  if (Array.isArray(val)) {
    return val.map((item) => {
      if (typeof item === 'object' && item !== null) {
        return Object.entries(item).map(([k, v]) => `${k}: ${v}`).join(' | ');
      }
      return String(item);
    }).join(' 조항 / ');
  }
  if (typeof val === 'object') {
    return Object.entries(val).map(([k, v]) => `${k}: ${v}`).join(' | ');
  }
  return String(val);
};
