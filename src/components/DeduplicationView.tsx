import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  MapPin,
  Phone,
  Sparkles,
  GitCompare,
  Layers,
} from 'lucide-react';
import { SupplierRecord, HotelMatchResult } from '../types';
import { matchHotelPair, clusterHotelListings } from '../engine/hotelDeduplication';

interface DeduplicationViewProps {
  records: SupplierRecord[];
}

export const DeduplicationView: React.FC<DeduplicationViewProps> = ({ records }) => {
  // Preset scenarios to quickly demonstrate key capabilities to hackathon judges
  const presetScenarios = [
    {
      label: '1. Confirmed Match (Taj Lands End)',
      idA: 'TBO-TLE-01',
      idB: 'AGD-TLE-02',
      desc: 'Matches "Taj Lands End" vs "The Taj Lands End Mumbai" with collocated GPS and matching phone.',
    },
    {
      label: '2. Negative Veto (Taj Lands End vs Taj Mahal Palace)',
      idA: 'TBO-TLE-01',
      idB: 'TBO-TMP-01',
      desc: 'Crucial Test: Both are 5★ Taj hotels in Mumbai, but 24km apart. System MUST reject.',
    },
    {
      label: '3. Negative Veto (JW Marriott Juhu vs Sahar Airport)',
      idA: 'TBO-JWJ-01',
      idB: 'EXP-JWS-01',
      desc: 'Both JW Marriott in Mumbai. 7km separation triggers geo veto.',
    },
    {
      label: '4. Missing GPS Fallback (Taj Landsend Hotel)',
      idA: 'TBO-TLE-01',
      idB: 'HB-TLE-03',
      desc: 'Listing B has null GPS; falls back safely to phone and postal token overlap.',
    },
    {
      label: '5. Negative Veto (Oberoi Delhi vs Oberoi Gurgaon)',
      idA: 'TBO-OND-01',
      idB: 'EXP-ONG-01',
      desc: 'Both Oberoi luxury properties in NCR, but in distinct cities (Delhi vs Gurugram).',
    },
    {
      label: '6. Goa Neighbor Resorts (Fort Aguada vs Holiday Village)',
      idA: 'TBO-TFA-01',
      idB: 'EXP-THV-01',
      desc: 'Neighboring Taj resorts 600m apart; telephone normalization prevents false merge.',
    },
  ];

  const [selectedIdA, setSelectedIdA] = useState<string>('TBO-TLE-01');
  const [selectedIdB, setSelectedIdB] = useState<string>('AGD-TLE-02');
  const [activeTab, setActiveTab] = useState<'interactive' | 'clusters'>('interactive');

  const listingA = records.find(r => r.id === selectedIdA) || records[0];
  const listingB = records.find(r => r.id === selectedIdB) || records[1];

  const matchResult: HotelMatchResult = matchHotelPair(listingA, listingB);

  // Grouped clusters for browsing
  const clusteringData = clusterHotelListings(records);

  const applyPreset = (preset: typeof presetScenarios[0]) => {
    setSelectedIdA(preset.idA);
    setSelectedIdB(preset.idB);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Hotel Deduplication Engine
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Multi-signal matching heuristics combining Token Sort, Haversine geo distance, phone normalization, and hard vetos.
          </p>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('interactive')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === 'interactive'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pairwise Comparator
          </button>
          <button
            onClick={() => setActiveTab('clusters')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === 'clusters'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Discovered Clusters ({clusteringData.clusters.length})
          </button>
        </div>
      </div>

      {activeTab === 'interactive' && (
        <div className="space-y-6">
          {/* Quick-test Presets */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2.5">
              Curated Test Scenarios (Evaluate Edge Cases)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {presetScenarios.map((p, idx) => {
                const isActive = selectedIdA === p.idA && selectedIdB === p.idB;
                return (
                  <button
                    key={idx}
                    onClick={() => applyPreset(p)}
                    className={`text-left p-2.5 rounded-lg border transition-all text-xs cursor-pointer ${
                      isActive
                        ? 'bg-indigo-50/60 border-indigo-300 text-indigo-950 font-medium'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-semibold">{p.label}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{p.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Pair Selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Listing A Selection */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Listing A (Base Record)
                </span>
                <span className="text-[11px] font-mono text-slate-500">{listingA.supplierName}</span>
              </div>
              <select
                value={selectedIdA}
                onChange={e => setSelectedIdA(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {records.slice(0, 50).map(r => (
                  <option key={r.id} value={r.id}>
                    [{r.supplierId.slice(0, 3)}] {r.hotelName} ({r.city})
                  </option>
                ))}
              </select>

              <div className="p-3 bg-slate-50 rounded-lg space-y-1.5 text-xs">
                <div className="font-bold text-slate-900">{listingA.hotelName}</div>
                <div className="text-slate-600 flex items-center gap-1.5 text-[11px]">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{listingA.address}, {listingA.city} ({listingA.postalCode})</span>
                </div>
                <div className="text-slate-600 flex items-center gap-1.5 text-[11px]">
                  <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="font-mono">{listingA.phone || 'No phone listed'}</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  GPS: {listingA.lat !== null ? `${listingA.lat.toFixed(4)}, ${listingA.lng?.toFixed(4)}` : 'MISSING'}
                </div>
              </div>
            </div>

            {/* Listing B Selection */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Listing B (Candidate Record)
                </span>
                <span className="text-[11px] font-mono text-slate-500">{listingB.supplierName}</span>
              </div>
              <select
                value={selectedIdB}
                onChange={e => setSelectedIdB(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {records.slice(0, 50).map(r => (
                  <option key={r.id} value={r.id}>
                    [{r.supplierId.slice(0, 3)}] {r.hotelName} ({r.city})
                  </option>
                ))}
              </select>

              <div className="p-3 bg-slate-50 rounded-lg space-y-1.5 text-xs">
                <div className="font-bold text-slate-900">{listingB.hotelName}</div>
                <div className="text-slate-600 flex items-center gap-1.5 text-[11px]">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{listingB.address}, {listingB.city} ({listingB.postalCode})</span>
                </div>
                <div className="text-slate-600 flex items-center gap-1.5 text-[11px]">
                  <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="font-mono">{listingB.phone || 'No phone listed'}</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  GPS: {listingB.lat !== null ? `${listingB.lat.toFixed(4)}, ${listingB.lng?.toFixed(4)}` : 'MISSING'}
                </div>
              </div>
            </div>
          </div>

          {/* Decision Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Deduplication Engine Verdict
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  <span
                    className={`text-lg font-bold tracking-tight ${
                      matchResult.decision === 'CONFIRMED_MATCH'
                        ? 'text-emerald-700'
                        : matchResult.decision === 'POSSIBLE_MATCH'
                        ? 'text-amber-700'
                        : 'text-rose-700'
                    }`}
                  >
                    {matchResult.decision === 'CONFIRMED_MATCH' && 'Confirmed Match'}
                    {matchResult.decision === 'POSSIBLE_MATCH' && 'Possible Match (Review Required)'}
                    {matchResult.decision === 'DIFFERENT_PROPERTY' && 'Different Property (Separate SKU)'}
                  </span>
                  <span className="text-sm font-mono font-bold text-slate-700 tabular-nums">
                    {matchResult.confidenceScore}% Confidence
                  </span>
                </div>
              </div>

              {/* Progress bar visual */}
              <div className="w-full sm:w-64 space-y-1">
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>Match Strength</span>
                  <span>{matchResult.confidenceScore}/100</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      matchResult.decision === 'CONFIRMED_MATCH'
                        ? 'bg-emerald-600'
                        : matchResult.decision === 'POSSIBLE_MATCH'
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${matchResult.confidenceScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Signal Radar Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-[11px] text-slate-500 uppercase font-medium">Name Similarity</div>
                <div className="text-lg font-bold text-slate-900 font-mono tabular-nums mt-0.5">
                  {matchResult.evidence.nameSimilarity}%
                </div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">
                  Token Sort & Levenshtein
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-[11px] text-slate-500 uppercase font-medium">GPS Separation</div>
                <div className="text-lg font-bold text-slate-900 font-mono tabular-nums mt-0.5">
                  {matchResult.evidence.geoDistanceMeters !== null
                    ? `${matchResult.evidence.geoDistanceMeters}m`
                    : 'No GPS'}
                </div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">
                  Haversine formula
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-[11px] text-slate-500 uppercase font-medium">Address Overlap</div>
                <div className="text-lg font-bold text-slate-900 font-mono tabular-nums mt-0.5">
                  {matchResult.evidence.addressSimilarity}%
                </div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">
                  Token Jaccard & PIN
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-[11px] text-slate-500 uppercase font-medium">Phone Match</div>
                <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                  {matchResult.evidence.phoneMatch === true
                    ? '100% Match'
                    : matchResult.evidence.phoneMatch === false
                    ? 'Mismatch'
                    : 'N/A'}
                </div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">
                  Normalized 10 digits
                </div>
              </div>
            </div>

            {/* Hard Veto Alert if triggered */}
            {matchResult.evidence.vetoTriggered && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-rose-900">
                    Hard Veto Triggered: False-Merge Protection Active
                  </div>
                  <div className="text-xs text-rose-700 mt-0.5">
                    {matchResult.evidence.vetoTriggered}
                  </div>
                </div>
              </div>
            )}

            {/* Plain English Explanation */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-2">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Explainable Audit Trail
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {matchResult.explanation}
              </p>
              <div className="pt-2 border-t border-slate-200/60 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
                {matchResult.evidence.positiveSignals.map((sig, idx) => (
                  <span key={idx} className="text-emerald-700 font-medium">
                    ✓ {sig}
                  </span>
                ))}
                {matchResult.evidence.negativeSignals.map((sig, idx) => (
                  <span key={idx} className="text-rose-700 font-medium">
                    ✕ {sig}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Discovered Clusters Tab */}
      {activeTab === 'clusters' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-slate-900 font-mono tabular-nums">
                {clusteringData.clusters.length}
              </span>{' '}
              multi-supplier duplicate clusters consolidated from raw supplier data.
            </div>
            <div className="text-slate-500">
              Zero manual rules required; fully deterministic clustering.
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {clusteringData.clusters.slice(0, 15).map((cluster, cIdx) => {
              const primary = cluster[0];
              const uniqueSuppliers = Array.from(new Set(cluster.map(c => c.supplierName)));
              const prices = cluster.map(c => c.priceINR);
              const minP = Math.min(...prices);
              const maxP = Math.max(...prices);

              return (
                <div
                  key={cIdx}
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                        Canonical Hotel #{cIdx + 1}
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mt-0.5">
                        {primary.hotelName}
                      </h4>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {primary.city}, {primary.country} · {primary.starRating}★
                      </div>
                    </div>
                    <div className="text-right sm:text-right">
                      <div className="text-xs text-slate-500">Price Spread across Suppliers</div>
                      <div className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                        ₹{minP.toLocaleString('en-IN')} – ₹{maxP.toLocaleString('en-IN')}
                      </div>
                      {maxP > minP && (
                        <div className="text-[11px] text-emerald-700 font-semibold">
                          ₹{(maxP - minP).toLocaleString('en-IN')} Arbitrage Opportunity
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Listings inside cluster */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-slate-700">
                      Consolidated Supplier Listings ({cluster.length}):
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {cluster.map(item => (
                        <div
                          key={item.id}
                          className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-900">
                              {item.supplierName}
                            </span>
                            <span className="font-mono font-bold text-slate-900 tabular-nums">
                              ₹{item.priceINR.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-600 truncate">
                            {item.hotelName}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {item.roomName}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
