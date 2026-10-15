import { useState, useEffect } from 'react';
import { initialOpportunities, initialMarketAccountsData, initialIntelligenceLogs, initialChecklistItems, agentPresetQuestions, generate100ExploreItems, formatExcelCellValue } from './data/initialData';


export default function App() {
  const [activeTab, setActiveTab] = useState('desk'); 

  const [deskRegionFilter, setDeskRegionFilter] = useState('전체');
  const [deskItemFilter, setDeskItemFilter] = useState('전체');

  const [oppViewMode, setOppViewMode] = useState('kanban'); 
  const [targetRevenue, setTargetRevenue] = useState(50); 

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
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedIntel, setSelectedIntel] = useState(null); 
  const [notification, setNotification] = useState('');

  const [excelPreviewData, setExcelPreviewData] = useState(null);
  const [excelPreviewTitle, setExcelPreviewTitle] = useState('');

  const [newOppForm, setNewOppForm] = useState({
    title: '',
    type: 'Cross-sell',
    company: '',
    region: '미국',
    item: 'PP Resin',
    expectedGP: '5.0억원/년',
    hypothesis: ''
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('trade_iq_audit_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      { id: 1, time: '2026-10-13 09:00', user: 'System', action: '시스템 초기화 및 초기 데이터 적재 완료' },
      { id: 2, time: '2026-10-13 10:30', user: '김성환 차장', action: 'ABC Chemicals 계정 정보 및 미팅 일정 갱신' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('trade_iq_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const addAuditLog = (actionText) => {
    const nowTime = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newLog = {
      id: Date.now(),
      time: nowTime,
      user: userProfile.name,
      action: actionText
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const [marketAccounts, setMarketAccounts] = useState(() => {
    const saved = localStorage.getItem('trade_iq_market_accounts');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialMarketAccountsData;
  });

  useEffect(() => {
    localStorage.setItem('trade_iq_market_accounts', JSON.stringify(marketAccounts));
  }, [marketAccounts]);

  const [intelligenceLogs, setIntelligenceLogs] = useState(() => {
    const saved = localStorage.getItem('trade_iq_intel_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialIntelligenceLogs;
  });

  const [newIntel, setNewIntel] = useState({ branch: '멕시코 법인 (MX)', category: '고객 니즈', content: '' });

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

  const [chatSessions, setChatSessions] = useState(() => {
    const saved = localStorage.getItem('trade_iq_chat_sessions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [{ id: 1, title: '미국 PP Resin 수입사 분석', messages: [], isSearched: false, currentActiveReason: '', currentActiveLinks: [] }];
  });
  const [activeSessionId, setActiveSessionId] = useState(1);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    localStorage.setItem('trade_iq_chat_sessions', JSON.stringify(chatSessions));
  }, [chatSessions]);

  // 탐색 DB는 고정 샘플이라 매번 생성만 하고 localStorage에는 저장하지 않는다
  const [exploreDatabase] = useState(() => generate100ExploreItems());

  const [exploreSearchTerm, setExploreSearchTerm] = useState('');

  const triggerAlert = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const handleOpenExcelPreview = (title, dataArray) => {
    setExcelPreviewTitle(title);
    setExcelPreviewData(dataArray);
    setModalType('excelPreview');
    setIsModalOpen(true);
    addAuditLog(`엑셀 미리보기 및 다운로드 준비: ${title}`);
  };

  const handleDownloadActualExcel = () => {
    if (!excelPreviewData || excelPreviewData.length === 0) return;
    const headers = Object.keys(excelPreviewData[0]);
    // 엑셀이 수식으로 해석하지 않도록 =,+,-,@ 로 시작하는 값 앞에 ' 를 붙인다 (CSV 인젝션 방지)
    const toCsvCell = (val) => {
      let text = String(formatExcelCellValue(val) ?? '');
      if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
      return `"${text.replace(/"/g, '""')}"`;
    };
    const csvRows = [
      headers.map(toCsvCell).join(','),
      ...excelPreviewData.map(row => headers.map(fieldName => toCsvCell(row[fieldName])).join(','))
    ];
    // encodeURI는 # 를 인코딩하지 않아 파일이 잘리므로 Blob 사용
    const blob = new Blob(['\uFEFF' + csvRows.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${excelPreviewTitle}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerAlert(`📊 '${excelPreviewTitle}.csv' 파일 다운로드가 완료되었습니다.`);
    addAuditLog(`실제 CSV/Excel 파일 다운로드 실행: ${excelPreviewTitle}`);
  };

  const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const handleExportPdf = (reportObj) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      triggerAlert('❌ 팝업 차단이 설정되어 있어 인쇄 창을 열 수 없습니다.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${escapeHtml(reportObj.title)}</title>
          <style>
            body { font-family: 'Malgun Gothic', sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
            .header { border-bottom: 2px solid #4f46e5; padding-bottom: 20px; margin-bottom: 30px; }
            .badge { background: #e0e7ff; color: #4338ca; padding: 4px 10px; font-size: 12px; font-weight: bold; border-radius: 4px; display: inline-block; margin-bottom: 10px; }
            h1 { font-size: 22px; margin: 10px 0; color: #0f172a; }
            .meta { font-size: 13px; color: #64748b; display: flex; gap: 20px; margin-bottom: 30px; }
            .content { font-size: 14px; white-space: pre-line; background: #f8fafc; padding: 24px; border-radius: 8px; border: 1px solid #e2e8f0; }
            .footer { margin-top: 50px; text-align: right; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px; }
            @media print {
              body { padding: 20px; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <span class="badge">효성 무역PG Trade AX 공식 분석 보고서</span>
            <h1>${escapeHtml(reportObj.title)}</h1>
          </div>
          <div class="meta">
            <span>작성일자: <strong>${escapeHtml(reportObj.date)}</strong></span>
            <span>작성자: <strong>${escapeHtml(reportObj.author)}</strong></span>
            <span>소속: <strong>${escapeHtml(userProfile.team)} (${escapeHtml(userProfile.name)})</strong></span>
          </div>
          <div class="content">
            ${escapeHtml(reportObj.content)}
          </div>
          <div class="footer">
            <p>Hyosung Trade IQ Platform - Automated Intelligence Generation</p>
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    triggerAlert('📑 PDF 인쇄 저장 창이 열렸습니다.');
    addAuditLog(`공식 분석 리포트 PDF 출력: ${escapeHtml(reportObj.title)}`);
  };

  const handleUpdateOpportunityStatus = (oppId, newStatus) => {
    const target = opportunities.find(o => o.id === oppId);
    if (target) addAuditLog(`영업기회 상태 변경 [${target.title}]: ${target.status} -> ${newStatus}`);
    setOpportunities(prev => prev.map(o => {
      if (o.id === oppId) {
        const newHistoryItem = {
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          action: `상태 변경: ${o.status} ➔ ${newStatus}`,
          user: userProfile.name
        };
        return { 
          ...o, 
          status: newStatus,
          history: [newHistoryItem, ...(o.history || [])]
        };
      }
      return o;
    }));
    triggerAlert(`영업기회 상태가 "${newStatus}"(으)로 변경되고 이력이 기록되었습니다.`);
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
    addAuditLog('새로운 AI 에이전트 대화 세션 생성');
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
    addAuditLog('AI 에이전트 대화 세션 삭제');
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
    addAuditLog(`AI 에이전트 질의 응답 수행: "${textToSend.slice(0, 20)}..."`);
  };

  const handleToggleChecklistStatus = (id) => {
    const NEXT_STATUS = { '대기': '진행중', '진행중': '완료', '완료': '대기' };
    const target = checklistItems.find(item => item.id === id);
    if (target) addAuditLog(`체크리스트 상태 변경 [항목 ${target.id}]: ${target.status} -> ${NEXT_STATUS[target.status] || '대기'}`);
    setChecklistItems(prev => prev.map(item =>
      item.id === id ? { ...item, status: NEXT_STATUS[item.status] || '대기' } : item
    ));
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

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1500 }}>
          <div style={{ backgroundColor: '#fff', width: modalType === 'excelPreview' || modalType === 'reportViewer' || modalType === 'auditLogViewer' ? '900px' : '680px', maxHeight: '85vh', overflowY: 'auto', borderRadius: '12px', padding: '32px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', boxSizing: 'border-box' }}>
            
            {modalType === 'excelPreview' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
                  <div>
                    <span style={{ fontSize: '11px', backgroundColor: '#ecfdf5', color: '#047857', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>엑셀 데이터 웹 미리보기 뷰어 (정제 완료)</span>
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
                            <td key={j} style={{ padding: '10px 12px', color: '#334155' }}>
                              {formatExcelCellValue(val)}
                            </td>
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

            {modalType === 'addNewOpp' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
                  <div>
                    <span style={{ fontSize: '11px', backgroundColor: '#e0e7ff', color: '#4338ca', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>신규 영업기회 생성</span>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '6px 0 0 0', color: '#1e293b' }}>AI 추천 영업기회 수동 등록</h3>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}>✕</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#334155' }}>기회명 (타이틀)</label>
                    <input 
                      type="text" 
                      placeholder="예: 신규 Buyer GHI – 정밀화학 원료 공급" 
                      value={newOppForm.title}
                      onChange={(e) => setNewOppForm({ ...newOppForm, title: e.target.value })}
                      style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', backgroundColor: '#ffffff', color: '#1e293b' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#334155' }}>유형</label>
                      <select 
                        value={newOppForm.type}
                        onChange={(e) => setNewOppForm({ ...newOppForm, type: e.target.value })}
                        style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#ffffff', color: '#1e293b' }}
                      >
                        <option value="Cross-sell">Cross-sell</option>
                        <option value="신규 Buyer">신규 Buyer</option>
                        <option value="공급사 신규시장">공급사 신규시장</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#334155' }}>대상 지역 (국가)</label>
                      <select 
                        value={newOppForm.region}
                        onChange={(e) => setNewOppForm({ ...newOppForm, region: e.target.value })}
                        style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#ffffff', color: '#1e293b' }}
                      >
                        <option value="미국">미국</option>
                        <option value="멕시코">멕시코</option>
                        <option value="브라질">브라질</option>
                        <option value="베트남">베트남</option>
                        <option value="인도">인도</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#334155' }}>주요 품목</label>
                      <input 
                        type="text" 
                        value={newOppForm.item}
                        onChange={(e) => setNewOppForm({ ...newOppForm, item: e.target.value })}
                        style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#ffffff', color: '#1e293b' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#334155' }}>예상 연간 GP 매출</label>
                      <input 
                        type="text" 
                        value={newOppForm.expectedGP}
                        onChange={(e) => setNewOppForm({ ...newOppForm, expectedGP: e.target.value })}
                        style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#ffffff', color: '#1e293b' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#334155' }}>거래 가설 (Hypothesis)</label>
                    <textarea 
                      rows={3}
                      placeholder="AI 분석 기반 거래 성사 가설 내용을 입력하세요..." 
                      value={newOppForm.hypothesis}
                      onChange={(e) => setNewOppForm({ ...newOppForm, hypothesis: e.target.value })}
                      style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', resize: 'vertical', backgroundColor: '#ffffff', color: '#1e293b' }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  <button onClick={() => setIsModalOpen(false)} style={{ padding: '10px 16px', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', color: '#475569' }}>취소</button>
                  <button onClick={() => {
                    if (!newOppForm.title.trim()) {
                      triggerAlert('기회명을 입력해 주세요.');
                      return;
                    }
                    const newEntry = {
                      id: Date.now(),
                      type: newOppForm.type,
                      title: newOppForm.title,
                      company: newOppForm.title.split('–')[0].trim(),
                      region: newOppForm.region,
                      item: newOppForm.item,
                      score: 85,
                      expectedGP: newOppForm.expectedGP,
                      status: '신규 제안',
                      date: new Date().toISOString().substring(0, 10).replace(/-/g, '.'),
                      hypothesis: newOppForm.hypothesis || '현장 영업 인텔리전스 및 통관 데이터 기반 신규 발굴 기회',
                      demand: '최근 수입 물량 증가세 확인',
                      productFit: '효성 주력 취급 Grade 매칭도 우수',
                      access: '현지 법인 영업 네트워크 활용 가능',
                      history: [{ date: new Date().toISOString().replace('T', ' ').substring(0, 16), action: '사용자 수동 등록', user: userProfile.name }],
                      nextActionList: [{ task: '초기 샘플 발송 및 규격 검토', owner: `${newOppForm.region} 법인`, risk: '중간', done: false }]
                    };
                    setOpportunities([newEntry, ...opportunities]);
                    addAuditLog(`신규 영업기회 수동 등록: ${newOppForm.title}`);
                    triggerAlert('새로운 영업기회가 성공적으로 등록되었습니다.');
                    setIsModalOpen(false);
                    setNewOppForm({ title: '', type: 'Cross-sell', company: '', region: '미국', item: 'PP Resin', expectedGP: '5.0억원/년', hypothesis: '' });
                  }} style={{ padding: '10px 20px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>등록하기</button>
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

                  <div style={{ backgroundColor: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: '#334155', margin: '0 0 8px 0' }}>📜 상태 변경 이력 관리 (History Log)</h4>
                    <div style={{ maxHeight: '100px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px', color: '#64748b' }}>
                      {selectedOpp.history && selectedOpp.history.map((h, hi) => (
                        <div key={hi} style={{ display: 'flex', justifyContent: 'between', gap: '10px' }}>
                          <span>[{h.date}]</span>
                          <strong style={{ color: '#4f46e5' }}>{h.action}</strong>
                          <span>({h.user})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155', marginBottom: '8px' }}>데이터 기반 근거 분석</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: '#475569' }}>
                      <div style={{ padding: '8px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>✓ <strong>수요 성장성:</strong> {selectedOpp.demand}</div>
                      <div style={{ padding: '8px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>✓ <strong>Product Fit:</strong> {selectedOpp.productFit}</div>
                      <div style={{ padding: '8px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>✓ <strong>접근 가능성:</strong> {selectedOpp.access}</div>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  <button onClick={() => handleOpenExcelPreview(selectedOpp.title, [selectedOpp])} style={{ padding: '10px 14px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>📊 엑셀 미리보기</button>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setIsModalOpen(false)} style={{ padding: '10px 16px', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', color: '#475569' }}>닫기</button>
                    <button onClick={() => { handleUpdateOpportunityStatus(selectedOpp.id, '견적 진행'); setIsModalOpen(false); }} style={{ padding: '10px 20px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>영업 Task 및 견적 승격 (CRM 연동)</button>
                  </div>
                </div>
              </div>
            )}

            {modalType === 'accountProfile' && selectedAccount && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
                  <div>
                    <span style={{ fontSize: '11px', backgroundColor: '#e0e7ff', color: '#4338ca', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>고객사 상세 정보 및 일정 관리</span>
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
                      <span style={{ fontSize: '11px', color: '#64748b' }}>주요 재무/영업 지표</span>
                      <p style={{ fontWeight: 'bold', margin: '4px 0 0 0' }}>안정적 우수 거래처</p>
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#fffbeb', padding: '14px', borderRadius: '8px', border: '1px solid #fde68a', color: '#92400e' }}>
                    <strong>📌 최근 현장 영업 이슈 및 요구사항:</strong>
                    <p style={{ margin: '6px 0 0 0', lineHeight: '1.4' }}>{selectedAccount.recentIssue}</p>
                  </div>

                  <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                      <span style={{ fontSize: '16px' }}>📅</span>
                      <strong style={{ color: '#1e293b', fontSize: '14px' }}>업체 정보, 담당자 연락처 및 영업 일정 배정 관리</strong>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>업체명 (회사명)</label>
                        <input 
                          type="text" 
                          value={selectedAccount.company}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSelectedAccount(prev => ({ ...prev, company: val }));
                          }}
                          style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box', backgroundColor: '#ffffff', color: '#1e293b', outline: 'none' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>업체 담당자 성명</label>
                        <input 
                          type="text" 
                          value={selectedAccount.mainContact}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSelectedAccount(prev => ({ ...prev, mainContact: val }));
                          }}
                          style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box', backgroundColor: '#ffffff', color: '#1e293b', outline: 'none' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>업체 담당자 연락처</label>
                        <input 
                          type="text" 
                          value={selectedAccount.contactPhone || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSelectedAccount(prev => ({ ...prev, contactPhone: val }));
                          }}
                          style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box', backgroundColor: '#ffffff', color: '#1e293b', outline: 'none' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>사내 영업 담당자</label>
                        <input 
                          type="text" 
                          value={selectedAccount.manager || userProfile.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSelectedAccount(prev => ({ ...prev, manager: val }));
                          }}
                          style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box', backgroundColor: '#ffffff', color: '#1e293b', outline: 'none' }}
                        />
                      </div>
                      <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>미팅 및 액션 일정 (일시 선택 데이터 피커)</label>
                        <input 
                          type="datetime-local" 
                          value={selectedAccount.schedule || '2026-10-20T14:00'}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSelectedAccount(prev => ({ ...prev, schedule: val }));
                          }}
                          style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box', backgroundColor: '#ffffff', color: '#1e293b', outline: 'none' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  <button onClick={() => setIsModalOpen(false)} style={{ padding: '10px 16px', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', color: '#475569' }}>취소</button>
                  <button onClick={() => {
                    setMarketAccounts(prev => prev.map(acc => acc.company === selectedAccount.company || acc.country === selectedAccount.country ? selectedAccount : acc));
                    addAuditLog(`고객사 정보 및 일정 수정 저장: ${selectedAccount.company}`);
                    triggerAlert(`${selectedAccount.company}의 업체 정보 및 영업 일정 데이터가 성공적으로 저장되었습니다.`);
                    setIsModalOpen(false);
                  }} style={{ padding: '10px 20px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>저장하기</button>
                </div>
              </div>
            )}

            {modalType === 'editIntel' && selectedIntel && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
                  <div>
                    <span style={{ fontSize: '11px', backgroundColor: '#e0e7ff', color: '#4338ca', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>Intelligence Network 상세 편집</span>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '6px 0 0 0', color: '#1e293b' }}>{selectedIntel.branch} 인텔리전스 수정 (ID: {selectedIntel.id})</h3>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}>✕</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px', color: '#334155' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', backgroundColor: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>최초 작성자</span>
                      <p style={{ fontWeight: 'bold', margin: '4px 0 0 0', color: '#1e293b' }}>{selectedIntel.author || userProfile.name}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>최종 수정 일시</span>
                      <p style={{ fontWeight: 'bold', margin: '4px 0 0 0', color: '#4f46e5' }}>{selectedIntel.updatedAt || '방금 전'}</p>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#334155' }}>등록 법인</label>
                    <select 
                      value={selectedIntel.branch}
                      onChange={(e) => setSelectedIntel({ ...selectedIntel, branch: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box', backgroundColor: '#ffffff', color: '#1e293b', outline: 'none' }}
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
                      value={selectedIntel.category}
                      onChange={(e) => setSelectedIntel({ ...selectedIntel, category: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box', backgroundColor: '#ffffff', color: '#1e293b', outline: 'none' }}
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
                      value={selectedIntel.content}
                      onChange={(e) => setSelectedIntel({ ...selectedIntel, content: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box', resize: 'vertical', backgroundColor: '#ffffff', color: '#1e293b', outline: 'none', lineHeight: '1.4' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  <button onClick={() => {
                    setIntelligenceLogs(prev => prev.filter(item => item.id !== selectedIntel.id));
                    setIsModalOpen(false);
                    addAuditLog(`현장 인텔리전스 삭제 [ID: ${selectedIntel.id}]`);
                    triggerAlert('해당 인텔리전스 항목이 삭제되었습니다.');
                  }} style={{ padding: '10px 16px', backgroundColor: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>삭제하기</button>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setIsModalOpen(false)} style={{ padding: '10px 16px', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', color: '#475569' }}>취소</button>
                    <button onClick={() => {
                      const nowTimeStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
                      setIntelligenceLogs(prev => prev.map(item => {
                        if (item.id === selectedIntel.id) {
                          return {
                            ...selectedIntel,
                            updatedAt: nowTimeStr,
                            author: selectedIntel.author || userProfile.name
                          };
                        }
                        return item;
                      }));
                      setIsModalOpen(false);
                      addAuditLog(`현장 인텔리전스 수정 [${selectedIntel.branch}]`);
                      triggerAlert('해당 인텔리전스 항목이 성공적으로 수정되었습니다.');
                    }} style={{ padding: '10px 20px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>저장하기</button>
                  </div>
                </div>
              </div>
            )}

            {modalType === 'reportViewer' && selectedReport && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
                  <div>
                    <span style={{ fontSize: '11px', backgroundColor: '#e0e7ff', color: '#4338ca', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>AI 공식 분석 리포트 전문 뷰어</span>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '6px 0 0 0', color: '#1e293b' }}>{selectedReport.title}</h3>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}>✕</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px', color: '#334155' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <span>작성일자: <strong>{selectedReport.date}</strong></span>
                    <span>작성자: <strong>{selectedReport.author}</strong></span>
                  </div>
                  <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', lineHeight: '1.7', whiteSpace: 'pre-line', fontSize: '13px', color: '#1e293b' }}>
                    {selectedReport.content}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  <button onClick={() => setIsModalOpen(false)} style={{ padding: '10px 16px', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', color: '#475569' }}>닫기</button>
                  <button onClick={() => handleExportPdf(selectedReport)} style={{ padding: '10px 20px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>📥 PDF 다운로드 (인쇄)</button>
                </div>
              </div>
            )}

            {modalType === 'auditLogViewer' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
                  <div>
                    <span style={{ fontSize: '11px', backgroundColor: '#e0e7ff', color: '#4338ca', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>시스템 전체 활동 감사 로그</span>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '6px 0 0 0', color: '#1e293b' }}>Trade IQ Audit Trail Logs</h3>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}>✕</button>
                </div>
                <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#f8fafc', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {auditLogs.map((log) => (
                    <div key={log.id} style={{ padding: '10px 14px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ color: '#4f46e5', marginRight: '10px' }}>[{log.user}]</strong>
                        <span style={{ color: '#334155' }}>{log.action}</span>
                      </div>
                      <span style={{ color: '#64748b', fontSize: '11px' }}>{log.time}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  <button onClick={() => {
                    setAuditLogs([]);
                    triggerAlert('감사 로그 기록이 초기화되었습니다.');
                  }} style={{ padding: '8px 14px', backgroundColor: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>로그 비우기</button>
                  <button onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>닫기</button>
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
                      style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', backgroundColor: '#ffffff', color: '#1e293b' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#334155' }}>소속 부서</label>
                    <input 
                      type="text" 
                      value={tempProfile.team} 
                      onChange={(e) => setTempProfile({ ...tempProfile, team: e.target.value })}
                      style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', backgroundColor: '#ffffff', color: '#1e293b' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#334155' }}>담당 지역 / 권한</label>
                    <input 
                      type="text" 
                      value={tempProfile.region} 
                      onChange={(e) => setTempProfile({ ...tempProfile, region: e.target.value })}
                      style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', backgroundColor: '#ffffff', color: '#1e293b' }} 
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  <button onClick={() => { setTempProfile(userProfile); setIsModalOpen(false); }} style={{ padding: '10px 16px', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', color: '#475569' }}>취소</button>
                  <button onClick={() => { 
                    setUserProfile(tempProfile); 
                    addAuditLog(`사용자 프로필 정보 갱신: ${tempProfile.name} (${tempProfile.team})`);
                    triggerAlert('프로필 정보가 성공적으로 저장되었습니다.'); 
                    setIsModalOpen(false); 
                  }} style={{ padding: '10px 20px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>저장</button>
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
                      style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', backgroundColor: '#ffffff', color: '#1e293b' }}
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
                      style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', backgroundColor: '#ffffff', color: '#1e293b' }}
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
                      style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', resize: 'vertical', backgroundColor: '#ffffff', color: '#1e293b' }}
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
                    const nowTimeStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
                    const addedItem = {
                      id: Date.now(),
                      branch: newIntel.branch,
                      time: '방금 전',
                      category: newIntel.category,
                      content: newIntel.content,
                      author: userProfile.name,
                      updatedAt: nowTimeStr
                    };
                    setIntelligenceLogs([addedItem, ...intelligenceLogs]);
                    addAuditLog(`해외법인 현장 인텔리전스 등록: [${newIntel.branch}]`);
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
        
        <div style={{ height: '64px', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', width: '100%', boxSizing: 'border-box', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
              {activeTab === 'desk' && 'Trade IQ - 영업기회 발굴 대시보드'}
              {activeTab === 'opportunities' && '내 영업기회 파이프라인 관리 (Opportunity Pipeline)'}
              {activeTab === 'accounts' && '고객사 및 글로벌 시장 환경 분석 (Accounts & Markets)'}
              {activeTab === 'network' && '해외법인 현장 인텔리전스 네트워크 (Intelligence Network)'}
              {activeTab === 'explore' && '글로벌 무역 통관 데이터 탐색기 (Explore)'}
              {activeTab === 'pipeline' && '영업 전환율 및 GP 매출 시뮬레이터 파이프라인'}
              {activeTab === 'reports' && 'AI 분석 인사이트 리포트 및 지식 자산화 (Reports)'}
              {activeTab === 'checklist' && '효성 무역PG 영업기회 발굴 AX 프로젝트 - 전체 실무 체크리스트'}
              {activeTab === 'agents' && 'AI AGENT - 스마트 무역 어시스턴트'}
            </h2>
            <span style={{ fontSize: '11px', backgroundColor: '#e0e7ff', color: '#4338ca', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold' }}>Advanced MVP</span>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button onClick={() => { setModalType('auditLogViewer'); setIsModalOpen(true); }} style={{ padding: '8px 12px', backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>📜 감사 로그({auditLogs.length})</button>
            <button onClick={() => handleOpenExcelPreview('Hyosung_Opportunities_All', opportunities)} style={{ padding: '8px 12px', backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>📊 전체 엑셀 미리보기</button>
            <input 
              type="text" 
              placeholder="고객, 품목, 국가 통합 검색..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '8px 14px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '6px', width: '220px', outline: 'none', backgroundColor: '#ffffff', color: '#1e293b' }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '32px', width: '100%', boxSizing: 'border-box' }}>
          
          {activeTab === 'desk' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '16px 20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>📌 맞춤형 관심 위젯 필터:</span>
                  <select value={deskRegionFilter} onChange={(e) => setDeskRegionFilter(e.target.value)} style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', backgroundColor: '#ffffff', color: '#1e293b' }}>
                    <option value="전체">전체 지역 (Region)</option>
                    <option value="멕시코">멕시코</option>
                    <option value="미국">미국</option>
                  </select>
                  <select value={deskItemFilter} onChange={(e) => setDeskItemFilter(e.target.value)} style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', backgroundColor: '#ffffff', color: '#1e293b' }}>
                    <option value="전체">전체 품목 (Item)</option>
                    <option value="TiO2">TiO2</option>
                    <option value="PP Resin">PP Resin</option>
                    <option value="PET Chip">PET Chip</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>필터링된 기회: <strong>{filteredOpportunities.length}건</strong></span>
                  <button onClick={() => { setModalType('addNewOpp'); setIsModalOpen(true); }} style={{ padding: '6px 12px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>＋ 신규 기회 등록</button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>새로운 기회</p>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#4f46e5', margin: '6px 0 0 0' }}>{opportunities.length} 건</h3>
                </div>
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>진행 중 기회</p>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', margin: '6px 0 0 0' }}>
                    {opportunities.filter(o => o.status === '견적 진행' || o.status === '검토 중').length} 건
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
                          
                          <select 
                            value={opp.status} 
                            onChange={(e) => { e.stopPropagation(); handleUpdateOpportunityStatus(opp.id, e.target.value); }}
                            onClick={(e) => e.stopPropagation()}
                            style={{ fontSize: '11px', backgroundColor: '#ffffff', color: '#1e293b', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold', border: '1px solid #cbd5e1', cursor: 'pointer' }}
                          >
                            <option value="신규 제안">신규 제안</option>
                            <option value="검토 중">검토 중</option>
                            <option value="견적 진행">견적 진행</option>
                            <option value="계약 완료">계약 완료</option>
                          </select>
                        </div>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>{opp.date}</span>
                      </div>
                      <h4 style={{ fontSize: '16px', fontWeight: 'bold', margin: '10px 0 6px 0' }}>{opp.title}</h4>
                      <p style={{ fontSize: '12px', color: '#475569', backgroundColor: '#f8fafc', padding: '10px', borderRadius: '6px', margin: '0 0 12px 0' }}>
                        💡 <strong>Deal Hypothesis:</strong> {opp.hypothesis}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                        <span>지역: <strong>{opp.region}</strong> | 품목: <strong>{opp.item}</strong> | 예상 GP: <strong style={{ color: '#4f46e5' }}>{opp.expectedGP}</strong></span>
                        <span style={{ color: '#4f46e5', fontWeight: 'bold' }}>가설 검토 및 이력 보기 →</span>
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
                    🔍 가설 심층 검토 및 이력 관리 열기
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'opportunities' && (
            <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '10px', border: '1px solid #e2e8f0', width: '100%', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#1e293b' }}>📊 진행 중인 영업기회 파이프라인 관리 (Opportunity Pipeline)</h3>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>칸반 및 테이블 뷰에서 상태를 직접 변경할 수 있으며 변경 이력이 기록됩니다.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => { setModalType('addNewOpp'); setIsModalOpen(true); }} style={{ padding: '8px 14px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>＋ 기회 등록</button>
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
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <span style={{ fontSize: '10px', backgroundColor: '#eef2ff', color: '#4338ca', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{opp.type}</span>
                              <select 
                                value={opp.status} 
                                onChange={(e) => { e.stopPropagation(); handleUpdateOpportunityStatus(opp.id, e.target.value); }}
                                onClick={(e) => e.stopPropagation()}
                                style={{ fontSize: '11px', backgroundColor: '#ffffff', color: '#1e293b', padding: '3px 6px', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                              >
                                <option value="신규 제안">신규 제안</option>
                                <option value="검토 중">검토 중</option>
                                <option value="견적 진행">견적 진행</option>
                                <option value="계약 완료">계약 완료</option>
                              </select>
                            </div>
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
                      <th style={{ padding: '12px' }}>상태 변경</th>
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
                        <td style={{ padding: '12px' }}>
                          <select 
                            value={opp.status} 
                            onChange={(e) => handleUpdateOpportunityStatus(opp.id, e.target.value)}
                            style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px', fontWeight: 'bold', backgroundColor: '#ffffff', color: '#1e293b', cursor: 'pointer' }}
                          >
                            <option value="신규 제안">신규 제안</option>
                            <option value="검토 중">검토 중</option>
                            <option value="견적 진행">견적 진행</option>
                            <option value="계약 완료">계약 완료</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'accounts' && (
            <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '10px', border: '1px solid #e2e8f0', width: '100%', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#1e293b' }}>🏢 고객사 및 글로벌 시장 환경 분석 (Accounts & Markets)</h3>
                <button onClick={() => handleOpenExcelPreview('Accounts_Master_List', marketAccounts)} style={{ padding: '8px 14px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>엑셀 다운로드</button>
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>주요 Buyer/Supplier의 3개년 수입 추이 및 미팅 일정을 관리합니다. [상세보기] 버튼을 클릭하세요.</p>
              
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                    <th style={{ padding: '12px' }}>고객사명</th>
                    <th style={{ padding: '12px' }}>국가</th>
                    <th style={{ padding: '12px' }}>주요 품목</th>
                    <th style={{ padding: '12px' }}>연간 수입 물량</th>
                    <th style={{ padding: '12px' }}>영업 일정 / 담당자</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>상세 보기</th>
                  </tr>
                </thead>
                <tbody>
                  {marketAccounts.map((acc, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px', fontWeight: 'bold', color: '#1e293b' }}>{acc.company}</td>
                      <td style={{ padding: '12px', color: '#64748b' }}>{acc.country}</td>
                      <td style={{ padding: '12px', color: '#64748b' }}>{acc.item}</td>
                      <td style={{ padding: '12px', color: '#64748b' }}>{acc.importVol}</td>
                      <td style={{ padding: '12px', fontSize: '12px', color: '#4f46e5' }}>
                        {acc.schedule ? `${acc.schedule.replace('T', ' ')} (${acc.manager || '담당자 미지정'})` : '일정 미지정'}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <button 
                          onClick={() => {
                            setSelectedAccount(acc);
                            setModalType('accountProfile');
                            setIsModalOpen(true);
                          }} 
                          style={{ padding: '6px 12px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          상세보기
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'network' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', boxSizing: 'border-box' }}>
              <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#1e293b' }}>⚡ 해외법인 현장 인텔리전스 네트워크</h3>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>북미, 중남미, 유럽, 아시아 등 글로벌 현장 영업 법인에서 수집된 시장 동향 및 고객 니즈를 통합 관리합니다. (항목 클릭 시 개별 수정 가능)</p>
                  </div>
                  <button 
                    onClick={() => { setModalType('addIntel'); setIsModalOpen(true); }}
                    style={{ padding: '10px 16px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    ＋ 현장 인텔리전스 등록
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  {intelligenceLogs.map((log) => (
                    <div 
                      key={log.id} 
                      onClick={() => {
                        setSelectedIntel({ ...log });
                        setModalType('editIntel');
                        setIsModalOpen(true);
                      }}
                      style={{ 
                        padding: '18px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #cbd5e1', 
                        fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer',
                        transition: 'all 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = '#4f46e5'}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <strong style={{ color: '#4f46e5' }}>{log.branch}</strong>
                          <span style={{ fontSize: '11px', backgroundColor: '#e0e7ff', color: '#3730a3', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{log.category}</span>
                        </div>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>{log.time}</span>
                      </div>
                      <p style={{ margin: 0, color: '#334155', lineHeight: '1.5' }}>{log.content}</p>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '8px', fontSize: '11px', color: '#64748b' }}>
                        <span>작성자: <strong>{log.author || 'System'}</strong></span>
                        <span>최종수정: <strong>{log.updatedAt || log.time}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'explore' && (
            <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '10px', border: '1px solid #e2e8f0', width: '100%', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#1e293b' }}>🔍 글로벌 무역 통관 데이터 탐색기 (Explore)</h3>
                <button onClick={() => handleOpenExcelPreview('Global_Trade_Database', Object.values(exploreDatabase))} style={{ padding: '8px 14px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>📊 전체 통관 DB 엑셀 미리보기</button>
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>HS Code, 품목명, 공급사 등으로 검색하면 하단 리스트가 해당 정보만 실시간으로 필터링되어 조회됩니다.</p>
              
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <input 
                  type="text" 
                  placeholder="HS Code, 품목명, 공급사, 수입사 검색..." 
                  value={exploreSearchTerm}
                  onChange={(e) => setExploreSearchTerm(e.target.value)}
                  style={{ flex: 1, padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', outline: 'none', backgroundColor: '#ffffff', color: '#1e293b' }} 
                />
                <button onClick={() => setExploreSearchTerm('')} style={{ padding: '10px 16px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', color: '#475569' }}>검색 초기화</button>
              </div>

              <h4 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '12px', color: '#1e293b' }}>
                📋 통관 데이터 목록 ({Object.entries(exploreDatabase).filter(([code, item]) => {
                  if (!exploreSearchTerm) return true;
                  const term = exploreSearchTerm.toLowerCase();
                  return code.toLowerCase().includes(term) || 
                         item.hsCode.toLowerCase().includes(term) || 
                         item.name.toLowerCase().includes(term) || 
                         item.supplier.toLowerCase().includes(term) || 
                         item.buyer.toLowerCase().includes(term);
                }).length}개 검색됨)
              </h4>

              <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', backgroundColor: '#f8fafc', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {Object.entries(exploreDatabase)
                  .filter(([code, item]) => {
                    if (!exploreSearchTerm) return true;
                    const term = exploreSearchTerm.toLowerCase();
                    return code.toLowerCase().includes(term) || 
                           item.hsCode.toLowerCase().includes(term) || 
                           item.name.toLowerCase().includes(term) || 
                           item.supplier.toLowerCase().includes(term) || 
                           item.buyer.toLowerCase().includes(term);
                  })
                  .map(([code, item]) => (
                    <div 
                      key={code}
                      style={{ padding: '14px', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', color: '#4f46e5', fontSize: '13px' }}>HS Code: {item.hsCode}</span>
                        <span style={{ fontSize: '11px', backgroundColor: '#ecfdf5', color: '#047857', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{item.country}</span>
                      </div>
                      <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '13px' }}>{item.name}</div>
                      <div style={{ color: '#64748b' }}>수입사: <strong>{item.buyer}</strong> | 공급사: <strong>{item.supplier}</strong></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '6px', color: '#059669', fontWeight: 'bold' }}>
                        <span>수량: {item.volume}</span>
                        <span>금액: {item.amount}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {activeTab === 'pipeline' && (
            <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '10px', border: '1px solid #e2e8f0', width: '100%', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#1e293b' }}>📈 영업 전환 및 GP 매출 시뮬레이터 (Pipeline Simulator)</h3>
                <button onClick={() => handleOpenExcelPreview('Sales_Funnel_Pipeline', [{ Stage: 'AI 가설 제안', Count: 120, Rate: '100%' }, { Stage: '현업 검토', Count: 94, Rate: '78%' }])} style={{ padding: '8px 14px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>📊 퍼널 분석 엑셀 미리보기</button>
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>목표 연간 GP 매출액을 설정하면 필요한 영업기회 발굴 건수와 단계별 퍼널 전환율을 시뮬레이션합니다.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', width: '100%', marginBottom: '24px' }}>
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

              <h4 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '12px', color: '#1e293b' }}>📊 영업 퍼널 단계별 전환율 및 파이프라인 현황</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                {[
                  { stage: '1단계: AI 가설 제안', count: '120건', rate: '100%', gp: `${targetRevenue * 1.8}억원` },
                  { stage: '2단계: 현업 검토', count: '94건', rate: '78.3%', gp: `${targetRevenue * 1.4}억원` },
                  { stage: '3단계: 견적 진행', count: '42건', rate: '35.0%', gp: `${targetRevenue * 1.1}억원` },
                  { stage: '4단계: 계약 완료', count: '18건', rate: '15.0%', gp: `${targetRevenue}억원 목표` }
                ].map((funnel, fi) => (
                  <div key={fi} style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <strong style={{ fontSize: '13px', color: '#4f46e5' }}>{funnel.stage}</strong>
                    <div style={{ fontSize: '12px', color: '#334155' }}>물량: <strong>{funnel.count}</strong> (전환 {funnel.rate})</div>
                    <div style={{ fontSize: '12px', color: '#059669', fontWeight: 'bold' }}>예상 GP: {funnel.gp}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '10px', border: '1px solid #e2e8f0', width: '100%', boxSizing: 'border-box' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#1e293b' }}>📑 AI 분석 인사이트 리포트 및 지식 자산화 (Reports)</h3>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>AI 에이전트가 도출한 심층 분석 리포트 전문을 미리보거나 PDF로 다운로드할 수 있습니다.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                {[
                  { 
                    title: '[인사이트] 북미 PP 시장 수요 급증 및 B사 공략 전략 보고서', 
                    date: '2026.10.10', 
                    author: 'AI Trade Agent',
                    content: '본 보고서는 미국 관세청 통관 데이터를 기반으로 최근 12개월간 PP Resin 수입량이 210% 이상 급증한 DEF Industries 및 주요 Buyer 3개사에 대한 심층 공략 전략을 담고 있습니다.\n\n1. 시장 동향: 북미 친환경 패키징 원료 전환 수요 확대\n2. 제품 매칭: 효성 H123 Grade 스펙 유사도 92% 검증 완료\n3. 기대 효과: 연간 6.2억원 이상 GP 매출 확보 예상'
                  },
                  { 
                    title: '[성공사례] 멕시코 법인 연계 TiO2 Cross-sell 실행 결과 보고서', 
                    date: '2026.10.05', 
                    author: '화학팀 김성환',
                    content: '멕시코 법인 현장 인텔리전스와 기존 PP 거래 관계를 활용한 ABC Chemicals TiO2 Cross-sell 실행 결과 보고서입니다.\n\n1. 고객 현황: 신규 공장 증설에 따른 원료 다변화 니즈 파악\n2. 실행 내용: Rutile Grade TiO2 150톤 테스트 공급 제안 승인\n3. 후속 조치: 현지 법인 창고 연계 물류비 12% 절감 달성'
                  }
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
                          setModalType('reportViewer');
                          setIsModalOpen(true);
                        }}
                        style={{ padding: '8px 14px', backgroundColor: '#fff', color: '#4f46e5', border: '1px solid #4f46e5', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        👁️ 미리 보기
                      </button>
                      <button 
                        onClick={() => handleExportPdf(rep)}
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
                    <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 28px 0' }}>글로벌 무역 데이터와 인텔리전스를 기반으로 무엇이든 질문해 주세요. (GEMINI_API_KEYS 연동 완료)</p>
                    
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
                      placeholder="무역 데이터 및 영업 가설에 대해 하이브리드 질문하세요..." 
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