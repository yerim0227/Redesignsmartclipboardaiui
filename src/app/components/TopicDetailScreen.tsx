import { ArrowLeft, Sparkles, Camera, FileText, Calendar, Bell, Share2, ChevronRight } from "lucide-react";

type AppScreen = 'home' | 'data' | 'tasks' | 'topicDetail' | 'actionReview';
type NavigateFn = (screen: AppScreen, data?: Record<string, string>) => void;

const screenshots = [
  { id: '1', label: '회의', color: '#1D4ED8' },
  { id: '2', label: '여행', color: '#1E3A8A' },
  { id: '3', label: '레시피', color: '#0891B2' },
  { id: '4', label: '행사', color: '#059669' },
  { id: '5', label: '테스트', color: '#1D4ED8' },
];

const keyPoints = [
  '회의 자료 1건 → 주간 업무 일정 추가 가능',
  '여행 정보 1건 → 제주도 일정 문서화',
  '레시피 1건 → 재료 목록 할 일로 변환',
  '행사 안내 1건 → 5월 30일 캘린더 등록',
];

const actionCards = [
  {
    id: 'note',
    type: '요약 노트',
    icon: FileText,
    color: '#1D4ED8',
    status: 'Draft' as const,
    description: '5개 스크린샷을 구조화된 노트로 요약',
  },
  {
    id: 'calendar',
    type: '캘린더 일정',
    icon: Calendar,
    color: '#2563EB',
    status: 'Draft' as const,
    description: '워크샵(5월 30일), 제주 여행 일정 추가',
  },
  {
    id: 'reminder',
    type: '리마인더',
    icon: Bell,
    color: '#1E3A8A',
    status: 'Draft' as const,
    description: '재료 구매 알림, 워크샵 준비 알림',
  },
  {
    id: 'share',
    type: '공유 초안',
    icon: Share2,
    color: '#94A3B8',
    status: 'Dismissed' as const,
    description: '정리된 내용을 공유용 문서로 작성',
  },
];

type StatusKey = 'Draft' | 'Edited' | 'Executed' | 'Dismissed';

const statusConfig: Record<StatusKey, { bg: string; color: string; label: string }> = {
  Draft: { bg: '#FFFFFF', color: '#1D4ED8', label: '초안' },
  Edited: { bg: '#FEF3C7', color: '#D97706', label: '편집됨' },
  Executed: { bg: '#D1FAE5', color: '#059669', label: '실행됨' },
  Dismissed: { bg: '#F1F5F9', color: '#94A3B8', label: '닫힘' },
};

export function TopicDetailScreen({
  navigate,
  data,
}: {
  navigate: NavigateFn;
  data: Record<string, string>;
}) {
  const isNew = data.topicId === 'new';

  return (
    <div>
      {/* Header */}
      <div className="bg-white px-4 pt-3 pb-3 border-b" style={{ borderColor: '#E8EDF8' }}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('tasks')}
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#F1F5F9' }}
          >
            <ArrowLeft size={16} className="text-[#64748B]" />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="text-[16px] text-[#1E293B] truncate" style={{ fontWeight: 700 }}>
              {isNew ? 'Screenshot collection' : 'Collected items (5)'}
            </h2>
            <p className="text-[10px] text-[#94A3B8]">5월 26일 11:34 업데이트 · 5개 항목</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">

        {/* Screenshot thumbnails row */}
        <div>
          <p className="text-[11px] text-[#94A3B8] mb-2">관련 데이터 ({screenshots.length}개)</p>
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {screenshots.map((ss) => (
              <div
                key={ss.id}
                className="flex-shrink-0 w-[72px] h-[72px] rounded-xl flex flex-col items-center justify-center gap-1"
                style={{ background: `linear-gradient(135deg, ${ss.color}22, ${ss.color}44)` }}
              >
                <Camera size={18} style={{ color: ss.color }} />
                <span className="text-[9px]" style={{ color: ss.color }}>{ss.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Summary card */}
        <div
          className="rounded-2xl p-4 text-white"
          style={{ background: 'linear-gradient(160deg, #0F1F3D 0%, #1A3660 60%, #1E3A8A 100%)' }}
        >
          <div className="flex items-center gap-2 mb-2.5">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(125,211,252,0.3)' }}
            >
              <Sparkles size={12} className="text-[#93C5FD]" />
            </div>
            <span className="text-[12px] text-[#93C5FD]" style={{ fontWeight: 600 }}>AI 분석 요약</span>
          </div>
          <p className="text-[12px] leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>
            수집된 5개의 스크린샷은 회의 자료, 여행 계획, 레시피, 행사 안내 등 다양한 주제를 포함합니다.
            각 항목을 카테고리별로 분류하여 구조화된 노트로 정리하거나 캘린더 일정으로 변환할 수 있어요.
          </p>

          <div className="space-y-1.5">
            <p className="text-[10px] text-[#93C5FD]" style={{ fontWeight: 600 }}>핵심 포인트</p>
            {keyPoints.map((point, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#93C5FD' }} />
                <p className="text-[11px] leading-snug" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Source references */}
        <div
          className="rounded-xl p-3 border"
          style={{ background: '#F8FAFC', borderColor: '#E2E8F0' }}
        >
          <p className="text-[10px] text-[#94A3B8] mb-1.5">데이터 소스 참조</p>
          <div className="flex flex-wrap gap-1">
            {['Screenshot_Meeting.jpg', 'Screenshot_Travel.jpg', 'Screenshot_Recipe.jpg', '+2개'].map((src) => (
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

        {/* Action cards */}
        <div>
          <p className="text-[12px] text-[#1E293B] mb-2.5" style={{ fontWeight: 600 }}>
            생성된 액션 초안
          </p>
          <div className="space-y-2.5">
            {actionCards.map((action) => {
              const Icon = action.icon;
              const st = statusConfig[action.status];
              const clickable = action.status === 'Draft' || action.status === 'Edited';
              const dimmed = !clickable;

              return (
                <button
                  key={action.id}
                  onClick={() => clickable && navigate('actionReview', { actionType: action.id })}
                  className="w-full bg-white rounded-xl p-3 border text-left flex items-center gap-3"
                  style={{
                    borderColor: '#E8EDF8',
                    boxShadow: clickable ? '0 1px 6px rgba(0,0,0,0.04)' : 'none',
                    opacity: dimmed ? 0.45 : 1,
                    cursor: clickable ? 'pointer' : 'default',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: dimmed ? '#F1F5F9' : `${action.color}18` }}
                  >
                    <Icon size={17} style={{ color: dimmed ? '#CBD5E1' : action.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span
                        className="text-[12px]"
                        style={{ fontWeight: 600, color: dimmed ? '#94A3B8' : '#1E293B' }}
                      >
                        {action.type}
                      </span>
                      <span
                        className="text-[9px] px-1.5 py-0.5 rounded-full"
                        style={{ background: st.bg, color: st.color }}
                      >
                        {st.label}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#94A3B8]">{action.description}</p>
                  </div>
                  {clickable && (
                    <ChevronRight size={14} className="text-[#CBD5E1] flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-2" />
      </div>
    </div>
  );
}
