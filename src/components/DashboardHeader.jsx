import { Trophy, BookOpen, UserCircle2 } from 'lucide-react';

const DashboardHeader = ({ user, stats }) => {
    return (
        <div className="relative mb-10 rounded-[2.5rem] overflow-hidden bg-slate-900 dark:bg-slate-900/60 shadow-xl border border-slate-850 dark:border-slate-800/40">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-650/30 via-transparent to-transparent"></div>
            <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
                
                {/* Welcome section with Avatar */}
                <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
                    <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-950/50 rounded-2xl flex items-center justify-center font-black text-3xl text-indigo-600 border-2 border-white dark:border-slate-800 shadow-md overflow-hidden shrink-0">
                        {user.profilePicture ? (
                            <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            user.name ? user.name.charAt(0) : <UserCircle2 className="w-10 h-10" />
                        )}
                    </div>
                    <div>
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/10 text-indigo-300 text-[10px] font-black uppercase tracking-widest mb-3">
                            Academic Portfolio
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-white leading-none tracking-tight">
                            Welcome back, <span className="text-indigo-400">{user.name}</span>
                        </h1>
                        <p className="text-slate-400 text-xs sm:text-sm font-semibold mt-2 block uppercase tracking-wider">
                            Today is {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                        </p>
                    </div>
                </div>

                {/* Overviews stats inside Header */}
                <div className="flex gap-4 shrink-0">
                    <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 text-center min-w-[110px]">
                        <Trophy className="w-5 h-5 text-amber-400 mx-auto mb-2 animate-bounce" />
                        <div className="text-xl font-black text-white">{stats.avgMarks}%</div>
                        <div className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">Average Score</div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 text-center min-w-[110px]">
                        <BookOpen className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
                        <div className="text-xl font-black text-white">{stats.total}</div>
                        <div className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">Active Units</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;
