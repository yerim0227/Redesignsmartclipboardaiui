import { useState } from "react";
import { HomeScreen } from "./components/HomeScreen";
import { DataScreen } from "./components/DataScreen";
import { TasksScreen } from "./components/TasksScreen";
import { TopicDetailScreen } from "./components/TopicDetailScreen";
import { ActionReviewScreen } from "./components/ActionReviewScreen";
import { StorageScreen } from "./components/StorageScreen";
import { HistoryScreen } from "./components/HistoryScreen";
import { AiSuggestScreen } from "./components/AiSuggestScreen";
import { AnalyzingScreen } from "./components/AnalyzingScreen";
import { Toaster } from "./components/ui/sonner";

export type AppScreen = 'home' | 'data' | 'tasks' | 'topicDetail' | 'actionReview' | 'storage' | 'history' | 'aiSuggest' | 'analyzing';
type PermissionStatus = 'unknown' | 'selecting' | 'granted' | 'partial' | 'denied';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('home');
  const [navData, setNavData] = useState<Record<string, string>>({});
  const [dataSelectMode, setDataSelectMode] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('granted');
  const [dataSheet, setDataSheet] = useState<{ show: boolean; selectedCount: number; topicName: string }>({
    show: false, selectedCount: 0, topicName: '',
  });

  const navigate = (s: AppScreen, data: Record<string, string> = {}) => {
    setScreen(s);
    setNavData(data);
  };

  return (
    <>
      <style>{`
        .phone-scroll::-webkit-scrollbar { display: none; }
        .phone-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spinOnce { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .screen-enter { animation: fadeIn 0.2s ease-out; }
        .scan-spin { animation: spinOnce 0.7s linear infinite; }
        button { transition: filter 0.08s ease; }
        button:active { filter: brightness(0.8) !important; }
      `}</style>

      {/* Outer page background */}
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: 'linear-gradient(150deg, #080E1E 0%, #0D1B38 40%, #0A1530 100%)' }}
      >
        {/* Decorative glow blobs */}
        <div
          className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(29,78,216,0.18) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-1/3 right-1/3 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(30,58,138,0.14) 0%, transparent 70%)' }}
        />

        {/* Phone device frame */}
        <div
          className="relative"
          style={{
            filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.6)) drop-shadow(0 0 40px rgba(29,78,216,0.2))',
          }}
        >
          {/* Side button (decorative) */}
          <div
            className="absolute -right-[5px] top-[120px] w-[4px] h-[40px] rounded-r-full"
            style={{ background: '#1E293B' }}
          />
          <div
            className="absolute -left-[5px] top-[100px] w-[4px] h-[30px] rounded-l-full"
            style={{ background: '#1E293B' }}
          />
          <div
            className="absolute -left-[5px] top-[140px] w-[4px] h-[30px] rounded-l-full"
            style={{ background: '#1E293B' }}
          />

          {/* Phone body */}
          <div
            className="relative w-[390px] h-[844px] flex flex-col overflow-hidden"
            style={{
              background: '#FFFFFF',
              borderRadius: '46px',
              border: '8px solid #0F172A',
              outline: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {/* Inner phone border highlight */}
            <div
              className="absolute inset-0 rounded-[40px] pointer-events-none z-10"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}
            />

            {/* Status bar */}
            <div
              className="flex justify-between items-center px-7 pt-3.5 pb-1.5 flex-shrink-0"
              style={{ background: (screen === 'home' || screen === 'aiSuggest' || screen === 'analyzing') ? 'transparent' : 'white' }}
            >
              <span className="text-[12px]" style={{
                fontWeight: 600,
                color: (screen === 'home' || screen === 'aiSuggest' || screen === 'analyzing') ? 'white' : '#1E293B',
              }}>9:41</span>
              <div className="flex items-center gap-2">
                {/* Signal */}
                <div className="flex items-end gap-[2px]">
                  {[4, 6, 8, 10].map((h, i) => (
                    <div
                      key={i}
                      className="w-[3px] rounded-sm"
                      style={{
                        height: `${h}px`,
                        background: (screen === 'home' || screen === 'aiSuggest' || screen === 'analyzing') ? 'rgba(255,255,255,0.8)' : '#1E293B',
                        opacity: i < 3 ? 0.5 + i * 0.15 : 1,
                      }}
                    />
                  ))}
                </div>
                {/* WiFi icon */}
                <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
                  <path d="M7.5 8.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" fill={(screen === 'home' || screen === 'aiSuggest' || screen === 'analyzing') ? 'rgba(255,255,255,0.9)' : '#1E293B'} />
                  <path d="M4.8 6.3a3.8 3.8 0 0 1 5.4 0" stroke={(screen === 'home' || screen === 'aiSuggest' || screen === 'analyzing') ? 'rgba(255,255,255,0.9)' : '#1E293B'} strokeWidth="1.2" strokeLinecap="round" fill="none" />
                  <path d="M2.3 3.8a7 7 0 0 1 10.4 0" stroke={(screen === 'home' || screen === 'aiSuggest' || screen === 'analyzing') ? 'rgba(255,255,255,0.6)' : '#94A3B8'} strokeWidth="1.2" strokeLinecap="round" fill="none" />
                </svg>
                {/* Battery */}
                <div className="flex items-center gap-0.5">
                  <div
                    className="w-[22px] h-[11px] rounded-[3px] border p-[1.5px] flex"
                    style={{ borderColor: (screen === 'home' || screen === 'aiSuggest' || screen === 'analyzing') ? 'rgba(255,255,255,0.7)' : '#64748B' }}
                  >
                    <div
                      className="h-full rounded-[1.5px]"
                      style={{
                        width: '75%',
                        background: (screen === 'home' || screen === 'aiSuggest' || screen === 'analyzing') ? 'rgba(255,255,255,0.8)' : '#10B981',
                      }}
                    />
                  </div>
                  <div
                    className="w-[2px] h-[6px] rounded-full"
                    style={{ background: (screen === 'home' || screen === 'aiSuggest' || screen === 'analyzing') ? 'rgba(255,255,255,0.6)' : '#64748B' }}
                  />
                </div>
              </div>
            </div>

            {/* Screen content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden phone-scroll screen-enter">
              {screen === 'home' && (
                <HomeScreen navigate={navigate} />
              )}
              {screen === 'data' && (
                <DataScreen
                  navigate={navigate}
                  data={navData}
                  permissionStatus={permissionStatus}
                  setPermissionStatus={setPermissionStatus}
                  onSelectModeChange={setDataSelectMode}
                  onOpenSheet={(count, name) => setDataSheet({ show: true, selectedCount: count, topicName: name })}
                />
              )}
              {screen === 'tasks' && (
                <TasksScreen navigate={navigate} />
              )}
              {screen === 'history' && (
                <HistoryScreen navigate={navigate} />
              )}
              {screen === 'aiSuggest' && (
                <AiSuggestScreen navigate={navigate} data={navData} />
              )}
              {screen === 'analyzing' && (
                <AnalyzingScreen navigate={navigate} data={navData} />
              )}
              {screen === 'topicDetail' && (
                <TopicDetailScreen navigate={navigate} data={navData} />
              )}
              {screen === 'actionReview' && (
                <ActionReviewScreen navigate={navigate} data={navData} />
              )}
              {screen === 'storage' && (
                <StorageScreen navigate={navigate} permissionStatus={permissionStatus} />
              )}
            </div>

            {/* Data bottom sheet — phone-body level overlay */}
            {dataSheet.show && (
              <>
                <div
                  className="absolute inset-0 z-40"
                  style={{ background: 'rgba(15,23,42,0.45)' }}
                  onClick={() => setDataSheet((s) => ({ ...s, show: false }))}
                />
                <div
                  className="absolute bottom-0 left-0 right-0 z-50 rounded-t-3xl px-5 pt-5 pb-8"
                  style={{ background: '#FFFFFF', boxShadow: '0 -8px 32px rgba(0,0,0,0.18)' }}
                >
                  <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: '#CBD5E1' }} />
                  <h3 className="text-[20px] text-[#1E293B] mb-1" style={{ fontWeight: 800 }}>
                    분석 시작
                  </h3>
                  <p className="text-[12px] text-[#64748B] mb-4 leading-relaxed">
                    {dataSheet.selectedCount}개 데이터를 AI Agent로 분석합니다.
                  </p>
                  <div className="rounded-xl border px-3 pt-1.5 pb-2.5 mb-4" style={{ borderColor: '#CBD5E1' }}>
                    <p className="text-[10px] text-[#94A3B8] mb-1">주제명</p>
                    <input
                      value={dataSheet.topicName}
                      onChange={(e) => setDataSheet((s) => ({ ...s, topicName: e.target.value }))}
                      className="w-full text-[15px] text-[#1E293B] outline-none"
                      style={{ fontWeight: 500 }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      const count = dataSheet.selectedCount;
                      const name = dataSheet.topicName;
                      setDataSheet((s) => ({ ...s, show: false }));
                      setDataSelectMode(false);
                      navigate('analyzing', { selectedCount: String(count), topicName: name });
                    }}
                    className="w-full py-3.5 rounded-2xl text-[14px] text-white mb-2.5"
                    style={{ background: 'linear-gradient(135deg, #1D4ED8, #2563EB)', fontWeight: 700, boxShadow: '0 4px 16px rgba(29,78,216,0.3)' }}
                  >
                    분석
                  </button>
                  <button
                    onClick={() => setDataSheet((s) => ({ ...s, show: false }))}
                    className="w-full py-3.5 rounded-2xl text-[14px] border"
                    style={{ color: '#64748B', borderColor: '#E2E8F0', fontWeight: 500, background: '#F8FAFC' }}
                  >
                    취소
                  </button>
                </div>
              </>
            )}

            <Toaster position="top-center" richColors />
          </div>
        </div>

      </div>
    </>
  );
}
