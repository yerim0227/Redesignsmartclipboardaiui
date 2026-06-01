import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft, FileText, Calendar, Bell, Share2, CheckSquare,
  Check, Edit3, Smartphone, Info, Send, Sparkles, ChevronDown, RotateCcw,
} from "lucide-react";

type AppScreen = 'home' | 'data' | 'tasks' | 'topicDetail' | 'actionReview';
type NavigateFn = (screen: AppScreen, data?: Record<string, string>) => void;

type ActionConfig = {
  title: string;
  icon: React.ElementType;
  color: string;
  app: string;
  appBg: string;
  defaultTitle: string;
  defaultBody: string;
};

type ChatMessage = {
  id: string;
  role: 'ai' | 'user';
  text: string;
};

type Version = {
  id: number;
  label: string;
  title: string;
  body: string;
};

const actionConfigs: Record<string, ActionConfig> = {
  note: {
    title: '요약 노트 초안',
    icon: FileText,
    color: '#1D4ED8',
    app: 'Samsung Notes',
    appBg: '#FFF9DB',
    defaultTitle: '스크린샷 수집 요약 노트',
    defaultBody:
      '📋 수집된 스크린샷 분석 결과\n\n' +
      '• 회의 자료: 주간 업무 보고, Q2 목표 달성률 78%\n' +
      '• 여행 계획: 제주도 3박 4일, 애월 숙소 예약\n' +
      '• 레시피: 된장찌개 재료 목록 (된장, 두부, 호박)\n' +
      '• 행사 안내: 사내 워크샵 5월 30일 오후 2시\n' +
      '• 테스트: UI 컴포넌트 레이아웃 확인',
  },
  calendar: {
    title: '캘린더 일정 초안',
    icon: Calendar,
    color: '#2563EB',
    app: 'Samsung Calendar',
    appBg: '#EFF6FF',
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
    app: 'Samsung Reminders',
    appBg: '#F5F3FF',
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
    color: '#64748B',
    app: '공유하기',
    appBg: '#F8FAFC',
    defaultTitle: '스크린샷 모음 공유',
    defaultBody: '최근 수집한 정보를 정리했습니다.\n\n공유 내용을 편집하세요.',
  },
  todo: {
    title: '할 일 목록 초안',
    icon: CheckSquare,
    color: '#059669',
    app: 'Samsung Notes',
    appBg: '#F0FDF4',
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

const quickSuggestions = ['더 간결하게', '핵심만 요약', '제목 바꿔줘', '영어로 번역'];

const aiReplies: Record<string, { title?: string; body?: string; message: string }> = {
  '더 간결하게': {
    body: '• 회의: Q2 달성률 78%\n• 여행: 제주도 3박4일 (애월)\n• 레시피: 된장찌개 재료\n• 행사: 워크샵 5/30 14:00\n• 테스트: UI 레이아웃',
    message: '본문을 더 간결하게 줄였어요. 초안에 반영했습니다.',
  },
  '핵심만 요약': {
    body: '주요 일정: 사내 워크샵(5/30), 제주도 여행(6/3~6)\n구매 필요: 된장찌개 재료\n업무: Q2 목표 달성률 78%',
    message: '핵심 내용만 3줄로 요약했어요.',
  },
  '제목 바꿔줘': {
    title: '5월 4주차 수집 항목 정리',
    message: '제목을 날짜 기반으로 변경했어요.',
  },
  '영어로 번역': {
    title: 'Screenshot Collection Summary Note',
    body: '📋 Collected Screenshot Analysis\n\n• Meeting: Weekly report, Q2 goal 78%\n• Travel: Jeju Island 3N4D, Aewol stay\n• Recipe: Doenjang-jjigae ingredients\n• Event: Workshop May 30, 2PM\n• Test: UI component layout check',
    message: '제목과 본문을 영어로 번역했어요.',
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

  const [isEditing, setIsEditing] = useState(false);
  const [titleVal, setTitleVal] = useState(config.defaultTitle);
  const [bodyVal, setBodyVal] = useState(config.defaultBody);
  const [executed, setExecuted] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'ai',
      text: '초안 내용을 수정하거나 개선하고 싶은 부분이 있으면 말씀해 주세요. 바로 반영해 드릴게요.',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatFullscreen, setChatFullscreen] = useState(false);
  const [versions, setVersions] = useState<Version[]>([
    { id: 1, label: 'v1 원본', title: config.defaultTitle, body: config.defaultBody },
  ]);
  const [activeVersionId, setActiveVersionId] = useState(1);
  const [versionsOpen, setVersionsOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
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
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

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
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
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

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: reply ? reply.message : '요청 내용을 반영했어요. 초안을 확인해 주세요.',
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, aiMsg]);
    }, 1000);
  };

  const handleExecute = () => {
    setExecuted(true);
    setTimeout(() => navigate('topicDetail', { topicId: '1' }), 1200);
  };

  if (chatFullscreen) {
    return (
      <div className="flex flex-col h-full bg-white" style={{ minHeight: '780px' }}>
        {/* Fullscreen chat header */}
        <div
          className="px-4 pt-3 pb-3 flex items-center gap-3 border-b flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${config.color}18, ${config.color}08)`,
            borderColor: `${config.color}25`,
          }}
        >
          <button
            onClick={() => setChatFullscreen(false)}
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.8)' }}
          >
            <ArrowLeft size={16} className="text-[#64748B]" />
          </button>
          <div
            className="w-7 h-7 rounded-xl flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${config.color}, #1E3A8A)` }}
          >
            <Sparkles size={14} className="text-white" />
          </div>
          <div>
            <p className="text-[14px]" style={{ fontWeight: 700, color: config.color }}>AI 수정 요청</p>
            <p className="text-[10px] text-[#94A3B8]">{config.title} · 초안에 즉시 반영</p>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'ai' && (
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-0.5"
                  style={{ background: `linear-gradient(135deg, ${config.color}, #1E3A8A)` }}
                >
                  <Sparkles size={11} className="text-white" />
                </div>
              )}
              <div
                className="max-w-[78%] px-3 py-2 rounded-2xl text-[12px] leading-relaxed"
                style={
                  msg.role === 'ai'
                    ? { background: '#F1F5F9', color: '#1E293B', borderBottomLeftRadius: '4px' }
                    : { background: config.color, color: 'white', borderBottomRightRadius: '4px' }
                }
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${config.color}, #1E3A8A)` }}
              >
                <Sparkles size={11} className="text-white" />
              </div>
              <div className="px-3 py-2 rounded-2xl" style={{ background: '#F1F5F9', borderBottomLeftRadius: '4px' }}>
                <div className="flex gap-1 items-center h-4">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: '#94A3B8', animation: `bounce 1s ease-in-out ${i * 0.15}s infinite` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick suggestions */}
        <div
          className="px-4 py-2.5 flex gap-2 overflow-x-auto border-t flex-shrink-0"
          style={{ borderColor: '#F1F5F9', scrollbarWidth: 'none' }}
        >
          {quickSuggestions.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="flex-shrink-0 text-[11px] px-3 py-1.5 rounded-full"
              style={{ background: `${config.color}12`, color: config.color, fontWeight: 500 }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <div
          className="flex items-center gap-2 px-4 py-3 border-t flex-shrink-0"
          style={{ background: '#FAFAFA', borderColor: '#E8EDF8' }}
        >
          <input
            ref={inputRef}
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(chatInput)}
            placeholder="수정 내용을 입력하세요..."
            autoFocus
            className="flex-1 text-[12px] outline-none bg-transparent"
            style={{ color: '#1E293B' }}
          />
          <button
            onClick={() => sendMessage(chatInput)}
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: chatInput.trim() ? config.color : '#E2E8F0' }}
          >
            <Send size={14} style={{ color: chatInput.trim() ? 'white' : '#94A3B8' }} />
          </button>
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

  if (executed) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-8 py-16 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: 'linear-gradient(135deg, #1D4ED8, #1E3A8A)' }}
        >
          <Check size={28} className="text-white" />
        </div>
        <p className="text-[16px] text-[#1E293B]" style={{ fontWeight: 700 }}>실행 완료!</p>
        <p className="text-[12px] text-[#94A3B8] mt-1.5">{config.app}으로 전달되었어요</p>
        <p className="text-[11px] text-[#CBD5E1] mt-1">잠시 후 이전 화면으로 돌아갑니다</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-white px-4 pt-3 pb-3 border-b" style={{ borderColor: '#E8EDF8' }}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('topicDetail', { topicId: '1' })}
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#F1F5F9' }}
          >
            <ArrowLeft size={16} className="text-[#64748B]" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center"
                style={{ background: `${config.color}18` }}
              >
                <Icon size={13} style={{ color: config.color }} />
              </div>
              <h2 className="text-[15px] text-[#1E293B]" style={{ fontWeight: 700 }}>
                {config.title}
              </h2>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className="text-[9px] px-1.5 py-0.5 rounded-full"
                style={{ background: '#FFFFFF', color: '#1D4ED8' }}
              >
                AI 생성 초안
              </span>
              <span className="text-[9px] text-[#94A3B8]">· 사용자 확인 후 실행</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">

        {/* Safety notice */}
        <div
          className="rounded-xl p-3 border flex gap-2"
          style={{ background: '#FFFBEB', borderColor: '#FDE68A' }}
        >
          <Info size={13} className="text-[#D97706] flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-[#92400E] leading-relaxed">
            AI가 초안을 작성했어요. 내용을 확인하고 수정한 후 실행해 주세요.
            <span className="font-semibold"> AI는 사용자 확인 없이 자동으로 실행하지 않아요.</span>
          </p>
        </div>

        {/* Version dropdown */}
        {versions.length > 1 && (
          <div ref={versionDropdownRef} className="relative flex justify-center">
            <button
              onClick={() => setVersionsOpen((v) => !v)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border w-full"
              style={{
                background: '#FAFBFF',
                borderColor: `${config.color}30`,
                justifyContent: 'center',
              }}
            >
              <RotateCcw size={11} style={{ color: config.color }} />
              <span className="text-[11px]" style={{ fontWeight: 600, color: config.color }}>
                편집 버전
              </span>
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
                style={{
                  background: 'white',
                  borderColor: `${config.color}25`,
                  boxShadow: `0 8px 24px rgba(0,0,0,0.12)`,
                }}
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
                      {v.id === 1 && (
                        <span className="text-[9px] text-[#94A3B8]">원본</span>
                      )}
                    </div>
                    {activeVersionId === v.id && (
                      <span
                        className="text-[9px] px-1.5 py-0.5 rounded-full"
                        style={{ background: `${config.color}15`, color: config.color }}
                      >
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
                  style={{ maxHeight: '140px', overflowY: 'auto' }}
                >
                  {bodyVal}
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="text-[10px] text-[#94A3B8] block mb-1" style={{ fontWeight: 600 }}>대상 앱</label>
            <div
              className="flex items-center gap-2 rounded-xl px-3 py-2"
              style={{ background: config.appBg }}
            >
              <Smartphone size={13} style={{ color: config.color }} />
              <span className="text-[12px] text-[#1E293B]">{config.app}</span>
              <span
                className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full"
                style={{ background: `${config.color}18`, color: config.color }}
              >
                Samsung
              </span>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-[#94A3B8] block mb-1" style={{ fontWeight: 600 }}>관련 데이터 소스</label>
            <div className="flex flex-wrap gap-1">
              {['스크린샷 × 5', 'Collected items (5)', '5월 20~26일'].map((src) => (
                <span
                  key={src}
                  className="text-[9px] px-1.5 py-0.5 rounded-full"
                  style={{ background: '#FFFFFF', color: '#2563EB' }}
                >
                  {src}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* AI Chat */}
        <div
          className="rounded-2xl overflow-hidden cursor-pointer"
          onClick={() => setChatFullscreen(true)}
          style={{
            border: `1.5px solid ${config.color}40`,
            boxShadow: `0 4px 16px ${config.color}20`,
          }}
        >
          {/* Chat header */}
          <div
            className="px-3 py-2.5 flex items-center gap-2 border-b"
            style={{
              background: `linear-gradient(135deg, ${config.color}22, ${config.color}0a)`,
              borderColor: `${config.color}25`,
            }}
          >
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${config.color}, #1E3A8A)` }}
            >
              <Sparkles size={12} className="text-white" />
            </div>
            <span className="text-[11px]" style={{ fontWeight: 700, color: config.color }}>AI에게 수정 요청</span>
            <span className="text-[9px] ml-auto" style={{ color: `${config.color}99` }}>초안에 즉시 반영</span>
          </div>

          {/* Messages */}
          <div
            className="px-3 py-2.5 space-y-2 bg-white"
            style={{ maxHeight: '160px', overflowY: 'auto' }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'ai' && (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mr-1.5 mt-0.5"
                    style={{ background: `${config.color}18` }}
                  >
                    <Sparkles size={9} style={{ color: config.color }} />
                  </div>
                )}
                <div
                  className="max-w-[80%] px-2.5 py-1.5 rounded-xl text-[11px] leading-relaxed"
                  style={
                    msg.role === 'ai'
                      ? { background: '#F1F5F9', color: '#1E293B' }
                      : { background: config.color, color: 'white' }
                  }
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start items-center gap-1.5">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: `${config.color}18` }}
                >
                  <Sparkles size={9} style={{ color: config.color }} />
                </div>
                <div className="px-2.5 py-1.5 rounded-xl" style={{ background: '#F1F5F9' }}>
                  <div className="flex gap-1 items-center h-3">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1 h-1 rounded-full"
                        style={{
                          background: '#94A3B8',
                          animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick suggestions */}
          <div
            className="px-3 py-2 flex gap-1.5 overflow-x-auto border-t"
            style={{ borderColor: '#F1F5F9', scrollbarWidth: 'none' }}
          >
            {quickSuggestions.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="flex-shrink-0 text-[10px] px-2.5 py-1 rounded-full"
                style={{ background: `${config.color}12`, color: config.color, fontWeight: 500 }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input row */}
          <div
            className="flex items-center gap-2 px-3 py-2.5 border-t"
            style={{ background: '#FAFAFA', borderColor: '#E8EDF8' }}
          >
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(chatInput)}
              placeholder="수정 내용을 입력하세요..."
              className="flex-1 text-[11px] outline-none bg-transparent"
              style={{ color: '#1E293B' }}
            />
            <button
              onClick={() => sendMessage(chatInput)}
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: chatInput.trim() ? config.color : '#E2E8F0' }}
            >
              <Send size={12} style={{ color: chatInput.trim() ? 'white' : '#94A3B8' }} />
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
            className="flex items-center justify-center gap-1.5 py-3 rounded-xl text-[12px]"
            style={{
              background: isEditing ? `${config.color}18` : '#FFFFFF',
              color: config.color,
              fontWeight: 600,
            }}
          >
            <Edit3 size={14} />
            {isEditing ? '완료' : '수정'}
          </button>
          <button
            onClick={handleExecute}
            disabled={isEditing}
            className="flex items-center justify-center gap-1.5 py-3 rounded-xl text-[12px] text-white"
            style={{
              background: isEditing
                ? '#CBD5E1'
                : `linear-gradient(135deg, ${config.color}, #1E3A8A)`,
              fontWeight: 600,
              cursor: isEditing ? 'not-allowed' : 'pointer',
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
