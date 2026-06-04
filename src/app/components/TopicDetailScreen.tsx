import { ArrowLeft, FileText, Calendar, Bell, Share2, ChevronRight } from "lucide-react";

type AppScreen = 'home' | 'data' | 'tasks' | 'topicDetail' | 'actionReview' | 'storage' | 'history' | 'aiSuggest';
type NavigateFn = (screen: AppScreen, data?: Record<string, string>) => void;

const topicTitles: Record<string, string> = {
  '1': 'Screenshot collection',
  '2': '제주 여행 계획',
  '3': '주간 회의 자료',
  '4': '레시피 모음',
  '5': '개발 참고 자료',
};

const actionCards = [
  {
    id: 'note',
    type: '삼성 노트',
    icon: FileText,
    color: '#1D4ED8',
    status: 'Draft' as const,
    description: '5개 스크린샷을 삼성 노트로 정리',
  },
  {
    id: 'calendar',
    type: '캘린더',
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
    type: '공유',
    icon: Share2,
    color: '#0891B2',
    status: 'Draft' as const,
    description: '정리된 내용을 공유용 메시지로 작성',
  },
];

type StatusKey = 'Draft' | 'Edited' | 'Executed' | 'Dismissed';

const statusConfig: Record<StatusKey, { bg: string; color: string; label: string }> = {
  Draft:     { bg: '#EFF6FF', color: '#1D4ED8', label: '초안' },
  Edited:    { bg: '#FEF3C7', color: '#D97706', label: '편집됨' },
  Executed:  { bg: '#D1FAE5', color: '#059669', label: '실행됨' },
  Dismissed: { bg: '#F1F5F9', color: '#94A3B8', label: '닫힘' },
};

function backScreen(from?: string): AppScreen {
  if (from === 'history') return 'history';
  if (from === 'aiSuggest') return 'aiSuggest';
  return 'home';
}

export function TopicDetailScreen({
  navigate,
  data,
}: {
  navigate: NavigateFn;
  data: Record<string, string>;
}) {
  const from = data.from;
  const topicId = data.topicId || '1';
  const title = data.topicTitle || topicTitles[topicId] || 'Screenshot collection';

  return (
    <div className="bg-[#F7F9FC] min-h-full">
      {/* Header */}
      <div className="bg-white px-4 pt-3 pb-3 border-b" style={{ borderColor: '#E8EDF8' }}>
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
          from === 'aiSuggest'
            ? navigate('aiSuggest', { skipLoading: 'true', query: data.query || '' })
            : navigate(backScreen(from))
        }
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#F1F5F9' }}
          >
            <ArrowLeft size={16} className="text-[#64748B]" />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="text-[16px] text-[#1E293B] truncate" style={{ fontWeight: 700 }}>
              {title}
            </h2>
            <p className="text-[10px] text-[#94A3B8]">AI가 생성한 액션 초안 {actionCards.length}개</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-2.5">
        <p className="text-[12px] text-[#64748B] px-0.5 mb-1">초안을 선택해 내용을 확인하고 실행하세요</p>

        {actionCards.map((action) => {
          const Icon = action.icon;
          const st = statusConfig[action.status];
          const clickable = action.status === 'Draft' || action.status === 'Edited';
          const dimmed = !clickable;

          return (
            <button
              key={action.id}
              onClick={() =>
                clickable &&
                navigate('actionReview', {
                  actionType: action.id,
                  topicId,
                  topicTitle: title,
                  from: from || '',
                  query: data.query || '',
                })
              }
              className="w-full bg-white rounded-xl p-3.5 border text-left flex items-center gap-3"
              style={{
                borderColor: '#E8EDF8',
                boxShadow: clickable ? '0 1px 8px rgba(0,0,0,0.05)' : 'none',
                opacity: dimmed ? 0.45 : 1,
                cursor: clickable ? 'pointer' : 'default',
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: dimmed ? '#F1F5F9' : `${action.color}18` }}
              >
                <Icon size={18} style={{ color: dimmed ? '#CBD5E1' : action.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span
                    className="text-[13px]"
                    style={{ fontWeight: 600, color: dimmed ? '#94A3B8' : '#1E293B' }}
                  >
                    {action.type}
                  </span>
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded-full"
                    style={{ background: st.bg, color: st.color, fontWeight: 600 }}
                  >
                    {st.label}
                  </span>
                </div>
                <p className="text-[11px] text-[#94A3B8]">{action.description}</p>
              </div>
              {clickable && (
                <ChevronRight size={15} className="text-[#CBD5E1] flex-shrink-0" />
              )}
            </button>
          );
        })}

        <div className="h-2" />
      </div>
    </div>
  );
}
