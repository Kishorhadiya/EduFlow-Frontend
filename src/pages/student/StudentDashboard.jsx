import { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import AuthContext from '../../context/AuthContext';
import ThemeContext from '../../context/ThemeContext';
import { DashboardSkeleton } from '../../components/Skeleton';
import {
    BookOpen,
    Clock,
    CheckCircle2,
    AlertCircle,
    Trophy,
    SearchX,
    BarChart3,
    Grid,
    Award
} from 'lucide-react';

// Reusable Components
import DashboardHeader from '../../components/DashboardHeader';
import StatCard from '../../components/StatCard';
import PerformanceChart from '../../components/PerformanceChart';
import SearchBar from '../../components/SearchBar';
import FilterDropdown from '../../components/FilterDropdown';
import AssignmentCard from '../../components/AssignmentCard';
import Pagination from '../../components/Pagination';

const StudentDashboard = () => {
    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);

    // Navigation and search/filter states
    const [mobileTab, setMobileTab] = useState('overview'); // overview, curriculum
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // all, pending, submitted, reviewed, late
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const fetchData = async () => {
            if (!user || !user.token) return;
            try {
                setLoading(true);
                setError(null);

                // Fetch student assignments
                const assRes = await fetch(`${API_URL}/assignments/my-assignments`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                const assData = await assRes.json();

                if (!assRes.ok) {
                    setError(assData.message || 'Failed to sync assignments');
                } else if (Array.isArray(assData)) {
                    setAssignments(assData);
                    localStorage.setItem('student_assignments', JSON.stringify(assData));
                }

                // Fetch student submissions
                const subRes = await fetch(`${API_URL}/submissions/my-submissions`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                if (subRes.ok) {
                    const subData = await subRes.json();
                    if (Array.isArray(subData)) {
                        setSubmissions(subData);
                        localStorage.setItem('student_submissions', JSON.stringify(subData));
                    }
                }
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Network instability detected. Please sync again.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, API_URL]);

    // Computed Stats
    const stats = useMemo(() => {
        const total = assignments.length;
        const submitted = submissions.filter(s => s.status === 'submitted' || s.status === 'reviewed').length;
        const reviewedSubmissions = submissions.filter(s => s.status === 'reviewed');
        const pending = Math.max(0, total - submitted);
        
        let avgMarks = 0;
        if (reviewedSubmissions.length > 0) {
            const sum = reviewedSubmissions.reduce((acc, curr) => acc + (curr.marks || 0), 0);
            avgMarks = Math.round(sum / reviewedSubmissions.length);
        }

        return {
            total,
            submitted,
            pending,
            avgMarks,
            reviewedCount: reviewedSubmissions.length
        };
    }, [assignments, submissions]);

    // Map each assignment to its status details
    const getSubmissionStatus = useCallback((assignment) => {
        const sub = submissions.find(s => s.assignmentId?._id === assignment._id || s.assignmentId === assignment._id);
        const isLate = new Date(assignment.dueDate) < new Date();

        if (!sub) {
            if (isLate) {
                return { 
                    label: 'Late Submission', 
                    color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/30', 
                    type: 'late', 
                    icon: AlertCircle,
                    submission: null
                };
            }
            return { 
                label: 'Pending', 
                color: 'text-amber-500 bg-amber-50 dark:bg-amber-955/20 border-amber-100 dark:border-amber-900/30', 
                type: 'pending', 
                icon: Clock,
                submission: null
            };
        }
        if (sub.status === 'reviewed') {
            return { 
                label: 'Reviewed', 
                color: 'text-emerald-505 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30', 
                type: 'reviewed', 
                icon: CheckCircle2,
                submission: sub
            };
        }
        return { 
            label: 'Submitted', 
            color: 'text-indigo-650 bg-indigo-50 dark:bg-indigo-950/20 border-indigo-105 dark:border-indigo-900/30', 
            type: 'submitted', 
            icon: CheckCircle2,
            submission: sub
        };
    }, [submissions]);

    // Recharts Data Configuration
    const marksProgressData = useMemo(() => {
        const graded = submissions.filter(s => s.status === 'reviewed' && s.marks !== undefined);
        if (graded.length === 0) {
            return [
                { name: 'Initial', score: 0 },
                { name: 'Average', score: 80 }
            ];
        }
        return graded.map((sub, idx) => ({
            name: `Asg ${idx + 1}`,
            score: sub.marks
        }));
    }, [submissions]);

    const submissionHistoryData = useMemo(() => {
        return [
            { name: 'Week 1', submitted: 1, pending: 2 },
            { name: 'Week 2', submitted: 2, pending: 1 },
            { name: 'Week 3', submitted: 3, pending: 0 },
            { name: 'Week 4', submitted: stats.submitted, pending: stats.pending }
        ];
    }, [stats]);

    const performanceAnalyticsData = useMemo(() => {
        return [
            { subject: 'Code Quality', value: 92 },
            { subject: 'Deadlines', value: stats.total > 0 ? Math.round((stats.submitted / stats.total) * 100) : 80 },
            { subject: 'Average Score', value: stats.avgMarks || 75 },
            { subject: 'Consistency', value: 85 },
            { subject: 'Engagement', value: 90 }
        ];
    }, [stats]);

    const completionRateData = useMemo(() => {
        return [
            { name: 'Submitted', value: stats.submitted || 1, color: '#6366f1' },
            { name: 'Pending', value: stats.pending || 1, color: theme === 'dark' ? '#1e293b' : '#f1f5f9' }
        ];
    }, [stats, theme]);

    // Filters & Searching
    const filteredAssignments = useMemo(() => {
        let result = [...assignments];

        if (statusFilter !== 'all') {
            result = result.filter(asg => {
                const status = getSubmissionStatus(asg);
                return status.type === statusFilter;
            });
        }

        if (searchQuery) {
            result = result.filter(asg =>
                asg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                asg.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return result;
    }, [assignments, statusFilter, searchQuery, getSubmissionStatus]);

    const paginatedAssignments = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredAssignments.slice(start, start + itemsPerPage);
    }, [filteredAssignments, currentPage]);

    const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage) || 1;

    if (loading) return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12">
            <DashboardSkeleton />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-955 p-4 md:p-8 lg:p-10 transition-colors duration-300 font-sans">
            <div className="max-w-7xl mx-auto animate-cinematic-in">

                {/* Dashboard Header Component */}
                <DashboardHeader user={user} stats={stats} />

                {error && (
                    <div className="mb-8 p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-700 dark:text-rose-400 rounded-2xl flex items-center gap-3 font-semibold shadow-sm">
                        <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Mobile Tab Selectors (top layout toggle) */}
                <div className="md:hidden flex justify-center mb-8">
                    <div className="inline-flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm w-full">
                        <button
                            onClick={() => setMobileTab('overview')}
                            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                mobileTab === 'overview' 
                                ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950' 
                                : 'text-slate-400 dark:text-slate-505'
                            }`}
                        >
                            <BarChart3 className="w-4 h-4" /> Overview
                        </button>
                        <button
                            onClick={() => setMobileTab('curriculum')}
                            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                mobileTab === 'curriculum' 
                                ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950' 
                                : 'text-slate-400 dark:text-slate-505'
                            }`}
                        >
                            <Grid className="w-4 h-4" /> Curriculum
                        </button>
                    </div>
                </div>

                {/* Main grid structure */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column (Overview statistics & Performance Charts) */}
                    <div className={`md:col-span-5 space-y-8 ${mobileTab === 'overview' ? 'block' : 'hidden md:block'}`}>
                        <div className="flex items-center gap-3">
                            <span className="w-2.5 h-2.5 bg-indigo-600 dark:bg-indigo-500 rounded-full"></span>
                            <h3 className="text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-[0.2em]">Academic Analytics</h3>
                        </div>

                        {/* Stats Cards Grid utilizing StatCard Component */}
                        <div className="grid grid-cols-2 gap-4">
                            <StatCard 
                                label="Total Tasks" 
                                value={stats.total} 
                                icon={BookOpen} 
                                desc="Assigned modules" 
                                positive={true} 
                            />
                            <StatCard 
                                label="Submitted" 
                                value={stats.submitted} 
                                icon={CheckCircle2} 
                                desc="Completed tasks" 
                                positive={true} 
                                colorClass="text-emerald-500 dark:text-emerald-450" 
                                bgClass="bg-emerald-50 dark:bg-emerald-950/20" 
                            />
                            <StatCard 
                                label="Pending" 
                                value={stats.pending} 
                                icon={Clock} 
                                desc="Awaiting action" 
                                positive={false} 
                                colorClass="text-amber-500 dark:text-amber-450" 
                                bgClass="bg-amber-50 dark:bg-amber-955/20" 
                            />
                            <StatCard 
                                label="Avg Score" 
                                value={`${stats.avgMarks}%`} 
                                icon={Trophy} 
                                desc="Academic score" 
                                positive={true} 
                                colorClass="text-purple-500 dark:text-purple-400" 
                                bgClass="bg-purple-50 dark:bg-purple-950/20" 
                            />
                        </div>

                        {/* Performance Charts Component */}
                        <PerformanceChart
                            marksProgressData={marksProgressData}
                            submissionHistoryData={submissionHistoryData}
                            performanceAnalyticsData={performanceAnalyticsData}
                            completionRateData={completionRateData}
                            theme={theme}
                        />
                    </div>

                    {/* Right Column (Assignments List) */}
                    <div className={`md:col-span-7 space-y-8 ${mobileTab === 'curriculum' ? 'block' : 'hidden md:block'}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <span className="w-2.5 h-2.5 bg-indigo-600 dark:bg-indigo-500 rounded-full"></span>
                                <h3 className="text-[10px] font-black text-slate-450 dark:text-slate-505 uppercase tracking-[0.2em]">Active Syllabus</h3>
                            </div>
                        </div>

                        {/* Search & Filter Bar utilizing SearchBar and FilterDropdown */}
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-805/50 shadow-sm flex flex-col sm:flex-row items-center gap-4">
                            <SearchBar 
                                value={searchQuery} 
                                onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} 
                            />
                            <FilterDropdown 
                                value={statusFilter} 
                                onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }} 
                                options={[
                                    { value: 'all', label: 'All Status' },
                                    { value: 'pending', label: 'Pending' },
                                    { value: 'submitted', label: 'Submitted' },
                                    { value: 'reviewed', label: 'Reviewed' },
                                    { value: 'late', label: 'Late' }
                                ]}
                            />
                        </div>

                        {/* Catalog list */}
                        {filteredAssignments.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-150 dark:border-slate-800/80">
                                <SearchX className="w-16 h-16 text-slate-205 dark:text-slate-750 mb-4" />
                                <h4 className="text-xl font-bold text-slate-400 dark:text-slate-500">No matching assignments located</h4>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {paginatedAssignments.map(asg => {
                                        const status = getSubmissionStatus(asg);
                                        return (
                                            <AssignmentCard
                                                key={asg._id}
                                                assignment={asg}
                                                status={status}
                                            />
                                        );
                                    })}
                                </div>

                                {/* Pagination Component */}
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Bottom Navigation Bar (Visual floating layout for small screens) */}
                <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-100 dark:border-slate-800 shadow-xl rounded-2xl p-2 flex justify-around z-40">
                    <button
                        onClick={() => { setMobileTab('overview'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className={`flex flex-col items-center p-2 rounded-xl transition-all cursor-pointer ${mobileTab === 'overview' ? 'text-indigo-650 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-505'}`}
                    >
                        <BarChart3 className="w-5 h-5" />
                        <span className="text-[8px] font-black uppercase mt-1">Overview</span>
                    </button>
                    <button
                        onClick={() => { setMobileTab('curriculum'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className={`flex flex-col items-center p-2 rounded-xl transition-all cursor-pointer ${mobileTab === 'curriculum' ? 'text-indigo-655 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-505'}`}
                    >
                        <Grid className="w-5 h-5" />
                        <span className="text-[8px] font-black uppercase mt-1">Curriculum</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
