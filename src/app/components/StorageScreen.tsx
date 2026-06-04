import { useState } from "react";
import { ArrowLeft, Check, ChevronRight, Database, HardDrive, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

type AppScreen = 'home' | 'data' | 'tasks' | 'topicDetail' | 'actionReview' | 'storage';
type NavigateFn = (screen: AppScreen, data?: Record<string, string>) => void;
type PermissionStatus = 'unknown' | 'selecting' | 'granted' | 'partial' | 'denied';

const periodOptions = ['마지막 종료 이후', '1시간', '24시간', '7일', '직접적용'];
const storageOptions = [
  { label: '250 MB', value: 250 },
  { label: '500 MB', value: 500 },
  { label: '1 GB', value: 1024 },
];
const usedStorageMb = 486.9;

export function StorageScreen({ navigate, permissionStatus }: { navigate: NavigateFn; permissionStatus: PermissionStatus }) {
  const [selectedPeriod, setSelectedPeriod] = useState('마지막 종료 이후');
  const [appliedPeriodText, setAppliedPeriodText] = useState('마지막 종료 이후');
  const [customHours, setCustomHours] = useState('');
  const [storageLimitMb, setStorageLimitMb] = useState(500);

  const isCustomMode = selectedPeriod === '직접적용';
  const hasOnlyNumbers = /^\d*$/.test(customHours);
  const canApplyCustom = isCustomMode && hasOnlyNumbers && customHours.trim().length > 0 && Number(customHours) > 0;
  const showNumberError = isCustomMode && customHours.length > 0 && !hasOnlyNumbers;
  const storagePercent = Math.min(100, (usedStorageMb / storageLimitMb) * 100);
  const storageLimitLabel = storageLimitMb >= 1024 ? `${storageLimitMb / 1024} GB` : `${storageLimitMb} MB`;

  const handleCustomApply = () => {
    if (!canApplyCustom) return;
    setAppliedPeriodText(`${customHours}시간 전부터`);
    setCustomHours('');
  };

  const handlePeriodSelect = (label: string) => {
    setSelectedPeriod(label);
    if (label !== '직접적용') {
      setAppliedPeriodText(label);
      setCustomHours('');
    }
  };

  const handleStorageLimit = (value: number) => {
    if (value < usedStorageMb) {
      toast.error('데이터를 정리해야 변경할 수 있어요.');
      return;
    }
    setStorageLimitMb(value);
  };

  return (
    <div className="min-h-full bg-[#F7F8FA] px-5 pt-3 pb-8">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigate('home')}
          className="w-8 h-8 rounded-full bg-white border border-[#E6EAF2] flex items-center justify-center"
        >
          <ArrowLeft size={17} className="text-[#1E293B]" />
        </button>
        <div>
          <h1 className="text-[23px] tracking-[-0.7px] text-[#111827]" style={{ fontWeight: 850 }}>설정</h1>
          <p className="text-[11px] text-[#8A94A6] mt-0.5">수집 범위와 저장 공간</p>
        </div>
      </div>

      <div className="space-y-3">
        <section className="bg-white rounded-[18px] border border-[#E6EAF2] p-3.5 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-[14px] text-[#111827]" style={{ fontWeight: 800 }}>수집 기간</h2>
              <p className="text-[10px] text-[#8A94A6] mt-0.5">{appliedPeriodText}</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
              <Database size={16} className="text-[#1688E8]" />
            </div>
          </div>

          <div className="-mx-3.5 px-3.5 flex gap-2 overflow-x-auto pb-1 mb-2.5 phone-scroll">
            {periodOptions.map((label) => {
              const active = selectedPeriod === label;
              return (
                <button
                  key={label}
                  onClick={() => handlePeriodSelect(label)}
                  className={`shrink-0 h-8 px-3.5 rounded-xl border text-[11px] ${active ? 'bg-[#E7F5FE] border-[#B7DDF2] text-[#1688E8]' : 'bg-white border-[#E7EAF0] text-[#586273]'}`}
                  style={{ fontWeight: active ? 800 : 600 }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {isCustomMode && (
            <div className="flex items-start gap-2.5 pt-1">
              <label className="flex-1">
                <span className="block text-[10px] text-[#657284] mb-1 ml-1">시간</span>
                <input
                  value={customHours}
                  onChange={(e) => setCustomHours(e.target.value)}
                  placeholder="숫자만 입력"
                  inputMode="numeric"
                  className={`h-11 w-full rounded-2xl border bg-white px-4 text-[14px] text-[#111827] outline-none placeholder:text-[#CBD5E1] ${showNumberError ? 'border-[#EF4444]' : 'border-[#E6EAF2]'}`}
                />
                {showNumberError && (
                  <span className="mt-1 block text-[10px] text-[#EF4444] ml-1">숫자만 입력이 가능합니다.</span>
                )}
              </label>
              <button
                onClick={handleCustomApply}
                disabled={!canApplyCustom}
                className={`w-[74px] h-11 mt-[18px] rounded-2xl text-[12px] transition-colors ${canApplyCustom ? 'bg-[#1688E8] text-white shadow-[0_8px_18px_rgba(22,136,232,0.22)]' : 'bg-[#E8EEF5] text-[#9AA5B5]'}`}
                style={{ fontWeight: 800 }}
              >
                적용
              </button>
            </div>
          )}
        </section>

        <section className="bg-white rounded-[18px] border border-[#E6EAF2] p-3.5 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-[14px] text-[#111827]" style={{ fontWeight: 800 }}>저장 공간</h2>
              <p className="text-[10px] text-[#8A94A6] mt-0.5">자료 19087개</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
              <HardDrive size={16} className="text-[#1688E8]" />
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 mb-3">
            <p className="text-[16px] text-[#111827]" style={{ fontWeight: 850 }}>486.9 MB / {storageLimitLabel}</p>
            <button
              onClick={() => navigate('data', { mode: 'cleanup' })}
              className="text-[12px] text-[#1688E8] shrink-0"
              style={{ fontWeight: 700 }}
            >
              정리
            </button>
          </div>
          <div className="h-2.5 rounded-full bg-[#EAF1F8] overflow-hidden mb-4">
            <div
              className="h-full rounded-full bg-[#1688E8] transition-all duration-300"
              style={{ width: `${storagePercent}%` }}
            />
          </div>
          <div className="flex gap-2">
            {storageOptions.map(({ label, value }) => {
              const active = storageLimitMb === value;
              return (
                <button
                  key={label}
                  onClick={() => handleStorageLimit(value)}
                  className={`h-9 px-4 rounded-xl border text-[11px] ${active ? 'bg-[#E7F5FE] border-[#B7DDF2] text-[#1688E8]' : 'bg-white border-[#E7EAF0] text-[#6B7280]'}`}
                  style={{ fontWeight: 800 }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="bg-white rounded-[18px] border border-[#E6EAF2] p-3.5 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#EFF6FF] flex items-center justify-center">
                <ShieldCheck size={17} className="text-[#1688E8]" />
              </div>
              <div>
                <h2 className="text-[14px] text-[#111827]" style={{ fontWeight: 800 }}>
                  {permissionStatus === 'denied' ? '권한 거부됨' : permissionStatus === 'unknown' ? '권한 필요' : permissionStatus === 'partial' ? '일부 권한 허용됨' : '권한 허용됨'}
                </h2>
                <p className="text-[10px] text-[#8A94A6] mt-0.5">
                  {permissionStatus === 'denied' ? '수집 데이터에서 사진 접근을 다시 허용할 수 있습니다.' : permissionStatus === 'unknown' ? '수집 데이터에서 사진 접근을 허용해 주세요.' : permissionStatus === 'partial' ? '선택한 이미지와 스크린샷만 확인할 수 있습니다.' : '새 이미지와 스크린샷을 확인할 수 있습니다.'}
                </p>
              </div>
            </div>
            {permissionStatus === 'granted' || permissionStatus === 'partial' ? <Check size={17} className="text-[#16A34A]" /> : <ChevronRight size={17} className="text-[#CBD5E1]" />}
          </div>
        </section>

        <button
          onClick={() => navigate('data')}
          className="w-full rounded-[18px] bg-[#EEF6FF] border border-[#D5E9FF] p-3.5 flex items-center justify-between text-left"
        >
          <div>
            <p className="text-[13px] text-[#0F5FB8]" style={{ fontWeight: 850 }}>데이터 관리로 이동</p>
            <p className="text-[10px] text-[#5C8FC0] mt-0.5">수집된 사진, 링크, 메모를 직접 선택합니다.</p>
          </div>
          <ChevronRight size={17} className="text-[#1688E8]" />
        </button>
      </div>
    </div>
  );
}
