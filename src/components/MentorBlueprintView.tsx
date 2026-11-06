import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Users,
  Calendar,
  Layers,
  Database,
  ShieldAlert,
  Sparkles,
  Award,
  ChevronDown,
  ChevronRight,
  Code,
  FileText,
} from 'lucide-react';

export const MentorBlueprintView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('A');

  const sections = [
    { id: 'A', title: 'A. Problem Statement Breakdown & Economics' },
    { id: 'B', title: 'B. Functional Requirements & I/O Contract' },
    { id: 'C', title: 'C. Features to Build vs Features to Exclude' },
    { id: 'D', title: 'D. Recommended MVP Scope (VoyageHack 4.0)' },
    { id: 'E', title: 'E. Architecture & Technology Stack' },
    { id: 'F', title: 'F. Relational & Schema Design' },
    { id: 'G', title: 'G. Hackathon Development Timeline' },
    { id: 'H', title: 'H. 4-Member Team Task Allocation' },
    { id: 'I', title: 'I. Technical Risks & Failsafe Solutions' },
    { id: 'J', title: 'J. Innovation, Differentiation & Pitch Script' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
          <span>Senior Mentor Blueprint</span>
          <span aria-hidden="true">·</span>
          <span>VoyageHack 4.0 Strategy</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Master Project Blueprint & Hackathon Guide
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Complete engineering, architectural, team, and presentation strategy tailored for beginners to compete for top hackathon honors.
        </p>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeSection === s.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {s.title.split('.')[0]}. {s.title.split('.')[1]?.split('&')[0]?.trim()}
          </button>
        ))}
      </div>

      {/* Blueprint Content Panel */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs text-xs text-slate-700 leading-relaxed space-y-6">
        {/* Section A */}
        {activeSection === 'A' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Section A: Problem Statement Breakdown & Travel Tech Economics
            </h3>
            <p>
              In modern travel ecosystems (such as TBO Holidays, Expedia, Agoda, and Hotelbeds), hotel supply is aggregated from dozens of wholesalers, bed banks, global distribution systems (GDS), and direct hotel central reservation systems (CRS).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900">The Supplier Disparity Reality</div>
                <ul className="space-y-1.5 text-slate-600">
                  <li>• <strong>Inconsistent Naming:</strong> &ldquo;Taj Lands End&rdquo; vs &ldquo;The Taj Lands End Mumbai&rdquo; vs &ldquo;Taj Landsend Hotel&rdquo;.</li>
                  <li>• <strong>Conflicting Coordinates:</strong> One supplier provides pin-point GPS; another provides city-center centroid or null coordinates.</li>
                  <li>• <strong>Different Room Vocabularies:</strong> &ldquo;Deluxe King Sea View&rdquo; vs &ldquo;Superior Double Ocean Facing&rdquo;.</li>
                </ul>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900">The Business Stakes & Traveler Friction</div>
                <ul className="space-y-1.5 text-slate-600">
                  <li>• <strong>Catalog Clutter:</strong> Showing 4 cards for the same hotel degrades conversion rates by 18-24%.</li>
                  <li>• <strong>Catastrophic False Positive Risk:</strong> Merging &ldquo;Taj Lands End&rdquo; (Bandra) with &ldquo;Taj Mahal Palace&rdquo; (Colaba, 24km away) strands guests in the wrong hotel!</li>
                  <li>• <strong>Missed Arbitrage:</strong> Failing to match identical rooms prevents travelers from securing the best price.</li>
                </ul>
              </div>
            </div>
            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-950 font-medium">
              💡 <strong>Hackathon Takeaway for Judges:</strong> Our mission is not &ldquo;fuzzy string matching&rdquo;. It is <em>protecting booking integrity</em> by enforcing geographic bounds while identifying price arbitrage across comparable inventory.
            </div>
          </div>
        )}

        {/* Section B */}
        {activeSection === 'B' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Section B: Functional Requirements & Input/Output Contracts
            </h3>
            <div className="space-y-3">
              <div className="font-bold text-slate-900 text-sm">System Inputs:</div>
              <p>Raw supplier records containing hotel metadata (name, address, city, country, lat/lng, phone, star rating) and room metadata (room name, description, price, currency, availability, cancellation policy, meal plan, bed type, view, inclusions, supplier reliability).</p>

              <div className="font-bold text-slate-900 text-sm pt-2">System Processing Stages:</div>
              <ol className="list-decimal list-inside space-y-1 pl-2 text-slate-600">
                <li><strong>Ingestion & Sanitation:</strong> Expand abbreviations, clean phone digits, normalize address tokens.</li>
                <li><strong>Pairwise Multi-Signal Evaluation:</strong> Calculate Token Sort, Haversine distance, telephone match.</li>
                <li><strong>Hard Veto Enforcement:</strong> Reject if geographic distance &gt; 2.0km or cities conflict.</li>
                <li><strong>Room Attribute Disentanglement:</strong> Separate physical room (King bed, sea view) from rate plan (Breakfast, free cancellation).</li>
                <li><strong>True Value Scoring:</strong> Apply weighted formula (40% Price, 20% Cancellation, 20% Reliability, 10% Meal, 10% Payment).</li>
                <li><strong>Canonical Consolidation:</strong> Construct single master hotel profile with linked supplier rates.</li>
              </ol>

              <div className="font-bold text-slate-900 text-sm pt-2">System Outputs:</div>
              <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
                <li>Deduplication decision (CONFIRMED_MATCH / POSSIBLE_MATCH / DIFFERENT_PROPERTY) + confidence %.</li>
                <li>Explainable decision audit trail with signal breakdown.</li>
                <li>Ranked offers with transparent trade-offs.</li>
                <li>Real-time precision, recall, and savings analytics.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Section C */}
        {activeSection === 'C' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Section C: Features to Build vs Features to Exclude
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-lg space-y-2">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Must Build (Competitive Core)</span>
                </div>
                <ul className="space-y-1 text-slate-700">
                  <li>✓ Multi-signal deterministic hotel deduplication (Token Sort + Geo + Phone).</li>
                  <li>✓ Hard Veto engine (prevent deceptive brand merges).</li>
                  <li>✓ Structured room attribute extraction (Bed, View, Meal, Refund).</li>
                  <li>✓ True Value scoring with configurable weights.</li>
                  <li>✓ Natural language explainability audit logs.</li>
                  <li>✓ Ground-truth benchmark with confusion matrix & savings.</li>
                  <li>✓ Sightseeing mini-extension (cross-vertical proof).</li>
                </ul>
              </div>

              <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-lg space-y-2">
                <div className="font-bold text-rose-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Exclude (Avoid Hackathon Traps)</span>
                </div>
                <ul className="space-y-1 text-slate-700">
                  <li>✕ <strong>Black-box Neural Networks:</strong> Hard to explain, unpredictable false positive merges, slow to train.</li>
                  <li>✕ <strong>Full Booking Gateway / Stripe Checkout:</strong> Out of scope for optimization problem.</li>
                  <li>✕ <strong>Generic AI Chatbots:</strong> Unrelated distraction from core data engine.</li>
                  <li>✕ <strong>Complex Vector Databases (Pinecone/Milvus):</strong> Adds latency and hosting overhead without precision gain over Token Sort + Geo.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Section D */}
        {activeSection === 'D' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Section D: Recommended MVP Scope for VoyageHack 4.0
            </h3>
            <div className="space-y-3">
              <p>For a competitive hackathon presentation, the MVP must be <strong>100% functional, interactive, and grounded in measurable metrics</strong>:</p>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="font-bold text-slate-900">Key Deliverables to Demonstrate:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
                  <div>• 200+ Realistic Multi-Supplier Records across 5 feeds.</div>
                  <div>• Interactive Pairwise Matcher with Live Confidence Bar.</div>
                  <div>• 6 Planted Stress-Test Edge Cases (Taj Bandra vs Colaba, etc.).</div>
                  <div>• Room Incompatibility Checker (King vs Twin, Sea vs City).</div>
                  <div>• Dynamic Weight Sliders updating True Value Ranks.</div>
                  <div>• Scientific Precision/Recall/F1 Confusion Matrix.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section E */}
        {activeSection === 'E' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Section E: Architecture & Technology Stack
            </h3>
            <div className="p-4 bg-slate-900 text-slate-100 rounded-lg font-mono text-[11px] leading-relaxed overflow-x-auto">
              [Raw Feeds: TBO / Agoda / Hotelbeds / Expedia / CRS]<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼<br/>
              [Module 1: Sanitation & Normalization (Tokenization, Phone Sanitizer)]<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼<br/>
              [Module 2: Multi-Signal Deduplication Engine (TokenSort + Haversine + Veto)]<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼<br/>
              [Module 3: Room Attribute Normalizer (Bed, View, Meal, Policy Extraction)]<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼<br/>
              [Module 4: Canonical Master Hotel Profile Synthesis]<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼<br/>
              [Module 5 & 6: True Value Scoring & Explainable Decision Trees]<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼<br/>
              [Interactive Executive Dashboard + Evaluation Benchmark Suite]
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <strong>Frontend:</strong> React 19, TypeScript, Tailwind CSS, Lucide icons, responsive layout.
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <strong>Algorithms:</strong> Token Sort Ratio, Levenshtein, Haversine geo distance, weighted scoring.
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <strong>Evaluation:</strong> Ground-truth verification, precision/recall/F1, confusion matrix.
              </div>
            </div>
          </div>
        )}

        {/* Section F */}
        {activeSection === 'F' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Section F: Relational & Document Schema Design
            </h3>
            <p>For production deployment in a PostgreSQL or SQLite relational database:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px] space-y-1">
                <div className="font-bold text-slate-900 font-sans">1. canonical_hotels</div>
                <div>id: UUID PRIMARY KEY</div>
                <div>master_name: VARCHAR(255)</div>
                <div>city: VARCHAR(100)</div>
                <div>country: VARCHAR(100)</div>
                <div>standardized_address: TEXT</div>
                <div>lat: DECIMAL(9,6)</div>
                <div>lng: DECIMAL(9,6)</div>
                <div>phone: VARCHAR(30)</div>
                <div>star_rating: INT</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px] space-y-1">
                <div className="font-bold text-slate-900 font-sans">2. supplier_listings</div>
                <div>id: VARCHAR(50) PRIMARY KEY</div>
                <div>canonical_hotel_id: UUID REFERENCES canonical_hotels</div>
                <div>supplier_id: VARCHAR(50)</div>
                <div>raw_hotel_name: VARCHAR(255)</div>
                <div>raw_address: TEXT</div>
                <div>supplier_reliability: DECIMAL(3,2)</div>
                <div>room_name: VARCHAR(255)</div>
                <div>price_inr: DECIMAL(10,2)</div>
                <div>cancellation_policy: VARCHAR(50)</div>
              </div>
            </div>
          </div>
        )}

        {/* Section G */}
        {activeSection === 'G' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Section G: Hackathon Development Timeline (Phases 1-10)
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-3">
                <span className="font-bold text-slate-900 shrink-0">Phase 1-2:</span>
                <div>Data model, 200+ synthetic records, and separate ground-truth labeling.</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-3">
                <span className="font-bold text-slate-900 shrink-0">Phase 3-4:</span>
                <div>Hotel Deduplication engine with Haversine geo distance and hard vetoes; room attribute extraction.</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-3">
                <span className="font-bold text-slate-900 shrink-0">Phase 5-6:</span>
                <div>True Value scoring with dynamic weight sliders; explainable trade-off generator.</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-3">
                <span className="font-bold text-slate-900 shrink-0">Phase 7-8:</span>
                <div>Enterprise dashboard integration; sightseeing cross-vertical demo.</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-3">
                <span className="font-bold text-slate-900 shrink-0">Phase 9-10:</span>
                <div>Benchmark evaluation, edge-case validation, pitch deck rehearsal & judge Q&A prep.</div>
              </div>
            </div>
          </div>
        )}

        {/* Section H */}
        {activeSection === 'H' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Section H: 4-Member Team Responsibility Allocation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900">Member 1 (Technical Lead & Architecture)</div>
                <p className="text-slate-600">Coordinates overall system integration, implements string distance & Haversine geo formulas, verifies hard veto logic, and conducts edge-case validation.</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900">Member 2 (Frontend Dashboard & UI Integration)</div>
                <p className="text-slate-600">Builds interactive pair tester, sliders, room comparison matrix, and ensures clean B2B responsive design without UI cliches.</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900">Member 3 (Data Engineering & Evaluation)</div>
                <p className="text-slate-600">Curates synthetic supplier dataset, maintains isolated ground-truth labels, runs precision/recall calculations, and stress-tests edge cases.</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900">Member 4 (Management & Product Strategy)</div>
                <p className="text-slate-600">Formulates True Value scoring formula, models supplier reliability SLAs, quantifies customer conversion ROI, and delivers the business pitch to judges.</p>
              </div>
            </div>
          </div>
        )}

        {/* Section I */}
        {activeSection === 'I' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Section I: Technical Risks & Failsafe Solutions
            </h3>
            <div className="space-y-3">
              <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-lg space-y-1">
                <div className="font-bold text-rose-900">Risk 1: Missing or Inaccurate GPS in Supplier Feeds</div>
                <div className="text-slate-700"><strong>Solution:</strong> Adaptive weighting fallback. If coordinates are null, the engine dynamically shifts weight to sanitized telephone matching and postal code tokens rather than failing or guessing.</div>
              </div>

              <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-lg space-y-1">
                <div className="font-bold text-rose-900">Risk 2: Deceptive Brand Overlap in Same Metropolitan Area</div>
                <div className="text-slate-700"><strong>Solution:</strong> Strict Haversine Hard Veto. Physical separation exceeding 2.0km triggers an immediate rejection veto regardless of 100% brand name match.</div>
              </div>

              <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-lg space-y-1">
                <div className="font-bold text-rose-900">Risk 3: Bed Configuration Mismatches Causing Guest Complaints</div>
                <div className="text-slate-700"><strong>Solution:</strong> Mandatory bed normalization. A King Bed and Twin Beds are categorized as INCOMPATIBLE and kept as distinct booking options.</div>
              </div>
            </div>
          </div>
        )}

        {/* Section J */}
        {activeSection === 'J' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Section J: Innovation, Differentiation & 3-Minute Hackathon Pitch Script
            </h3>
            <div className="p-5 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-3">
              <div className="font-bold text-indigo-900 text-sm">Winning Pitch Script (For Member 4 & Team):</div>
              <div className="space-y-2 text-slate-700 italic">
                <p>&ldquo;Good morning judges. Every travel platform faces a billion-dollar challenge: the same hotel is sold by 10 different suppliers with 10 different names, conflicting coordinates, and deceptive room titles.&rdquo;</p>
                <p>&ldquo;Most teams treat this as a simple string similarity puzzle. But in travel technology, a False Positive is disastrous. If you accidentally merge Taj Lands End in Bandra with Taj Mahal Palace in Colaba because both are &lsquo;Taj Hotels in Mumbai&rsquo;, your customer arrives at midnight 25 kilometers from where their reservation exists.&rdquo;</p>
                <p>&ldquo;That is why VoyageOptima is engineered with <strong>Triple-Signal Precision and Fail-Safe Vetos</strong>. We combine Token Sort ratios with exact Haversine geographic thresholds and sanitized telephone matching. As shown in our live benchmark, we achieve 100% Precision with zero false positive merges across 200+ supplier feeds.&rdquo;</p>
                <p>&ldquo;Furthermore, we don&rsquo;t stop at the hotel lobby. We normalize room configurations so a twin bed is never falsely merged into a king bed, and our True Value scoring engine looks beyond raw superficial discounting to evaluate cancellation safety and supplier fulfillment reliability.&rdquo;</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
