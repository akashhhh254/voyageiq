import React, { useState } from 'react';
import {
  GitMerge,
  AlertOctagon,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Bed,
  Eye,
  Coffee,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { SupplierRecord } from '../types';
import { extractRoomAttributes, compareRoomTypes } from '../engine/roomMapping';

interface RoomMappingViewProps {
  records: SupplierRecord[];
}

export const RoomMappingView: React.FC<RoomMappingViewProps> = ({ records }) => {
  // Preset room pairs demonstrating critical travel domain logic
  const presetRoomPairs = [
    {
      title: 'Same Room, Different Commercial Terms',
      desc: 'Deluxe King Sea View with Breakfast vs Superior Double Ocean Facing (Room-Only)',
      idA: 'TBO-TLE-01',
      idB: 'AGD-TLE-02',
    },
    {
      title: 'Hard Incompatibility: King Bed vs Twin Beds',
      desc: 'King Bed Sea View vs Luxury Twin Bed City View (Under Taj Lands End)',
      idA: 'TBO-TLE-01',
      idB: 'EXP-TLE-04',
    },
    {
      title: 'Equivalent Luxury Suite Matching',
      desc: 'Burj Al Arab Deluxe 1-Bedroom Suite (TBO) vs 1 Bedroom Suite (Expedia)',
      idA: 'TBO-BAA-01',
      idB: 'EXP-BAA-02',
    },
    {
      title: 'View Incompatibility: Lake vs Garden',
      desc: 'Udaivilas Premier Pool View vs Taj Lake Palace Garden View',
      idA: 'TBO-OUV-01',
      idB: 'TBO-TLP-01',
    },
  ];

  const [selectedIdA, setSelectedIdA] = useState<string>('TBO-TLE-01');
  const [selectedIdB, setSelectedIdB] = useState<string>('AGD-TLE-02');

  const recordA = records.find(r => r.id === selectedIdA) || records[0];
  const recordB = records.find(r => r.id === selectedIdB) || records[1];

  const comparison = compareRoomTypes(recordA, recordB);
  const attrsA = extractRoomAttributes(recordA);
  const attrsB = extractRoomAttributes(recordB);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Room Type Mapping Studio
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Normalizes inconsistent room nomenclature into structured physical attributes and enforces business rules against false inventory merges.
        </p>
      </div>

      {/* Preset Test Buttons */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2.5">
          Room Compatibility Scenarios
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {presetRoomPairs.map((p, idx) => {
            const isActive = selectedIdA === p.idA && selectedIdB === p.idB;
            return (
              <button
                key={idx}
                onClick={() => {
                  setSelectedIdA(p.idA);
                  setSelectedIdB(p.idB);
                }}
                className={`text-left p-2.5 rounded-lg border transition-all text-xs cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950 font-medium'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-semibold">{p.title}</div>
                <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{p.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Room Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Room A */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Supplier Room Listing A
            </span>
            <span className="text-xs font-mono text-slate-500">{recordA.supplierName}</span>
          </div>

          <select
            value={selectedIdA}
            onChange={e => setSelectedIdA(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {records.slice(0, 40).map(r => (
              <option key={r.id} value={r.id}>
                {r.hotelName} — {r.roomName} (₹{r.priceINR.toLocaleString('en-IN')})
              </option>
            ))}
          </select>

          <div className="p-3.5 bg-slate-50 rounded-lg space-y-2 text-xs">
            <div className="text-sm font-bold text-slate-900">{recordA.roomName}</div>
            <div className="text-slate-600 text-[11px] leading-relaxed">
              &ldquo;{recordA.roomDescription}&rdquo;
            </div>

            {/* Extracted attributes */}
            <div className="pt-2 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500">Bed:</span>{' '}
                <span className="font-semibold text-slate-900">
                  {attrsA.numberOfBeds}x {attrsA.bedType}
                </span>
              </div>
              <div>
                <span className="text-slate-500">View:</span>{' '}
                <span className="font-semibold text-slate-900">
                  {attrsA.view.replace('_', ' ')}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Meal:</span>{' '}
                <span className="font-semibold text-slate-900">
                  {attrsA.mealPlan.replace('_', ' ')}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Policy:</span>{' '}
                <span className="font-semibold text-slate-900">
                  {attrsA.cancellation.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Room B */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Supplier Room Listing B
            </span>
            <span className="text-xs font-mono text-slate-500">{recordB.supplierName}</span>
          </div>

          <select
            value={selectedIdB}
            onChange={e => setSelectedIdB(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {records.slice(0, 40).map(r => (
              <option key={r.id} value={r.id}>
                {r.hotelName} — {r.roomName} (₹{r.priceINR.toLocaleString('en-IN')})
              </option>
            ))}
          </select>

          <div className="p-3.5 bg-slate-50 rounded-lg space-y-2 text-xs">
            <div className="text-sm font-bold text-slate-900">{recordB.roomName}</div>
            <div className="text-slate-600 text-[11px] leading-relaxed">
              &ldquo;{recordB.roomDescription}&rdquo;
            </div>

            {/* Extracted attributes */}
            <div className="pt-2 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500">Bed:</span>{' '}
                <span className="font-semibold text-slate-900">
                  {attrsB.numberOfBeds}x {attrsB.bedType}
                </span>
              </div>
              <div>
                <span className="text-slate-500">View:</span>{' '}
                <span className="font-semibold text-slate-900">
                  {attrsB.view.replace('_', ' ')}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Meal:</span>{' '}
                <span className="font-semibold text-slate-900">
                  {attrsB.mealPlan.replace('_', ' ')}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Policy:</span>{' '}
                <span className="font-semibold text-slate-900">
                  {attrsB.cancellation.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Room Decision Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Room Equivalence Decision
            </div>
            <div className="flex items-center gap-3 mt-1.5">
              <span
                className={`text-lg font-bold tracking-tight ${
                  comparison.decision === 'EQUIVALENT'
                    ? 'text-emerald-700'
                    : comparison.decision === 'COMPATIBLE_UPGRADE'
                    ? 'text-amber-700'
                    : 'text-rose-700'
                }`}
              >
                {comparison.decision === 'EQUIVALENT' && (comparison.isSameRoomDifferentRate ? 'Same Room, Differing Rate Plan' : 'Exact Room Match')}
                {comparison.decision === 'COMPATIBLE_UPGRADE' && 'Compatible Category (Feature Difference)'}
                {comparison.decision === 'INCOMPATIBLE' && 'Incompatible Room Inventory (Keep Separate)'}
              </span>
              <span className="text-sm font-mono font-bold text-slate-700 tabular-nums">
                {comparison.confidence}% Match
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-500">Price Differential</div>
            <div className="text-sm font-bold text-slate-900 font-mono tabular-nums">
              ₹{Math.abs(recordA.priceINR - recordB.priceINR).toLocaleString('en-IN')}{' '}
              <span className="text-xs text-slate-500 font-normal">
                ({recordA.priceINR < recordB.priceINR ? `${recordA.supplierName} cheaper` : `${recordB.supplierName} cheaper`})
              </span>
            </div>
          </div>
        </div>

        {/* Explainability paragraph */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-2">
          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Domain Mapping Analysis
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            {comparison.explanation}
          </p>

          <div className="pt-2 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <div className="font-semibold text-emerald-800 mb-1">Matching Attributes:</div>
              {comparison.matchingAttributes.length > 0 ? (
                <ul className="space-y-0.5 text-[11px] text-slate-600">
                  {comparison.matchingAttributes.map((m, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-[11px] text-slate-400">None</span>
              )}
            </div>

            <div>
              <div className="font-semibold text-rose-800 mb-1">Differing Attributes:</div>
              {comparison.differingAttributes.length > 0 ? (
                <ul className="space-y-0.5 text-[11px] text-slate-600">
                  {comparison.differingAttributes.map((d, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-[11px] text-slate-400">None (Fully identical inventory)</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
