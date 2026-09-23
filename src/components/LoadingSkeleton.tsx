import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-[#111827] border border-slate-800/80 rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-[4/3] w-full bg-slate-800/60" />
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <div className="h-3 w-12 bg-slate-800 rounded" />
          <div className="h-3 w-20 bg-slate-800 rounded" />
        </div>
        <div className="h-4 w-4/5 bg-slate-800 rounded" />
        <div className="h-3 w-3/5 bg-slate-800 rounded" />
        <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
          <div className="h-5 w-16 bg-slate-800 rounded" />
          <div className="h-7 w-20 bg-slate-800 rounded" />
        </div>
      </div>
    </div>
  );
};

export const TableRowSkeleton: React.FC<{ cols?: number }> = ({ cols = 5 }) => {
  return (
    <tr className="border-b border-slate-800 animate-pulse">
      {Array.from({ length: cols }).map((_, idx) => (
        <td key={idx} className="p-4">
          <div className="h-4 bg-slate-800 rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
};

export const DashboardCardSkeleton: React.FC = () => {
  return (
    <div className="p-5 rounded-xl bg-[#111827] border border-slate-800 animate-pulse space-y-3">
      <div className="h-3 w-24 bg-slate-800 rounded" />
      <div className="h-7 w-32 bg-slate-800 rounded" />
      <div className="h-3 w-20 bg-slate-800 rounded" />
    </div>
  );
};
