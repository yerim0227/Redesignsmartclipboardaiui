import { useState } from "react";
import { ArrowLeft, ChevronRight, FileText, Calendar, Bell, Share2, Sparkles, Camera } from "lucide-react";

type AppScreen = 'home' | 'data' | 'tasks' | 'topicDetail' | 'actionReview' | 'storage' | 'history';
type NavigateFn = (screen: AppScreen, data?: Record<string, string>) => void;

type DraftItem = {
  id: string;
  type: string;
  icon: typeof FileText;
  color: string;
  description: string;
  status: 'Draft' | 'Edited' | 'Executed' | 'Dismissed';
};

type HistoryTopic = {
  id: string;
  title: string;
  date: string;
  dataCount: number;
  summary: string;
  drafts: DraftItem[];
};

const historyTopics: HistoryTopic[] = [
  {
    id: '1',
    title: 'Screenshot collection',
    date: '5월 26일 11:34',
    dataCount: 5,
    summary: '회의 자료, 여행 계획, 레시피, 행사 안내 포함',
    drafts: [
      { id: 'note', type: '삼성 노트', icon: FileText, color: '#1D4ED8', description: '5개 스크린샷을 삼성 노트로 정리', status: 'Executed' },
      { id: 'calendar', type: '캘린더', icon: Calendar, color: '#2563EB', description: '워크샵(5월 30일), 제주 여행 일정 추가', status: 'Executed' },
      { id: 'reminder', type: '리마인더', icon: Bell, color: '#1E3A8A', description: '재료 구매 알림, 워크샵 준비 알림', status: 'Dismissed' },
      { id: 'share', type: '공유', icon: Share2, color: '#0891B2', description: '정리된 내용을 공유용 메시지로 작성', status: 'Draft' },
    ],
  },
  {
    id: '2',
    title: '제주 여행 계획',
    date: '5월 22일 09:18',
    dataCount: 3,
    summary: '여행 일정, 숙소 정보, 맛집 리스트 포함',
    drafts: [
      { id: 'note', type: '삼성 노트', icon: FileText, color: '#1D4ED8', description: '제주 여행 일정 요약 문서 작성', status: 'Executed' },
      { id: 'calendar', type: '캘린더', icon: Calendar, color: '#2563EB', description: '6월 3일~5일 제주 여행 일정 등록', status: 'Executed' },
      { id: 'share', type: '공유', icon: Share2, color: '#0891B2', description: '여행 일정을 카카오톡 메시지로 작성', status: 'Edited' },
    ],
  },
  {
    id: '3',
    title: '주간 회의 자료',
    date: '5월 19일 14:55',
    dataCount: 4,
    summary: '팀 미팅 내용, 액션 아이템, 다음 주 일정 포함',
    drafts: [
      { id: 'note', type: '삼성 노트', icon: FileText, color: '#1D4ED8', description: '회의 내용 회의록으로 정리', status: 'Executed' },
      { id: 'reminder', type: '리마인더', icon: Bell, color: '#1E3A8A', description: '액션 아이템 마감일 알림 설정', status: 'Executed' },
    ],
  },
  {
    id: '4',
    title: '레시피 모음',
    date: '5월 14일 18:02',
    dataCount: 6,
    summary: '파스타, 샐러드, 디저트 레시피 스크린샷',
    drafts: [
      { id: 'note', type: '삼성 노트', icon: FileText, color: '#1D4ED8', description: '레시피별 재료와 순서 정리', status: 'Executed' },
      { id: 'calendar', type: '캘린더', icon: Calendar, color: '#2563EB', description: '재료 구매 일정 등록', status: 'Dismissed' },
    ],
  },
];

const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
  Draft:     { bg: '#EFF6FF', color: '#1D4ED8', label: '초안' },
  Edited:    { bg: '#FEF3C7', color: '#D97706', label: '편집됨' },
  Executed:  { bg: '#D1FAE5', color: '#059669', label: '실행됨' },
  Dismissed: { bg: '#F1F5F9', color: '#94A3B8', label: '닫힘' },
};

export function HistoryScreen({ navigate }: { navigate: NavigateFn }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-[#F7F9FC] min-h-full">
      {/* Header */}
      <div className="bg-white px-4 pt-3 pb-3 border-b" style={{ borderColor: '#E8EDF8' }}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('home')}
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#F1F5F9' }}
          >
            <ArrowLeft size={16} className="text-[#64748B]" />
          </button>
          <div>
            <h2 className="text-[16px] text-[#1E293B]" style={{ fontWeight: 700 }}>히스토리</h2>
            <p className="text-[10px] text-[#94A3B8]">이전 정리 작업 {historyTopics.length}건</p>
          </div>
        </div>
      </div>

      {/* Topic list */}
      <div className="p-4 space-y-3">
        {historyTopics.map((topic) => {
          const isOpen = expandedId === topic.id;
          const executedCount = topic.drafts.filter((d) => d.status === 'Executed').length;

          return (
            <div
              key={topic.id}
              className="bg-white rounded-2xl border overflow-hidden"
              style={{ borderColor: '#E8EDF8', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}
            >
              {/* Topic row */}
              <button
                className="w-full px-4 py-3.5 flex items-center gap-3 text-left"
                onClick={() => toggleExpand(topic.id)}
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: '#EFF6FF' }}
                >
                  <Camera size={17} className="text-[#2563EB]" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[13px] text-[#1E293B] truncate" style={{ fontWeight: 700 }}>
                      {topic.title}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#94A3B8]">
                    {topic.date} · 데이터 {topic.dataCount}개 · 초안 {topic.drafts.length}개
                  </p>
                </div>

                {/* Executed badge */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {executedCount > 0 && (
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded-full"
                      style={{ background: '#D1FAE5', color: '#059669', fontWeight: 600 }}
                    >
                      {executedCount}개 실행됨
                    </span>
                  )}
                  <ChevronRight
                    size={14}
                    className="text-[#CBD5E1]"
                    style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.18s ease' }}
                  />
                </div>
              </button>

              {/* Expanded: summary + drafts */}
              {isOpen && (
                <div className="border-t" style={{ borderColor: '#F1F5F9' }}>
                  {/* AI summary strip */}
                  <div
                    className="mx-4 my-3 rounded-xl px-3 py-2.5 flex items-start gap-2"
                    style={{ background: '#F0F5FF' }}
                  >
                    <Sparkles size={12} className="text-[#2563EB] mt-0.5 flex-shrink-0" />
                    <p className="text-[11px] text-[#1E3A8A] leading-relaxed">{topic.summary}</p>
                  </div>

                  {/* Draft list */}
                  <div className="px-4 pb-3 space-y-2">
                    {topic.drafts.map((draft) => {
                      const Icon = draft.icon;
                      const st = statusConfig[draft.status];
                      const clickable = draft.status === 'Draft' || draft.status === 'Edited';

                      return (
                        <button
                          key={draft.id}
                          onClick={() => clickable && navigate('actionReview', { actionType: draft.id })}
                          className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 border text-left"
                          style={{
                            borderColor: '#E8EDF8',
                            background: '#FAFBFF',
                            cursor: clickable ? 'pointer' : 'default',
                            opacity: draft.status === 'Dismissed' ? 0.5 : 1,
                          }}
                        >
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: `${draft.color}18` }}
                          >
                            <Icon size={14} style={{ color: draft.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="text-[12px] text-[#1E293B]" style={{ fontWeight: 600 }}>
                                {draft.type}
                              </span>
                              <span
                                className="text-[9px] px-1.5 py-0.5 rounded-full"
                                style={{ background: st.bg, color: st.color, fontWeight: 600 }}
                              >
                                {st.label}
                              </span>
                            </div>
                            <p className="text-[10px] text-[#94A3B8] truncate">{draft.description}</p>
                          </div>
                          {clickable && (
                            <ChevronRight size={12} className="text-[#CBD5E1] flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Full detail button */}
                  <div className="px-4 pb-4">
                    <button
                      onClick={() => navigate('topicDetail', { topicId: topic.id, from: 'history' })}
                      className="w-full py-2.5 rounded-xl text-[12px] border"
                      style={{ color: '#2563EB', borderColor: '#BFDBFE', background: '#EFF6FF', fontWeight: 600 }}
                    >
                      전체 내용 보기
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="h-6" />
    </div>
  );
}
