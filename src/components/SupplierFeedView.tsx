import React, { useState } from 'react';
import {
  Search,
  Filter,
  Upload,
  Eye,
  FileCode,
  MapPin,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { SupplierRecord, SupplierId } from '../types';

interface SupplierFeedViewProps {
  records: SupplierRecord[];
  onAddRecords?: (newRecords: SupplierRecord[]) => void;
  onResetData: () => void;
}

export const SupplierFeedView: React.FC<SupplierFeedViewProps> = ({
  records,
  onResetData,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('ALL');
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  const [selectedRecord, setSelectedRecord] = useState<SupplierRecord | null>(null);
  const [showJsonModal, setShowJsonModal] = useState(false);

  // Filter listings
  const filteredRecords = records.filter(r => {
    const matchesSearch =
      r.hotelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.roomName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSupplier =
      selectedSupplier === 'ALL' || r.supplierId === selectedSupplier;

    const matchesCity = selectedCity === 'ALL' || r.city.toLowerCase() === selectedCity.toLowerCase();

    return matchesSearch && matchesSupplier && matchesCity;
  });

  const uniqueCities = Array.from(new Set(records.map(r => r.city))).sort();
  const suppliers: { id: string; label: string }[] = [
    { id: 'ALL', label: 'All Suppliers' },
    { id: 'TBO_Global', label: 'TBO Global Feeds' },
    { id: 'Agoda_Partner', label: 'Agoda Direct Connect' },
    { id: 'Hotelbeds_Feed', label: 'Hotelbeds APItude' },
    { id: 'Expedia_Affiliate', label: 'Expedia Partner Solutions' },
    { id: 'Direct_Connect', label: 'Direct CRS Connect' },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Raw Supplier Ingestion Feed
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Standardized internal representation of disparate supplier hotel and room payloads.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onResetData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Dataset</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by hotel, city, or room..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Supplier Filter */}
          <div>
            <select
              value={selectedSupplier}
              onChange={e => setSelectedSupplier(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {suppliers.map(s => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* City Filter */}
          <div>
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="ALL">All Cities ({records.length} records)</option>
              {uniqueCities.map(city => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div>
            Showing <span className="font-semibold text-slate-900 font-mono tabular-nums">{filteredRecords.length}</span> of{' '}
            <span className="font-semibold text-slate-900 font-mono tabular-nums">{records.length}</span> supplier records
          </div>
          <div className="flex items-center gap-3">
            <span>5 Normalized Feeds</span>
            <span aria-hidden="true">·</span>
            <span>Ground-Truth Tagged</span>
          </div>
        </div>
      </div>

      {/* High-Density Data Grid */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Supplier Feed</th>
                <th className="py-3 px-4">Hotel Name & Locality</th>
                <th className="py-3 px-4">Room Description</th>
                <th className="py-3 px-4">Bed & View</th>
                <th className="py-3 px-4">Rate & Policy</th>
                <th className="py-3 px-4 text-right">Price (INR)</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.slice(0, 40).map(record => {
                const isNoGps = record.lat === null || record.lng === null;
                return (
                  <tr
                    key={record.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Supplier */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">
                        {record.supplierName}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span>Reliability:</span>
                        <span className="font-mono tabular-nums font-medium text-slate-700">
                          {Math.round(record.supplierReliability * 100)}%
                        </span>
                      </div>
                    </td>

                    {/* Hotel & Location */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-semibold text-slate-900 truncate">
                        {record.hotelName}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{record.address}, {record.city}</span>
                      </div>
                      {isNoGps && (
                        <div className="text-[10px] text-amber-700 font-medium mt-0.5">
                          GPS: Coordinates Missing (Fallback Active)
                        </div>
                      )}
                    </td>

                    {/* Room */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-medium text-slate-800 truncate">
                        {record.roomName}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {record.roomDescription}
                      </div>
                    </td>

                    {/* Bed & View */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-slate-900 font-medium">
                        {record.numberOfBeds}x {record.bedType}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {record.view.replace('_', ' ')}
                      </div>
                    </td>

                    {/* Rate & Policy */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-slate-900 font-medium">
                        {record.mealPlan.replace('_', ' ')}
                      </div>
                      <div className={`text-[11px] mt-0.5 font-medium ${
                        record.cancellationPolicy === 'FREE_CANCELLATION'
                          ? 'text-emerald-700'
                          : record.cancellationPolicy === 'NON_REFUNDABLE'
                          ? 'text-rose-700'
                          : 'text-amber-700'
                      }`}>
                        {record.cancellationPolicy.replace('_', ' ')}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                        ₹{record.priceINR.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {record.paymentType.replace('_', ' ')}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedRecord(record);
                          setShowJsonModal(true);
                        }}
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                        title="Inspect Record Payload"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredRecords.length > 40 && (
          <div className="p-3 text-center text-xs text-slate-500 border-t border-slate-100 bg-slate-50/50">
            Showing first 40 records for performance. Refine filters to pinpoint specific supplier items.
          </div>
        )}
      </div>

      {/* Payload Modal */}
      {showJsonModal && selectedRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Supplier Payload Inspection
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedRecord.id} · {selectedRecord.supplierName}
                </p>
              </div>
              <button
                onClick={() => setShowJsonModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <pre className="text-xs font-mono bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto leading-relaxed">
                {JSON.stringify(selectedRecord, null, 2)}
              </pre>
            </div>
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowJsonModal(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
