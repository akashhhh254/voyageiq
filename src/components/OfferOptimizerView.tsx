import React, { useState } from 'react';
import {
  Sliders,
  Award,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingDown,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { SupplierRecord, ValueWeights, ScoredOffer } from '../types';
import { DEFAULT_WEIGHTS, rankOffers, explainRankingDecision } from '../engine/offerOptimization';

interface OfferOptimizerViewProps {
  records: SupplierRecord[];
  weights: ValueWeights;
  onUpdateWeights: (newWeights: ValueWeights) => void;
}

export const OfferOptimizerView: React.FC<OfferOptimizerViewProps> = ({
  records,
  weights,
  onUpdateWeights,
}) => {
  // Select Taj Lands End cluster offers as default showcase
  const defaultOffers = records.filter(r => r.clusterId === 'taj_lands_end');

  const [selectedClusterId, setSelectedClusterId] = useState<string>('taj_lands_end');
  const [strategy, setStrategy] = useState<'TRUE_VALUE' | 'CHEAPEST' | 'FLEXIBILITY' | 'RELIABILITY'>('TRUE_VALUE');

  const clusterRecords = records.filter(r => r.clusterId === selectedClusterId);
  const scoredOffers = rankOffers(clusterRecords, weights, strategy);

  const winner = scoredOffers[0];
  const runnerUp = scoredOffers[1];
  const explanation = winner ? explainRankingDecision(winner, runnerUp) : null;

  // Preset weight configurations
  const applyPresetWeights = (preset: 'balanced' | 'budget' | 'business' | 'safety') => {
    switch (preset) {
      case 'budget':
        onUpdateWeights({
          priceWeight: 0.70,
          cancellationWeight: 0.10,
          reliabilityWeight: 0.10,
          inclusionsWeight: 0.05,
          paymentFlexibilityWeight: 0.05,
        });
        break;
      case 'business':
        onUpdateWeights({
          priceWeight: 0.20,
          cancellationWeight: 0.40,
          reliabilityWeight: 0.20,
          inclusionsWeight: 0.10,
          paymentFlexibilityWeight: 0.10,
        });
        break;
      case 'safety':
        onUpdateWeights({
          priceWeight: 0.20,
          cancellationWeight: 0.20,
          reliabilityWeight: 0.50,
          inclusionsWeight: 0.05,
          paymentFlexibilityWeight: 0.05,
        });
        break;
      case 'balanced':
      default:
        onUpdateWeights(DEFAULT_WEIGHTS);
        break;
    }
  };

  const clustersAvailable = [
    { id: 'taj_lands_end', label: 'Taj Lands End, Mumbai (4 Offers)' },
    { id: 'leela_delhi', label: 'The Leela Palace New Delhi (3 Offers)' },
    { id: 'itc_grand_chola', label: 'ITC Grand Chola Chennai (2 Offers)' },
    { id: 'burj_al_arab', label: 'Burj Al Arab Dubai (2 Offers)' },
    { id: 'marina_bay_sands', label: 'Marina Bay Sands Singapore (2 Offers)' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          True Value Offer Optimizer & Ranking
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          A transparent multi-criteria decision engine that avoids superficial price bias by balancing net rate, cancellation terms, supplier SLA, and meal inclusions.
        </p>
      </div>

      {/* Cluster Selector & Preset Buttons */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="w-full sm:w-80">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
              Select Inventory Cluster to Optimize:
            </label>
            <select
              value={selectedClusterId}
              onChange={e => setSelectedClusterId(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
            >
              {clustersAvailable.map(c => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
              Weight Presets:
            </label>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => applyPresetWeights('balanced')}
                className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                Balanced Default
              </button>
              <button
                onClick={() => applyPresetWeights('budget')}
                className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                Budget Focus (70% Price)
              </button>
              <button
                onClick={() => applyPresetWeights('business')}
                className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                Business (40% Flexibility)
              </button>
              <button
                onClick={() => applyPresetWeights('safety')}
                className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                Supplier Safety (50% SLA)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Configurable Sliders & Audit Winner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Configurable Sliders */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-slate-500" />
              <span>Scoring Weights</span>
            </span>
            <button
              onClick={() => onUpdateWeights(DEFAULT_WEIGHTS)}
              className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              title="Reset to default weights"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Slider 1: Price */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700">Price Competitiveness</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                {Math.round(weights.priceWeight * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.10"
              max="0.80"
              step="0.05"
              value={weights.priceWeight}
              onChange={e =>
                onUpdateWeights({ ...weights, priceWeight: parseFloat(e.target.value) })
              }
              className="w-full accent-slate-900 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
            />
          </div>

          {/* Slider 2: Cancellation */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700">Cancellation Flexibility</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                {Math.round(weights.cancellationWeight * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.60"
              step="0.05"
              value={weights.cancellationWeight}
              onChange={e =>
                onUpdateWeights({ ...weights, cancellationWeight: parseFloat(e.target.value) })
              }
              className="w-full accent-slate-900 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
            />
          </div>

          {/* Slider 3: Reliability */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700">Supplier Reliability (SLA)</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                {Math.round(weights.reliabilityWeight * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.60"
              step="0.05"
              value={weights.reliabilityWeight}
              onChange={e =>
                onUpdateWeights({ ...weights, reliabilityWeight: parseFloat(e.target.value) })
              }
              className="w-full accent-slate-900 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
            />
          </div>

          {/* Slider 4: Meal & Inclusions */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700">Meal & Inclusions</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                {Math.round(weights.inclusionsWeight * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.40"
              step="0.05"
              value={weights.inclusionsWeight}
              onChange={e =>
                onUpdateWeights({ ...weights, inclusionsWeight: parseFloat(e.target.value) })
              }
              className="w-full accent-slate-900 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
            />
          </div>

          {/* Slider 5: Payment */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700">Payment Flexibility</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                {Math.round(weights.paymentFlexibilityWeight * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.30"
              step="0.05"
              value={weights.paymentFlexibilityWeight}
              onChange={e =>
                onUpdateWeights({ ...weights, paymentFlexibilityWeight: parseFloat(e.target.value) })
              }
              className="w-full accent-slate-900 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
            />
          </div>

          <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            Total Score is mathematically normalized across all active weight ratios in real-time.
          </div>
        </div>

        {/* Right Column: Scored Ranking Table & Audit Explanation */}
        <div className="lg:col-span-8 space-y-6">
          {/* Winner Explanation Card */}
          {winner && explanation && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>Explainable Ranking Verdict</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {explanation.headline}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {explanation.summary}
              </p>
              <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2">
                {explanation.keyFactors.map((factor, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md font-medium"
                  >
                    ✓ {factor}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Scored Offers Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 uppercase tracking-wider">
                Ranked Supplier Offers ({scoredOffers.length})
              </span>
              <span className="text-slate-500">
                Sorted by True Value Composite Score
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-2.5 px-3">Rank</th>
                    <th className="py-2.5 px-3">Supplier</th>
                    <th className="py-2.5 px-3">Rate Plan & Terms</th>
                    <th className="py-2.5 px-3 text-right">Price</th>
                    <th className="py-2.5 px-3 text-center">True Value</th>
                    <th className="py-2.5 px-3">Trade-offs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {scoredOffers.map(offer => {
                    const isRank1 = offer.rank === 1;
                    return (
                      <tr
                        key={offer.record.id}
                        className={isRank1 ? 'bg-indigo-50/20 font-medium' : 'hover:bg-slate-50/60'}
                      >
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                              isRank1
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            #{offer.rank}
                          </span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="font-bold text-slate-900">
                            {offer.record.supplierName}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            SLA: {Math.round(offer.record.supplierReliability * 100)}%
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="text-slate-900">{offer.record.mealPlan.replace('_', ' ')}</div>
                          <div
                            className={`text-[10px] ${
                              offer.record.cancellationPolicy === 'FREE_CANCELLATION'
                                ? 'text-emerald-700 font-semibold'
                                : 'text-slate-500'
                            }`}
                          >
                            {offer.record.cancellationPolicy.replace('_', ' ')}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <div className="font-bold text-slate-900 font-mono tabular-nums">
                            ₹{offer.record.priceINR.toLocaleString('en-IN')}
                          </div>
                          {offer.priceDeltaVsBest > 0 && (
                            <div className="text-[10px] text-rose-600 font-mono tabular-nums">
                              +₹{offer.priceDeltaVsBest.toLocaleString('en-IN')}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-md font-mono font-bold tabular-nums text-xs ${
                              isRank1
                                ? 'bg-indigo-100 text-indigo-900'
                                : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            {offer.trueValueScore}/100
                          </span>
                        </td>
                        <td className="py-3 px-3 text-[11px] text-slate-500 max-w-xs">
                          {offer.tradeOffs.length > 0 ? (
                            <span className="text-slate-600">{offer.tradeOffs.join('; ')}</span>
                          ) : (
                            <span className="text-emerald-700 font-medium">Optimal across all vectors</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
