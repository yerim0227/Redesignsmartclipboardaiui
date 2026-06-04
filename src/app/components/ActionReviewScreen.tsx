import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft, FileText, Calendar, Bell, Share2, CheckSquare,
  Check, Edit3, Send, Sparkles, ChevronDown, RotateCcw,
} from "lucide-react";

type AppScreen = 'home' | 'data' | 'tasks' | 'topicDetail' | 'actionReview' | 'storage' | 'history' | 'aiSuggest';
type NavigateFn = (screen: AppScreen, data?: Record<string, string>) => void;

type ActionConfig = {
  title: string;
  icon: React.ElementType;
  color: string;
  defaultTitle: string;
  defaultBody: string;
};

type Version = {
  id: number;
  label: string;
  title: string;
  body: string;
};

const actionConfigs: Record<string, ActionConfig> = {
  note: {
    title: '삼성 노트 초안',
    icon: FileText,
    color: '#1D4ED8',
    defaultTitle: '스크린샷 수집 삼성 노트',
    defaultBody:
      '📋 수집된 스크린샷 분석 결과\n\n' +
      '• 회의 자료: 주간 업무 보고, Q2 목표 달성률 78%\n' +
      '• 여행 계획: 제주도 3박 4일, 애월 숙소 예약\n' +
      '• 레시피: 된장찌개 재료 목록 (된장, 두부, 호박)\n' +
      '• 행사 안내: 사내 워크샵 5월 30일 오후 2시\n' +
      '• 테스트: UI 컴포넌트 레이아웃 확인',
  },
  calendar: {
    title: '캘린더 초안',
    icon: Calendar,
    color: '#2563EB',
    defaultTitle: '사내 워크샵 — 5월 30일',
    defaultBody:
      '📅 일정 정보\n\n' +
      '제목: 사내 워크샵\n' +
      '날짜: 2026년 5월 30일 (금)\n' +
      '시간: 오후 2:00 ~ 오후 5:00\n' +
      '장소: 본사 B동 3층 대회의실\n\n' +
      '📍 추가 일정\n' +
      '• 제주도 여행: 6월 3일 ~ 6월 6일',
  },
  reminder: {
    title: '리마인더 초안',
    icon: Bell,
    color: '#1E3A8A',
    defaultTitle: '워크샵 준비 및 재료 구매',
    defaultBody:
      '⏰ 알림 항목\n\n' +
      '① 된장찌개 재료 구매\n   → 5월 28일(수) 오전 11:00\n\n' +
      '② 워크샵 참석 확인 메일 발송\n   → 5월 29일(목) 오전 9:00\n\n' +
      '③ 제주도 렌터카 최종 확인\n   → 6월 2일(화) 오전 10:00',
  },
  share: {
    title: '공유 초안',
    icon: Share2,
    color: '#0891B2',
    defaultTitle: '5월 4주차 수집 정보 공유',
    defaultBody:
      '📤 공유 내용 정리\n\n' +
      '안녕하세요! 최근 수집한 정보를 정리해서 공유드려요.\n\n' +
      '📋 주요 내용\n' +
      '• 사내 워크샵: 5월 30일(금) 오후 2시 · B동 3층\n' +
      '• 제주도 여행: 6월 3일 ~ 6월 6일 · 애월 숙소\n' +
      '• 된장찌개 레시피: 재료 목록 첨부\n' +
      '• Q2 업무 보고: 달성률 78%\n\n' +
      '필요하신 분은 말씀해 주세요 😊',
  },
  todo: {
    title: '할 일 목록 초안',
    icon: CheckSquare,
    color: '#059669',
    defaultTitle: '이번 주 할 일',
    defaultBody:
      '✅ 할 일 목록\n\n' +
      '[ ] 된장찌개 재료 구매 (된장, 두부 1/2모, 호박, 양파)\n' +
      '[ ] 사내 워크샵 참석 확인 (5월 30일)\n' +
      '[ ] 제주도 숙소 체크인 정보 확인\n' +
      '[ ] Q2 업무 보고 자료 검토\n' +
      '[x] 스크린샷 정리 완료',
  },
};

const quickSuggestions = ['더 간결하게', '핵심만 요약', '제목 바꿔줘', '영어로 번역', '친근하게'];

const aiReplies: Record<string, { title?: string; body?: string }> = {
  '더 간결하게': {
    body: '• 회의: Q2 달성률 78%\n• 여행: 제주도 3박4일 (애월)\n• 레시피: 된장찌개 재료\n• 행사: 워크샵 5/30 14:00\n• 테스트: UI 레이아웃',
  },
  '핵심만 요약': {
    body: '주요 일정: 사내 워크샵(5/30), 제주도 여행(6/3~6)\n구매 필요: 된장찌개 재료\n업무: Q2 목표 달성률 78%',
  },
  '제목 바꿔줘': {
    title: '5월 4주차 수집 항목 정리',
  },
  '영어로 번역': {
    title: 'May Week 4 — Collected Info',
    body: '📤 Sharing Summary\n\nHi! Here\'s a summary of recently collected info.\n\n📋 Key Items\n• Workshop: May 30(Fri) 2PM · Building B, 3F\n• Jeju Trip: Jun 3 ~ Jun 6 · Aewol stay\n• Doenjang-jjigae recipe: ingredients list attached\n• Q2 report: 78% goal achieved\n\nLet me know if you need anything 😊',
  },
  '친근하게': {
    body: '📤 안녕하세요~!\n\n이번 주 모은 정보 공유할게요 😄\n\n🗓️ 워크샵이 5월 30일 금요일 오후 2시에 있어요! B동 3층이에요.\n✈️ 제주 여행은 6월 3일~6일이고요, 애월에 숙소 잡았어요.\n🍲 된장찌개 레시피도 정리했으니 필요하면 알려주세요!\n\n궁금한 거 있으면 편하게 물어봐요 😊',
  },
};

export function ActionReviewScreen({
  navigate,
  data,
}: {
  navigate: NavigateFn;
  data: Record<string, string>;
}) {
  const actionType = data.actionType || 'note';
  const config = actionConfigs[actionType] || actionConfigs.note;
  const Icon = config.icon;

  const topicId = data.topicId || '1';
  const topicTitle = data.topicTitle || '';
  const from = data.from || '';
  const query = data.query || '';

  const [isEditing, setIsEditing] = useState(false);
  const [titleVal, setTitleVal] = useState(config.defaultTitle);
  const [bodyVal, setBodyVal] = useState(config.defaultBody);
  const [executed, setExecuted] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [versions, setVersions] = useState<Version[]>([
    { id: 1, label: 'v1 원본', title: config.defaultTitle, body: config.defaultBody },
  ]);
  const [activeVersionId, setActiveVersionId] = useState(1);
  const [versionsOpen, setVersionsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const versionDropdownRef = useRef<HTMLDivElement>(null);

  const saveVersion = (newTitle: string, newBody: string) => {
    setVersions((prev) => {
      const nextId = prev.length + 1;
      return [...prev, { id: nextId, label: `v${nextId}`, title: newTitle, body: newBody }];
    });
    setActiveVersionId((prev) => prev + 1);
  };

  const restoreVersion = (v: Version) => {
    setTitleVal(v.title);
    setBodyVal(v.body);
    setActiveVersionId(v.id);
  };

  useEffect(() => {
    if (!versionsOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (versionDropdownRef.current && !versionDropdownRef.current.contains(e.target as Node)) {
        setVersionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [versionsOpen]);

  const sendMessage = (text: string) => {
    if (!text.trim() || isTyping) return;
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      const matched = Object.keys(aiReplies).find((k) => text.includes(k));
      const reply = matched ? aiReplies[matched] : null;

      if (reply) {
        const newTitle = reply.title ?? titleVal;
        const newBody = reply.body ?? bodyVal;
        if (reply.title) setTitleVal(reply.title);
        if (reply.body) setBodyVal(reply.body);
        if (reply.title || reply.body) saveVersion(newTitle, newBody);
      }
      setIsTyping(false);
    }, 900);
  };

  const handleExecute = () => {
    setExecuted(true);
    setTimeout(() => navigate('topicDetail', { topicId, topicTitle, from, query }), 1200);
  };

  const handleBack = () => {
    navigate('topicDetail', { topicId, topicTitle, from, query });
  };

  if (executed) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-8 py-16 text-center" style={{ minHeight: '700px' }}>
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: 'linear-gradient(135deg, #1D4ED8, #1E3A8A)' }}
        >
          <Check size={28} className="text-white" />
        </div>
        <p className="text-[16px] text-[#1E293B]" style={{ fontWeight: 700 }}>실행 완료!</p>
        <p className="text-[12px] text-[#94A3B8] mt-1.5">초안이 실행되었어요</p>
        <p className="text-[11px] text-[#CBD5E1] mt-1">잠시 후 이전 화면으로 돌아갑니다</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F9FC] min-h-full">
      {/* Header */}
      <div className="bg-white px-4 pt-3 pb-3 border-b" style={{ borderColor: '#E8EDF8' }}>
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#F1F5F9' }}
          >
            <ArrowLeft size={16} className="text-[#64748B]" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${config.color}18` }}
              >
                <Icon size={13} style={{ color: config.color }} />
              </div>
              <h2 className="text-[15px] text-[#1E293B] truncate" style={{ fontWeight: 700 }}>
                {config.title}
              </h2>
            </div>
            <p className="text-[10px] text-[#94A3B8] mt-0.5">AI 생성 초안 · 사용자 확인 후 실행</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">

        {/* Version dropdown */}
        {versions.length > 1 && (
          <div ref={versionDropdownRef} className="relative">
            <button
              onClick={() => setVersionsOpen((v) => !v)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border w-full justify-center"
              style={{ background: '#FAFBFF', borderColor: `${config.color}30` }}
            >
              <RotateCcw size={11} style={{ color: config.color }} />
              <span className="text-[11px]" style={{ fontWeight: 600, color: config.color }}>편집 버전</span>
              <span
                className="text-[9px] px-1.5 py-0.5 rounded-full"
                style={{ background: `${config.color}15`, color: config.color }}
              >
                {versions.find((v) => v.id === activeVersionId)?.label ?? ''}
              </span>
              <ChevronDown
                size={13}
                style={{
                  color: config.color,
                  transform: versionsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.15s ease',
                }}
              />
            </button>

            {versionsOpen && (
              <div
                className="absolute left-0 right-0 top-full mt-1 rounded-2xl border overflow-hidden z-20"
                style={{ background: 'white', borderColor: `${config.color}25`, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
              >
                <p className="text-[9px] text-[#94A3B8] px-3 pt-2.5 pb-1">버전을 탭하면 해당 내용으로 복원돼요</p>
                {versions.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => { restoreVersion(v); setVersionsOpen(false); }}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-left"
                    style={{
                      background: activeVersionId === v.id ? `${config.color}0e` : 'transparent',
                      borderTop: '1px solid #F1F5F9',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[11px]"
                        style={{ fontWeight: activeVersionId === v.id ? 700 : 400, color: activeVersionId === v.id ? config.color : '#1E293B' }}
                      >
                        {v.label}
                      </span>
                      {v.id === 1 && <span className="text-[9px] text-[#94A3B8]">원본</span>}
                    </div>
                    {activeVersionId === v.id && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: `${config.color}15`, color: config.color }}>
                        현재
                      </span>
                    )}
                  </button>
                ))}
                <div className="h-1" />
              </div>
            )}
          </div>
        )}

        {/* Draft form */}
        <div
          className="bg-white rounded-2xl p-4 border space-y-3"
          style={{ borderColor: '#E8EDF8', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
        >
          <div>
            <label className="text-[10px] text-[#94A3B8] block mb-1" style={{ fontWeight: 600 }}>제목</label>
            {isEditing ? (
              <input
                value={titleVal}
                onChange={(e) => setTitleVal(e.target.value)}
                className="w-full text-[12px] text-[#1E293B] rounded-xl px-3 py-2 outline-none border"
                style={{ background: '#F8FAFC', borderColor: config.color }}
              />
            ) : (
              <div className="rounded-xl px-3 py-2" style={{ background: '#F8FAFC' }}>
                <p className="text-[12px] text-[#1E293B]" style={{ fontWeight: 500 }}>{titleVal}</p>
              </div>
            )}
          </div>

          <div>
            <label className="text-[10px] text-[#94A3B8] block mb-1" style={{ fontWeight: 600 }}>본문</label>
            {isEditing ? (
              <textarea
                value={bodyVal}
                onChange={(e) => setBodyVal(e.target.value)}
                rows={7}
                className="w-full text-[11px] text-[#1E293B] rounded-xl px-3 py-2 outline-none border resize-none leading-relaxed"
                style={{ background: '#F8FAFC', borderColor: config.color }}
              />
            ) : (
              <div className="rounded-xl px-3 py-2" style={{ background: '#F8FAFC' }}>
                <p
                  className="text-[11px] text-[#1E293B] leading-relaxed whitespace-pre-wrap"
                  style={{ maxHeight: '150px', overflowY: 'auto' }}
                >
                  {bodyVal}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* AI 수정 요청 */}
        <div
          className="bg-white rounded-2xl border overflow-hidden"
          style={{ borderColor: `${config.color}35`, boxShadow: `0 2px 10px ${config.color}15` }}
        >
          {/* Label */}
          <div
            className="px-3 py-2.5 flex items-center gap-2 border-b"
            style={{ background: `${config.color}0a`, borderColor: `${config.color}20` }}
          >
            <div
              className="w-5 h-5 rounded-lg flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${config.color}, #1E3A8A)` }}
            >
              <Sparkles size={11} className="text-white" />
            </div>
            <span className="text-[11px]" style={{ fontWeight: 700, color: config.color }}>AI에게 수정 요청</span>
            {isTyping && (
              <div className="flex gap-0.5 ml-auto items-center">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1 h-1 rounded-full"
                    style={{ background: config.color, opacity: 0.6, animation: `bounce 1s ease-in-out ${i * 0.15}s infinite` }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Quick suggestion buttons */}
          <div
            className="px-3 pt-2.5 pb-2 flex gap-1.5 overflow-x-auto"
            style={{ scrollbarWidth: 'none' }}
          >
            {quickSuggestions.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                disabled={isTyping}
                className="flex-shrink-0 text-[11px] px-3 py-1.5 rounded-full"
                style={{
                  background: `${config.color}12`,
                  color: config.color,
                  fontWeight: 600,
                  opacity: isTyping ? 0.5 : 1,
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input row */}
          <div
            className="flex items-center gap-2 px-3 py-2.5 border-t"
            style={{ background: '#FAFAFA', borderColor: '#F1F5F9' }}
          >
            <input
              ref={inputRef}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(chatInput)}
              placeholder="수정 내용을 입력하세요..."
              className="flex-1 text-[12px] outline-none bg-transparent"
              style={{ color: '#1E293B' }}
            />
            <button
              onClick={() => sendMessage(chatInput)}
              disabled={!chatInput.trim() || isTyping}
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: chatInput.trim() && !isTyping ? config.color : '#E2E8F0' }}
            >
              <Send size={12} style={{ color: chatInput.trim() && !isTyping ? 'white' : '#94A3B8' }} />
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              if (isEditing) saveVersion(titleVal, bodyVal);
              setIsEditing(!isEditing);
            }}
            className="flex items-center justify-center gap-1.5 py-3.5 rounded-xl text-[13px]"
            style={{
              background: isEditing ? `${config.color}18` : '#FFFFFF',
              color: config.color,
              fontWeight: 700,
              border: `1px solid ${config.color}30`,
            }}
          >
            <Edit3 size={14} />
            {isEditing ? '완료' : '직접 수정'}
          </button>
          <button
            onClick={handleExecute}
            disabled={isEditing}
            className="flex items-center justify-center gap-1.5 py-3.5 rounded-xl text-[13px] text-white"
            style={{
              background: isEditing ? '#CBD5E1' : `linear-gradient(135deg, ${config.color}, #1E3A8A)`,
              fontWeight: 700,
              cursor: isEditing ? 'not-allowed' : 'pointer',
              boxShadow: isEditing ? 'none' : `0 4px 14px ${config.color}40`,
            }}
          >
            <Check size={14} />
            실행
          </button>
        </div>

        <div className="h-2" />
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
      `}</style>
    </div>
  );
}
