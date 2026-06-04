import { useState } from "react";
import {
  Sparkles,
  Brain,
  Settings, HardDrive, Database, History,
} from "lucide-react";

type AppScreen = 'home' | 'data' | 'tasks' | 'topicDetail' | 'actionReview' | 'storage' | 'history' | 'aiSuggest';
type NavigateFn = (screen: AppScreen, data?: Record<string, string>) => void;

export function HomeScreen({ navigate }: { navigate: NavigateFn }) {
  const [query, setQuery] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleDirectPick = () => navigate('data');
  const handleAiSearch = () => navigate('aiSuggest', { query });

  const BG_GRADIENT = 'linear-gradient(160deg, #1E3A8A 0%, #2563EB 55%, #3B82F6 100%)';

  return (
    <div className="relative flex flex-col min-h-[680px]" style={{ background: '#FFFFFF' }}>
      {/* Settings button */}
      <div className="absolute right-5 top-3 z-30">
        <button
          onClick={() => setSettingsOpen((v) => !v)}
          className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm"
          style={{
            background: focused ? 'rgba(255,255,255,0.16)' : '#FFFFFF',
            border: focused ? '1px solid rgba(255,255,255,0.22)' : '1px solid #E6EAF2',
            color: focused ? '#FFFFFF' : '#1D4ED8',
            transition: 'all 0.32s ease',
          }}
          aria-label="설정 열기"
        >
          <Settings size={18} />
        </button>
        {settingsOpen && (
          <div className="absolute right-0 mt-2 w-[180px] rounded-2xl bg-white border border-[#E6EAF2] p-1.5 shadow-[0_18px_42px_rgba(15,23,42,0.18)]">
            <button
              onClick={() => { setSettingsOpen(false); navigate('history'); }}
              className="w-full flex items-center gap-2.5 rounded-xl px-3 py-3 text-left"
            >
              <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
                <History size={15} className="text-[#1688E8]" />
              </div>
              <span className="text-[13px] text-[#1E293B]" style={{ fontWeight: 700 }}>히스토리 보기</span>
            </button>
            <button
              onClick={() => { setSettingsOpen(false); navigate('storage'); }}
              className="w-full flex items-center gap-2.5 rounded-xl px-3 py-3 text-left"
            >
              <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
                <HardDrive size={15} className="text-[#1688E8]" />
              </div>
              <span className="text-[13px] text-[#1E293B]" style={{ fontWeight: 700 }}>저장공간 관리</span>
            </button>
            <button
              onClick={() => { setSettingsOpen(false); navigate('data'); }}
              className="w-full flex items-center gap-2.5 rounded-xl px-3 py-3 text-left"
            >
              <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
                <Database size={15} className="text-[#1688E8]" />
              </div>
              <span className="text-[13px] text-[#1E293B]" style={{ fontWeight: 700 }}>데이터 관리</span>
            </button>
          </div>
        )}
      </div>

      {/* Header area — transitions between expanded and compact */}
      <div
        className="px-5 pb-6"
        style={{
          paddingTop: focused ? '18px' : '48px',
          background: focused ? BG_GRADIENT : '#FFFFFF',
          transition: 'padding-top 0.32s ease, background 0.32s ease',
        }}
      >
        {/* Expanded: icon on top, big title, subtitle */}
        <div
          className="flex flex-col items-center text-center"
          style={{
            marginBottom: focused ? '0' : '40px',
            maxHeight: focused ? '0' : '160px',
            opacity: focused ? 0 : 1,
            overflow: 'hidden',
            transition: 'max-height 0.32s ease, opacity 0.22s ease, margin-bottom 0.32s ease',
            pointerEvents: focused ? 'none' : 'auto',
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

        {/* Compact: icon + title in one row */}
        <div
          className="flex items-center justify-center gap-2"
          style={{
            maxHeight: focused ? '48px' : '0',
            opacity: focused ? 1 : 0,
            overflow: 'hidden',
            marginBottom: focused ? '20px' : '0',
            transition: 'max-height 0.32s ease, opacity 0.28s ease, margin-bottom 0.32s ease',
            pointerEvents: focused ? 'auto' : 'none',
          }}
        >
          <Sparkles size={18} className="text-white flex-shrink-0" />
          <h1 style={{ fontWeight: 800, letterSpacing: '-0.3px', fontSize: '18px', color: '#FFFFFF' }}>
            SmartClipboardAI
          </h1>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: focused ? 'rgba(255,255,255,0.13)' : BG_GRADIENT,
            boxShadow: focused ? 'none' : '0 8px 32px rgba(29,78,216,0.28)',
            border: focused ? '1px solid rgba(255,255,255,0.22)' : 'none',
            transition: 'background 0.32s ease, box-shadow 0.32s ease, border 0.32s ease',
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
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="예: 어제 회의 자료, 여행 링크, 일정 캡처"
            className="w-full rounded-xl px-4 py-3 text-[13px] outline-none mb-3 placeholder:text-white/45"
            style={{
              background: 'rgba(255,255,255,0.13)',
              border: focused
                ? '1px solid rgba(255,255,255,0.55)'
                : '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              transition: 'border 0.2s ease',
            }}
          />

          <div className="flex gap-2">
            <button
              onMouseDown={(e) => { e.preventDefault(); handleAiSearch(); }}
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
              onMouseDown={(e) => { e.preventDefault(); handleDirectPick(); }}
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
        </div>
      </div>
    </div>
  );
}
