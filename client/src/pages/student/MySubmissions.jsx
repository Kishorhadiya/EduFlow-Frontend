import { useState, useEffect, useContext, useCallback } from 'react';
import AuthContext from '../../context/AuthContext';
import ThemeContext from '../../context/ThemeContext';
import Swal from 'sweetalert2';
import {
    History,
    ExternalLink,
    Trash2,
    CheckCircle2,
    Clock,
    MessageSquare,
    FileText,
} from 'lucide-react';

const MySubmissions = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const fetchSubmissions = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/submissions/my-submissions`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await res.json();
            setSubmissions(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [API_URL, user.token]);

    useEffect(() => {
        fetchSubmissions();
    }, [fetchSubmissions]);

    const handleDelete = async (id) => {
        const isDark = theme === 'dark';
        Swal.fire({
            title: 'Retract Submission?',
            text: "This will remove your work from the evaluator's queue.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, Retract',
            background: isDark ? '#0f172a' : '#fff',
            color: isDark ? '#f8fafc' : '#1e293b'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(`${API_URL}/submissions/${id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${user.token}` }
                    });
                    if (res.ok) {
                        fetchSubmissions();
                        Swal.fire({
                            title: 'Retracted!',
                            text: 'Your submission has been removed.',
                            icon: 'success',
                            background: isDark ? '#0f172a' : '#fff',
                            color: isDark ? '#f8fafc' : '#1e293b'
                        });
                    } else {
                        const data = await res.json();
                        Swal.fire({
                            icon: 'error',
                            title: 'Operation Failed',
                            text: data.message || 'Unable to delete',
                            background: isDark ? '#0f172a' : '#fff',
                            color: isDark ? '#f8fafc' : '#1e293b'
                        });
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        });
    };

    if (loading) return (
        <div className="flex flex-col justify-center items-center h-[70vh] gap-4 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 dark:text-slate-400 font-bold animate-pulse uppercase tracking-[0.2em] text-xs">Loading Portfolio</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 lg:p-12 text-slate-805 dark:text-slate-200 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">

                {/* Header Branding */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                            <History className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                            Academic History
                        </h2>
                    </div>
                </div>

                {submissions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-205 dark:border-slate-800/80">
                        <div className="w-24 h-24 bg-slate-50 dark:bg-slate-950 rounded-full flex items-center justify-center mb-6">
                            <FileText className="w-10 h-10 text-slate-300 dark:text-slate-700" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white">No submissions yet</h3>
                        <p className="text-slate-400 dark:text-slate-500 mt-2 font-medium italic">Your academic achievements will appear here once submitted.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {submissions.map(sub => (
                            <div key={sub._id} className="group bg-white dark:bg-slate-900 rounded-[2.5rem] p-5 md:p-8 shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 dark:border-slate-800/50 flex flex-col lg:flex-row gap-6 md:gap-8 relative overflow-hidden">

                                {/* Left: Assignment Info */}
                                <div className="flex-1 flex flex-col justify-center border-l-4 border-indigo-600 pl-4 md:pl-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${sub.status === 'reviewed' ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' : 'bg-amber-50 dark:bg-amber-955/30 text-amber-605 dark:text-amber-400'}`}>
                                            {sub.status === 'reviewed' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                            {sub.status}
                                        </div>
                                        <span className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest">
                                            {new Date(sub.submittedAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-4 line-clamp-1">
                                        {sub.assignmentId?.title}
                                    </h3>
                                    <a
                                        href={sub.submissionLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-305 font-black text-xs uppercase tracking-widest transition-all"
                                    >
                                        <ExternalLink className="w-4 h-4" /> View My Submission
                                    </a>
                                </div>

                                {/* Center: Grading & Feedback */}
                                <div className="lg:w-2/5 p-4 md:p-6 bg-slate-50 dark:bg-slate-900/30 rounded-3xl border border-slate-100 dark:border-slate-800/80 flex flex-row items-center gap-4 md:gap-8 group-hover:bg-indigo-50/50 dark:group-hover:bg-indigo-950/10 transition-all">
                                    <div className="text-center">
                                        <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2 leading-none">Grade</div>
                                        <div className={`text-4xl font-black ${sub.marks ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-300 dark:text-slate-700'}`}>
                                            {sub.marks || '--'}
                                            <span className="text-xs text-slate-400 dark:text-slate-500 ml-1 font-bold">/ 100</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 border-l border-slate-200 dark:border-slate-800/80 pl-4 md:pl-8 text-left">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2 justify-start">
                                            <MessageSquare className="w-3.5 h-3.5 text-indigo-400" /> Faculty Insights
                                        </div>
                                        <p className="text-sm font-bold text-slate-605 dark:text-slate-400 italic line-clamp-2">
                                            {sub.feedback || "Pending professional assessment..."}
                                        </p>
                                    </div>
                                </div>

                                {/* Right: Actions */}
                                <div className="flex items-center justify-center lg:justify-end">
                                    <button
                                        onClick={() => handleDelete(sub._id)}
                                        className="p-4 bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-500 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-rose-100 dark:hover:border-rose-900/30 transition-all shadow-sm active:scale-95 group/del cursor-pointer"
                                        title="Retract Submission"
                                    >
                                        <Trash2 className="w-6 h-6 group-hover/del:scale-110 transition-transform" />
                                    </button>
                                </div>

                                {/* Visual Background Decoration */}
                                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MySubmissions;
