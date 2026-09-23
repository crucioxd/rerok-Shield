import React from 'react';
import { RecommendationAssistant } from '../components/RecommendationAssistant';
import { Sparkles, HelpCircle, ShieldAlert, Cpu } from 'lucide-react';

export const ShieldAIPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-800/50 text-blue-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Rule-Assisted Intelligence</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Smart Protection Advisory
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-400">
          Not sure whether you need 28° privacy glass, a matte gaming texture, or camera lens armor? Shield AI pairs your mobile model with tailored protection.
        </p>
      </div>

      <RecommendationAssistant />

      {/* Viva Explanation / Technical Note Card */}
      <div className="p-6 rounded-2xl bg-[#0D1321] border border-blue-900/30 max-w-4xl mx-auto space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
          <Cpu className="w-4 h-4" />
          <span>Project Architecture Note · AI-Assisted Recommendation</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The recommendation subsystem evaluates device model compatibility matrices, price thresholds, user-defined usage constraints (Privacy, Heavy Duty, Gaming, Camera Armor), customer ratings, and inventory availability to generate weighted multi-factor match scores and dynamic rationale explanations.
        </p>
      </div>
    </div>
  );
};
