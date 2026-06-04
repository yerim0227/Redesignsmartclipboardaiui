import { useState, useEffect } from "react";
import { ArrowLeft, Sparkles, Camera, FileText, ShoppingCart, Code2, Plane, ChevronRight, X } from "lucide-react";

type AppScreen = 'home' | 'data' | 'tasks' | 'topicDetail' | 'actionReview' | 'storage' | 'history' | 'aiSuggest';
type NavigateFn = (screen: AppScreen, data?: Record<string, string>) => void;

type SuggestedTopic = {
  id: string;
  title: string;
  description: string;
  dataCount: number;
  dataTypes: string[];
  icon: typeof Camera;
  color: string;
  accentBg: string;
  tags: string[];
};

const suggestedTopics: SuggestedTopic[] = [
  {
    id: '1',
    title: '회의 자료 정리',
    description: '회의 스크린샷과 메모를 삼성 노트와 액션 아이템으로 정리해 드릴게요.',
    dataCount: 5,
    dataTypes: ['스크린샷 3개', '메모 2개'],
    icon: FileText,
    color: '#1D4ED8',
    accentBg: '#EFF6FF',
    tags: ['업무', '회의', '문서화'],
  },
  {
    id: '2',
    title: '제주도 여행 계획',
    description: '숙소, 맛집, 일정 캡처를 모아 여행 가이드와 캘린더 일정으로 만들어 드려요.',
    dataCount: 7,
    dataTypes: ['스크린샷 4개', '링크 3개'],
    icon: Plane,
    color: '#0891B2',
    accentBg: '#ECFEFF',
    tags: ['여행', '일정', '제주'],
  },
  {
    id: '3',
    title: '레시피 컬렉션',
    description: '저장된 레시피 이미지에서 재료 목록과 조리 순서를 자동 추출할게요.',
    dataCount: 6,
    dataTypes: ['스크린샷 6개'],
    icon: Camera,
    color: '#059669',
    accentBg: '#ECFDF5',
    tags: ['요리', '레시피', '식재료'],
  },
  {
    id: '4',
    title: '쇼핑 위시리스트',
    description: '저장해 둔 상품 링크와 캡처를 가격 비교 정리표로 만들어 드려요.',
    dataCount: 8,
    dataTypes: ['스크린샷 2개', '링크 6개'],
    icon: ShoppingCart,
    color: '#D97706',
    accentBg: '#FFFBEB',
    tags: ['쇼핑', '위시리스트'],
  },
  {
    id: '5',
    title: '개발 참고 자료',
    description: '코드 스크린샷과 공식 문서 링크를 주제별로 분류해 정리해 드릴게요.',
    dataCount: 9,
    dataTypes: ['스크린샷 5개', '링크 4개'],
    icon: Code2,
    color: '#7C3AED',
    accentBg: '#F5F3FF',
    tags: ['개발', '레퍼런스', '코드'],
  },
];

const SCAN_STEPS = [
  { label: '데이터 스캔 중...', sub: '저장된 데이터를 분석하고 있어요' },
  { label: '패턴 분류 중...', sub: '콘텐츠 유형을 파악하고 있어요' },
  { label: '주제 추천 준비 중...', sub: '최적의 정리 방법을 찾고 있어요' },
];

export function AiSuggestScreen({
  navigate,
  data,
}: {
  navigate: NavigateFn;
  data: Record<string, string>;
}) {
  const skipLoading = data.skipLoading === 'true';
  const [phase, setPhase] = useState<'loading' | 'results'>(skipLoading ? 'results' : 'loading');
  const [stepIndex, setStepIndex] = useState(0);
  const [visibleTopics, setVisibleTopics] = useState<number>(skipLoading ? suggestedTopics.length : 0);
  const query = data.query || '';

  useEffect(() => {
    if (skipLoading) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setStepIndex(1), 900));
    timers.push(setTimeout(() => setStepIndex(2), 1700));
    timers.push(setTimeout(() => setPhase('results'), 2500));
    return () => timers.forEach(clearTimeout);
  }, []);

  // Stagger topic cards appearing
  useEffect(() => {
    if (phase !== 'results') return;
    let i = 0;
    const iv = setInterval(() => {
      i += 1;
      setVisibleTopics(i);
      if (i >= suggestedTopics.length) clearInterval(iv);
    }, 120);
    return () => clearInterval(iv);
  }, [phase]);

  /* ── Loading screen ── */
  if (phase === 'loading') {
    return (
      <div
        className="flex flex-col min-h-[780px]"
        style={{ background: 'linear-gradient(160deg, #0F1F3D 0%, #1A3660 50%, #1E3A8A 100%)' }}
      >
        <button
          onClick={() => navigate('home')}
          className="self-start m-4 w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)' }}
        >
          <X size={15} className="text-white" />
        </button>

        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          {/* Animated rings */}
          <div className="relative w-28 h-28 mb-8">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                border: '2px solid rgba(147,197,253,0.3)',
                animation: 'ping 1.4s cubic-bezier(0,0,0.2,1) infinite',
              }}
            />
            <div
              className="absolute inset-3 rounded-full"
              style={{
                border: '2px solid rgba(147,197,253,0.25)',
                animation: 'ping 1.4s cubic-bezier(0,0,0.2,1) infinite 0.3s',
              }}
            />
            <div
              className="absolute inset-6 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(37,99,235,0.4)', border: '1.5px solid rgba(147,197,253,0.5)' }}
            >
              <Sparkles size={22} className="text-[#93C5FD]" style={{ animation: 'pulse 1.2s ease-in-out infinite' }} />
            </div>
          </div>

          <h2 className="text-[20px] text-white mb-2" style={{ fontWeight: 700 }}>
            AI가 분석하고 있어요
          </h2>

          {query && (
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-5"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <span className="text-[11px] text-[#93C5FD]">"{query}"</span>
            </div>
          )}
          {!query && <div className="mb-5" />}

          {/* Step indicators */}
          <div className="space-y-3 w-full max-w-[260px]">
            {SCAN_STEPS.map((step, i) => {
              const isDone = i < stepIndex;
              const isActive = i === stepIndex;
              return (
                <div
                  key={i}
                  className="flex items-center gap-3"
                  style={{ opacity: i > stepIndex ? 0.3 : 1, transition: 'opacity 0.3s' }}
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: isDone ? '#10B981' : isActive ? 'rgba(147,197,253,0.3)' : 'rgba(255,255,255,0.1)',
                      border: isActive ? '1.5px solid #93C5FD' : 'none',
                      transition: 'all 0.3s',
                    }}
                  >
                    {isDone ? (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : isActive ? (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#93C5FD]" style={{ animation: 'pulse 0.8s ease-in-out infinite' }} />
                    ) : null}
                  </div>
                  <div className="text-left">
                    <p className="text-[12px] text-white" style={{ fontWeight: isDone ? 500 : isActive ? 600 : 400 }}>
                      {step.label}
                    </p>
                    {isActive && (
                      <p className="text-[10px]" style={{ color: 'rgba(147,197,253,0.7)' }}>{step.sub}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /* ── Results screen ── */
  return (
    <div className="bg-[#F7F9FC] min-h-full">
      {/* Header — gradient */}
      <div
        className="px-4 pt-3 pb-5"
        style={{ background: 'linear-gradient(160deg, #0F1F3D 0%, #1A3660 55%, #1E3A8A 100%)' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('home')}
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)' }}
          >
            <ArrowLeft size={15} className="text-white" />
          </button>
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-[#93C5FD]" />
            <span className="text-[14px] text-white" style={{ fontWeight: 700 }}>AI 추천 주제</span>
          </div>
        </div>

        <div
          className="rounded-2xl px-4 py-3"
          style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.15)' }}
        >
          <p className="text-[11px] mb-0.5" style={{ color: 'rgba(147,197,253,0.8)', fontWeight: 600 }}>
            분석 결과
          </p>
          <p className="text-[13px] text-white" style={{ fontWeight: 500 }}>
            {suggestedTopics.length}개 주제를 찾았어요
            {query ? ` · "${query}" 기반` : ' · 전체 데이터 기반'}
          </p>
          <p className="text-[10px] mt-1" style={{ color: 'rgba(165,180,252,0.65)' }}>
            주제를 선택하면 AI가 초안을 생성해 드려요
          </p>
        </div>
      </div>

      {/* Topic cards */}
      <div className="p-4 space-y-3">
        {suggestedTopics.map((topic, idx) => {
          const Icon = topic.icon;
          const visible = idx < visibleTopics;
          return (
            <div
              key={topic.id}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(12px)',
                transition: 'opacity 0.22s ease, transform 0.22s ease',
              }}
            >
              <button
                onClick={() => navigate('topicDetail', { topicId: topic.id, topicTitle: topic.title, from: 'aiSuggest', query })}
                className="w-full bg-white rounded-2xl border text-left overflow-hidden"
                style={{
                  borderColor: '#E8EDF8',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                }}
              >
                {/* Top row */}
                <div className="flex items-start gap-3 p-4 pb-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: topic.accentBg }}
                  >
                    <Icon size={19} style={{ color: topic.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="text-[14px] text-[#1E293B]" style={{ fontWeight: 700 }}>
                        {topic.title}
                      </span>
                      <ChevronRight size={15} className="text-[#CBD5E1] flex-shrink-0" />
                    </div>
                    <p className="text-[11px] text-[#64748B] leading-relaxed">{topic.description}</p>
                  </div>
                </div>

                {/* Bottom strip */}
                <div
                  className="flex items-center justify-between px-4 py-2.5 border-t"
                  style={{ borderColor: '#F1F5F9', background: '#FAFBFF' }}
                >
                  <div className="flex items-center gap-1.5">
                    {topic.dataTypes.map((dt) => (
                      <span
                        key={dt}
                        className="text-[9px] px-2 py-0.5 rounded-full"
                        style={{ background: topic.accentBg, color: topic.color, fontWeight: 600 }}
                      >
                        {dt}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    {topic.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-[9px] text-[#94A3B8]">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            </div>
          );
        })}

        {/* Direct pick fallback */}
        <button
          onClick={() => navigate('data')}
          className="w-full py-3 rounded-2xl text-[12px] border mt-1"
          style={{ color: '#64748B', borderColor: '#E2E8F0', background: '#FFFFFF', fontWeight: 500 }}
        >
          직접 데이터 선택하기
        </button>

        <div className="h-4" />
      </div>
    </div>
  );
}
