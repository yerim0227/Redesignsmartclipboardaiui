import { useState, useEffect } from "react";
import { Camera, Trash2, AlertCircle, RefreshCw, X, ChevronRight, RotateCcw, ImageIcon, ShieldCheck, Check, ShieldOff } from "lucide-react";

type AppScreen = 'home' | 'data' | 'tasks' | 'topicDetail' | 'actionReview';
type NavigateFn = (screen: AppScreen, data?: Record<string, string>) => void;

const initialItems = [
  {
    id: '1',
    name: 'Screenshot_20260526_091234_Meeting.jpg',
    type: '스크린샷',
    mime: 'image/jpeg',
    date: '5월 26일 09:12',
    color: '#1D4ED8',
    label: '회의 자료',
    textPreview: '주간 업무 보고 — Q2 목표 달성률 78%, 팀별 현황 요약',
  },
  {
    id: '2',
    name: 'Screenshot_20260524_133021_Travel.jpg',
    type: '스크린샷',
    mime: 'image/jpeg',
    date: '5월 24일 13:30',
    color: '#1E3A8A',
    label: '여행 계획',
    textPreview: '제주도 3박 4일 · 숙소: 애월 게스트하우스 · 렌터카 예약 완료',
  },
  {
    id: '3',
    name: 'Screenshot_20260523_080045_Recipe.jpg',
    type: '스크린샷',
    mime: 'image/jpeg',
    date: '5월 23일 08:00',
    color: '#0891B2',
    label: '레시피',
    textPreview: '된장찌개 재료: 된장 2큰술, 두부 1/2모, 호박 1/2개, 양파 1/2개',
  },
  {
    id: '4',
    name: 'Screenshot_20260522_195532_Event.jpg',
    type: '스크린샷',
    mime: 'image/jpeg',
    date: '5월 22일 19:55',
    color: '#059669',
    label: '행사 안내',
    textPreview: '사내 워크샵 안내 · 5월 30일(금) 오후 2시 · 장소: 본사 B동 3F',
  },
  {
    id: '5',
    name: 'Screenshot_20260520_164512_Test.jpg',
    type: '스크린샷',
    mime: 'image/jpeg',
    date: '5월 20일 16:45',
    color: '#1D4ED8',
    label: '테스트',
    textPreview: 'UI 컴포넌트 레이아웃 테스트 · 버튼 정렬 및 여백 확인',
  },
];

type FilterType = '전체' | '메모' | '링크' | '이미지' | '파일' | '스크린샷';
const filterTabs: FilterType[] = ['전체', '메모', '링크', '이미지', '파일', '스크린샷'];

type PermissionStatus = 'unknown' | 'selecting' | 'granted' | 'partial' | 'denied';

export function DataScreen({ navigate, onSelectModeChange, onOpenSheet }: {
  navigate: NavigateFn;
  onSelectModeChange: (v: boolean) => void;
  onOpenSheet: (selectedCount: number, topicName: string) => void;
}) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('전체');
  const [items, setItems] = useState(initialItems);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<typeof initialItems[0] | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('unknown');
  const [pickerSelected, setPickerSelected] = useState<Set<string>>(new Set(initialItems.map(i => i.id)));
  const [allowedIds, setAllowedIds] = useState<Set<string>>(new Set());

  // Items visible based on permission
  const visibleItems = (() => {
    if (permissionStatus === 'unknown') return [];
    if (permissionStatus === 'denied') return [];
    if (permissionStatus === 'partial') return items.filter(i => allowedIds.has(i.id));
    return items;
  })();

  const filtered = activeFilter === '전체'
    ? visibleItems
    : visibleItems.filter((i) => i.type === activeFilter);

  const enterSelectMode = () => {
    setSelectMode(true);
    setSelected(new Set());
    onSelectModeChange(true);
  };

  const exitSelectMode = () => {
    setSelectMode(false);
    setSelected(new Set());
    onSelectModeChange(false);
  };

  useEffect(() => {
    if (selectMode) {
      window.history.pushState({ selectMode: true }, '');
      const handlePop = () => exitSelectMode();
      window.addEventListener('popstate', handlePop);
      return () => window.removeEventListener('popstate', handlePop);
    }
  }, [selectMode]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAllVisible = () => setSelected(new Set(filtered.map((i) => i.id)));
  const clearSelection = () => setSelected(new Set());

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setDeleteTargetId(null);
  };

  const deleteAll = () => {
    setItems([]);
    setShowDeleteConfirm(false);
  };

  const openBottomSheet = () => {
    onOpenSheet(selected.size, `Collected items (${selected.size})`);
  };

  const confirmPartialSelection = () => {
    setAllowedIds(new Set(pickerSelected));
    setPermissionStatus('partial');
  };

  // ── 사진 선택 화면 (일부 허용) — full screen ──────────────
  if (permissionStatus === 'selecting') {
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="px-4 pt-3 pb-3 border-b flex items-center gap-3" style={{ borderColor: '#E8EDF8' }}>
          <button
            onClick={() => setPermissionStatus('unknown')}
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#F1F5F9' }}
          >
            <X size={15} className="text-[#64748B]" />
          </button>
          <div className="flex-1">
            <h2 className="text-[16px] text-[#1E293B]" style={{ fontWeight: 700 }}>사진 선택</h2>
            <p className="text-[10px] text-[#94A3B8]">허용할 사진을 선택하세요</p>
          </div>
          <button
            onClick={confirmPartialSelection}
            className="px-3.5 py-1.5 rounded-xl text-[12px] text-white"
            style={{
              background: pickerSelected.size > 0 ? 'linear-gradient(135deg, #1D4ED8, #2563EB)' : '#CBD5E1',
              fontWeight: 700,
            }}
          >
            완료 {pickerSelected.size > 0 && `(${pickerSelected.size}개)`}
          </button>
        </div>

        <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: '#F1F5F9', background: '#FAFBFF' }}>
          <span className="text-[11px] text-[#64748B]">{pickerSelected.size}/{initialItems.length}개 선택됨</span>
          <div className="flex gap-3">
            <button onClick={() => setPickerSelected(new Set(initialItems.map(i => i.id)))} className="text-[11px] text-[#2563EB]" style={{ fontWeight: 500 }}>모두 선택</button>
            <button onClick={() => setPickerSelected(new Set())} className="text-[11px] text-[#94A3B8]">선택 해제</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4" style={{ scrollbarWidth: 'none' }}>
          <div className="grid grid-cols-2 gap-3">
            {initialItems.map((item) => {
              const isSelected = pickerSelected.has(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => setPickerSelected((prev) => {
                    const next = new Set(prev);
                    next.has(item.id) ? next.delete(item.id) : next.add(item.id);
                    return next;
                  })}
                  className="relative rounded-2xl overflow-hidden text-left"
                  style={{
                    outline: isSelected ? '2.5px solid #1D4ED8' : '2.5px solid transparent',
                    boxShadow: isSelected ? '0 0 0 1px #BFDBFE' : '0 2px 8px rgba(0,0,0,0.08)',
                  }}
                >
                  <div className="w-full h-[100px] flex items-center justify-center relative" style={{ background: `linear-gradient(135deg, ${item.color}20, ${item.color}45)` }}>
                    <div className="absolute inset-0 p-3 flex flex-col justify-between opacity-25">
                      <div className="h-2 rounded w-3/4" style={{ background: item.color }} />
                      <div className="space-y-1.5">
                        <div className="h-1.5 rounded w-full" style={{ background: item.color }} />
                        <div className="h-1.5 rounded w-4/5" style={{ background: item.color }} />
                      </div>
                    </div>
                    <Camera size={22} style={{ color: `${item.color}60` }} />
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center" style={isSelected ? { background: '#1D4ED8', borderColor: '#1D4ED8' } : { background: 'rgba(255,255,255,0.85)', borderColor: '#CBD5E1' }}>
                      {isSelected && <Check size={13} className="text-white" strokeWidth={2.5} />}
                    </div>
                  </div>
                  <div className="px-2.5 py-2 bg-white">
                    <p className="text-[11px] text-[#1E293B] truncate" style={{ fontWeight: 600 }}>{item.label}</p>
                    <p className="text-[9px] text-[#94A3B8] mt-0.5">{item.date}</p>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="h-4" />
        </div>
      </div>
    );
  }

  // ── 메인 데이터 화면 ──────────────────────────────────────
  return (
    <div className="relative flex flex-col" style={{ height: '100%' }}>

      {/* ── Header ─────────────────────────────── */}
      <div className="px-4 pt-3 pb-3 border-b" style={{ borderColor: '#E8EDF8', background: selectMode ? '#EFF6FF' : 'white' }}>
        <div className="flex items-center mb-1 gap-2">
          <div className="flex-shrink-0">
            {!selectMode && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-[11px] px-3 py-1.5 rounded-xl border whitespace-nowrap"
                style={{ background: '#FEF2F2', color: '#DC2626', borderColor: '#FCA5A5' }}
              >
                전체 삭제
              </button>
            )}
            {selectMode && selected.size > 0 && (
              <button
                onClick={() => { setItems((prev) => prev.filter((i) => !selected.has(i.id))); exitSelectMode(); }}
                className="text-[11px] px-3 py-1.5 rounded-xl border whitespace-nowrap"
                style={{ background: '#FEF2F2', color: '#DC2626', borderColor: '#FCA5A5' }}
              >
                삭제
              </button>
            )}
            {selectMode && selected.size === 0 && <div className="w-16" />}
          </div>

          <h2 className="flex-1 text-center text-[17px] text-[#1E293B]" style={{ fontWeight: 700 }}>
            {selectMode ? (selected.size > 0 ? `${selected.size}개 선택됨` : '항목 선택') : '수집 데이터'}
          </h2>

          <div className="flex-shrink-0">
            <button
              onClick={() => selectMode ? exitSelectMode() : enterSelectMode()}
              className="text-[11px] px-3 py-1.5 rounded-xl border whitespace-nowrap"
              style={selectMode
                ? { background: '#1D4ED8', color: 'white', borderColor: '#1D4ED8' }
                : { background: 'white', color: '#64748B', borderColor: '#E2E8F0' }}
            >
              {selectMode ? '취소' : '선택'}
            </button>
          </div>
        </div>

        <p className="text-[10px] text-[#94A3B8] text-center">
          {selectMode
            ? `${visibleItems.length}개 중 선택 · 탭하여 선택하세요`
            : `${visibleItems.length}개 전체 · 텍스트 0 · 링크 0 · 이미지 0 · 스크린샷 ${visibleItems.length}`}
        </p>
      </div>

      {/* ── confirm banners ──────────────────── */}
      {showDeleteConfirm && (
        <div className="mx-4 mt-3 rounded-xl p-3 flex items-center gap-2" style={{ background: '#FEF2F2', border: '1px solid #FCA5A5' }}>
          <AlertCircle size={14} className="text-[#DC2626] flex-shrink-0" />
          <p className="text-[11px] text-[#DC2626] flex-1">수집된 데이터 {visibleItems.length}개를 모두 삭제할까요?</p>
          <button onClick={deleteAll} className="text-[10px] px-2 py-0.5 bg-[#DC2626] text-white rounded-lg">삭제</button>
          <button onClick={() => setShowDeleteConfirm(false)} className="text-[10px] px-2 py-0.5 bg-white text-[#64748B] rounded-lg border" style={{ borderColor: '#E2E8F0' }}>취소</button>
        </div>
      )}
      {deleteTargetId && (
        <div className="mx-4 mt-3 rounded-xl p-3 flex items-center gap-2" style={{ background: '#FEF2F2', border: '1px solid #FCA5A5' }}>
          <AlertCircle size={14} className="text-[#DC2626] flex-shrink-0" />
          <p className="text-[11px] text-[#DC2626] flex-1 leading-snug">이 항목을 삭제할까요?</p>
          <button onClick={() => deleteItem(deleteTargetId)} className="text-[10px] px-2 py-0.5 bg-[#DC2626] text-white rounded-lg">삭제</button>
          <button onClick={() => setDeleteTargetId(null)} className="text-[10px] px-2 py-0.5 bg-white text-[#64748B] rounded-lg border" style={{ borderColor: '#E2E8F0' }}>취소</button>
        </div>
      )}

      {/* ── 스크린샷 카드 (권한 요청 / 스캔 / 거부됨) ── */}
      {!selectMode && (
        <div className="px-4 pt-3">
          {/* 권한 미결정 → 인라인 권한 요청 카드 */}
          {permissionStatus === 'unknown' && (
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#BFDBFE', background: '#FFFFFF' }}>
              <div className="px-4 pt-4 pb-3">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#EFF6FF' }}>
                    <ImageIcon size={18} className="text-[#2563EB]" />
                  </div>
                  <div>
                    <p className="text-[13px] text-[#1E293B]" style={{ fontWeight: 700 }}>사진 접근 허용</p>
                    <p className="text-[11px] text-[#64748B] mt-0.5 leading-relaxed">
                      스크린샷을 가져오려면 사진 접근 권한이 필요해요. 데이터는 기기 내에서만 처리됩니다.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPermissionStatus('granted')}
                      className="flex-1 py-2.5 rounded-xl text-[12px] text-white"
                      style={{ background: 'linear-gradient(135deg, #1D4ED8, #2563EB)', fontWeight: 700 }}
                    >
                      모두 허용
                    </button>
                    <button
                      onClick={() => setPermissionStatus('selecting')}
                      className="flex-1 py-2.5 rounded-xl text-[12px] border"
                      style={{ color: '#1D4ED8', borderColor: '#BFDBFE', background: '#EFF6FF', fontWeight: 600 }}
                    >
                      일부 허용
                    </button>
                  </div>
                  <button
                    onClick={() => setPermissionStatus('denied')}
                    className="w-full py-2 text-[11px]"
                    style={{ color: '#94A3B8' }}
                  >
                    거부
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 권한 허용됨 → 일반 스캔 카드 */}
          {(permissionStatus === 'granted' || permissionStatus === 'partial') && (
            <div className="rounded-2xl p-3.5 border" style={{ background: '#FFFFFF', borderColor: '#BFDBFE' }}>
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(37,99,235,0.12)' }}>
                    <Camera size={12} className="text-[#2563EB]" />
                  </div>
                  <span className="text-[12px] text-[#1D4ED8]" style={{ fontWeight: 600 }}>스크린샷 가져오기</span>
                  {permissionStatus === 'partial' && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: '#FEF3C7', color: '#D97706' }}>일부 허용</span>
                  )}
                </div>
              </div>
              <p className="text-[11px] text-[#64748B] mb-2.5 leading-relaxed">
                {permissionStatus === 'partial'
                  ? <><span style={{ fontWeight: 600 }}>{allowedIds.size}개</span>의 사진에 접근 허용됨</>
                  : <>최근 스크린샷을 다시 스캔할 수 있어요.{' '}<span className="text-[#2563EB]">새 스크린샷 없음</span> — 이전 항목은 모두 가져왔어요</>
                }
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPermissionStatus('unknown')}
                  className="flex-1 text-[11px] py-2 text-white rounded-xl flex items-center justify-center gap-1.5"
                  style={{ background: 'linear-gradient(135deg, #2563EB, #60A5FA)' }}
                >
                  <RefreshCw size={11} />
                  다시 스캔
                </button>
                <button
                  onClick={() => setPermissionStatus('selecting')}
                  className="flex-1 text-[11px] py-2 text-[#2563EB] rounded-xl border"
                  style={{ borderColor: '#BFDBFE', background: '#EFF6FF' }}
                >
                  권한 변경
                </button>
              </div>
            </div>
          )}

          {/* 거부됨 → 작은 알림 배너 */}
          {permissionStatus === 'denied' && (
            <div className="rounded-2xl p-3.5 border flex items-start gap-3" style={{ background: '#FAFAFA', borderColor: '#E2E8F0' }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#F1F5F9' }}>
                <ShieldOff size={14} className="text-[#94A3B8]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-[#64748B]" style={{ fontWeight: 600 }}>사진 접근 거부됨</p>
                <p className="text-[10px] text-[#94A3B8] mt-0.5">스크린샷을 가져올 수 없어요.</p>
              </div>
              <button
                onClick={() => setPermissionStatus('unknown')}
                className="flex-shrink-0 text-[10px] px-2.5 py-1.5 rounded-xl border"
                style={{ color: '#1D4ED8', borderColor: '#BFDBFE', background: '#EFF6FF', fontWeight: 600 }}
              >
                권한 요청
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── 선택 모드 bar ──────────────────────── */}
      {selectMode && (
        <div className="mx-4 mt-3 rounded-xl px-3 py-2.5 flex items-center justify-between" style={{ background: '#DBEAFE', border: '1px solid #BFDBFE' }}>
          <span className="text-[12px] text-[#1D4ED8]" style={{ fontWeight: 600 }}>선택한 데이터 {selected.size}개</span>
          <div className="flex items-center gap-3">
            <button onClick={selectAllVisible} className="text-[11px] text-[#2563EB]" style={{ fontWeight: 500 }}>모두 선택</button>
            <button onClick={clearSelection} className="flex items-center gap-0.5 text-[11px] text-[#64748B]">
              <RotateCcw size={10} />
              초기화
            </button>
          </div>
        </div>
      )}

      {/* ── Filter chips ─────────────────────── */}
      <div className="bg-white px-4 border-b mt-2.5" style={{ borderColor: '#F1F5F9', paddingTop: '10px', paddingBottom: '10px' }}>
        <div className="flex gap-1.5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
          {filterTabs.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="flex-shrink-0 text-[10px] px-3 py-1 rounded-full transition-colors"
              style={activeFilter === f ? { background: '#1D4ED8', color: 'white' } : { background: '#F1F5F9', color: '#64748B' }}
            >
              {f}
              {f === '스크린샷' && <span className="ml-1 opacity-70">{visibleItems.length}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* ── Items list ───────────────────────── */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        <div className="p-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              {permissionStatus === 'unknown' ? (
                <>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: '#EFF6FF' }}>
                    <ShieldCheck size={24} className="text-[#93C5FD]" />
                  </div>
                  <p className="text-[13px] text-[#94A3B8]">권한을 허용하면</p>
                  <p className="text-[11px] text-[#CBD5E1] mt-1">스크린샷 목록이 여기에 표시됩니다</p>
                </>
              ) : permissionStatus === 'denied' ? (
                <>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: '#F1F5F9' }}>
                    <Camera size={24} className="text-[#CBD5E1]" />
                  </div>
                  <p className="text-[13px] text-[#94A3B8]">사진 접근이 거부되었어요</p>
                  <p className="text-[11px] text-[#CBD5E1] mt-1">다른 유형의 데이터는 정상적으로 추가할 수 있어요</p>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: '#F1F5F9' }}>
                    <Camera size={24} className="text-[#CBD5E1]" />
                  </div>
                  <p className="text-[13px] text-[#94A3B8]">수집된 데이터가 없어요</p>
                  <p className="text-[11px] text-[#CBD5E1] mt-1">새로운 항목을 추가해 보세요</p>
                </>
              )}
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden border"
                style={{
                  borderColor: selected.has(item.id) ? '#1D4ED8' : '#E8EDF8',
                  boxShadow: selected.has(item.id) ? '0 0 0 2px #BFDBFE, 0 2px 8px rgba(0,0,0,0.05)' : '0 2px 8px rgba(0,0,0,0.05)',
                }}
                onClick={() => selectMode && toggleSelect(item.id)}
              >
                {/* Thumbnail strip */}
                <div className="w-full h-[88px] relative flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${item.color}18, ${item.color}38)` }}>
                  <div className="absolute inset-0 p-3 flex flex-col justify-between opacity-30">
                    <div className="flex gap-2 items-center">
                      <div className="h-2 rounded w-16" style={{ background: item.color }} />
                      <div className="h-2 rounded w-10" style={{ background: item.color }} />
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-1.5 rounded w-full" style={{ background: item.color }} />
                      <div className="h-1.5 rounded w-3/4" style={{ background: item.color }} />
                      <div className="h-1.5 rounded w-5/6" style={{ background: item.color }} />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-5 rounded-md w-16" style={{ background: item.color }} />
                      <div className="h-5 rounded-md w-12" style={{ background: item.color }} />
                    </div>
                  </div>

                  {/* Camera button — subtle, no background */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setPreviewItem(item); }}
                    className="w-9 h-9 flex items-center justify-center z-10"
                  >
                    <Camera size={18} style={{ color: 'rgba(255,255,255,0.4)' }} />
                  </button>

                  <div className="absolute bottom-2 left-2 right-2 rounded-lg px-2 py-1" style={{ background: 'rgba(15,23,42,0.55)' }}>
                    <p className="text-[9px] text-white leading-tight truncate">{item.textPreview}</p>
                  </div>

                  {selectMode && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full border-2 flex items-center justify-center" style={selected.has(item.id) ? { background: '#1D4ED8', borderColor: '#1D4ED8' } : { background: 'white', borderColor: '#CBD5E1' }}>
                      {selected.has(item.id) && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  )}
                </div>

                {/* Info row */}
                <div className="px-3 py-2.5 flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: '#FFFFFF', color: '#2563EB' }}>{item.type}</span>
                      <span className="text-[9px] text-[#94A3B8]">{item.mime}</span>
                    </div>
                    <p className="text-[11px] text-[#1E293B] truncate" style={{ fontWeight: 500 }}>{item.name}</p>
                    <p className="text-[9px] text-[#94A3B8] mt-0.5">{item.date}</p>
                  </div>
                  {!selectMode && (
                    <button
                      onClick={() => setDeleteTargetId(item.id)}
                      className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg flex-shrink-0"
                      style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5' }}
                    >
                      <Trash2 size={10} />
                      삭제
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
          <div className="h-2" />
        </div>
      </div>

      {/* ── 선택 완료 바 ─────────────────────── */}
      {selectMode && selected.size > 0 && (
        <div className="flex-shrink-0 px-4 py-3" style={{ background: 'white', borderTop: '1px solid #BFDBFE' }}>
          <button
            onClick={openBottomSheet}
            className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 text-[14px] text-white"
            style={{ background: 'linear-gradient(135deg, #1D4ED8, #2563EB)', fontWeight: 700, boxShadow: '0 4px 16px rgba(29,78,216,0.35)' }}
          >
            {selected.size}개 선택 완료
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* ── 전체화면 미리보기 ─────────────────── */}
      {previewItem && (
        <div className="absolute inset-0 z-50 flex flex-col" style={{ background: '#0F172A' }}>
          <div className="flex items-center justify-between px-4 pt-4 pb-3 flex-shrink-0">
            <div className="min-w-0">
              <p className="text-[13px] text-white truncate" style={{ fontWeight: 600 }}>{previewItem.label}</p>
              <p className="text-[10px] text-white/50 mt-0.5">{previewItem.date}</p>
            </div>
            <button onClick={() => setPreviewItem(null)} className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ml-3" style={{ background: 'rgba(255,255,255,0.12)' }}>
              <X size={16} className="text-white" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center px-4 pb-4">
            <div className="w-full rounded-2xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${previewItem.color}25, ${previewItem.color}50)`, aspectRatio: '9/16', maxHeight: '100%', position: 'relative' }}>
              <div className="absolute inset-0 p-6 flex flex-col gap-4 opacity-50">
                <div className="flex gap-3 items-center">
                  <div className="h-4 rounded w-24" style={{ background: previewItem.color }} />
                  <div className="h-4 rounded w-16" style={{ background: previewItem.color }} />
                </div>
                <div className="space-y-3 flex-1">
                  <div className="h-3 rounded w-full" style={{ background: previewItem.color }} />
                  <div className="h-3 rounded w-5/6" style={{ background: previewItem.color }} />
                  <div className="h-3 rounded w-4/5" style={{ background: previewItem.color }} />
                  <div className="h-3 rounded w-full" style={{ background: previewItem.color }} />
                  <div className="h-3 rounded w-3/4" style={{ background: previewItem.color }} />
                </div>
                <div className="flex gap-3">
                  <div className="h-10 rounded-xl w-28" style={{ background: previewItem.color }} />
                  <div className="h-10 rounded-xl w-20" style={{ background: previewItem.color }} />
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: `${previewItem.color}40`, border: `2px solid ${previewItem.color}60` }}>
                  <Camera size={28} style={{ color: previewItem.color }} />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 px-4 py-3" style={{ background: 'rgba(15,23,42,0.75)' }}>
                <p className="text-[11px] text-white leading-relaxed">{previewItem.textPreview}</p>
                <p className="text-[9px] text-white/50 mt-1">{previewItem.name}</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
