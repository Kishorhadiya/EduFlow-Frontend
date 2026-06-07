export const DashboardSkeleton = () => (
    <div className="animate-pulse space-y-8 w-full">
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-[2.5rem]"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-[2rem]"></div>
            <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-[2rem]"></div>
            <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-[2rem]"></div>
        </div>
    </div>
);

export const CardSkeleton = () => (
    <div className="animate-pulse bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-4">
        <div className="flex justify-between">
            <div className="h-6 w-20 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
            <div className="h-10 w-10 bg-slate-50 dark:bg-slate-800/50 rounded-xl"></div>
        </div>
        <div className="h-8 w-3/4 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
        <div className="h-4 w-full bg-slate-50 dark:bg-slate-800/50 rounded-lg"></div>
        <div className="h-4 w-5/6 bg-slate-50 dark:bg-slate-800/50 rounded-lg"></div>
        <div className="pt-6 border-t border-slate-50 dark:border-slate-800 h-12 w-full bg-slate-50 dark:bg-slate-800/50 rounded-2xl"></div>
    </div>
);
