import { useState } from 'react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts';

const PerformanceChart = ({ marksProgressData, submissionHistoryData, performanceAnalyticsData, completionRateData, theme }) => {
    const [chartTab, setChartTab] = useState('progress'); // progress, history, performance, completion

    const isDark = theme === 'dark';

    const getTooltipStyle = () => ({
        backgroundColor: isDark ? '#0f172a' : '#fff',
        borderColor: isDark ? '#1e293b' : '#e2e8f0',
        color: isDark ? '#f8fafc' : '#1e293b',
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: '600'
    });

    const getAxisStyle = () => ({
        fontSize: 9,
        fontWeight: 'bold',
        fill: isDark ? '#64748b' : '#94a3b8'
    });

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800/80 shadow-sm flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Academic Performance Dashboard</h4>
                
                {/* Tabs selector */}
                <div className="flex flex-wrap gap-1 bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-100 dark:border-slate-850">
                    {[
                        { id: 'progress', label: 'Marks Curve' },
                        { id: 'history', label: 'History' },
                        { id: 'performance', label: 'Analytics' },
                        { id: 'completion', label: 'Completion' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setChartTab(tab.id)}
                            className={`flex-1 min-w-[70px] py-2 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                                chartTab === tab.id 
                                ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-sm' 
                                : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Recharts Wrapper */}
            <div className="h-48 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    {chartTab === 'progress' ? (
                        <AreaChart data={marksProgressData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                            <defs>
                                <linearGradient id="scoreGlow" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                            <XAxis dataKey="name" stroke={isDark ? '#64748b' : '#94a3b8'} style={getAxisStyle()} />
                            <YAxis stroke={isDark ? '#64748b' : '#94a3b8'} style={getAxisStyle()} domain={[0, 100]} />
                            <Tooltip contentStyle={getTooltipStyle()} />
                            <Area type="monotone" dataKey="score" name="Marks score" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#scoreGlow)" />
                        </AreaChart>
                    ) : chartTab === 'history' ? (
                        <BarChart data={submissionHistoryData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                            <XAxis dataKey="name" stroke={isDark ? '#64748b' : '#94a3b8'} style={getAxisStyle()} />
                            <YAxis stroke={isDark ? '#64748b' : '#94a3b8'} style={getAxisStyle()} />
                            <Tooltip contentStyle={getTooltipStyle()} />
                            <Legend wrapperStyle={{ fontSize: 8, fontWeight: 'bold' }} />
                            <Bar dataKey="submitted" name="Submitted" fill="#10b981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    ) : chartTab === 'performance' ? (
                        <BarChart data={performanceAnalyticsData} layout="vertical" margin={{ top: 5, right: 5, left: 15, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                            <XAxis type="number" domain={[0, 100]} stroke={isDark ? '#64748b' : '#94a3b8'} style={getAxisStyle()} />
                            <YAxis type="category" dataKey="subject" stroke={isDark ? '#64748b' : '#94a3b8'} style={getAxisStyle()} width={80} />
                            <Tooltip contentStyle={getTooltipStyle()} />
                            <Bar dataKey="value" name="Score" fill="#a855f7" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    ) : (
                        <div className="h-full w-full relative flex items-center justify-center">
                            <PieChart>
                                <Pie
                                    data={completionRateData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={45}
                                    outerRadius={60}
                                    paddingAngle={4}
                                    dataKey="value"
                                >
                                    {completionRateData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={getTooltipStyle()} />
                            </PieChart>
                            {/* Centered Overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-2xl font-black text-slate-805 dark:text-white leading-none">
                                    {completionRateData[0]?.value ? Math.round((completionRateData[0].value / (completionRateData[0].value + completionRateData[1].value)) * 100) : 0}%
                                </span>
                                <span className="text-[7px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Completion</span>
                            </div>
                        </div>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PerformanceChart;
