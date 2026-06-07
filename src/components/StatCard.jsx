import { TrendingUp, Clock } from 'lucide-react';

const StatCard = ({ label, value, icon: IconComponent, desc, positive = true, colorClass = 'text-indigo-650 dark:text-indigo-400', bgClass = 'bg-indigo-50 dark:bg-indigo-950/20' }) => {
    return (
        <div className="glass-card p-6 rounded-3xl transition-all hover:scale-105 duration-300 group flex flex-col justify-between h-full">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${bgClass} ${colorClass} group-hover:scale-110 transition-transform duration-300`}>
                        {IconComponent && <IconComponent className="w-5 h-5" />}
                    </div>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        positive 
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400'
                    }`}>
                        {positive ? <TrendingUp className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {positive ? 'Upward' : 'Active'}
                    </span>
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">{value}</div>
                <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-tight">{label}</h4>
            </div>
            {desc && <p className="text-[10px] text-slate-450 dark:text-slate-450 mt-2 font-semibold uppercase tracking-wider">{desc}</p>}
        </div>
    );
};

export default StatCard;
