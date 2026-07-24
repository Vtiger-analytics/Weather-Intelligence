import React from 'react';
import { 
  Shirt, 
  Umbrella, 
  Footprints, 
  Sparkles, 
  AlertTriangle, 
  Activity, 
  Bike, 
  Utensils, 
  Moon, 
  Camera, 
  Sprout, 
  Sun, 
  Compass, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  ShieldCheck,
  Glasses,
  Wind
} from 'lucide-react';
import { FullWeatherData, PlanningSummary, ActivityRating } from '../types';
import { generatePlanningSummary } from '../utils/planningEngine';

interface PlanningRecommendationsSectionProps {
  data: FullWeatherData;
}

export const PlanningRecommendationsSection: React.FC<PlanningRecommendationsSectionProps> = ({ data }) => {
  const summary: PlanningSummary = generatePlanningSummary(data);

  // Helper icon selector for activity
  const renderActivityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity': return <Activity className="w-5 h-5 text-sky-400" />;
      case 'Bike': return <Bike className="w-5 h-5 text-teal-400" />;
      case 'Utensils': return <Utensils className="w-5 h-5 text-amber-400" />;
      case 'Moon': return <Moon className="w-5 h-5 text-indigo-400" />;
      case 'Camera': return <Camera className="w-5 h-5 text-purple-400" />;
      case 'Sprout': return <Sprout className="w-5 h-5 text-emerald-400" />;
      case 'Sun': return <Sun className="w-5 h-5 text-amber-400" />;
      case 'Compass': return <Compass className="w-5 h-5 text-blue-400" />;
      default: return <Sparkles className="w-5 h-5 text-sky-400" />;
    }
  };

  // Helper icon for clothing
  const renderClothingIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shirt': return <Shirt className="w-5 h-5 text-sky-400" />;
      case 'Umbrella': return <Umbrella className="w-5 h-5 text-blue-400" />;
      case 'Footprints': return <Footprints className="w-5 h-5 text-emerald-400" />;
      case 'Glasses': return <Glasses className="w-5 h-5 text-amber-400" />;
      case 'Wind': return <Wind className="w-5 h-5 text-teal-400" />;
      default: return <Sparkles className="w-5 h-5 text-amber-400" />;
    }
  };

  // Status color helper
  const getStatusBadge = (status: ActivityRating['status']) => {
    switch (status) {
      case 'Ideal':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Good':
        return 'bg-sky-500/15 text-sky-400 border-sky-500/30';
      case 'Fair':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Poor':
        return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
      case 'Avoid':
      default:
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Travel & Commute Advisory Warning Banner if present */}
      {summary.commuteWarning && (
        <div className={`p-5 rounded-3xl border ${
          summary.commuteWarning.severity === 'alert'
            ? 'bg-rose-950/40 border-rose-700/80 text-rose-200'
            : summary.commuteWarning.severity === 'warning'
            ? 'bg-amber-950/40 border-amber-700/80 text-amber-200'
            : 'bg-sky-950/40 border-sky-700/80 text-sky-200'
        } backdrop-blur-xl flex items-start gap-4 shadow-xl`}>
          <AlertTriangle className={`w-6 h-6 flex-shrink-0 mt-0.5 ${
            summary.commuteWarning.severity === 'alert' ? 'text-rose-400 animate-bounce' : 'text-amber-400'
          }`} />
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider">{summary.commuteWarning.title}</h4>
            <p className="text-xs mt-1 leading-relaxed">{summary.commuteWarning.message}</p>
          </div>
        </div>
      )}

      {/* 2. Clothing & Outerwear Layering Recommendations */}
      <div className="p-6 lg:p-7 rounded-3xl border border-slate-800/80 bg-slate-900/80 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800/80">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Shirt className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Clothing & Gear Concierge</h3>
            <p className="text-xs text-slate-400">Layering and attire guidance based on current temperature, wind, and rain</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {summary.clothing.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 flex items-start gap-3.5 hover:bg-slate-800/40 transition">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex-shrink-0">
                {renderClothingIcon(item.iconName)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">{item.title}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Activity Suitability Matrix */}
      <div className="p-6 lg:p-7 rounded-3xl border border-slate-800/80 bg-slate-900/80 backdrop-blur-xl shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Outdoor Activity Suitability Index</h3>
              <p className="text-xs text-slate-400">Weather compatibility scores (0-100%) for sport, leisure, and outdoor activities</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {summary.activities.map((act) => (
            <div key={act.id} className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 flex flex-col justify-between hover:border-slate-700/80 transition group">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 group-hover:scale-105 transition-transform">
                      {renderActivityIcon(act.icon)}
                    </div>
                    <span className="text-sm font-bold text-slate-100">{act.name}</span>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${getStatusBadge(act.status)}`}>
                    {act.status}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                  {act.reason}
                </p>
              </div>

              {/* Progress Bar & Score */}
              <div className="mt-4 pt-3 border-t border-slate-800/60">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-slate-400 text-[11px]">Compatibility</span>
                  <span className="font-extrabold text-slate-200">{act.score}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      act.score >= 80 ? 'bg-emerald-400' : act.score >= 50 ? 'bg-sky-400' : act.score >= 30 ? 'bg-amber-400' : 'bg-rose-500'
                    }`}
                    style={{ width: `${act.score}%` }}
                  />
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* 4. Best Time Windows Today */}
      {summary.bestWindows.length > 0 && (
        <div className="p-6 lg:p-7 rounded-3xl border border-slate-800/80 bg-slate-900/80 backdrop-blur-xl shadow-xl space-y-3">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800/80">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-100">Optimal Time Window Today</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {summary.bestWindows.map((win, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/80 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-200">{win.activity}: <span className="text-sky-400">{win.timeRange}</span></div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{win.condition}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
