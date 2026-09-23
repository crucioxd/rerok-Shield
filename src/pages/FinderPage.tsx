import React from 'react';
import { CompatibilityFinder } from '../components/CompatibilityFinder';
import { Shield, Smartphone, Layers, CheckCircle2 } from 'lucide-react';

export const FinderPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Finder Component */}
      <CompatibilityFinder />

      {/* Guide / Educational Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-800">
        <div className="p-6 rounded-xl bg-[#0D1321] border border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
            <Smartphone className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Full Screen Edge-to-Edge</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Laser-mapped curvature covers every millimeter of curved edges on flagships without lifting when using rugged cases.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-[#0D1321] border border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Zero Sensor Obstruction</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Precision micro-punch cutouts ensure in-display ultrasonic fingerprint scanners, Face ID dot projectors, and proximity sensors operate seamlessly.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-[#0D1321] border border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Bubble-Free Installation</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Self-absorbing static AB glue expels air bubbles instantly during application with zero residue upon removal.
          </p>
        </div>
      </div>
    </div>
  );
};
