import { useState } from "react";
import {
  Sparkles, ChevronRight, ChevronDown, ChevronUp,
  Camera, Brain, EyeOff, Link, FileText, Image, Search,
} from "lucide-react";

type AppScreen = 'home' | 'data' | 'tasks' | 'topicDetail' | 'actionReview';
type NavigateFn = (screen: AppScreen, data?: Record<string, string>) => void;

const recentItems = [
  { id: '1', name: 'Screenshot_20260526_091234_Meeting.jpg', date: '5월 26일 09:12', color: '#1D4ED8', label: '회의 자료' },
  { id: '2', name: 'Screenshot_20260524_133021_Travel.jpg', date: '5월 24일 13:30', color: '#1E3A8A', label: '여행 계획' },
  { id: '3', name: 'Screenshot_20260523_080045_Recipe.jpg', date: '5월 23일 08:00', color: '#0891B2', label: '레시피' },
  { id: '4', name: 'Screenshot_20260522_195532_Event.jpg', date: '5월 22일 19:55', color: '#059669', label: '행사 안내' },
  { id: '5', name: 'Screenshot_20260520_164512_Test.jpg', date: '5월 20일 16:45', color: '#1D4ED8', label: '테스트' },
];

export function HomeScreen({ navigate }: { navigate: NavigateFn }) {
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'entry' | 'dashboard'>('entry');
  const [showRecommend, setShowRecommend] = useState(true);
  // Entry screen: toggle dashboard sections below
  const [showDetails, setShowDetails] = useState(false);

  const handleAction = () => {
    setView('dashboard');
  };

  /* ─────────────────────────────────────────
     SHARED DASHBOARD SECTIONS
     (used both in entry expand and dashboard view)
  ───────────────────────────────────────── */
  const DashboardSections = () => (
    <div className="space-y-3">
      {/* 오늘 수집 */}
      <div
        className="bg-white rounded-2xl p-4 border"
        style={{ borderColor: '#E8EDF8', boxShadow: '0 2px 12px rgba(29,78,216,0.08)' }}
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-2 h-2 rounded-full bg-[#10B981]" />
              <span className="text-[11px] text-[#64748B]">오늘 수집</span>
            </div>
            <p className="text-[22px] text-[#1E293B]" style={{ fontWeight: 700, lineHeight: 1.1 }}>
              5개 수집됨
            </p>
          </div>
          <button
            onClick={() => navigate('data')}
            className="flex items-center gap-0.5 text-[11px] text-[#1D4ED8] mt-1"
          >
            전체 보기 <ChevronRight size={12} />
          </button>
        </div>
        <div className="flex gap-1.5 flex-wrap mb-2.5">
          {[
            { icon: Link, label: '링크 0', color: '#94A3B8' },
            { icon: FileText, label: '메모 0', color: '#94A3B8' },
            { icon: Camera, label: '스크린샷 5', color: '#1D4ED8' },
            { icon: Image, label: '이미지 0', color: '#94A3B8' },
          ].map(({ icon: Icon, label, color }) => (
            <div
              key={label}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full"
              style={{ background: color === '#1D4ED8' ? '#FFFFFF' : '#F8FAFC' }}
            >
              <Icon size={9} style={{ color }} />
              <span className="text-[10px]" style={{ color }}>{label}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-[#94A3B8] leading-relaxed">
          수집된 데이터로 요약, 일정, 할 일 등을 추천받을 수 있어요
        </p>
      </div>

      {/* 추천 작업 */}
      {showRecommend && (
        <div>
          <div className="flex justify-between items-center mb-2 px-1">
            <div className="flex items-center gap-1.5">
              <Sparkles size={12} className="text-[#1E3A8A]" />
              <span className="text-[12px] text-[#1E293B]" style={{ fontWeight: 600 }}>추천 작업</span>
            </div>
            <button
              onClick={() => setShowRecommend(false)}
              className="flex items-center gap-0.5 text-[10px] text-[#94A3B8]"
            >
              <EyeOff size={10} /> 숨기기
            </button>
          </div>
          <div
            className="bg-white rounded-2xl p-3.5 border"
            style={{ borderColor: '#DBEAFE', boxShadow: '0 2px 8px rgba(29,78,216,0.06)' }}
          >
            <div className="flex gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: '#EFF6FF' }}
              >
                <Camera size={19} style={{ color: '#93C5FD' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[13px] text-[#1E293B]" style={{ fontWeight: 600 }}>
                    Screenshot collection
                  </span>
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded-full"
                    style={{ background: '#DBEAFE', color: '#1E3A8A' }}
                  >
                    AI 추천
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B] mb-2 leading-relaxed">
                  스크린샷 5개를 시각 노트나 문서로 정리할 수 있어요.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#94A3B8]">screenshots · 5개 · 60%</span>
                  <button
                    onClick={() => navigate('topicDetail', { topicId: '1' })}
                    className="text-[11px] px-3 py-1 text-white rounded-lg"
                    style={{ background: 'linear-gradient(135deg, #1D4ED8, #2563EB)' }}
                  >
                    검토
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );

  /* ─────────────────────────────────────────
     ENTRY SCREEN
  ───────────────────────────────────────── */
  if (view === 'entry') {
    return (
      <div className="flex flex-col" style={{ minHeight: showDetails ? 'auto' : '680px' }}>

        {/* Top section — becomes blue gradient when expanded */}
        <div
          style={{
            background: showDetails
              ? 'linear-gradient(160deg, #1E3A8A 0%, #2563EB 55%, #3B82F6 100%)'
              : '#FFFFFF',
            paddingLeft: '1.25rem',
            paddingRight: '1.25rem',
            paddingBottom: '1.5rem',
            paddingTop: showDetails ? '1.25rem' : '3rem',
            transition: 'background 0.4s ease, padding-top 0.4s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          {/* App identity — full (hidden when expanded) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              marginBottom: showDetails ? 0 : '2.5rem',
              opacity: showDetails ? 0 : 1,
              maxHeight: showDetails ? '0px' : '220px',
              overflow: 'hidden',
              transition: 'opacity 0.2s ease, max-height 0.4s cubic-bezier(0.4,0,0.2,1), margin-bottom 0.4s ease',
              pointerEvents: showDetails ? 'none' : 'auto',
            }}
          >
            <div className="mb-4">
              <Sparkles size={52} style={{ color: '#2563EB' }} />
            </div>
            <h1 style={{ fontWeight: 800, letterSpacing: '-0.6px', fontSize: '30px', color: '#1E293B' }}>
              SmartClipboardAI
            </h1>
            <p className="text-[12px] mt-1.5" style={{ color: '#94A3B8' }}>
              수집된 정보를 AI로 정리해 드립니다
            </p>
          </div>

          {/* App identity — compact row (visible when expanded) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.625rem',
              marginBottom: showDetails ? '1rem' : 0,
              opacity: showDetails ? 1 : 0,
              maxHeight: showDetails ? '60px' : '0px',
              overflow: 'hidden',
              transition: 'opacity 0.3s ease 0.15s, max-height 0.4s cubic-bezier(0.4,0,0.2,1), margin-bottom 0.4s ease',
              pointerEvents: showDetails ? 'auto' : 'none',
            }}
          >
            <div
              className="rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                width: '2rem', height: '2rem',
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
              }}
            >
              <Sparkles size={13} className="text-white" />
            </div>
            <h1 style={{ fontWeight: 800, fontSize: '18px', color: 'white', letterSpacing: '-0.3px' }}>
              SmartClipboardAI
            </h1>
          </div>

          {/* Card — background removed when showDetails (blends into bg) */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: showDetails ? 'rgba(255,255,255,0.1)' : 'linear-gradient(160deg, #1E3A8A 0%, #2563EB 55%, #3B82F6 100%)',
              border: showDetails ? '1px solid rgba(255,255,255,0.18)' : 'none',
              boxShadow: showDetails ? 'none' : '0 8px 32px rgba(29,78,216,0.28)',
              transition: 'background 0.4s ease, box-shadow 0.4s ease',
            }}
          >
            <p className="text-white text-[18px] mb-1.5" style={{ fontWeight: 700 }}>
              무엇을 정리할까요?
            </p>
            <p className="text-[11px] mb-4" style={{ color: 'rgba(165,180,252,0.75)' }}>
              원하는 주제나 내용을 입력하거나 AI에게 맡겨보세요
            </p>

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="예: 어제 회의 자료, 여행 링크, 일정 캡처"
              className="w-full rounded-xl px-4 py-3 text-[13px] outline-none mb-3"
              style={{
                background: 'rgba(255,255,255,0.13)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
              }}
            />

            {/* Primary buttons */}
            <div className="flex gap-2 mb-2.5">
              <button
                onClick={handleAction}
                className="flex-1 rounded-xl py-3 text-[13px] flex items-center justify-center gap-1.5"
                style={{
                  background: '#FFFFFF',
                  color: '#2563EB',
                  fontWeight: 700,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
                }}
              >
                <Brain size={14} />
                AI가 찾아주기
              </button>
              <button
                onClick={handleAction}
                className="flex-1 rounded-xl py-3 text-[13px] text-white"
                style={{
                  background: 'rgba(255,255,255,0.18)',
                  border: '1px solid rgba(255,255,255,0.28)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                직접 고르기
              </button>
            </div>

            {/* 3rd button */}
            <button
              onClick={() => setShowDetails((v) => !v)}
              className="w-full rounded-xl py-2.5 text-[12px] flex items-center justify-center gap-1.5 transition-all"
              style={{
                background: showDetails ? 'rgba(165,180,252,0.15)' : 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(199,210,254,0.85)',
              }}
            >
              {showDetails ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              {showDetails ? '수집 현황 닫기' : '수집 현황 보기'}
              {!showDetails && (
                <span
                  className="ml-1 text-[9px] px-1.5 py-0.5 rounded-full"
                  style={{ background: 'rgba(29,78,216,0.4)', color: 'rgba(186,230,253,0.9)' }}
                >
                  5개
                </span>
              )}
            </button>
          </div>

          {/* Bottom hint (only when collapsed) */}
          {!showDetails && (
            <div className="mt-6 flex items-center gap-3">
              <div className="h-px flex-1" style={{ background: '#E2E8F0' }} />
              <p className="text-[10px]" style={{ color: '#CBD5E1' }}>오늘 5개 항목 수집됨</p>
              <div className="h-px flex-1" style={{ background: '#E2E8F0' }} />
            </div>
          )}
        </div>

        {/* Expanded dashboard sections — white bg, right below top section */}
        {showDetails && (
          <div className="px-5 pt-3 pb-5 space-y-3" style={{ background: '#FFFFFF' }}>
            <div className="flex items-center gap-2 pb-1">
              <div className="h-px flex-1" style={{ background: '#E2E8F0' }} />
              <span className="text-[10px] text-[#94A3B8]">수집된 항목</span>
              <div className="h-px flex-1" style={{ background: '#E2E8F0' }} />
            </div>
            <DashboardSections />
          </div>
        )}
      </div>
    );
  }

  /* ─────────────────────────────────────────
     DASHBOARD SCREEN (after AI 찾아주기 / 직접 고르기)
  ───────────────────────────────────────── */
  return (
    <div className="pb-4">
      {/* Compact header */}
      <div
        className="px-5 pt-3 pb-5"
        style={{
          background: 'linear-gradient(160deg, #1E3A8A 0%, #2563EB 55%, #3B82F6 100%)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-[10px] flex items-center justify-center"
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <Sparkles size={14} className="text-white" />
            </div>
            <div>
              <h1
                className="text-[17px] text-white"
                style={{ fontWeight: 700, letterSpacing: '-0.3px' }}
              >
                SmartClipboardAI
              </h1>
              <p className="text-[10px]" style={{ color: 'rgba(165,180,252,0.7)' }}>
                수집된 정보를 AI로 정리해 드립니다
              </p>
            </div>
          </div>
          <button
            onClick={() => setView('entry')}
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            <Search size={14} className="text-white" />
          </button>
        </div>
      </div>

      {/* Sections */}
      <div className="px-4 pt-3 space-y-3">
        <DashboardSections />
      </div>
    </div>
  );
}
