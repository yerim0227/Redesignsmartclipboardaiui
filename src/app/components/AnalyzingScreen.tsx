import { useState, useEffect } from "react";
import { FileText, Calendar, Bell, Share2, Check } from "lucide-react";

type AppScreen = 'home' | 'data' | 'tasks' | 'topicDetail' | 'actionReview' | 'storage' | 'history' | 'aiSuggest' | 'analyzing';
type NavigateFn = (screen: AppScreen, data?: Record<string, string>) => void;

const STEPS = [
  { label: '선택한 데이터 불러오는 중...', sub: '항목을 준비하고 있어요' },
  { label: '텍스트 · 이미지 분석 중...', sub: '내용과 맥락을 파악하고 있어요' },
  { label: '초안 작성 중...', sub: 'AI가 액션 초안을 생성하고 있어요' },
];

const DRAFT_TYPES = [
  { icon: FileText, label: '삼성 노트', color: '#1D4ED8' },
  { icon: Calendar, label: '캘린더', color: '#2563EB' },
  { icon: Bell, label: '리마인더', color: '#1E3A8A' },
  { icon: Share2, label: '공유', color: '#0891B2' },
];

export function AnalyzingScreen({
  navigate,
  data,
}: {
  navigate: NavigateFn;
  data: Record<string, string>;
}) {
  const selectedCount = data.selectedCount || '0';
  const topicName = data.topicName || '수집 항목';

  const [stepIndex, setStepIndex] = useState(0);
  const [doneSteps, setDoneSteps] = useState<number[]>([]);
  const [visibleDrafts, setVisibleDrafts] = useState<number>(0);
  const [phase, setPhase] = useState<'analyzing' | 'done'>('analyzing');

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => { setDoneSteps([0]); setStepIndex(1); }, 1000));
    timers.push(setTimeout(() => { setDoneSteps([0, 1]); setStepIndex(2); }, 2000));
    timers.push(setTimeout(() => { setDoneSteps([0, 1, 2]); setPhase('done'); }, 3000));

    // Draft cards appear after step 3
    timers.push(setTimeout(() => setVisibleDrafts(1), 3150));
    timers.push(setTimeout(() => setVisibleDrafts(2), 3280));
    timers.push(setTimeout(() => setVisibleDrafts(3), 3410));
    timers.push(setTimeout(() => setVisibleDrafts(4), 3540));

    // Auto-navigate
    timers.push(setTimeout(() => {
      navigate('topicDetail', { topicId: '1', topicTitle: topicName });
    }, 4400));

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div
      className="flex flex-col min-h-[780px]"
      style={{ background: 'linear-gradient(160deg, #0D1B38 0%, #1A3260 50%, #1E3A8A 100%)' }}
    >
      {/* Top area */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center pb-4">

        {/* Selected count badge */}
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full mb-8"
          style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.16)' }}
        >
          <div className="w-2 h-2 rounded-full" style={{ background: '#34D399' }} />
          <span className="text-[12px] text-white" style={{ fontWeight: 600 }}>
            {selectedCount}개 항목 선택됨
          </span>
        </div>

        {/* Topic name */}
        <h2 className="text-[22px] text-white mb-1" style={{ fontWeight: 800, letterSpacing: '-0.4px' }}>
          {topicName}
        </h2>
        <p className="text-[12px] mb-10" style={{ color: 'rgba(165,180,252,0.7)' }}>
          AI가 선택한 데이터를 분석해 초안을 작성하고 있어요
        </p>

        {/* Step list */}
        <div className="space-y-3.5 w-full max-w-[270px] mb-10">
          {STEPS.map((step, i) => {
            const isDone = doneSteps.includes(i);
            const isActive = i === stepIndex && !isDone;
            return (
              <div
                key={i}
                className="flex items-center gap-3"
                style={{ opacity: i > stepIndex ? 0.28 : 1, transition: 'opacity 0.3s ease' }}
              >
                {/* Status dot */}
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: isDone ? '#10B981' : isActive ? 'rgba(147,197,253,0.2)' : 'rgba(255,255,255,0.08)',
                    border: isActive ? '1.5px solid #93C5FD' : 'none',
                    transition: 'all 0.3s ease',
                    boxShadow: isDone ? '0 0 8px rgba(16,185,129,0.4)' : 'none',
                  }}
                >
                  {isDone ? (
                    <Check size={12} className="text-white" strokeWidth={2.5} />
                  ) : isActive ? (
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: '#93C5FD', animation: 'pulse 0.8s ease-in-out infinite' }}
                    />
                  ) : null}
                </div>
                <div className="text-left">
                  <p
                    className="text-[12px] text-white"
                    style={{ fontWeight: isDone ? 500 : isActive ? 700 : 400 }}
                  >
                    {step.label}
                  </p>
                  {isActive && (
                    <p className="text-[10px] mt-0.5" style={{ color: 'rgba(147,197,253,0.65)' }}>
                      {step.sub}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Draft cards appear when done */}
        {phase === 'done' && (
          <div className="w-full space-y-2">
            <p className="text-[11px] mb-3" style={{ color: 'rgba(147,197,253,0.75)', fontWeight: 600 }}>
              생성된 초안 {visibleDrafts}개
            </p>
            {DRAFT_TYPES.map((d, i) => {
              const Icon = d.icon;
              const visible = i < visibleDrafts;
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(8px)',
                    transition: 'opacity 0.2s ease, transform 0.2s ease',
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${d.color}30` }}
                  >
                    <Icon size={14} style={{ color: '#93C5FD' }} />
                  </div>
                  <span className="text-[12px] text-white flex-1 text-left" style={{ fontWeight: 500 }}>
                    {d.label}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#34D399' }} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom label */}
      <div className="pb-10 pt-2 text-center">
        <p className="text-[10px]" style={{ color: 'rgba(147,197,253,0.45)' }}>
          {phase === 'done' ? '초안 화면으로 이동 중...' : 'AI Agent가 분석하고 있어요'}
        </p>
      </div>
    </div>
  );
}
