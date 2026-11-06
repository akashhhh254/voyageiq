import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { OverviewView } from './components/OverviewView';
import { SupplierFeedView } from './components/SupplierFeedView';
import { DeduplicationView } from './components/DeduplicationView';
import { RoomMappingView } from './components/RoomMappingView';
import { UnifiedProfilesView } from './components/UnifiedProfilesView';
import { OfferOptimizerView } from './components/OfferOptimizerView';
import { SightseeingView } from './components/SightseeingView';
import { EvaluationBenchmarkView } from './components/EvaluationBenchmarkView';
import { MentorBlueprintView } from './components/MentorBlueprintView';
import { getFullSyntheticDataset } from './data/syntheticDataset';
import { DEFAULT_WEIGHTS } from './engine/offerOptimization';
import { runEvaluationBenchmark } from './engine/evaluation';
import { ValueWeights, SupplierRecord } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [records, setRecords] = useState<SupplierRecord[]>(() => getFullSyntheticDataset());
  const [weights, setWeights] = useState<ValueWeights>(DEFAULT_WEIGHTS);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  // Compute evaluation metrics against benchmark
  const benchmarkResult = useMemo(() => {
    return runEvaluationBenchmark(records);
  }, [records]);

  const handleRerunBenchmark = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      // Force recalculation
      setRecords([...records]);
      setIsEvaluating(false);
      setActiveTab('benchmark');
    }, 350);
  };

  const handleResetData = () => {
    setRecords(getFullSyntheticDataset());
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 antialiased selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRunQuickBenchmark={handleRerunBenchmark}
        isEvaluating={isEvaluating}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'overview' && (
          <OverviewView
            metrics={benchmarkResult.metrics}
            onNavigate={tab => setActiveTab(tab)}
          />
        )}

        {activeTab === 'feed' && (
          <SupplierFeedView
            records={records}
            onResetData={handleResetData}
          />
        )}

        {activeTab === 'deduplication' && (
          <DeduplicationView records={records} />
        )}

        {activeTab === 'rooms' && (
          <RoomMappingView records={records} />
        )}

        {activeTab === 'unified' && (
          <UnifiedProfilesView records={records} weights={weights} />
        )}

        {activeTab === 'optimizer' && (
          <OfferOptimizerView
            records={records}
            weights={weights}
            onUpdateWeights={setWeights}
          />
        )}

        {activeTab === 'sightseeing' && (
          <SightseeingView />
        )}

        {activeTab === 'benchmark' && (
          <EvaluationBenchmarkView
            metrics={benchmarkResult.metrics}
            edgeCases={benchmarkResult.edgeCaseResults}
            onRerunBenchmark={handleRerunBenchmark}
            isEvaluating={isEvaluating}
          />
        )}

        {activeTab === 'blueprint' && (
          <MentorBlueprintView />
        )}
      </main>

      {/* Simple, unpretentious footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span className="font-semibold text-slate-900">VoyageOptima Platform</span>
            <span className="mx-2">·</span>
            <span>VOYAGEHACK 4.0 Multi-Supplier Optimization Prototype</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Deterministic Fuzzy & Geo Engine</span>
            <span>·</span>
            <span>Ground-Truth Validated</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
