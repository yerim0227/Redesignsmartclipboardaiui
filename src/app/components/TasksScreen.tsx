import { Plus, ChevronRight, FolderOpen, Clock, Workflow } from "lucide-react";

type AppScreen = 'home' | 'data' | 'tasks' | 'topicDetail' | 'actionReview';
type NavigateFn = (screen: AppScreen, data?: Record<string, string>) => void;

const topics = [
  {
    id: '1',
    title: 'Collected items (5)',
    items: 5,
    lastUpdated: '5월 26일 11:34 업데이트',
    color: '#1D4ED8',
    tags: ['스크린샷', '회의', '여행'],
  },
];

const workflowSteps = [
  { label: '수집', active: true },
  { label: '클러스터' , active: true },
  { label: '주제', active: true },
  { label: 'AI 분석', active: false },
  { label: '초안', active: false },
  { label: '확인', active: false },
  { label: '실행', active: false },
];

export function TasksScreen({ navigate }: { navigate: NavigateFn }) {
  return (
    <div>
      {/* Header */}
      <div className="bg-white px-4 pt-3 pb-3 border-b text-center" style={{ borderColor: '#E8EDF8' }}>
        <h2 className="text-[17px] text-[#1E293B]" style={{ fontWeight: 700 }}>작업</h2>
        <p className="text-[10px] text-[#94A3B8] mt-0.5">주제별로 수집한 데이터를 정리하세요</p>
      </div>

      <div className="p-4 space-y-4">

        {/* 모은 주제 CTA card */}
        <div
          className="rounded-2xl p-4 text-white"
          style={{ background: 'linear-gradient(135deg, #1D4ED8 0%, #1E3A8A 100%)' }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <FolderOpen size={15} className="text-white/80" />
            <span className="text-[12px] text-white/80">모은 주제</span>
          </div>
          <p className="text-[11px] leading-relaxed mb-3" style={{ color: 'rgba(199,210,254,0.85)' }}>
            선택한 데이터를 주제별로 모아두고, 이후 요약/일정/알림 액션을 붙입니다.
          </p>
          <button
            onClick={() => navigate('data')}
            className="w-full py-2.5 rounded-xl text-[12px] flex items-center justify-center gap-1.5"
            style={{
              background: 'rgba(255,255,255,0.18)',
              border: '1px solid rgba(255,255,255,0.25)',
              color: 'white',
              fontWeight: 600,
            }}
          >
            <Plus size={13} />
            데이터 골라 주제 만들기
          </button>
        </div>

        {/* 주제 목록 */}
        <div>
          <div className="flex justify-between items-center mb-2 px-0.5">
            <span className="text-[12px] text-[#1E293B]" style={{ fontWeight: 600 }}>주제 목록</span>
            <span className="text-[10px] text-[#94A3B8]">{topics.length}개</span>
          </div>

          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => navigate('topicDetail', { topicId: topic.id })}
              className="w-full bg-white rounded-2xl p-3.5 border text-left flex items-center gap-3"
              style={{ borderColor: '#E8EDF8', boxShadow: '0 2px 8px rgba(2,132,199,0.07)' }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${topic.color}22, ${topic.color}44)` }}
              >
                <FolderOpen size={19} style={{ color: topic.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-[13px] text-[#1E293B]" style={{ fontWeight: 600 }}>
                    {topic.title}
                  </p>
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: '#DBEAFE', color: '#1E3A8A' }}
                  >
                    AI 제안
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Clock size={9} className="text-[#94A3B8]" />
                  <span className="text-[10px] text-[#94A3B8]">{topic.lastUpdated}</span>
                </div>
                <div className="flex gap-1 mt-1.5">
                  {topic.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] px-1.5 py-0.5 rounded-full"
                      style={{ background: '#FFFFFF', color: '#2563EB' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: '#FFFFFF' }}
                >
                  <span className="text-[11px] text-[#1D4ED8]" style={{ fontWeight: 700 }}>
                    {topic.items}
                  </span>
                </div>
                <ChevronRight size={14} className="text-[#CBD5E1]" />
              </div>
            </button>
          ))}
        </div>

        {/* Workflow indicator */}
        <div
          className="rounded-2xl p-3.5 border"
          style={{ background: '#FFFFFF', borderColor: '#BFDBFE' }}
        >
          <div className="flex items-center gap-1.5 mb-2">
            <Workflow size={12} className="text-[#2563EB]" />
            <p className="text-[11px] text-[#1D4ED8]" style={{ fontWeight: 600 }}>AI 워크플로우</p>
          </div>
          <div className="flex items-center gap-0.5 flex-wrap">
            {workflowSteps.map((step, i) => (
              <div key={i} className="flex items-center">
                <span
                  className="text-[9px] px-1.5 py-0.5 rounded-full"
                  style={step.active
                    ? { background: '#1D4ED8', color: 'white' }
                    : { background: 'white', color: '#94A3B8', border: '1px solid #E2E8F0' }
                  }
                >
                  {step.label}
                </span>
                {i < workflowSteps.length - 1 && (
                  <span className="text-[8px] text-[#CBD5E1] mx-0.5">›</span>
                )}
              </div>
            ))}
          </div>
          <p className="text-[9px] text-[#94A3B8] mt-1.5">
            현재 단계: 주제 생성 완료 · 다음: AI 분석 → 초안 생성
          </p>
        </div>

        <div className="h-2" />
      </div>
    </div>
  );
}
