import React, { useState, useEffect } from 'react';

const initialOpportunities = [
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
    nextActionList: [
      { task: '베트남 공장 가용 물량 확약서 수취', owner: '구매팀', risk: '높음', done: false },
      { task: '멕시코 현지 창고 보관료 산정', owner: '물류팀', risk: '낮음', done: false }
    ]
  }
];

const marketAccountsData = [
  { company: 'ABC Chemicals', country: '멕시코', item: 'TiO2', importVol: '2,400톤/년', growth: '+18%', status: '관심 타깃', creditRating: 'A+', mainContact: 'Carlos Mendoza (구매이사)', recentIssue: '신규 공장 증설에 따른 원료 다변화 검토 중' },
  { company: 'DEF Industries', country: '미국', item: 'PP Resin', importVol: '10,000톤/년', growth: '+233%', status: '신규 제안중', creditRating: 'AA-', mainContact: 'John Smith (Sourcing Mgr)', recentIssue: '친환경 패키징 원료 전환 프로젝트 진행 중' },
  { company: 'GHI Polymer', country: '브라질', item: 'PC', importVol: '5,500톤/년', growth: '+22%', status: '검토 대기', creditRating: 'B+', mainContact: 'Lucas Silva (Director)', recentIssue: '환율 변동에 따른 3개월 단기 계약 선호' },
  { company: 'JKL Corp', country: '인도', item: 'PET Chip', importVol: '3,800톤/년', growth: '+15%', status: '기존 거래', creditRating: 'A', mainContact: 'Rajesh Kumar (Supply Head)', recentIssue: '정기 오더 물량 10% 확대 요청 완료' }
];

const initialIntelligenceLogs = [
  { branch: '멕시코 법인 (MX)', time: '1시간 전', category: '고객 니즈', content: 'ABC사 신규 공장 증설에 따라 TiO2 추가 소요 발생 예상, 현지 영업 파트너 접촉 중' },
  { branch: '베트남 법인 (VN)', time: '3시간 전', category: '공급사 정보', content: 'Supplier Y, PET Chip 신규 라인 가동 개시 및 수출 가능 물량 확보 완료' },
  { branch: '미국 법인 (US)', time: '5시간 전', category: '시장 동향', content: '미국내 친환경 패키징 수요 증가로 리사이클 폴리머 관세 면제 검토 소식' },
  { branch: '유럽 법인 (EU)', time: '8시간 전', category: '규제 대응', content: 'EU 탄소국경조정제도(CBAM) 강화에 따른 친환경 인증 폴리머 수요 급증' }
];

const initialChecklistItems = [
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

const agentPresetQuestions = [
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

const generate100ExploreItems = () => {
  const database = {
    '3902': { 
      hsCode: '3902.10.0000', 
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
    '3206': { 
      hsCode: '3206.11.0000', 
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
    '3907': { 
      hsCode: '3907.40.0000', 
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

  for (let i = 1; i <= 100; i++) {
    const code = (3900 + i).toString();
    if (!database[code]) {
      database[code] = {
        hsCode: `${3900 + (i % 10)}.${10 + (i % 8)}.000${i % 10}`,
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

export default function App() {
  const [activeTab, setActiveTab] = useState('desk'); 

  // [고도화 1번] My Trade Desk 맞춤형 필터 상태
  const [deskRegionFilter, setDeskRegionFilter] = useState('전체');
  const [deskItemFilter, setDeskItemFilter] = useState('전체');

  // [고도화 2번] My Opportunities 뷰 전환 상태 (kanban vs table)
  const [oppViewMode, setOppViewMode] = useState('kanban'); 

  // [고도화 6번] Pipeline GP 매출 시뮬레이터 상태
  const [targetRevenue, setTargetRevenue] = useState(50); // 억원 목표

  // 영업기회 상태 (localStorage 연동)
  const [opportunities, setOpportunities] = useState(() => {
    const saved = localStorage.getItem('trade_iq_opportunities');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialOpportunities;
  });
  const [selectedOpp, setSelectedOpp] = useState(opportunities[0]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); 
  const [activeAgent, setActiveAgent] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [notification, setNotification] = useState('');

  // 엑셀 웹 미리보기 모달 상태
  const [excelPreviewData, setExcelPreviewData] = useState(null);
  const [excelPreviewTitle, setExcelPreviewTitle] = useState('');

  // 해외법인 인텔리전스 로그 상태
  const [intelligenceLogs, setIntelligenceLogs] = useState(() => {
    const saved = localStorage.getItem('trade_iq_intel_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialIntelligenceLogs;
  });

  const [newIntel, setNewIntel] = useState({ branch: '멕시코 법인 (MX)', category: '고객 니즈', content: '' });

  // 사용자 프로필 상태
  const [userProfile, setUserProfile] = useState(() => {
    const savedProfile = localStorage.getItem('trade_iq_user_profile');
    if (savedProfile) {
      try { return JSON.parse(savedProfile); } catch (e) { console.error(e); }
    }
    return { name: '김성환 차장', team: '화학팀', region: '북미·중남미' };
  });
  const [tempProfile, setTempProfile] = useState(userProfile);

  useEffect(() => {
    localStorage.setItem('trade_iq_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('trade_iq_opportunities', JSON.stringify(opportunities));
  }, [opportunities]);

  useEffect(() => {
    localStorage.setItem('trade_iq_intel_logs', JSON.stringify(intelligenceLogs));
  }, [intelligenceLogs]);

  // 체크리스트 상태 관리
  const [checklistItems, setChecklistItems] = useState(() => {
    const saved = localStorage.getItem('trade_iq_checklist');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialChecklistItems;
  });
  const [checklistFilter, setChecklistFilter] = useState('전체');

  useEffect(() => {
    localStorage.setItem('trade_iq_checklist', JSON.stringify(checklistItems));
  }, [checklistItems]);

  // AI AGENT 챗봇 세션
  const [chatSessions, setChatSessions] = useState([
    { id: 1, title: '미국 PP Resin 수입사 분석', messages: [], isSearched: false, currentActiveReason: '', currentActiveLinks: [] }
  ]);
  const [activeSessionId, setActiveSessionId] = useState(1);
  const [chatInput, setChatInput] = useState('');

  // Explore 100개 데이터
  const [exploreDatabase, setExploreDatabase] = useState(() => {
    const initialDb = generate100ExploreItems();
    localStorage.setItem('trade_iq_explore_db', JSON.stringify(initialDb));
    return initialDb;
  });

  const [hsCodeInput, setHsCodeInput] = useState('3902');
  const [exploreResult, setExploreResult] = useState(exploreDatabase['3902'] || null);

  useEffect(() => {
    localStorage.setItem('trade_iq_explore_db', JSON.stringify(exploreDatabase));
  }, [exploreDatabase]);

  const triggerAlert = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  // 엑셀 웹 화면 미리보기 및 다운로드 핸들러
  const handleOpenExcelPreview = (title, dataArray) => {
    setExcelPreviewTitle(title);
    setExcelPreviewData(dataArray);
    setModalType('excelPreview');
    setIsModalOpen(true);
  };

  const handleDownloadActualExcel = () => {
    if (!excelPreviewData || excelPreviewData.length === 0) return;
    const headers = Object.keys(excelPreviewData[0]);
    const csvRows = [
      headers.join(','),
      ...excelPreviewData.map(row => headers.map(fieldName => JSON.stringify(row[fieldName] || '')).join(','))
    ];
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${excelPreviewTitle}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerAlert(`📊 '${excelPreviewTitle}.csv' 파일 다운로드가 완료되었습니다.`);
  };

  // PDF 리포트 다운로드
  const handleExportPdf = (title) => {
    const blob = new Blob([`[Hyosung Trade AX Report]\n\nTitle: ${title}\nDate: 2026-10-13\nAuthor: 김성환 차장\n\n- AI Agent Deal Hypothesis & Data Analysis Verified -`], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerAlert(`📑 '${title}' PDF 리포트 다운로드가 완료되었습니다.`);
  };

  // 영업기회 승격 및 CRM 연동
  const handlePromoteOpportunity = (oppId) => {
    setOpportunities(prev => prev.map(o => {
      if (o.id === oppId) {
        return { ...o, status: '견적 진행' };
      }
      return o;
    }));
    triggerAlert('영업 검토 상태가 "견적 진행"으로 승격되어 사내 CRM 파이프라인에 실시간 연동되었습니다!');
    setIsModalOpen(false);
  };

  const handleCreateNewChat = () => {
    const newSession = {
      id: Date.now(),
      title: '새로운 무역 분석 대화',
      messages: [],
      isSearched: false,
      currentActiveReason: '',
      currentActiveLinks: []
    };
    setChatSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  const handleDeleteChatSession = (e, sessionId) => {
    e.stopPropagation();
    if (chatSessions.length === 1) {
      triggerAlert('최소 1개의 채팅 세션은 유지되어야 합니다.');
      return;
    }
    const updated = chatSessions.filter(s => s.id !== sessionId);
    setChatSessions(updated);
    if (activeSessionId === sessionId) {
      setActiveSessionId(updated[0].id);
    }
    triggerAlert('채팅 세션이 삭제되었습니다.');
  };

  const handleSendMessage = (customText) => {
    const textToSend = customText || chatInput;
    if (!textToSend.trim()) return;

    const newMsg = { sender: 'user', text: textToSend };
    const matchedPreset = agentPresetQuestions.find(item => item.q === textToSend);

    let aiResponseText = '해당 질의에 대한 글로벌 무역 통관 및 CRM 데이터 분석 결과, 신규 바이어 발굴 및 수입 성장 추세가 확인되었습니다.';
    let aiReasonText = 'Tendata 글로벌 통관 DB 및 최근 12개월 수입 실적 교차 검증';
    let aiLinksList = [{ label: '관련 통관 통계 데이터셋 원본', url: '#' }];

    if (matchedPreset) {
      aiResponseText = matchedPreset.answer;
      aiReasonText = matchedPreset.reason;
      aiLinksList = matchedPreset.links;
    } else {
      aiResponseText = `"${textToSend}"에 대한 AI 에이전트 분석 결과, 연관된 국가의 수입 물량 증가세와 효성 공급 가능 Grade 매칭이 확인되었습니다.`;
    }

    const aiMsg = { sender: 'ai', text: aiResponseText, reason: aiReasonText, links: aiLinksList };

    setChatSessions(prev => prev.map(session => {
      if (session.id === activeSessionId) {
        const newTitle = session.messages.length === 0 ? (textToSend.length > 18 ? textToSend.slice(0, 18) + '...' : textToSend) : session.title;
        return {
          ...session,
          title: newTitle,
          messages: [...session.messages, newMsg, aiMsg],
          isSearched: true,
          currentActiveReason: aiReasonText,
          currentActiveLinks: aiLinksList
        };
      }
      return session;
    }));

    if (!customText) setChatInput('');
  };

  const handleToggleChecklistStatus = (id) => {
    setChecklistItems(prev => prev.map(item => {
      if (item.id === id) {
        let nextStatus = '대기';
        if (item.status === '대기') nextStatus = '진행중';
        else if (item.status === '진행중') nextStatus = '완료';
        else if (item.status === '완료') nextStatus = '대기';
        return { ...item, status: nextStatus };
      }
      return item;
    }));
    triggerAlert('실무 점검표 확인 결과가 업데이트되었습니다.');
  };

  const handleNoteChange = (id, newNote) => {
    setChecklistItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, note: newNote };
      }
      return item;
    }));
  };

  // [고도화 1번 반영] My Trade Desk 필터링 로직
  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          opp.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          opp.item.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = deskRegionFilter === '전체' || opp.region === deskRegionFilter;
    const matchesItem = deskItemFilter === '전체' || opp.item === deskItemFilter;
    return matchesSearch && matchesRegion && matchesItem;
  });

  const filteredChecklist = checklistFilter === '전체' 
    ? checklistItems 
    : checklistItems.filter(item => item.category === checklistFilter);

  const completedCount = checklistItems.filter(i => i.status === '완료').length;
  const inProgressCount = checklistItems.filter(i => i.status === '진행중').length;
  const pendingCount = checklistItems.filter(i => i.status === '대기').length;
  const completionRate = Math.round((completedCount / checklistItems.length) * 100);

  const currentSession = chatSessions.find(s => s.id === activeSessionId) || chatSessions[0];

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', backgroundColor: '#f4f6f9', fontFamily: 'sans-serif', color: '#333', margin: 0, overflow: 'hidden', position: 'relative' }}>
      
      {notification && (
        <div style={{ position: 'fixed', top: '20px', right: '30px', backgroundColor: '#4f46e5', color: '#fff', padding: '12px 24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 2000, fontSize: '14px', fontWeight: 'bold' }}>
          ✨ {notification}
        </div>
      )}

      {/* 공통 모달 레이어 */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1500 }}>
          <div style={{ backgroundColor: '#fff', width: modalType === 'excelPreview' ? '900px' : '680px', maxHeight: '85vh', overflowY: 'auto', borderRadius: '12px', padding: '32px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', boxSizing: 'border-box' }}>
            
            {modalType === 'excelPreview' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
                  <div>
                    <span style={{ fontSize: '11px', backgroundColor: '#ecfdf5', color: '#047857', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>엑셀 데이터 웹 미리보기 뷰어</span>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '6px 0 0 0', color: '#1e293b' }}>{excelPreviewTitle}</h3>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}>✕</button>
                </div>
                <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '20px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569', position: 'sticky', top: 0 }}>
                        {excelPreviewData && excelPreviewData.length > 0 && Object.keys(excelPreviewData[0]).map((key, idx) => (
                          <th key={idx} style={{ padding: '10px 12px' }}>{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {excelPreviewData && excelPreviewData.map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          {Object.values(row).map((val, j) => (
                            <td key={j} style={{ padding: '10px 12px', color: '#334155' }}>{typeof val === 'object' ? JSON.stringify(val) : String(val)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  <button onClick={() => setIsModalOpen(false)} style={{ padding: '10px 16px', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', color: '#475569' }}>닫기</button>
                  <button onClick={handleDownloadActualExcel} style={{ padding: '10px 20px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>💾 실제 엑셀 파일 다운로드</button>
                </div>
              </div>
            )}

            {modalType === 'hypothesis' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
                  <div>
                    <span style={{ fontSize: '11px', backgroundColor: '#e0e7ff', color: '#4338ca', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>Deal Hypothesis 상세 검토</span>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '6px 0 0 0', color: '#1e293b' }}>{selectedOpp.title}</h3>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}>✕</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px' }}>
                  <div style={{ backgroundColor: '#eef2ff', padding: '14px', borderRadius: '8px', color: '#312e81', lineHeight: '1.5' }}>
                    <strong>거래 가설 (Hypothesis):</strong> {selectedOpp.hypothesis}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155', marginBottom: '8px' }}>데이터 기반 근거 분석</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: '#475569' }}>
                      <div style={{ padding: '8px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>✓ <strong>수요 성장성:</strong> {selectedOpp.demand}</div>
                      <div style={{ padding: '8px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>✓ <strong>Product Fit:</strong> {selectedOpp.productFit}</div>
                      <div style={{ padding: '8px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>✓ <strong>접근 가능성:</strong> {selectedOpp.access}</div>
                    </div>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: '#b45309', marginBottom: '8px' }}>⚠️ 확인 필요 사항 (Next to Validate 체크리스트)</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {selectedOpp.nextActionList.map((item, idx) => (
                        <label key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', backgroundColor: '#fffbeb', borderRadius: '6px', border: '1px solid #fde68a', cursor: 'pointer' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                            <input type="checkbox" defaultChecked={item.done} onChange={(e) => { item.done = e.target.checked; }} />
                            <span style={{ color: '#92400e', fontWeight: '500' }}>{item.task}</span>
                          </div>
                          <span style={{ fontSize: '11px', backgroundColor: '#fef3c7', color: '#d97706', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{item.owner} ({item.risk})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  <button onClick={() => handleOpenExcelPreview(selectedOpp.title, [selectedOpp])} style={{ padding: '10px 14px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>📊 엑셀 미리보기</button>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setIsModalOpen(false)} style={{ padding: '10px 16px', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', color: '#475569' }}>닫기</button>
                    <button onClick={() => handlePromoteOpportunity(selectedOpp.id)} style={{ padding: '10px 20px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>영업 Task 및 견적 승격 (CRM 연동)</button>
                  </div>
                </div>
              </div>
            )}

            {/* [고도화 3번] Accounts & Markets 고객사 360도 프로필 모달 */}
            {modalType === 'accountProfile' && selectedAccount && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
                  <div>
                    <span style={{ fontSize: '11px', backgroundColor: '#e0e7ff', color: '#4338ca', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>고객사 360° 입체 분석 프로필</span>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '6px 0 0 0', color: '#1e293b' }}>{selectedAccount.company} ({selectedAccount.country})</h3>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}>✕</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px', color: '#334155' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>주요 취급 품목</span>
                      <p style={{ fontWeight: 'bold', margin: '4px 0 0 0' }}>{selectedAccount.item}</p>
                    </div>
                    <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>연간 수입 물량 / 성장률</span>
                      <p style={{ fontWeight: 'bold', color: '#059669', margin: '4px 0 0 0' }}>{selectedAccount.importVol} ({selectedAccount.growth})</p>
                    </div>
                    <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>신용 등급</span>
                      <p style={{ fontWeight: 'bold', color: '#4f46e5', margin: '4px 0 0 0' }}>{selectedAccount.creditRating}</p>
                    </div>
                    <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>핵심 담당자 (Buyer Contact)</span>
                      <p style={{ fontWeight: 'bold', margin: '4px 0 0 0' }}>{selectedAccount.mainContact}</p>
                    </div>
                  </div>
                  <div style={{ backgroundColor: '#fffbeb', padding: '14px', borderRadius: '8px', border: '1px solid #fde68a', color: '#92400e' }}>
                    <strong>📌 최근 현장 영업 이슈 및 요구사항:</strong>
                    <p style={{ margin: '6px 0 0 0', lineHeight: '1.4' }}>{selectedAccount.recentIssue}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  <button onClick={() => setIsModalOpen(false)} style={{ padding: '10px 16px', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', color: '#475569' }}>닫기</button>
                  <button onClick={() => { triggerAlert(`${selectedAccount.company}와의 신규 미팅 일정이 캘린더에 연동되었습니다.`); setIsModalOpen(false); }} style={{ padding: '10px 20px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>영업 미팅 일정 잡기</button>
                </div>
              </div>
            )}

            {modalType === 'reportPreview' && selectedReport && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
                  <div>
                    <span style={{ fontSize: '11px', backgroundColor: '#e0e7ff', color: '#4338ca', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>AI 분석 리포트 미리 보기</span>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '6px 0 0 0', color: '#1e293b' }}>{selectedReport.title}</h3>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}>✕</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px', color: '#334155' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <span>작성일: <strong>{selectedReport.date}</strong></span>
                    <span>작성 에이전트/담당자: <strong>{selectedReport.author}</strong></span>
                  </div>
                  <div style={{ backgroundColor: '#fffbeb', padding: '16px', borderRadius: '8px', border: '1px solid #fde68a', color: '#92400e', lineHeight: '1.6' }}>
                    <strong>💡 요약 및 핵심 인사이트:</strong><br />
                    본 리포트는 AI 에이전트가 수집한 글로벌 무역 통계 및 효성 각 법인의 영업 이력을 교차 분석하여 도출된 전략 문서입니다.
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  <button onClick={() => setIsModalOpen(false)} style={{ padding: '10px 16px', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', color: '#475569' }}>닫기</button>
                  <button onClick={() => handleExportPdf(selectedReport.title)} style={{ padding: '10px 20px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>PDF 다운로드</button>
                </div>
              </div>
            )}

            {modalType === 'profile' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#1e293b' }}>사용자 프로필 및 담당 권한 설정</h3>
                  <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}>✕</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#334155' }}>사용자 성명</label>
                    <input 
                      type="text" 
                      value={tempProfile.name} 
                      onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                      style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#334155' }}>소속 부서</label>
                    <input 
                      type="text" 
                      value={tempProfile.team} 
                      onChange={(e) => setTempProfile({ ...tempProfile, team: e.target.value })}
                      style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#334155' }}>담당 지역 / 권한</label>
                    <input 
                      type="text" 
                      value={tempProfile.region} 
                      onChange={(e) => setTempProfile({ ...tempProfile, region: e.target.value })}
                      style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }} 
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  <button onClick={() => { setTempProfile(userProfile); setIsModalOpen(false); }} style={{ padding: '10px 16px', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', color: '#475569' }}>취소</button>
                  <button onClick={() => { 
                    setUserProfile(tempProfile); 
                    triggerAlert('프로필 정보가 성공적으로 저장되었습니다.'); 
                    setIsModalOpen(false); 
                  }} style={{ padding: '10px 20px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>저장</button>
                </div>
              </div>
            )}

            {modalType === 'agentTune' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#1e293b' }}>AI Agent 설정 튜닝 ({activeAgent})</h3>
                  <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}>✕</button>
                </div>
                <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>
                  해당 에이전트의 자동 탐색 주기 및 데이터 가중치 파라미터를 조정할 수 있습니다.
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  <button onClick={() => { triggerAlert('설정이 반영되었습니다.'); setIsModalOpen(false); }} style={{ padding: '10px 20px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>확인</button>
                </div>
              </div>
            )}

            {modalType === 'addIntel' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#1e293b' }}>🌐 해외법인 현장 인텔리전스 긴급 등록</h3>
                  <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}>✕</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#334155' }}>등록 법인</label>
                    <select 
                      value={newIntel.branch}
                      onChange={(e) => setNewIntel({ ...newIntel, branch: e.target.value })}
                      style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
                    >
                      <option value="멕시코 법인 (MX)">멕시코 법인 (MX)</option>
                      <option value="미국 법인 (US)">미국 법인 (US)</option>
                      <option value="베트남 법인 (VN)">베트남 법인 (VN)</option>
                      <option value="유럽 법인 (EU)">유럽 법인 (EU)</option>
                      <option value="인도 법인 (IN)">인도 법인 (IN)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#334155' }}>인텔리전스 카테고리</label>
                    <select 
                      value={newIntel.category}
                      onChange={(e) => setNewIntel({ ...newIntel, category: e.target.value })}
                      style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
                    >
                      <option value="고객 니즈">고객 니즈</option>
                      <option value="공급사 정보">공급사 정보</option>
                      <option value="시장 동향">시장 동향</option>
                      <option value="규제 대응">규제 대응</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#334155' }}>인텔리전스 내용</label>
                    <textarea 
                      rows={4}
                      placeholder="현장 영업 특이사항 및 긴급 인텔리전스 내용을 입력하세요..."
                      value={newIntel.content}
                      onChange={(e) => setNewIntel({ ...newIntel, content: e.target.value })}
                      style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', resize: 'vertical' }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  <button onClick={() => setIsModalOpen(false)} style={{ padding: '10px 16px', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', color: '#475569' }}>취소</button>
                  <button onClick={() => {
                    if (!newIntel.content.trim()) {
                      triggerAlert('인텔리전스 내용을 입력해 주세요.');
                      return;
                    }
                    const addedItem = {
                      branch: newIntel.branch,
                      time: '방금 전',
                      category: newIntel.category,
                      content: newIntel.content
                    };
                    setIntelligenceLogs([addedItem, ...intelligenceLogs]);
                    triggerAlert('해외법인 현장 인텔리전스가 성공적으로 등록되었습니다!');
                    setIsModalOpen(false);
                    setNewIntel({ branch: '멕시코 법인 (MX)', category: '고객 니즈', content: '' });
                  }} style={{ padding: '10px 20px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>등록하기</button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 사이드바 네비게이션 */}
      <div style={{ width: '250px', backgroundColor: '#1e293b', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexShrink: 0, height: '100vh' }}>
        <div>
          <div style={{ padding: '24px', borderBottom: '1px solid #334155' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#818cf8', margin: 0 }}>Trade IQ</h1>
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: '4px 0 0 0' }}>Opportunity Intelligence Platform</p>
          </div>
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
            {[
              { id: 'desk', label: '🎯 My Trade Desk' },
              { id: 'opportunities', label: '📊 My Opportunities' },
              { id: 'accounts', label: '🏢 Accounts & Markets' },
              { id: 'network', label: '⚡ Intelligence Network' },
              { id: 'explore', label: '🔍 Explore' },
              { id: 'pipeline', label: '📈 Pipeline' },
              { id: 'reports', label: '📑 Reports' },
              { id: 'checklist', label: '📝 Check List' },
              { id: 'agents', label: '🤖 AI AGENT' },
            ].map(tab => (
              <div 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)} 
                style={{ 
                  padding: '10px 14px', 
                  backgroundColor: activeTab === tab.id ? '#4f46e5' : 'transparent', 
                  borderRadius: '8px', 
                  cursor: 'pointer', 
                  color: activeTab === tab.id ? '#fff' : '#cbd5e1',
                  fontWeight: activeTab === tab.id ? 'bold' : 'normal'
                }}
              >
                {tab.label}
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '16px', borderTop: '1px solid #334155', fontSize: '12px', color: '#94a3b8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontWeight: 'bold', color: '#f8fafc', margin: 0 }}>{userProfile.name}</p>
            <p style={{ margin: '2px 0 0 0' }}>{userProfile.team} | {userProfile.region}</p>
          </div>
          <button onClick={() => { 
            setTempProfile(userProfile);
            setModalType('profile'); 
            setIsModalOpen(true); 
          }} style={{ background: '#334155', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>설정</button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', width: 'calc(100vw - 250px)' }}>
        
        {/* 상단 헤더 */}
        <div style={{ height: '64px', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', width: '100%', boxSizing: 'border-box', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
              {activeTab === 'desk' && 'Trade IQ - 영업기회 발굴 대시보드'}
              {activeTab === 'opportunities' && '내 영업기회 파이프라인 관리 (Opportunity Pipeline)'}
              {activeTab === 'accounts' && '고객사 및 글로벌 시장 환경 분석 (Accounts & Markets)'}
              {activeTab === 'network' && '해외법인 인텔리전스 및 AI Agent 튜닝 (Intelligence Network)'}
              {activeTab === 'explore' && '글로벌 무역 통관 데이터 탐색기 (Explore)'}
              {activeTab === 'pipeline' && '영업 전환율 및 GP 매출 시뮬레이터 파이프라인'}
              {activeTab === 'reports' && 'AI 분석 인사이트 리포트 및 지식 자산화 (Reports)'}
              {activeTab === 'checklist' && '효성 무역PG 영업기회 발굴 AX 프로젝트 - 전체 실무 체크리스트'}
              {activeTab === 'agents' && 'AI AGENT - 스마트 무역 어시스턴트'}
            </h2>
            <span style={{ fontSize: '11px', backgroundColor: '#e0e7ff', color: '#4338ca', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold' }}>Advanced MVP</span>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button onClick={() => handleOpenExcelPreview('Hyosung_Opportunities_All', opportunities)} style={{ padding: '8px 12px', backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>📊 전체 엑셀 미리보기</button>
            <input 
              type="text" 
              placeholder="고객, 품목, 국가 통합 검색..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '8px 14px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '6px', width: '220px', outline: 'none' }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '32px', width: '100%', boxSizing: 'border-box' }}>
          
          {/* [고도화 1번] TAB 1: My Trade Desk (맞춤형 관심 위젯 필터) */}
          {activeTab === 'desk' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '16px 20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>📌 맞춤형 관심 위젯 필터:</span>
                  <select value={deskRegionFilter} onChange={(e) => setDeskRegionFilter(e.target.value)} style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}>
                    <option value="전체">전체 지역 (Region)</option>
                    <option value="멕시코">멕시코</option>
                    <option value="미국">미국</option>
                  </select>
                  <select value={deskItemFilter} onChange={(e) => setDeskItemFilter(e.target.value)} style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}>
                    <option value="전체">전체 품목 (Item)</option>
                    <option value="TiO2">TiO2</option>
                    <option value="PP Resin">PP Resin</option>
                    <option value="PET Chip">PET Chip</option>
                  </select>
                </div>
                <span style={{ fontSize: '12px', color: '#64748b' }}>필터링된 추천 기회: <strong>{filteredOpportunities.length}건</strong></span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>새로운 기회</p>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#4f46e5', margin: '6px 0 0 0' }}>{opportunities.length} 건</h3>
                </div>
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>진행 중 기회 (견적 승격 반영)</p>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', margin: '6px 0 0 0' }}>
                    {opportunities.filter(o => o.status === '견적 진행').length + 15} <span style={{ fontSize: '11px', fontWeight: 'normal', color: '#64748b' }}>견적 {opportunities.filter(o => o.status === '견적 진행').length + 5}건</span>
                  </h3>
                </div>
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>예상 매출 (6개월)</p>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669', margin: '6px 0 0 0' }}>32.6억 <span style={{ fontSize: '11px', color: '#059669' }}>▲12%</span></h3>
                </div>
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>확인 요청</p>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#d97706', margin: '6px 0 0 0' }}>5 건</h3>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: 0 }}>🤖 AI가 새롭게 발굴한 기회</h3>
                  {filteredOpportunities.map((opp) => (
                    <div 
                      key={opp.id} 
                      onClick={() => setSelectedOpp(opp)}
                      style={{ 
                        backgroundColor: '#fff', padding: '20px', borderRadius: '10px', cursor: 'pointer',
                        border: selectedOpp.id === opp.id ? '2px solid #4f46e5' : '1px solid #e2e8f0',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{ fontSize: '11px', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', color: '#475569' }}>{opp.type}</span>
                          <span style={{ fontSize: '11px', backgroundColor: '#ecfdf5', color: '#047857', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>적합도 {opp.score}점</span>
                          <span style={{ fontSize: '11px', backgroundColor: opp.status === '견적 진행' ? '#eef2ff' : '#fef3c7', color: opp.status === '견적 진행' ? '#4338ca' : '#d97706', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>상태: {opp.status}</span>
                        </div>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>{opp.date}</span>
                      </div>
                      <h4 style={{ fontSize: '16px', fontWeight: 'bold', margin: '10px 0 6px 0' }}>{opp.title}</h4>
                      <p style={{ fontSize: '12px', color: '#475569', backgroundColor: '#f8fafc', padding: '10px', borderRadius: '6px', margin: '0 0 12px 0' }}>
                        💡 <strong>Deal Hypothesis:</strong> {opp.hypothesis}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                        <span>지역: <strong>{opp.region}</strong> | 품목: <strong>{opp.item}</strong> | 예상 GP: <strong style={{ color: '#4f46e5' }}>{opp.expectedGP}</strong></span>
                        <span style={{ color: '#4f46e5', fontWeight: 'bold' }}>가설 검토하기 →</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '16px', height: 'fit-content' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#4f46e5', textTransform: 'uppercase' }}>Deal Hypothesis 상세 보기</span>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '4px 0' }}>{selectedOpp.title}</h3>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>현재 상태: <strong style={{ color: '#4338ca' }}>{selectedOpp.status}</strong></p>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: '#334155', textTransform: 'uppercase', margin: '0 0 6px 0' }}>거래 가설 (Hypothesis)</h4>
                    <div style={{ backgroundColor: '#eef2ff', padding: '12px', borderRadius: '8px', fontSize: '13px', color: '#312e81', lineHeight: '1.5' }}>
                      {selectedOpp.hypothesis}
                    </div>
                  </div>
                  <button 
                    onClick={() => { setModalType('hypothesis'); setIsModalOpen(true); }}
                    style={{ backgroundColor: '#4f46e5', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', marginTop: '10px' }}
                  >
                    🔍 가설 심층 검토 및 체크리스트 열기
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* [고도화 2번] TAB 2: My Opportunities (칸반 / 테이블 뷰 전환) */}
          {activeTab === 'opportunities' && (
            <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '10px', border: '1px solid #e2e8f0', width: '100%', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#1e293b' }}>📊 진행 중인 영업기회 파이프라인 관리 (Opportunity Pipeline)</h3>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>칸반 보드와 테이블 뷰 간 전환을 지원합니다.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setOppViewMode('kanban')} style={{ padding: '8px 14px', backgroundColor: oppViewMode === 'kanban' ? '#4f46e5' : '#f1f5f9', color: oppViewMode === 'kanban' ? '#fff' : '#475569', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>칸반 뷰</button>
                  <button onClick={() => setOppViewMode('table')} style={{ padding: '8px 14px', backgroundColor: oppViewMode === 'table' ? '#4f46e5' : '#f1f5f9', color: oppViewMode === 'table' ? '#fff' : '#475569', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>테이블 뷰</button>
                  <button onClick={() => handleOpenExcelPreview('My_Opportunities_Pipeline', opportunities)} style={{ padding: '8px 14px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>엑셀 다운로드</button>
                </div>
              </div>

              {oppViewMode === 'kanban' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', width: '100%' }}>
                  {['신규 제안', '검토 중', '견적 진행', '계약 완료'].map((stage, idx) => {
                    const stageItems = opportunities.filter(o => o.status === stage);
                    return (
                      <div key={idx} style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', minHeight: '350px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#334155', margin: '0 0 16px 0', borderBottom: '2px solid #4f46e5', paddingBottom: '8px' }}>
                          {stage} ({stageItems.length})
                        </h4>
                        {stageItems.map(opp => (
                          <div key={opp.id} onClick={() => { setSelectedOpp(opp); setModalType('hypothesis'); setIsModalOpen(true); }} style={{ backgroundColor: '#fff', padding: '12px', borderRadius: '6px', border: '1px solid #4f46e5', fontSize: '12px', marginBottom: '10px', cursor: 'pointer', boxShadow: '0 1px 3px rgba(79,70,229,0.15)' }}>
                            <span style={{ fontSize: '10px', backgroundColor: '#eef2ff', color: '#4338ca', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{opp.type}</span>
                            <strong style={{ display: 'block', margin: '6px 0 4px 0' }}>{opp.title}</strong>
                            <p style={{ color: '#059669', margin: 0, fontWeight: 'bold' }}>예상 GP: {opp.expectedGP}</p>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                      <th style={{ padding: '12px' }}>기회명</th>
                      <th style={{ padding: '12px' }}>유형</th>
                      <th style={{ padding: '12px' }}>국가</th>
                      <th style={{ padding: '12px' }}>품목</th>
                      <th style={{ padding: '12px' }}>예상 GP</th>
                      <th style={{ padding: '12px' }}>상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {opportunities.map(opp => (
                      <tr key={opp.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px', fontWeight: 'bold', color: '#1e293b' }}>{opp.title}</td>
                        <td style={{ padding: '12px' }}>{opp.type}</td>
                        <td style={{ padding: '12px' }}>{opp.region}</td>
                        <td style={{ padding: '12px' }}>{opp.item}</td>
                        <td style={{ padding: '12px', color: '#059669', fontWeight: 'bold' }}>{opp.expectedGP}</td>
                        <td style={{ padding: '12px'}}><span style={{ backgroundColor: '#e0e7ff', color: '#3730a3', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>{opp.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* [고도화 3번] TAB 3: Accounts & Markets (고객사 360도 프로필) */}
          {activeTab === 'accounts' && (
            <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '10px', border: '1px solid #e2e8f0', width: '100%', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#1e293b' }}>🏢 고객사 및 글로벌 시장 환경 분석 (Customer 360°)</h3>
                <button onClick={() => handleOpenExcelPreview('Accounts_Master_List', marketAccountsData)} style={{ padding: '8px 14px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>엑셀 다운로드</button>
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>주요 Buyer/Supplier의 3개년 수입 추이 및 신용도를 입체적으로 분석합니다. [360° 프로필]을 클릭하세요.</p>
              
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                    <th style={{ padding: '12px' }}>고객사명</th>
                    <th style={{ padding: '12px' }}>국가</th>
                    <th style={{ padding: '12px' }}>주요 품목</th>
                    <th style={{ padding: '12px' }}>연간 수입 물량</th>
                    <th style={{ padding: '12px' }}>수요 증가율</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>상세 뷰</th>
                  </tr>
                </thead>
                <tbody>
                  {marketAccountsData.map((acc, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px', fontWeight: 'bold', color: '#1e293b' }}>{acc.company}</td>
                      <td style={{ padding: '12px', color: '#64748b' }}>{acc.country}</td>
                      <td style={{ padding: '12px', color: '#64748b' }}>{acc.item}</td>
                      <td style={{ padding: '12px', color: '#64748b' }}>{acc.importVol}</td>
                      <td style={{ padding: '12px', color: '#059669', fontWeight: 'bold' }}>{acc.growth}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <button 
                          onClick={() => {
                            setSelectedAccount(acc);
                            setModalType('accountProfile');
                            setIsModalOpen(true);
                          }} 
                          style={{ padding: '6px 12px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          360° 프로필
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 4: Intelligence Network */}
          {activeTab === 'network' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', boxSizing: 'border-box' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>연동된 해외법인</p>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#4f46e5', margin: '6px 0 0 0' }}>6개 법인 <span style={{ fontSize: '11px', fontWeight: 'normal', color: '#059669' }}>● 실시간 동기화</span></h3>
                </div>
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>누적 인텔리전스</p>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', margin: '6px 0 0 0' }}>{intelligenceLogs.length} 건 <span style={{ fontSize: '11px', color: '#059669' }}>▲실시간</span></h3>
                </div>
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>활성 AI 에이전트 수</p>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669', margin: '6px 0 0 0' }}>3개 모델 <span style={{ fontSize: '11px', color: '#64748b' }}>정상 가동</span></h3>
                </div>
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>자동 알림 발송 건수</p>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#d97706', margin: '6px 0 0 0' }}>12 건</h3>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h4 style={{ fontSize: '15px', fontWeight: 'bold', margin: 0, color: '#1e293b' }}>🌐 글로벌 법인별 실시간 현장 인텔리전스 스트림</h4>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => { setModalType('addIntel'); setIsModalOpen(true); }}
                          style={{ padding: '6px 12px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                          ＋ 현장 인텔리전스 긴급 등록
                        </button>
                        <button onClick={() => triggerAlert('실시간 인텔리전스 피드가 최신 상태로 새로고침되었습니다.')} style={{ padding: '6px 12px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', color: '#475569' }}>새로고침</button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
                      {intelligenceLogs.map((log, i) => (
                        <div key={i} style={{ padding: '14px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <strong style={{ color: '#4f46e5' }}>{log.branch}</strong>
                              <span style={{ fontSize: '11px', backgroundColor: '#e0e7ff', color: '#3730a3', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{log.category}</span>
                            </div>
                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>{log.time}</span>
                          </div>
                          <p style={{ margin: '4px 0 0 0', color: '#334155', lineHeight: '1.4' }}>{log.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 16px 0', color: '#1e293b' }}>🤖 시나리오별 AI Agent 오케스트레이션</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {[
                        { name: '신규 Buyer 발굴 Agent', desc: 'Tendata 통관 데이터 기반 수입량 급증사 매칭', cycle: '1시간 주기' },
                        { name: '기존 고객 Cross-sell Agent', desc: 'White Space 품목 분석 및 교차 판매 제안', cycle: '1일 주기' },
                        { name: 'Supplier 신규시장 매칭 Agent', desc: '생산 CAPA와 해외 바이어 수요 최적 연계', cycle: '실시간 스트리밍' }
                      ].map((agent, i) => (
                        <div key={i} style={{ padding: '14px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong style={{ fontSize: '13px', color: '#1e293b' }}>{agent.name}</strong>
                            <span style={{ fontSize: '11px', backgroundColor: '#ecfdf5', color: '#047857', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>정상 가동</span>
                          </div>
                          <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{agent.desc}</p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '8px', fontSize: '11px', color: '#94a3b8' }}>
                            <span>탐색 주기: <strong>{agent.cycle}</strong></span>
                            <button onClick={() => { setActiveAgent(agent.name); setModalType('agentTune'); setIsModalOpen(true); }} style={{ padding: '4px 10px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>설정 튜닝</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 5: Explore */}
          {activeTab === 'explore' && (
            <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '10px', border: '1px solid #e2e8f0', width: '100%', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#1e293b' }}>🔍 글로벌 무역 통관 데이터 탐색기 (Explore - 100개 항목 세팅)</h3>
                <button onClick={() => handleOpenExcelPreview('Global_Trade_Database', Object.values(exploreDatabase))} style={{ padding: '8px 14px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>📊 전체 통관 DB 엑셀 미리보기</button>
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>실제 무역 통관/선적 데이터 항목(HS Code, 수입사, 공급사, 수량, 금액, 선적일, 관세, Landed Cost 등)을 조회합니다.</p>
              
              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                <input 
                  type="text" 
                  placeholder="HS Code 입력 (예: 3902, 3901 ~ 4000)" 
                  value={hsCodeInput}
                  onChange={(e) => setHsCodeInput(e.target.value)}
                  style={{ flex: 1, padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }} 
                />
                <button onClick={() => {
                  const res = exploreDatabase[hsCodeInput];
                  if (res) {
                    setExploreResult(res);
                    triggerAlert(`HS Code [${hsCodeInput}] 통관 데이터 조회 성공!`);
                  } else {
                    const newRes = { 
                      hsCode: `${hsCodeInput}.00.0000`, 
                      name: `사용자 정의 품목 (${hsCodeInput})`, 
                      buyer: 'Global Import Buyer', 
                      supplier: 'Hyosung Source Partner', 
                      volume: '12,500톤', 
                      amount: '$18,500,000', 
                      shipDate: '2026.10.10', 
                      country: '글로벌 복수 국가', 
                      tariff: '일반관세 적용', 
                      landedCost: '$1,650 / 톤', 
                      trend: '안정세' 
                    };
                    setExploreDatabase(prev => ({ ...prev, [hsCodeInput]: newRes }));
                    setExploreResult(newRes);
                    triggerAlert(`HS Code [${hsCodeInput}] 신규 데이터가 생성 및 저장되었습니다.`);
                  }
                }} style={{ padding: '10px 20px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>데이터 검색</button>
              </div>

              {exploreResult && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>HS Code 및 품목 명칭</span>
                    <h4 style={{ fontSize: '14px', color: '#1e293b', margin: '4px 0 0 0' }}><strong>[{exploreResult.hsCode}]</strong> {exploreResult.name}</h4>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>수입사 (Buyer) 및 공급사 (Supplier)</span>
                    <h4 style={{ fontSize: '13px', color: '#4f46e5', margin: '4px 0 0 0' }}>{exploreResult.buyer} ➔ {exploreResult.supplier}</h4>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>수입 물량 및 총 금액</span>
                    <h4 style={{ fontSize: '13px', color: '#059669', margin: '4px 0 0 0' }}>{exploreResult.volume} ({exploreResult.amount})</h4>
                  </div>
                </div>
              )}

              <h4 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '12px', color: '#1e293b' }}>📋 조회 가능한 전체 HS Code 항목 목록 (총 {Object.keys(exploreDatabase).length}개)</h4>
              <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', backgroundColor: '#f8fafc', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {Object.keys(exploreDatabase).map((code) => (
                  <div 
                    key={code}
                    onClick={() => {
                      setHsCodeInput(code);
                      setExploreResult(exploreDatabase[code]);
                      triggerAlert(`HS Code [${code}] 데이터가 로드되었습니다.`);
                    }}
                    style={{ padding: '8px 10px', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <span style={{ fontWeight: 'bold', color: '#4f46e5' }}>{code}</span>
                    <span style={{ fontSize: '11px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '90px' }}>{exploreDatabase[code].name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* [고도화 6번] TAB 6: Pipeline (GP 매출 시뮬레이터) */}
          {activeTab === 'pipeline' && (
            <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '10px', border: '1px solid #e2e8f0', width: '100%', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#1e293b' }}>📈 영업 전환 및 GP 매출 시뮬레이터 (Pipeline Simulator)</h3>
                <button onClick={() => handleOpenExcelPreview('Sales_Funnel_Pipeline', [{ Stage: 'AI 가설 제안', Count: 120, Rate: '100%' }, { Stage: '현업 검토', Count: 94, Rate: '78%' }])} style={{ padding: '8px 14px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>📊 퍼널 분석 엑셀 미리보기</button>
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>목표 연간 GP 매출액을 설정하면 필요한 영업기회 발굴 건수와 요구 전환 성공 확률을 실시간 역산합니다.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', width: '100%' }}>
                <div style={{ padding: '24px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '10px', color: '#334155' }}>목표 연간 GP 매출 설정: {targetRevenue} 억원</label>
                  <input type="range" min="10" max="200" step="10" value={targetRevenue} onChange={(e) => setTargetRevenue(Number(e.target.value))} style={{ width: '100%', marginBottom: '20px' }} />
                  <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>
                    <p>• 필요 신규 발굴 기회: <strong>{Math.round(targetRevenue / 1.5)} 건</strong></p>
                    <p>• 요구 평균 전환 성공률: <strong style={{ color: '#059669' }}>{Math.min(95, Math.round((targetRevenue / 100) * 45))}% 이상</strong></p>
                  </div>
                </div>
                <div style={{ padding: '24px', backgroundColor: '#eef2ff', borderRadius: '8px', border: '1px solid #c7d2fe', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#312e81', margin: '0 0 8px 0' }}>💡 AI 시뮬레이션 인사이트</h4>
                  <p style={{ fontSize: '13px', color: '#4338ca', margin: 0, lineHeight: '1.5' }}>현재 설정하신 {targetRevenue}억원 달성을 위해 북미 지역 PP Resin 및 멕시코 TiO2 Cross-sell 기회에 역량을 집중하는 것이 가장 효율적입니다.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: Reports */}
          {activeTab === 'reports' && (
            <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '10px', border: '1px solid #e2e8f0', width: '100%', boxSizing: 'border-box' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#1e293b' }}>📑 AI 분석 인사이트 리포트 및 지식 자산화 (Reports)</h3>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>AI 에이전트가 도출한 심층 분석 리포트 및 성공 사례 아카이브입니다. 뷰어 또는 PDF 다운로드를 지원합니다.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                {[
                  { title: '[인사이트] 북미 PP 시장 수요 급증 및 B사 공략 전략 보고서', date: '2026.10.10', author: 'AI Trade Agent' },
                  { title: '[성공사례] 멕시코 법인 연계 TiO2 Cross-sell 실행 결과 보고서', date: '2026.10.05', author: '화학팀 김성환' }
                ].map((rep, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div>
                      <strong style={{ fontSize: '14px', color: '#1e293b' }}>{rep.title}</strong>
                      <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0 0' }}>작성일: {rep.date} | 작성자: {rep.author}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => {
                          setSelectedReport(rep);
                          setModalType('reportPreview');
                          setIsModalOpen(true);
                        }}
                        style={{ padding: '8px 14px', backgroundColor: '#fff', color: '#4f46e5', border: '1px solid #4f46e5', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        👁️ 미리 보기
                      </button>
                      <button 
                        onClick={() => handleExportPdf(rep.title)}
                        style={{ padding: '8px 14px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        📥 PDF 다운로드
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: Check List */}
          {activeTab === 'checklist' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>전체 점검 항목</p>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', margin: '6px 0 0 0' }}>{checklistItems.length} 개</h3>
                </div>
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>완료된 항목</p>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669', margin: '6px 0 0 0' }}>{completedCount} 개</h3>
                </div>
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>진행 중 / 대기</p>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#d97706', margin: '6px 0 0 0' }}>{inProgressCount} / {pendingCount}</h3>
                </div>
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>전체 이행 달성률</p>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#4f46e5', margin: '6px 0 0 0' }}>{completionRate}%</h3>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['전체', '데이터 수집 및 파이프라인', '데이터 매핑 및 마스터 정제', '추천 알고리즘 및 스코어링', 'LLM 에이전트 및 검증', '화면 및 현업 프로세스 연동'].map((cat, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setChecklistFilter(cat)}
                      style={{ 
                        padding: '8px 16px', 
                        backgroundColor: checklistFilter === cat ? '#4f46e5' : '#fff', 
                        color: checklistFilter === cat ? '#fff' : '#475569', 
                        border: '1px solid #cbd5e1', 
                        borderRadius: '8px', 
                        fontSize: '12px', 
                        fontWeight: 'bold', 
                        cursor: 'pointer' 
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <button onClick={() => handleOpenExcelPreview('Hyosung_AX_Checklist_23', checklistItems)} style={{ padding: '8px 14px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>📊 체크리스트 엑셀 미리보기</button>
              </div>

              <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                      <th style={{ padding: '14px', width: '60px', textAlign: 'center' }}>번호</th>
                      <th style={{ padding: '14px', width: '150px' }}>구분 (카테고리)</th>
                      <th style={{ padding: '14px', width: '180px' }}>세부 점검 항목</th>
                      <th style={{ padding: '14px' }}>구체적 실무 확인 및 점검 내용 / 필요 이유</th>
                      <th style={{ padding: '14px', width: '100px', textAlign: 'center' }}>확인 결과</th>
                      <th style={{ padding: '14px', width: '90px', textAlign: 'center' }}>등록일자</th>
                      <th style={{ padding: '14px', width: '250px' }}>비고 / 후속 조치 (텍스트박스)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredChecklist.map((item) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px', textAlign: 'center', fontWeight: 'bold', color: '#4f46e5' }}>{item.id}</td>
                        <td style={{ padding: '14px', fontSize: '12px', color: '#64748b' }}>{item.category}</td>
                        <td style={{ padding: '14px', fontWeight: 'bold', color: '#1e293b' }}>{item.title}</td>
                        <td style={{ padding: '14px', color: '#334155', lineHeight: '1.4' }}>
                          <div style={{ marginBottom: '4px' }}>{item.desc}</div>
                          <div style={{ fontSize: '11px', color: '#64748b', backgroundColor: '#f8fafc', padding: '6px 8px', borderRadius: '4px' }}>
                            💡 <strong>필요 이유:</strong> {item.reason}
                          </div>
                        </td>
                        <td style={{ padding: '14px', textAlign: 'center' }}>
                          <button 
                            onClick={() => handleToggleChecklistStatus(item.id)}
                            style={{ 
                              padding: '6px 12px', 
                              borderRadius: '6px', 
                              border: 'none', 
                              fontSize: '11px', 
                              fontWeight: 'bold', 
                              cursor: 'pointer',
                              backgroundColor: item.status === '완료' ? '#ecfdf5' : item.status === '진행중' ? '#fffbeb' : '#f1f5f9',
                              color: item.status === '완료' ? '#047857' : item.status === '진행중' ? '#d97706' : '#475569'
                            }}
                          >
                            {item.status === '완료' ? '✅ 완료' : item.status === '진행중' ? '🔄 진행중' : '⏳ 대기'}
                          </button>
                        </td>
                        <td style={{ padding: '14px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>{item.date}</td>
                        <td style={{ padding: '14px' }}>
                          <textarea 
                            value={item.note || ''} 
                            onChange={(e) => handleNoteChange(item.id, e.target.value)}
                            onBlur={() => triggerAlert(`[항목 ${item.id}] 비고/후속 조치가 저장되었습니다.`)}
                            placeholder="후속 조치 내용 입력..."
                            rows={5}
                            style={{ 
                              width: '100%', 
                              minHeight: '85px',
                              padding: '10px 12px', 
                              fontSize: '12px', 
                              border: '1px solid #cbd5e1', 
                              borderRadius: '6px', 
                              outline: 'none', 
                              backgroundColor: '#ffffff', 
                              color: '#1e293b', 
                              resize: 'vertical',
                              boxSizing: 'border-box',
                              fontFamily: 'sans-serif',
                              lineHeight: '1.4'
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 9: AI AGENT */}
          {activeTab === 'agents' && (
            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr ' + (currentSession.isSearched ? '320px' : '0px'), gap: '16px', width: '100%', height: 'calc(100vh - 140px)', transition: 'all 0.3s ease', overflow: 'hidden' }}>
              
              <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', color: '#fff', height: '100%', boxSizing: 'border-box' }}>
                <button 
                  onClick={handleCreateNewChat}
                  style={{ width: '100%', padding: '10px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  ＋ 새로운 대화 시작
                </button>
                
                <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold', marginTop: '8px', paddingLeft: '4px' }}>대화 기록</div>
                
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {chatSessions.map((session) => (
                    <div 
                      key={session.id}
                      onClick={() => setActiveSessionId(session.id)}
                      style={{ 
                        padding: '10px 12px', 
                        backgroundColor: session.id === activeSessionId ? '#334155' : 'transparent', 
                        borderRadius: '8px', 
                        cursor: 'pointer', 
                        fontSize: '13px',
                        color: session.id === activeSessionId ? '#f8fafc' : '#cbd5e1',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        border: session.id === activeSessionId ? '1px solid #475569' : '1px solid transparent'
                      }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '170px' }}>{session.title}</span>
                      <span onClick={(e) => handleDeleteChatSession(e, session.id)} style={{ fontSize: '12px', color: '#94a3b8', padding: '2px 6px', borderRadius: '4px', cursor: 'pointer' }}>✕</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                {currentSession.messages.length === 0 ? (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '26px', fontWeight: 'bold', background: 'linear-gradient(90deg, #4f46e5, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 8px 0' }}>
                      안녕하세요, {userProfile.name}님
                    </h1>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 28px 0' }}>글로벌 무역 데이터와 인텔리전스를 기반으로 무엇이든 질문해 주세요.</p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', width: '100%', maxWidth: '580px', marginBottom: '20px' }}>
                      {agentPresetQuestions.map((item, i) => (
                        <div key={i} onClick={() => handleSendMessage(item.q)} style={{ padding: '14px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', textAlign: 'left', cursor: 'pointer', fontSize: '12px', color: '#334155', fontWeight: '500' }}>
                          {item.q}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#fdfdfe' }}>
                    {currentSession.messages.map((msg, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                        <div style={{ maxWidth: '80%', padding: '14px 18px', borderRadius: '14px', fontSize: '13px', lineHeight: '1.6', backgroundColor: msg.sender === 'user' ? '#4f46e5' : '#f1f5f9', color: msg.sender === 'user' ? '#fff' : '#1e293b', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', backgroundColor: '#fff' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '24px', padding: '8px 16px' }}>
                    <input 
                      type="text" 
                      placeholder="무역 데이터 및 영업 가설에 대해 질문하세요..." 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                      style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '13px', outline: 'none', color: '#1e293b' }}
                    />
                    <button onClick={() => handleSendMessage()} style={{ padding: '8px 18px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '20px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>전송</button>
                  </div>
                </div>
              </div>

              {currentSession.isSearched && (
                <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', overflowY: 'auto', boxSizing: 'border-box', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                  <div>
                    <span style={{ fontSize: '11px', backgroundColor: '#e0e7ff', color: '#4338ca', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>Explainable AI (XAI)</span>
                    <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: '6px 0 0 0', color: '#1e293b' }}>답변 판단 근거 및 소스</h3>
                  </div>

                  <div style={{ backgroundColor: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ fontSize: '11px', fontWeight: 'bold', color: '#334155', textTransform: 'uppercase', margin: '0 0 6px 0' }}>🔍 실시간 분석 로직</h4>
                    <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: '1.4' }}>{currentSession.currentActiveReason}</p>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '11px', fontWeight: 'bold', color: '#334155', textTransform: 'uppercase', margin: '0 0 8px 0' }}>🔗 연동된 무역/통관 데이터 링크</h4>
                    {currentSession.currentActiveLinks && currentSession.currentActiveLinks.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {currentSession.currentActiveLinks.map((link, idx) => (
                          <a key={idx} href={link.url} onClick={(e) => { e.preventDefault(); triggerAlert(`'${link.label}' 상세 데이터 뷰어로 이동합니다.`); }} style={{ display: 'block', padding: '8px 10px', backgroundColor: '#f1f5f9', borderRadius: '6px', fontSize: '11px', color: '#4f46e5', fontWeight: '500', textDecoration: 'none', border: '1px solid #e2e8f0' }}>
                            📄 {link.label} ↗
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p style={{ fontSize: '11px', color: '#94a3b8' }}>연동된 외부 데이터 링크가 없습니다.</p>
                    )}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}