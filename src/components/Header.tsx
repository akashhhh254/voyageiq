import React from 'react';
import { Layers, Play, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onRunQuickBenchmark: () => void;
  isEvaluating?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onRunQuickBenchmark,
  isEvaluating,
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'feed', label: 'Supplier Feed' },
    { id: 'deduplication', label: 'Hotel Matching' },
    { id: 'rooms', label: 'Room Mapping' },
    { id: 'unified', label: 'Unified Profiles' },
    { id: 'optimizer', label: 'Offer Optimizer' },
    { id: 'sightseeing', label: 'Sightseeing' },
    { id: 'benchmark', label: 'Evaluation' },
    { id: 'blueprint', label: 'Mentor Blueprint' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div 
            onClick={() => setActiveTab('overview')} 
            className="flex items-center gap-2.5 cursor-pointer whitespace-nowrap shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-base shadow-xs">
              VO
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900">
                VoyageOptima
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs text-slate-400 font-mono">
                v4.0
              </span>
            </div>
          </div>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 overflow-x-auto scrollbar-none py-1">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`text-xs uppercase tracking-wider font-semibold transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                    isActive
                      ? 'text-indigo-600 border-indigo-600'
                      : 'text-slate-500 hover:text-slate-900 border-transparent'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onRunQuickBenchmark}
              disabled={isEvaluating}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isEvaluating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Evaluating...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Benchmark</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center gap-4 overflow-x-auto py-2.5 border-t border-slate-100 scrollbar-none text-xs">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`whitespace-nowrap px-2 py-1 rounded font-medium ${
                activeTab === item.id
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
