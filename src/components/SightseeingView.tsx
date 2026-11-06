import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Clock,
  Car,
  Utensils,
  Ticket,
} from 'lucide-react';
import {
  SAMPLE_SIGHTSEEING_PRODUCTS,
  groupSightseeingProducts,
  GroupedSightseeingCluster,
} from '../engine/sightseeingEngine';

export const SightseeingView: React.FC = () => {
  const clusters = groupSightseeingProducts(SAMPLE_SIGHTSEEING_PRODUCTS);
  const [selectedAttraction, setSelectedAttraction] = useState<string>(
    clusters[0]?.attractionName || ''
  );

  const activeCluster =
    clusters.find(c => c.attractionName === selectedAttraction) || clusters[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
          <span>Module 7</span>
          <span aria-hidden="true">·</span>
          <span>Cross-Vertical Generalization</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Sightseeing & Experience Optimization
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Demonstrates that our multi-supplier deduplication and normalization engine extends seamlessly beyond hotels to tours and activities without false package consolidation.
        </p>
      </div>

      {/* Attraction Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {clusters.map(c => {
          const isActive = c.attractionName === activeCluster.attractionName;
          return (
            <button
              key={c.attractionName}
              onClick={() => setSelectedAttraction(c.attractionName)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {c.attractionName} ({c.products.length} Supplier Products)
            </button>
          );
        })}
      </div>

      {/* Avoided Mistakes Callout */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-amber-700" />
          <span>Domain Protection: Why Sightseeing Cannot Be Naively Merged</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {activeCluster.differentiationAnalysis.map((item, idx) => (
            <div
              key={idx}
              className="p-3 bg-white/80 rounded-lg border border-amber-100 space-y-1"
            >
              <div className="font-bold text-slate-900">{item.rule}</div>
              <p className="text-[11px] text-slate-600">{item.description}</p>
              <div className="text-[11px] text-amber-800 font-medium pt-1">
                ⚠️ Avoided: {item.avoidedMistake}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grouped Products under Selected Attraction */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Differentiated Inventory for {activeCluster.attractionName}
          </h3>
          <span className="text-xs text-slate-500">
            Price Range:{' '}
            <span className="font-bold text-slate-900 font-mono tabular-nums">
              ₹{activeCluster.minPrice.toLocaleString('en-IN')} – ₹{activeCluster.maxPrice.toLocaleString('en-IN')}
            </span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeCluster.products.map(product => {
            const isVip = product.accessTier === 'UPPER_DECK_VIP';
            return (
              <div
                key={product.id}
                className={`bg-white border rounded-xl p-5 shadow-xs flex flex-col justify-between transition-all ${
                  isVip ? 'border-indigo-300 ring-1 ring-indigo-50' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                        {product.supplierName} · SLA {Math.round(product.supplierReliability * 100)}%
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">
                        {product.packageTitle}
                      </h4>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                        ₹{product.priceINR.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        per person
                      </div>
                    </div>
                  </div>

                  {/* Attributes badge row */}
                  <div className="py-3 flex flex-wrap gap-2 text-[11px]">
                    <span className="inline-flex items-center gap-1 text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                      <Ticket className="w-3 h-3 text-slate-500" />
                      <span>{product.accessTier.replace(/_/g, ' ')}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                      <Car className="w-3 h-3 text-slate-500" />
                      <span>Transfer: {product.transferType.replace(/_/g, ' ')}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{product.durationHours} Hours</span>
                    </span>

                    {product.hasMeal && (
                      <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md font-medium">
                        <Utensils className="w-3 h-3 text-emerald-600" />
                        <span>Dining Included</span>
                      </span>
                    )}
                  </div>

                  {/* Inclusions list */}
                  <div className="space-y-1 text-xs text-slate-600">
                    {product.inclusions.map((inc, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px]">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {product.notes && (
                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 italic">
                    {product.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
