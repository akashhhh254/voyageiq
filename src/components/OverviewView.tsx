import React from 'react';
import {
  Building2,
  GitMerge,
  BadgePercent,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Compass,
  FileSpreadsheet,
} from 'lucide-react';
import { EvaluationMetrics } from '../types';

interface OverviewViewProps {
  metrics: EvaluationMetrics;
  onNavigate: (tab: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ metrics, onNavigate }) => {
  return (
    <div className="space-y-8">
      {/* Hero Introduction */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">
            <span>VoyageHack 4.0</span>
            <span aria-hidden="true">·</span>
            <span>Multi-Supplier Travel Optimization</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-3">
            Intelligent Hotel Deduplication & Best-Value Offer Ranking
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
            Travel platforms ingest disparate hotel listings and conflicting room descriptions across 
            multiple global suppliers. VoyageOptima normalizes naming variations, enforces strict geographic 
            proximity vetos, maps room equivalence without false merges, and calculates a transparent 
            True Value Score to surface the highest-value inventory.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('deduplication')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
            >
              <span>Test Hotel Deduplication</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('benchmark')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <span>View Ground-Truth Benchmark</span>
            </button>
            <button
              onClick={() => onNavigate('blueprint')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer"
            >
              <span>Hackathon Mentor Blueprint</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Raw Listings</span>
            <FileSpreadsheet className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {metrics.totalRawListings}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Across 5 global supplier feeds
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Unified Master Hotels</span>
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {metrics.unifiedClustersCount}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Deduplicated canonical properties
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Catalog Compression</span>
            <GitMerge className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {metrics.duplicateReductionPercentage}%
          </div>
          <div className="text-xs text-emerald-700 font-medium mt-1">
            Zero duplicate cards presented to users
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Arbitrage Savings</span>
            <TrendingDown className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            ₹{metrics.totalIdentifiedSavingsINR.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Identified across identical room rates
          </div>
        </div>
      </div>

      {/* Core Architectural Pillars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              1. Multi-Signal Deduplication
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Combines Token Sort Ratio, Levenshtein Distance, sanitized telephone matching, 
              and precise Haversine distance calculations with an inviolable 2.0km physical veto.
            </p>
            <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Prevents merging different hotels with similar names</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Explains every match decision transparently</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('deduplication')}
            className="mt-6 text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Explore Deduplication Engine</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
              <GitMerge className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              2. Strict Room Mapping
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Extracts physical room attributes (King vs Twin, Sea View vs City View, Square Footage) 
              separately from commercial booking terms (Breakfast vs Room Only, Non-Refundable).
            </p>
            <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Never conflates Twin Bed with King Bed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Separates room inventory from rate plans</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('rooms')}
            className="mt-6 text-xs font-semibold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Explore Room Mapping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4">
              <BadgePercent className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              3. True Value Offer Optimizer
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Raw price alone is misleading. Our configurable scoring engine balances price, 
              cancellation flexibility, supplier reliability SLA, and inclusions into a single True Value Score.
            </p>
            <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Configurable weight sliders (Price, SLA, Refund)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Natural language explainable trade-offs</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('optimizer')}
            className="mt-6 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Explore Offer Optimizer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Differentiation Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
              Hackathon Value Proposition
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              The Critical Travel Technology Safety Guardrail
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              &ldquo;In travel technology, merging two different hotels is ten times worse than failing to merge 
              two identical ones. A false positive results in angry travelers arriving at the wrong property 
              in the middle of the night. Our architecture is engineered around high precision and fail-safe vetos.&rdquo;
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => onNavigate('unified')}
              className="px-4 py-2 text-xs font-semibold text-slate-900 bg-white rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-center"
            >
              View Unified Catalog
            </button>
            <button
              onClick={() => onNavigate('sightseeing')}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer text-center"
            >
              View Sightseeing Module
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
