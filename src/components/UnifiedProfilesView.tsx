import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Phone,
  Star,
  Layers,
  Award,
  ShieldCheck,
  Check,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { SupplierRecord, UnifiedHotelProfile, ValueWeights } from '../types';
import { clusterHotelListings } from '../engine/hotelDeduplication';
import { buildUnifiedHotelProfile } from '../engine/unifiedProfile';

interface UnifiedProfilesViewProps {
  records: SupplierRecord[];
  weights?: ValueWeights;
}

export const UnifiedProfilesView: React.FC<UnifiedProfilesViewProps> = ({
  records,
  weights,
}) => {
  // Cluster records and build unified profiles
  const clustering = clusterHotelListings(records);
  const profiles: UnifiedHotelProfile[] = clustering.clusters.map(c =>
    buildUnifiedHotelProfile(c, weights)
  );

  const [selectedProfileId, setSelectedProfileId] = useState<string>(
    profiles[0]?.id || ''
  );

  const activeProfile = profiles.find(p => p.id === selectedProfileId) || profiles[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Unified Hotel Catalog
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Single canonical master hotel listings synthesized from multiple conflicting supplier feeds with full source attribution.
        </p>
      </div>

      {/* Main Grid: Left selector list + Right master profile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Master Hotel List */}
        <div className="lg:col-span-4 space-y-2 max-h-[800px] overflow-y-auto pr-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Canonical Master Hotels ({profiles.length})
          </div>
          {profiles.map(p => {
            const isSelected = p.id === selectedProfileId;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedProfileId(p.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-indigo-500 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-xs text-slate-900 truncate">
                    {p.masterName}
                  </div>
                  <div className="flex items-center text-amber-500 text-xs shrink-0 font-medium">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="ml-0.5">{p.starRating}</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-1 truncate">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{p.city}, {p.country}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 mt-2 border-t border-slate-100">
                  <span>{p.supplierListingsCount} Linked Suppliers</span>
                  <span>{p.roomCategories.length} Room Types</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Master Hotel Profile */}
        {activeProfile ? (
          <div className="lg:col-span-8 space-y-6">
            {/* Master Header Card */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
                      <span>Canonical Master Property</span>
                      <span aria-hidden="true">·</span>
                      <span>Verified Cluster</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {activeProfile.masterName}
                    </h3>
                    <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{activeProfile.standardizedAddress}, {activeProfile.city}</span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono">{activeProfile.phone}</span>
                    </div>
                  </div>

                  <div className="text-right sm:text-right shrink-0">
                    <div className="flex items-center gap-1 text-amber-500 justify-end">
                      {Array.from({ length: activeProfile.starRating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Consolidated from <span className="font-bold text-slate-900 font-mono">{activeProfile.supplierListingsCount}</span> supplier feeds
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {activeProfile.bestDescription}
                  </p>
                </div>

                {/* Amenities */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-800 mb-2">
                    Verified Facilities & Amenities:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeProfile.allAmenities.map((amenity, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Room Categories & Multi-Supplier Rate Matrix */}
            <div className="space-y-4">
              <div className="text-sm font-bold text-slate-900">
                Standardized Room Categories & Linked Supplier Offers
              </div>

              {activeProfile.roomCategories.map((cat, cIdx) => (
                <div
                  key={cIdx}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs"
                >
                  <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {cat.categoryTitle}
                      </h4>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Inventory matched across {cat.offersCount} supplier offer{cat.offersCount > 1 ? 's' : ''}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-500">Rate Range: </span>
                      <span className="text-xs font-bold text-slate-900 font-mono tabular-nums">
                        ₹{cat.lowestPriceINR.toLocaleString('en-IN')} – ₹{cat.highestPriceINR.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Supplier offers list */}
                  <div className="divide-y divide-slate-100">
                    {cat.offers.map((offer, oIdx) => {
                      const isBest = offer.isRecommended;
                      return (
                        <div
                          key={offer.record.id}
                          className={`p-4 transition-colors ${
                            isBest ? 'bg-indigo-50/20' : 'hover:bg-slate-50/50'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-xs text-slate-900">
                                  {offer.record.supplierName}
                                </span>
                                {isBest && (
                                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                                    ★ Rank #1 Best Value
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-2">
                                <span>{offer.record.mealPlan.replace('_', ' ')}</span>
                                <span aria-hidden="true">·</span>
                                <span
                                  className={
                                    offer.record.cancellationPolicy === 'FREE_CANCELLATION'
                                      ? 'text-emerald-700 font-medium'
                                      : 'text-slate-600'
                                  }
                                >
                                  {offer.record.cancellationPolicy.replace('_', ' ')}
                                </span>
                                <span aria-hidden="true">·</span>
                                <span>SLA: {Math.round(offer.record.supplierReliability * 100)}%</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 sm:text-right shrink-0">
                              <div>
                                <div className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                                  ₹{offer.record.priceINR.toLocaleString('en-IN')}
                                </div>
                                <div className="text-[10px] text-slate-500">
                                  True Value: <span className="font-bold text-slate-800">{offer.trueValueScore}/100</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
            No profile selected
          </div>
        )}
      </div>
    </div>
  );
};
