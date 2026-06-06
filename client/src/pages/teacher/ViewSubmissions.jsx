import { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import AuthContext from '../../context/AuthContext';
import ThemeContext from '../../context/ThemeContext';
import Swal from 'sweetalert2';
import {
    FileCheck,
    BookOpen,
    ExternalLink,
    Clock,
    Save,
    Search,
    Mail,
    AlertCircle,
    UserCheck,
    ChevronDown,
    GraduationCap,
    ChevronLeft
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const ViewSubmissions = () => {
    const location = useLocation();
    const [classes, setClasses] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedAssignment, setSelectedAssignment] = useState('');
    const [studentSearch, setStudentSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // all, submitted, reviewed

    const [marks, setMarks] = useState({});
    const [feedback, setFeedback] = useState({});

    const { user } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        if (location.state?.classId) {
            setSelectedClass(location.state.classId);
            setSelectedAssignment(location.state.assignmentId);
        }
    }, [location.state]);

    useEffect(() => {
        fetch(`${API_URL}/classes`)
            .then(res => res.json())
            .then(data => setClasses(data));
    }, [API_URL]);

    useEffect(() => {
        if (selectedClass) {
            fetch(`${API_URL}/assignments/class/${selectedClass}`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            })
                .then(res => res.json())
                .then(data => {
                    setAssignments(data);
                    setSelectedAssignment('');
                    setSubmissions([]);
                });
        }
    }, [selectedClass, user.token, API_URL]);

    const fetchSubmissions = useCallback(() => {
        if (!selectedAssignment) return;
        fetch(`${API_URL}/submissions/assignment/${selectedAssignment}`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
        })
            .then(res => res.json())
            .then(data => setSubmissions(data));
    }, [selectedAssignment, API_URL, user.token]);

    useEffect(() => {
        fetchSubmissions();
    }, [fetchSubmissions]);

    const handleEvaluate = async (submissionId) => {
        const mark = marks[submissionId] !== undefined ? marks[submissionId] : submissions.find(s => s._id === submissionId)?.marks;
        const feed = feedback[submissionId] !== undefined ? feedback[submissionId] : submissions.find(s => s._id === submissionId)?.feedback;

        if (mark > 100) {
            Swal.fire({
                icon: 'warning',
                title: 'Limit Exceeded',
                text: 'Maximum score is 100',
                background: theme === 'dark' ? '#0f172a' : '#fff',
                color: theme === 'dark' ? '#f8fafc' : '#1e293b'
            });
            return;
        }

        try {
            const res = await fetch(`${API_URL}/submissions/${submissionId}/evaluate`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    marks: mark,
                    feedback: feed
                })
            });
            if (res.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Evaluation Saved',
                    text: 'Feedback and marks have been updated.',
                    timer: 1000,
                    showConfirmButton: false,
                    background: theme === 'dark' ? '#0f172a' : '#fff',
                    color: theme === 'dark' ? '#f8fafc' : '#1e293b'
                });
                fetchSubmissions();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const filteredSubmissions = useMemo(() => {
        return submissions.filter(sub => {
            const matchesSearch = sub.studentId?.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
                sub.studentId?.email.toLowerCase().includes(studentSearch.toLowerCase());
            const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [submissions, studentSearch, statusFilter]);

    const stats = useMemo(() => {
        const total = submissions.length;
        const reviewed = submissions.filter(s => s.status === 'reviewed').length;
        const pending = total - reviewed;
        const percentage = total > 0 ? Math.round((reviewed / total) * 100) : 0;
        return { total, reviewed, pending, percentage };
    }, [submissions]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 transition-colors duration-300 font-sans">
            <div className="max-w-7xl mx-auto">

                {/* Back button */}
                <button
                    onClick={() => navigate('/teacher/dashboard')}
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-black text-xs uppercase tracking-widest mb-6 transition-colors bg-transparent border-none cursor-pointer"
                >
                    <ChevronLeft className="w-5 h-5" />
                    Back to Dashboard
                </button>

                {/* Dashboard Header */}
                <div className="mb-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                        <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                            <span className="p-2.5 bg-indigo-650 dark:bg-indigo-500 rounded-2xl shadow-lg shadow-indigo-100 dark:shadow-none">
                                <FileCheck className="w-7 h-7 text-white" />
                            </span>
                            Grading Hub
                        </h2>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Evaluate student performance and provide constructive feedback.</p>
                </div>

                {/* Top Controls Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">

                    {/* Selectors Card */}
                    <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-150 dark:border-slate-800/80 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
                        <div className="relative flex-grow w-full">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-slate-50 dark:bg-slate-950 rounded-lg text-slate-400 dark:text-slate-600">
                                <GraduationCap className="w-4.5 h-4.5" />
                            </div>
                            <select
                                className="w-full pl-14 pr-10 py-3.5 bg-slate-50/50 dark:bg-slate-950/40 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-black text-slate-700 dark:text-slate-300 appearance-none cursor-pointer uppercase text-[10px] tracking-widest"
                                onChange={e => setSelectedClass(e.target.value)}
                                value={selectedClass}
                            >
                                <option value="">Target Academic Unit</option>
                                {classes.map(cls => (
                                    <option key={cls._id} value={cls._id}>{cls.className}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>

                        <div className="relative flex-grow w-full">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-slate-50 dark:bg-slate-950 rounded-lg text-slate-400 dark:text-slate-600">
                                <BookOpen className="w-4.5 h-4.5" />
                            </div>
                            <select
                                className="w-full pl-14 pr-10 py-3.5 bg-slate-50/50 dark:bg-slate-950/40 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-black text-slate-700 dark:text-slate-300 appearance-none cursor-pointer disabled:opacity-50 uppercase text-[10px] tracking-widest"
                                onChange={e => setSelectedAssignment(e.target.value)}
                                value={selectedAssignment}
                                disabled={!selectedClass}
                            >
                                <option value="">Assignment Module</option>
                                {assignments.map(asg => (
                                    <option key={asg._id} value={asg._id}>{asg.title}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Quick Stats Card */}
                    <div className="lg:col-span-4 bg-slate-900 dark:bg-slate-900/60 rounded-[2rem] p-6 text-white border border-slate-850 dark:border-slate-800/80 flex flex-col justify-between overflow-hidden relative group shadow-md">
                        <div className="relative z-10 w-full">
                            <h4 className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mb-4">Grading Progress</h4>
                            <div className="flex items-end justify-between mb-2">
                                <span className="text-2xl font-black">{stats.percentage}%</span>
                                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{stats.reviewed} / {stats.total} Reviewed</span>
                            </div>
                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                    style={{ width: `${stats.percentage}%` }}
                                ></div>
                            </div>
                        </div>
                        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-indigo-650/20 rounded-full blur-3xl group-hover:bg-indigo-600/30 transition-all"></div>
                    </div>
                </div>

                {/* Submissions Section */}
                {!selectedAssignment ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
                        <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-950/40 rounded-full flex items-center justify-center mb-6 animate-pulse">
                            <AlertCircle className="w-10 h-10 text-indigo-400" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white">Select Assignment Module</h3>
                        <p className="text-slate-400 mt-2 font-medium">Select a class and challenge module to view submission records.</p>
                    </div>
                ) : (
                    <div className="space-y-6">

                        {/* List Filters & Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="relative max-w-sm w-full">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-650" />
                                <input
                                    type="text"
                                    placeholder="Search candidate name or email..."
                                    className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-indigo-600 dark:focus:border-indigo-500 font-bold text-slate-600 dark:text-slate-350"
                                    value={studentSearch}
                                    onChange={(e) => setStudentSearch(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-150 dark:border-slate-800 shrink-0">
                                {['all', 'submitted', 'reviewed'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setStatusFilter(status)}
                                        className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${statusFilter === status ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-white'}`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Submissions Display */}
                        {filteredSubmissions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-150 dark:border-slate-800">
                                <Search className="w-16 h-16 text-slate-205 dark:text-slate-700 mb-6" />
                                <h4 className="text-xl font-bold text-slate-400 dark:text-slate-500">No candidates match your criteria</h4>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6">
                                {filteredSubmissions.map(sub => (
                                    <div key={sub._id} className="group bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 shadow-sm hover:shadow-md transition-all border border-slate-100 dark:border-slate-805/50 relative overflow-hidden">

                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

                                            {/* Candidate Info */}
                                            <div className="lg:col-span-3 flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 flex items-center justify-center font-black text-xl border border-indigo-100 dark:border-indigo-900/30 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                                                    {sub.studentId?.name.charAt(0)}
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="font-black text-slate-800 dark:text-white truncate text-base">{sub.studentId?.name}</h4>
                                                    <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs font-bold mt-0.5">
                                                        <Mail className="w-3.5 h-3.5" /> {sub.studentId?.email}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Submission Link & Status */}
                                            <div className="lg:col-span-3">
                                                <div className="flex flex-col gap-2">
                                                    <a
                                                        href={sub.submissionLink}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-850 transition-all text-xs font-black uppercase tracking-wider border border-slate-100 dark:border-slate-800"
                                                    >
                                                        <ExternalLink className="w-4 h-4 text-indigo-500" />
                                                        <span className="truncate">View Work Artifact</span>
                                                    </a>
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest w-fit ${sub.status === 'reviewed' ? 'text-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30' : 'text-amber-500 bg-amber-50/50 dark:bg-amber-950/30'}`}>
                                                        {sub.status === 'reviewed' ? <UserCheck className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                                        {sub.status}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Grading Forms */}
                                            <div className="lg:col-span-6 flex flex-col sm:flex-row items-end gap-4 bg-slate-50/50 dark:bg-slate-950/30 p-4 rounded-3xl group-hover:bg-indigo-50/10 dark:group-hover:bg-indigo-950/10 transition-all border border-transparent group-hover:border-indigo-100/30 dark:group-hover:border-indigo-900/30">
                                                <div className="w-full sm:w-28">
                                                    <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 block ml-1">Score (100)</label>
                                                    <input
                                                        type="number"
                                                        placeholder="0"
                                                        className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-black text-center text-indigo-650 dark:text-indigo-400 shadow-sm"
                                                        defaultValue={sub.marks}
                                                        onChange={e => setMarks({ ...marks, [sub._id]: e.target.value })}
                                                    />
                                                </div>
                                                <div className="flex-grow w-full">
                                                    <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 block ml-1">Evaluator Feedback</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Constructive review..."
                                                        className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-xs text-slate-700 dark:text-slate-300 shadow-sm"
                                                        defaultValue={sub.feedback}
                                                        onChange={e => setFeedback({ ...feedback, [sub._id]: e.target.value })}
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => handleEvaluate(sub._id)}
                                                    className="w-full sm:w-auto px-5 py-3 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest shrink-0 cursor-pointer"
                                                >
                                                    <Save className="w-4 h-4" /> Save
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewSubmissions;
