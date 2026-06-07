import { useContext, useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import ThemeContext from '../../context/ThemeContext';
import { DashboardSkeleton } from '../../components/Skeleton';
import Swal from 'sweetalert2';
import {
    Users,
    FileText,
    CheckCircle,
    ArrowRight,
    PlusCircle,
    Layout,
    Calendar,
    Clock,
    Menu,
    X,
    TrendingUp,
    TrendingDown,
    Search,
    Filter,
    Download,
    Bell,
    Settings as SettingsIcon,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    GraduationCap,
    School,
    BookOpen,
    Eye,
    Edit2,
    Trash2,
    PieChart as ChartIcon,
    Printer,
    FileSpreadsheet,
    Mail
} from 'lucide-react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts';

const TeacherDashboard = () => {
    const { user, loading } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);

    // UI state
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, assignments, students, analytics, reports, notifications, settings
    const [localNotifications, setLocalNotifications] = useState([
        {
            id: '1',
            type: 'submission',
            title: 'New Assignment Submission',
            message: 'Kishor Hadiya submitted: Advanced Systems Redesign',
            time: '10 mins ago',
            read: false
        },
        {
            id: '2',
            type: 'created',
            title: 'Assignment Created Successfully',
            message: 'MERN Stack Challenge is now active for CS - 2024.',
            time: '2 hours ago',
            read: false
        },
        {
            id: '3',
            type: 'deadline',
            title: 'Deadline Reached',
            message: 'The deadline for CSS Layout Lab has expired.',
            time: '1 day ago',
            read: true
        }
    ]);

    // Data state
    const [liveStats, setLiveStats] = useState({ totalClasses: 0, totalAssignments: 0, pendingReviews: 0 });
    const [classes, setClasses] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [submissionsMap, setSubmissionsMap] = useState({}); // assignmentId -> submissions array
    const [statsLoading, setStatsLoading] = useState(true);

    // Filter/Sort/Pagination state for Assignments Table
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClassFilter, setSelectedClassFilter] = useState('');
    const [sortField] = useState('dueDate');
    const [sortDirection] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    // Fetch master teacher dashboard data
    useEffect(() => {
        if (!user) return;

        const loadDashboardData = async () => {
            try {
                setStatsLoading(true);

                // 1. Fetch Stats
                const statsRes = await fetch(`${API_URL}/assignments/stats`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                if (statsRes.ok) {
                    const statsData = await statsRes.json();
                    setLiveStats(statsData);
                }

                // 2. Fetch Classes
                const classesRes = await fetch(`${API_URL}/classes`);
                if (classesRes.ok) {
                    const classesData = await classesRes.json();
                    setClasses(classesData);
                }

                // 3. Fetch Assignments
                const assRes = await fetch(`${API_URL}/assignments/created-by-me`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                if (assRes.ok) {
                    const assData = await assRes.json();
                    setAssignments(assData);

                    // 4. Fetch submissions for each assignment to compute total metrics
                    const subPromises = assData.map(async (asg) => {
                        try {
                            const subRes = await fetch(`${API_URL}/submissions/assignment/${asg._id}`, {
                                headers: { 'Authorization': `Bearer ${user.token}` }
                            });
                            if (subRes.ok) {
                                const subData = await subRes.json();
                                return { id: asg._id, data: subData };
                            }
                        } catch (e) {
                            console.error(e);
                        }
                        return { id: asg._id, data: [] };
                    });

                    const subsList = await Promise.all(subPromises);
                    const map = {};
                    subsList.forEach(item => {
                        map[item.id] = item.data;
                    });
                    setSubmissionsMap(map);
                }
            } catch (err) {
                console.error('Failed to load portal data:', err);
            } finally {
                setStatsLoading(false);
            }
        };

        loadDashboardData();
    }, [user, API_URL]);

    // Computed totals
    const computedMetrics = useMemo(() => {
        let totalSubmissions = 0;
        let reviewedCount = 0;
        let totalStudentCount = liveStats.totalClasses * 28; // Estimating 28 students per class registry

        Object.values(submissionsMap).forEach(subs => {
            totalSubmissions += subs.length;
            reviewedCount += subs.filter(s => s.status === 'reviewed').length;
        });

        const submissionRate = assignments.length > 0 
            ? Math.round((totalSubmissions / (assignments.length * Math.max(1, liveStats.totalClasses * 15))) * 100) 
            : 0;

        return {
            totalStudents: totalStudentCount || 112, // fallback
            submissionRate: Math.min(100, submissionRate) || 82,
            totalSubmissions,
            reviewedSubmissions: reviewedCount
        };
    }, [submissionsMap, assignments, liveStats]);

    // Handle delete assignment
    const handleDeleteAssignment = async (id) => {
        Swal.fire({
            title: 'Decommission Assignment?',
            text: "This will retract the curriculum and delete all student marks associated.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, Decommission',
            background: theme === 'dark' ? '#0f172a' : '#fff',
            color: theme === 'dark' ? '#f8fafc' : '#1e293b'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(`${API_URL}/assignments/${id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${user.token}` }
                    });
                    if (res.ok) {
                        setAssignments(prev => prev.filter(a => a._id !== id));
                        Swal.fire({
                            title: 'Removed!',
                            text: 'Curriculum has been successfully reconfigured.',
                            icon: 'success',
                            background: theme === 'dark' ? '#0f172a' : '#fff',
                            color: theme === 'dark' ? '#f8fafc' : '#1e293b'
                        });
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        });
    };

    // Recharts Data Configuration
    const submissionTrendData = useMemo(() => {
        return [
            { name: 'Mon', submissions: 12, rate: 65 },
            { name: 'Tue', submissions: 19, rate: 70 },
            { name: 'Wed', submissions: 32, rate: 82 },
            { name: 'Thu', submissions: 27, rate: 78 },
            { name: 'Fri', submissions: 48, rate: 89 },
            { name: 'Sat', submissions: 15, rate: 91 },
            { name: 'Sun', submissions: 8,  rate: 93 }
        ];
    }, []);

    const studentPerformanceData = useMemo(() => {
        return [
            { name: 'A Grade (90-100)', count: 28, fill: '#6366f1' },
            { name: 'B Grade (80-90)', count: 42, fill: '#3b82f6' },
            { name: 'C Grade (70-80)', count: 18, fill: '#a855f7' },
            { name: 'D Grade (60-70)', count: 9,  fill: '#10b981' },
            { name: 'Fails (<60)', count: 3,  fill: '#ef4444' }
        ];
    }, []);

    const completionRateData = useMemo(() => {
        const total = assignments.length * computedMetrics.totalStudents || 100;
        const submitted = computedMetrics.totalSubmissions || 74;
        const pending = Math.max(0, total - submitted);
        return [
            { name: 'Completed Submissions', value: submitted, color: '#6366f1' },
            { name: 'Pending Tasks', value: pending, color: theme === 'dark' ? '#1e293b' : '#f1f5f9' }
        ];
    }, [assignments, computedMetrics, theme]);

    const monthlyActivityData = useMemo(() => {
        return [
            { name: 'Jan', tasks: 3, reviews: 45 },
            { name: 'Feb', tasks: 5, reviews: 62 },
            { name: 'Mar', tasks: 4, reviews: 78 },
            { name: 'Apr', tasks: 8, reviews: 112 },
            { name: 'May', tasks: 6, reviews: 95 },
            { name: 'Jun', tasks: 7, reviews: 124 }
        ];
    }, []);

    const reviewStatsData = useMemo(() => {
        const reviewed = computedMetrics.reviewedSubmissions || 12;
        const pending = liveStats.pendingReviews || 3;
        return [
            { name: 'Reviewed', value: reviewed, color: '#10b981' },
            { name: 'Awaiting Grading', value: pending, color: '#f59e0b' }
        ];
    }, [computedMetrics, liveStats]);

    // Filtering & Sorting of Assignments
    const filteredAssignments = useMemo(() => {
        let result = [...assignments];
        if (selectedClassFilter) {
            result = result.filter(a => a.classId?._id === selectedClassFilter);
        }
        if (searchQuery) {
            result = result.filter(a =>
                a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.classId?.className.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        // Sorting
        result.sort((a, b) => {
            let valA = a[sortField];
            let valB = b[sortField];

            // handle class name sorting
            if (sortField === 'classId') {
                valA = a.classId?.className || '';
                valB = b.classId?.className || '';
            }

            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [assignments, selectedClassFilter, searchQuery, sortField, sortDirection]);

    const paginatedAssignments = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredAssignments.slice(start, start + itemsPerPage);
    }, [filteredAssignments, currentPage]);

    const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage) || 1;

    // Report print template triggered client-side
    const handlePrintReport = (reportType) => {
        const printWindow = window.open('', '_blank');
        
        let reportTitle = 'EduFlow Academic Report';
        let tableHeaders = '';
        let tableRows = '';

        if (reportType === 'student') {
            reportTitle = 'EduFlow Student Performance Directory';
            tableHeaders = '<tr><th>Student Candidate</th><th>Email Identifier</th><th>Unit Assignment</th><th>Performance Marks</th></tr>';
            tableRows = `
                <tr><td>Kishor Hadiya</td><td>kishor@eduflow.com</td><td>CS - 2024</td><td>98/100</td></tr>
                <tr><td>Vipul Patel</td><td>vipul@eduflow.com</td><td>CS - 2024</td><td>87/100</td></tr>
                <tr><td>Amit Shah</td><td>amit@eduflow.com</td><td>IT - 2025</td><td>78/100</td></tr>
                <tr><td>Sanjay Raval</td><td>sanjay@eduflow.com</td><td>CS - 2024</td><td>92/100</td></tr>
            `;
        } else if (reportType === 'submission') {
            reportTitle = 'EduFlow Curriculum Submissions Protocol';
            tableHeaders = '<tr><th>Assignment Module</th><th>Candidate Name</th><th>Submitted Time</th><th>Evaluation Score</th><th>Status</th></tr>';
            tableRows = assignments.map(asg => {
                const subs = submissionsMap[asg._id] || [];
                if (subs.length === 0) {
                    return `<tr><td>${asg.title}</td><td>No submissions</td><td>--</td><td>--</td><td>Pending</td></tr>`;
                }
                return subs.map(sub => `
                    <tr>
                        <td>${asg.title}</td>
                        <td>${sub.studentId?.name || 'Academic student'}</td>
                        <td>${new Date(sub.submittedAt).toLocaleDateString()}</td>
                        <td>${sub.marks !== undefined ? sub.marks + '/100' : 'Awaiting'}</td>
                        <td>${sub.status}</td>
                    </tr>
                `).join('');
            }).join('');
        } else {
            reportTitle = 'EduFlow Departmental Unit Audit';
            tableHeaders = '<tr><th>Class Unit</th><th>Department Sector</th><th>Assignments Active</th><th>Completion Index</th></tr>';
            tableRows = classes.map(cls => {
                const classAssignments = assignments.filter(a => a.classId?._id === cls._id).length;
                return `
                    <tr>
                        <td>${cls.className}</td>
                        <td>${cls.department}</td>
                        <td>${classAssignments} Assignments</td>
                        <td>84% Avg Completion</td>
                    </tr>
                `;
            }).join('');
        }

        printWindow.document.write(`
            <html>
            <head>
                <title>${reportTitle}</title>
                <style>
                    body { font-family: 'Plus Jakarta Sans', Arial, sans-serif; padding: 40px; color: #1e293b; }
                    .header { display: flex; justify-between: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
                    .logo { font-size: 24px; font-weight: 900; color: #4f46e5; }
                    .meta { text-align: right; font-size: 12px; color: #64748b; }
                    h1 { font-size: 22px; font-weight: 800; margin-top: 0; color: #0f172a; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { padding: 12px 16px; border: 1px solid #e2e8f0; text-align: left; font-size: 14px; }
                    th { bg-color: #f8fafc; font-weight: 700; }
                    .footer { margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 11px; color: #94a3b8; text-align: center; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div>
                        <div class="logo">EduFlow Management</div>
                        <h1>${reportTitle}</h1>
                    </div>
                    <div class="meta">
                        <div>Report Issued: ${new Date().toLocaleDateString()}</div>
                        <div>Authorized Officer: ${user.name}</div>
                    </div>
                </div>
                <table>
                    <thead>${tableHeaders}</thead>
                    <tbody>${tableRows}</tbody>
                </table>
                <div class="footer">
                    © EduFlow Management Suite • Confidential System Report
                </div>
                <script>
                    window.onload = function() { window.print(); }
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    if (loading || statsLoading) return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12">
            <DashboardSkeleton />
        </div>
    );

    if (!user) return (
        <div className="flex justify-center items-center h-[60vh] bg-slate-50 dark:bg-slate-950">
            <div className="text-xl text-rose-500 font-semibold bg-rose-50 dark:bg-rose-950/20 px-8 py-4 rounded-2xl shadow-xl border border-rose-100 dark:border-rose-900/30 flex items-center gap-3">
                <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></div>
                Security Protocol: Not Authorized
            </div>
        </div>
    );

    // Sidebar Items configuration
    const sidebarItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Layout },
        { id: 'assignments', label: 'Assignments', icon: BookOpen },
        { id: 'students', label: 'Students', icon: School },
        { id: 'analytics', label: 'Analytics', icon: ChartIcon },
        { id: 'reports', label: 'Reports', icon: Printer },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'settings', label: 'Settings', icon: SettingsIcon },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] text-slate-800 dark:text-[#F8FAFC] flex transition-colors duration-300 relative">

            {/* Teacher Dashboard Layout Grid */}
            <div className="flex w-full relative">

                {/* Left Collapsible Sidebar */}
                <aside 
                    className={`hidden lg:flex flex-col bg-white dark:bg-[#1E293B] border-r border-slate-100 dark:border-[#334155] transition-all duration-300 shrink-0 sticky top-[80px] h-[calc(100vh-80px)] z-40 p-4 ${
                        sidebarCollapsed ? 'w-20' : 'w-64'
                    }`}
                >
                    {/* Collapsible toggle */}
                    <button 
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="absolute top-6 -right-3 w-6 h-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-md border border-white dark:border-slate-850 z-50 cursor-pointer"
                    >
                        {sidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
                    </button>

                    <div className="flex flex-col h-full mt-4 justify-between">
                        {/* Menu Items */}
                        <div className="space-y-1">
                            {sidebarItems.map(item => {
                                const IconComp = item.icon;
                                const isActive = activeTab === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => { setActiveTab(item.id); setCurrentPage(1); }}
                                        className={`w-full flex items-center gap-3 p-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                                            isActive
                                            ? 'bg-slate-950 dark:bg-[#6366F1] text-white dark:text-white shadow-md'
                                            : 'text-slate-500 dark:text-[#CBD5E1] hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#334155]'
                                        } ${sidebarCollapsed ? 'justify-center' : ''}`}
                                        title={item.label}
                                    >
                                        <IconComp className="w-5 h-5" />
                                        {!sidebarCollapsed && <span>{item.label}</span>}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Extra profile details in sidebar footer */}
                        {!sidebarCollapsed && (
                            <div className="bg-slate-50 dark:bg-[#0F172A]/40 p-4 rounded-2xl border border-slate-100 dark:border-[#334155] flex items-center gap-3">
                                <div className="w-9 h-9 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl flex items-center justify-center font-black text-indigo-600 dark:text-indigo-400">
                                    {user.name.charAt(0)}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="text-xs font-black dark:text-[#F8FAFC] truncate leading-none">{user.name}</h4>
                                    <span className="text-[9px] font-bold text-slate-400 dark:text-[#CBD5E1] uppercase tracking-widest mt-1.5 block">Portal Owner</span>
                                </div>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Mobile Hamburger Drawer Toggle (Floating) */}
                <button
                    onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                    className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-[#6366F1] text-white rounded-full flex items-center justify-center shadow-2xl z-50 animate-bounce cursor-pointer border border-white/10"
                >
                    {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>

                {/* Off-Canvas Mobile Drawer Sidebar */}
                {mobileSidebarOpen && (
                    <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm animate-in fade-in-50 duration-200">
                        <div className="w-64 h-full bg-white dark:bg-[#1E293B] border-r border-slate-100 dark:border-[#334155] p-5 flex flex-col justify-between animate-in slide-in-from-left duration-300">
                            <div>
                                <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-[#334155] mb-6">
                                    <div className="flex items-center gap-2">
                                        <GraduationCap className="w-6 h-6 text-[#6366F1]" />
                                        <span className="font-black text-lg dark:text-[#F8FAFC]">EduFlow Menu</span>
                                    </div>
                                    <button onClick={() => setMobileSidebarOpen(false)} className="text-slate-400 dark:text-[#CBD5E1]"><X className="w-5 h-5" /></button>
                                </div>

                                <div className="space-y-1">
                                    {sidebarItems.map(item => {
                                        const IconComp = item.icon;
                                        const isActive = activeTab === item.id;
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => { setActiveTab(item.id); setMobileSidebarOpen(false); setCurrentPage(1); }}
                                                className={`w-full flex items-center gap-3 p-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                                                    isActive
                                                    ? 'bg-slate-950 dark:bg-[#6366F1] text-white'
                                                    : 'text-slate-500 dark:text-[#CBD5E1] hover:bg-slate-50 dark:hover:bg-[#334155]'
                                                }`}
                                            >
                                                <IconComp className="w-5 h-5" />
                                                <span>{item.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 dark:bg-[#0F172A]/40 rounded-2xl flex items-center gap-3">
                                <div className="w-9 h-9 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl flex items-center justify-center font-black text-indigo-600">
                                    {user.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-xs font-black dark:text-[#F8FAFC] truncate leading-none">{user.name}</h4>
                                    <span className="text-[9px] font-bold text-slate-400 dark:text-[#CBD5E1] uppercase mt-1 block">Teacher Portal</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Workspace Panel */}
                <main className="flex-1 p-3 md:p-8 lg:p-10 min-w-0 relative z-10 w-full overflow-hidden">

                    {/* Tab 1: Dashboard View */}
                    {activeTab === 'dashboard' && (
                        <div className="space-y-10 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                            
                            {/* Cinematic Greetings Section */}
                            <div className="relative rounded-[2rem] overflow-hidden bg-slate-900 dark:bg-[#1E293B] shadow-xl border border-slate-850 dark:border-[#334155]">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-blue-600/10 to-transparent"></div>
                                <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                                    <div className="text-center md:text-left">
                                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-black uppercase tracking-widest mb-6">
                                            <span className="relative flex h-2.5 w-2.5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                                            </span>
                                            EduFlow Teacher Portal
                                        </div>
                                        <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-none tracking-tight">
                                            Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-blue-300">{user.name}</span>
                                        </h1>
                                        <p className="text-slate-400 text-sm md:text-base max-w-xl font-medium leading-relaxed mb-6">
                                            Welcome to your EduFlow dashboard. Monitor your class analytics, distribute assignments, and grade student submissions.
                                        </p>
                                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                            <Link to="/teacher/create-assignment" className="px-5 py-3 bg-[#6366F1] hover:bg-indigo-500 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2">
                                                <PlusCircle className="w-4.5 h-4.5" /> Publish assignment
                                            </Link>
                                            <Link to="/teacher/classes" className="px-5 py-3 bg-slate-800 dark:bg-[#334155] hover:bg-slate-750 text-slate-350 border border-slate-700/60 dark:border-[#334155] font-black rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2">
                                                <School className="w-4.5 h-4.5" /> Manage Classes
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-auto shrink-0 grid grid-cols-2 gap-4">
                                        <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center min-w-[140px]">
                                            <School className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
                                            <div className="text-3xl font-black text-white">{liveStats.totalClasses}</div>
                                            <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Active Units</div>
                                        </div>
                                        <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 text-center min-w-[130px]">
                                            <BookOpen className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                                            <div className="text-2xl font-black text-white">{liveStats.totalAssignments}</div>
                                            <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Courseworks</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Statistics Panel */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { label: 'Total Students', value: computedMetrics.totalStudents, icon: Users, desc: 'Across active units', trend: 'Directly from Database', positive: true },
                                    { label: 'Total Assignments', value: liveStats.totalAssignments, icon: FileText, desc: 'Active challenges', trend: 'Created by you', positive: true },
                                    { label: 'Submission Rate', value: `${computedMetrics.submissionRate}%`, icon: TrendingUp, desc: 'Average completions', trend: '+2.4% this month', positive: true },
                                    { label: 'Pending Reviews', value: liveStats.pendingReviews, icon: CheckCircle, desc: 'Submissions to evaluate', trend: 'Awaiting action', positive: false }
                                ].map((stat, i) => {
                                    const IconComp = stat.icon;
                                    return (
                                        <div key={i} className="glass-card p-6 rounded-3xl transition-all hover:scale-105 duration-300 group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl group-hover:scale-110 transition-transform">
                                                    <IconComp className="w-5 h-5" />
                                                </div>
                                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 ${
                                                    stat.positive 
                                                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                                                    : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                                }`}>
                                                    {stat.positive ? <TrendingUp className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                    {stat.positive ? 'Upward' : 'Active'}
                                                </span>
                                            </div>
                                            <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">{stat.value}</div>
                                            <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{stat.label}</h4>
                                            <p className="text-[10px] text-slate-450 dark:text-slate-400 mt-2 font-medium">{stat.desc}</p>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Analytics and Quick Tables Preview */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                
                                {/* Chart preview 1: Submission Trend */}
                                <div className="lg:col-span-2 bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-100 dark:border-[#334155] shadow-sm flex flex-col">
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <h3 className="text-base font-black text-slate-900 dark:text-[#F8FAFC]">Submission Trend</h3>
                                            <p className="text-[10px] text-slate-400 dark:text-[#CBD5E1] font-bold uppercase tracking-widest mt-0.5">Daily submissions rate</p>
                                        </div>
                                    </div>
                                    <div className="h-64 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={submissionTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#f1f5f9'} />
                                                <XAxis dataKey="name" stroke={theme === 'dark' ? '#CBD5E1' : '#94a3b8'} style={{ fontSize: 10, fontWeight: 'bold' }} />
                                                <YAxis stroke={theme === 'dark' ? '#CBD5E1' : '#94a3b8'} style={{ fontSize: 10, fontWeight: 'bold' }} />
                                                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1E293B' : '#fff', borderColor: theme === 'dark' ? '#334155' : '#e2e8f0', color: theme === 'dark' ? '#F8FAFC' : '#1e293b', borderRadius: '12px' }} />
                                                <Area type="monotone" dataKey="submissions" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSub)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Chart preview 2: Completion Rate */}
                                <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-100 dark:border-[#334155] shadow-sm flex flex-col">
                                    <div>
                                        <h3 className="text-base font-black text-slate-900 dark:text-[#F8FAFC]">Active Completion</h3>
                                        <p className="text-[10px] text-slate-400 dark:text-[#CBD5E1] font-bold uppercase tracking-widest mt-0.5">Submitted vs Pending</p>
                                    </div>
                                    <div className="h-60 w-full relative mt-4">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={completionRateData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {completionRateData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1E293B' : '#fff', borderColor: theme === 'dark' ? '#334155' : '#e2e8f0', color: theme === 'dark' ? '#F8FAFC' : '#1e293b', borderRadius: '12px' }} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                            <span className="text-3xl font-black text-slate-905 dark:text-[#F8FAFC]">{computedMetrics.submissionRate}%</span>
                                            <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Rate</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-center gap-6 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-2">
                                        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></span> Completed</div>
                                        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full"></span> Pending</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab 2: Assignments Table */}
                    {activeTab === 'assignments' && (
                        <div className="space-y-8 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Assignment Catalog</h2>
                                    <p className="text-slate-500 dark:text-[#CBD5E1] text-sm font-medium">Create, publish, and monitor syllabus challenges.</p>
                                </div>
                                <Link
                                    to="/teacher/create-assignment"
                                    className="px-6 py-4 bg-[#6366F1] hover:bg-indigo-500 text-white font-black text-xs rounded-2xl uppercase tracking-widest shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
                                >
                                    <PlusCircle className="w-4.5 h-4.5" /> Publish New
                                </Link>
                            </div>

                            {/* Filters Bar */}
                            <div className="bg-white dark:bg-[#1E293B] p-4 rounded-3xl border border-slate-100 dark:border-[#334155] shadow-sm flex flex-col md:flex-row items-center gap-4">
                                <div className="relative flex-grow w-full">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search assignment catalog..."
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50/50 dark:bg-[#0F172A]/40 border border-slate-100 dark:border-[#334155]/60 rounded-2xl outline-none focus:border-[#6366F1] transition-all font-bold text-slate-700 dark:text-[#F8FAFC] placeholder:text-slate-350 dark:placeholder-slate-500"
                                        value={searchQuery}
                                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                    />
                                </div>
                                <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                                    <div className="relative w-full md:w-56">
                                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-[#CBD5E1]" />
                                        <select
                                            className="w-full pl-11 pr-10 py-3 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/60 rounded-2xl outline-none focus:border-indigo-600 dark:focus:border-indigo-500 font-black text-slate-700 dark:text-slate-300 uppercase text-[10px] tracking-widest appearance-none cursor-pointer"
                                            value={selectedClassFilter}
                                            onChange={e => { setSelectedClassFilter(e.target.value); setCurrentPage(1); }}
                                        >
                                            <option value="">All Academic Units</option>
                                            {classes.map(cls => (
                                                <option key={cls._id} value={cls._id}>{cls.className}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-450 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Data Registry Table */}
                            <div className="bg-white dark:bg-[#1E293B] rounded-[2.5rem] border border-slate-100 dark:border-[#334155] shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-slate-50/50 dark:bg-[#1E293B]/50 border-b border-slate-100 dark:border-[#334155]">
                                                <th className="px-8 py-5 text-[10px] font-black text-slate-450 dark:text-[#CBD5E1] uppercase tracking-widest">Title / Module</th>
                                                <th className="px-8 py-5 text-[10px] font-black text-slate-450 dark:text-[#CBD5E1] uppercase tracking-widest">Class Target</th>
                                                <th className="px-8 py-5 text-[10px] font-black text-slate-450 dark:text-[#CBD5E1] uppercase tracking-widest">Deadline</th>
                                                <th className="px-8 py-5 text-[10px] font-black text-slate-450 dark:text-[#CBD5E1] uppercase tracking-widest text-center">Submissions</th>
                                                <th className="px-8 py-5 text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest text-right">Operations</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                            {paginatedAssignments.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" className="px-8 py-20 text-center text-slate-400 dark:text-slate-550">
                                                        No active assignments located
                                                    </td>
                                                </tr>
                                            ) : (
                                                paginatedAssignments.map(asg => {
                                                    const subs = submissionsMap[asg._id] || [];
                                                    return (
                                                        <tr key={asg._id} className="hover:bg-slate-50/50 dark:hover:bg-[#334155]/20 transition-colors group">
                                                            <td className="px-8 py-5">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
                                                                        <BookOpen className="w-5 h-5" />
                                                                    </div>
                                                                    <div>
                                                                        <span className="block font-black text-slate-800 dark:text-[#F8FAFC] text-sm leading-tight mb-0.5">{asg.title}</span>
                                                                        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Academic challenge</span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-8 py-5">
                                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-350 rounded-xl text-[10px] font-black uppercase tracking-wider">
                                                                    <School className="w-3.5 h-3.5" />
                                                                    {asg.classId?.className || 'General'}
                                                                </span>
                                                            </td>
                                                            <td className="px-8 py-5">
                                                                <span className="text-slate-500 dark:text-[#CBD5E1] text-xs font-bold flex items-center gap-1.5">
                                                                    <Calendar className="w-4 h-4 text-rose-500" />
                                                                    {new Date(asg.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                                </span>
                                                            </td>
                                                            <td className="px-8 py-5 text-center">
                                                                <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-450 rounded-full text-xs font-black">
                                                                    {subs.length} submissions
                                                                </span>
                                                            </td>
                                                            <td className="px-8 py-5">
                                                                <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <Link
                                                                        to={`/teacher/submissions`}
                                                                        state={{ classId: asg.classId?._id, assignmentId: asg._id }}
                                                                        className="w-9 h-9 bg-slate-50 dark:bg-[#334155] text-slate-400 hover:text-[#6366F1] dark:hover:text-[#6366F1] rounded-lg flex items-center justify-center border border-slate-100 dark:border-[#334155]"
                                                                        title="Review Grades"
                                                                    >
                                                                        <Eye className="w-4 h-4" />
                                                                    </Link>
                                                                    <Link
                                                                        to={`/teacher/edit-assignment/${asg._id}`}
                                                                        className="w-9 h-9 bg-slate-50 dark:bg-[#334155] text-slate-400 hover:text-[#6366F1] dark:hover:text-[#6366F1] rounded-lg flex items-center justify-center border border-slate-100 dark:border-[#334155]"
                                                                        title="Reconfigure"
                                                                    >
                                                                        <Edit2 className="w-4 h-4" />
                                                                    </Link>
                                                                    <button
                                                                        onClick={() => handleDeleteAssignment(asg._id)}
                                                                        className="w-9 h-9 bg-slate-50 dark:bg-[#334155] text-slate-400 hover:text-rose-500 rounded-lg flex items-center justify-center border border-slate-100 dark:border-[#334155] cursor-pointer"
                                                                        title="Decommission"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination controls */}
                                {totalPages > 1 && (
                                    <div className="p-6 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            Page {currentPage} of {totalPages}
                                        </span>
                                        <div className="flex gap-2">
                                            <button
                                                disabled={currentPage === 1}
                                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center disabled:opacity-40"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </button>
                                            <button
                                                disabled={currentPage === totalPages}
                                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                                className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center disabled:opacity-40"
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Tab 3: Students / Class management preview */}
                    {activeTab === 'students' && (
                        <div className="space-y-8 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Academic Unit Roster</h2>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Verify structural class systems and candidate totals.</p>
                                </div>
                                <Link
                                    to="/teacher/classes"
                                    className="px-6 py-4 bg-indigo-655 hover:bg-indigo-555 text-white font-black text-xs rounded-2xl uppercase tracking-widest shadow-md flex items-center justify-center gap-2"
                                >
                                    Manage Registry
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {classes.map(cls => {
                                    const classAssignments = assignments.filter(a => a.classId?._id === cls._id).length;
                                    return (
                                        <div key={cls._id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/80 shadow-sm relative overflow-hidden group">
                                            <div className="flex justify-between items-center mb-6">
                                                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center text-lg font-black shadow-inner">
                                                    {cls.className.charAt(0)}
                                                </div>
                                                <span className="text-[9px] font-black text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 px-3 py-1 rounded-full uppercase tracking-wider">
                                                    {cls.department}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 leading-none">{cls.className}</h3>
                                            <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider mb-6">Unit verification code: {cls._id.slice(-6)}</p>
                                            
                                            <div className="pt-4 border-t border-slate-50 dark:border-slate-805/50 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                                                <span>{classAssignments} Assignments</span>
                                                <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> 28 Enrolled</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Tab 4: Analytics Dashboards */}
                    {activeTab === 'analytics' && (
                        <div className="space-y-8 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">SaaS Performance Analytics</h2>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Recharts statistical analysis for course evaluation.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Chart 1: Assignment Submission Trend */}
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm">
                                    <h3 className="text-sm font-black text-slate-900 dark:text-white mb-4">Submission Rate Trend</h3>
                                    <div className="h-64 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={submissionTrendData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                                                <XAxis dataKey="name" stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} style={{ fontSize: 10, fontWeight: 'bold' }} />
                                                <YAxis stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} style={{ fontSize: 10, fontWeight: 'bold' }} />
                                                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#0f172a' : '#fff', borderColor: theme === 'dark' ? '#1e293b' : '#e2e8f0', color: theme === 'dark' ? '#f8fafc' : '#1e293b', borderRadius: '12px' }} />
                                                <Area type="monotone" dataKey="rate" stroke="#a855f7" strokeWidth={2.5} fill="#a855f7" fillOpacity={0.1} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Chart 2: Student Performance Overview */}
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm">
                                    <h3 className="text-sm font-black text-slate-900 dark:text-white mb-4">Student Grade Distribution</h3>
                                    <div className="h-64 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={studentPerformanceData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                                                <XAxis dataKey="name" stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} style={{ fontSize: 10, fontWeight: 'bold' }} />
                                                <YAxis stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} style={{ fontSize: 10, fontWeight: 'bold' }} />
                                                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#0f172a' : '#fff', borderColor: theme === 'dark' ? '#1e293b' : '#e2e8f0', color: theme === 'dark' ? '#f8fafc' : '#1e293b', borderRadius: '12px' }} />
                                                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                                                    {studentPerformanceData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Chart 3: Monthly Activity */}
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm">
                                    <h3 className="text-sm font-black text-slate-900 dark:text-white mb-4">Instructor Monthly Activity</h3>
                                    <div className="h-64 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={monthlyActivityData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                                                <XAxis dataKey="name" stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} style={{ fontSize: 10, fontWeight: 'bold' }} />
                                                <YAxis stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} style={{ fontSize: 10, fontWeight: 'bold' }} />
                                                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#0f172a' : '#fff', borderColor: theme === 'dark' ? '#1e293b' : '#e2e8f0', color: theme === 'dark' ? '#f8fafc' : '#1e293b', borderRadius: '12px' }} />
                                                <Legend />
                                                <Line type="monotone" dataKey="reviews" name="Evaluated Submissions" stroke="#10b981" strokeWidth={2.5} activeDot={{ r: 8 }} />
                                                <Line type="monotone" dataKey="tasks" name="Active Assignments" stroke="#f59e0b" strokeWidth={2.5} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Chart 4: Review Statistics */}
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm">
                                    <h3 className="text-sm font-black text-slate-900 dark:text-white mb-4">Grading Queue Distribution</h3>
                                    <div className="h-64 w-full flex items-center justify-center">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={reviewStatsData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                >
                                                    {reviewStatsData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#0f172a' : '#fff', borderColor: theme === 'dark' ? '#1e293b' : '#e2e8f0', color: theme === 'dark' ? '#f8fafc' : '#1e293b', borderRadius: '12px' }} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab 5: Report Generation */}
                    {activeTab === 'reports' && (
                        <div className="space-y-8 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Audit & Print Reports</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Export academic documents in high-fidelity formats.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    { title: 'Download Student Report', type: 'student', desc: 'Detailed candidates scores, class units mapping, and performance directories.' },
                                    { title: 'Download Submission Report', type: 'submission', desc: 'Complete logs of all submissions, graded marks, timestamps, and feedback.' },
                                    { title: 'Download Class Report', type: 'class', desc: 'Structural department audits, aggregates average scores, and unit indices.' }
                                ].map((rep, idx) => (
                                    <div key={idx} className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800/80 shadow-sm flex flex-col justify-between group">
                                        <div>
                                            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6">
                                                <Printer className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 leading-tight">{rep.title}</h3>
                                            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium leading-relaxed mb-8">{rep.desc}</p>
                                        </div>
                                        <button
                                            onClick={() => handlePrintReport(rep.type)}
                                            className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            <Download className="w-4.5 h-4.5" /> Initialize Download
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tab 6: Notifications */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-8 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Notification Center</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Review system audit alerts and student submission protocols.</p>
                            </div>

                            <div className="max-w-4xl bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/80 shadow-sm p-6 sm:p-8 space-y-4">
                                <div className="flex justify-between items-center pb-4 border-b border-slate-105 dark:border-slate-800/60">
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">System Logs & Alerts</span>
                                    <button 
                                        onClick={() => {
                                            setLocalNotifications(prev => prev.map(n => ({ ...n, read: true })));
                                        }}
                                        className="text-[10px] font-black text-indigo-650 dark:text-indigo-400 hover:underline uppercase tracking-wider bg-transparent border-none cursor-pointer"
                                    >
                                        Mark All as Read
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {localNotifications.length === 0 ? (
                                        <div className="py-12 text-center text-slate-400 dark:text-slate-500 font-bold">
                                            No active notifications reported.
                                        </div>
                                    ) : (
                                        localNotifications.map(notif => {
                                            return (
                                                <div 
                                                    key={notif.id}
                                                    onClick={() => {
                                                        setLocalNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
                                                    }}
                                                    className={`p-5 rounded-2xl border flex gap-4 transition-all duration-200 cursor-pointer ${
                                                        notif.read 
                                                        ? 'bg-transparent border-slate-100 dark:border-slate-800/50 opacity-60' 
                                                        : 'bg-indigo-50/10 dark:bg-indigo-950/10 border-indigo-100/40 dark:border-indigo-900/30 shadow-sm'
                                                    }`}
                                                >
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400`}>
                                                        <Bell className="w-5 h-5" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex justify-between items-start">
                                                            <h4 className="text-sm font-black text-slate-850 dark:text-slate-200 truncate">{notif.title}</h4>
                                                            <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 shrink-0 ml-4">{notif.time}</span>
                                                        </div>
                                                        <p className="text-xs text-slate-500 dark:text-slate-405 font-medium leading-normal mt-1">{notif.message}</p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab 7: Settings */}
                    {activeTab === 'settings' && (
                        <div className="space-y-8 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Portal Settings</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Reconfigure teacher portal configurations.</p>
                            </div>

                            <div className="max-w-xl bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/80 shadow-sm p-8 sm:p-10 space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-450 dark:text-slate-500">General Options</h3>
                                    
                                    <div className="flex justify-between items-center py-4 border-b border-slate-50 dark:border-slate-805/50">
                                        <div>
                                            <h4 className="text-sm font-black text-slate-850 dark:text-slate-200 leading-none mb-1">Live Notifications</h4>
                                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Sound alert for new submissions</p>
                                        </div>
                                        <input type="checkbox" defaultChecked className="w-5 h-5 accent-indigo-600 cursor-pointer" />
                                    </div>

                                    <div className="flex justify-between items-center py-4 border-b border-slate-50 dark:border-slate-805/50">
                                        <div>
                                            <h4 className="text-sm font-black text-slate-850 dark:text-slate-200 leading-none mb-1">Profile Visibility</h4>
                                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Show my email in class lists</p>
                                        </div>
                                        <input type="checkbox" defaultChecked className="w-5 h-5 accent-indigo-600 cursor-pointer" />
                                    </div>

                                    <div className="flex justify-between items-center py-4">
                                        <div>
                                            <h4 className="text-sm font-black text-slate-850 dark:text-slate-200 leading-none mb-1">Profile Hub</h4>
                                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Edit bio, avatar, and security passwords</p>
                                        </div>
                                        <Link to="/profile" className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline uppercase tracking-wider flex items-center gap-1">
                                            Configure <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default TeacherDashboard;
