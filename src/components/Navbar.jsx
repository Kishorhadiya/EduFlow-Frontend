import { useContext, useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import ThemeContext from '../context/ThemeContext';
import NotificationBell from './NotificationBell';
import {
    LayoutDashboard,
    BookOpen,
    User,
    LogOut,
    Menu,
    X,
    ClipboardList,
    GraduationCap,
    School,
    ArrowRight,
    Sun,
    Moon,
    Bell,
    CheckCircle2,
    AlertCircle,
    FileText,
    Award
} from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Initialize mock or dynamic notifications
    useEffect(() => {
        if (!user) return;
        
        if (user.role === 'teacher') {
            const initialNotifs = [
                {
                    id: '1',
                    type: 'submission',
                    title: 'New Assignment Submission',
                    message: 'Kishor Hadiya submitted: Advanced Systems Redesign',
                    time: '10 mins ago',
                    read: false,
                    icon: ClipboardList,
                    color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
                },
                {
                    id: '2',
                    type: 'created',
                    title: 'Assignment Created Successfully',
                    message: 'MERN Stack Challenge is now active for CS - 2024.',
                    time: '2 hours ago',
                    read: false,
                    icon: FileText,
                    color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
                },
                {
                    id: '3',
                    type: 'deadline',
                    title: 'Deadline Reached',
                    message: 'The deadline for CSS Layout Lab has expired.',
                    time: '1 day ago',
                    read: true,
                    icon: AlertCircle,
                    color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/30'
                }
            ];
            setNotifications(initialNotifs);
        } else {
            // Student dynamic notifications computed from local storage cache
            const loadStudentNotifications = () => {
                const storedAss = localStorage.getItem('student_assignments');
                const storedSubs = localStorage.getItem('student_submissions');
                const readIds = JSON.parse(localStorage.getItem('student_read_notifications') || '[]');

                if (storedAss && storedSubs) {
                    const ass = JSON.parse(storedAss);
                    const subs = JSON.parse(storedSubs);
                    const now = new Date();
                    const list = [];

                    // 1. Graded submissions
                    const graded = subs.filter(s => s.status === 'reviewed');
                    graded.forEach(g => {
                        const id = `grade-${g._id}`;
                        list.push({
                            id,
                            type: 'marks',
                            title: 'Marks Published',
                            message: `Your submission for "${g.assignmentId?.title || 'Assignment'}" was graded: ${g.marks || 0}/100.`,
                            time: 'Recently',
                            read: readIds.includes(id)
                        });
                    });

                    // 2. Pending assignments near deadline (< 24 hours)
                    ass.forEach(asg => {
                        const hasSubmitted = subs.some(s => s.assignmentId?._id === asg._id || s.assignmentId === asg._id);
                        if (!hasSubmitted) {
                            const diffMs = new Date(asg.dueDate) - now;
                            const diffHours = diffMs / (1000 * 60 * 60);
                            if (diffHours > 0 && diffHours < 24) {
                                const id = `deadline-${asg._id}`;
                                list.push({
                                    id,
                                    type: 'deadline',
                                    title: 'Deadline Approaching',
                                    message: `Warning: "${asg.title}" is due in ${Math.round(diffHours)} hours.`,
                                    time: 'Urgent',
                                    read: readIds.includes(id)
                                });
                            }
                        }
                    });

                    // 3. New assignments (created in last 7 days)
                    ass.forEach(asg => {
                        const diffMs = now - new Date(asg.createdAt || Date.now());
                        const diffDays = diffMs / (1000 * 60 * 60 * 24);
                        if (diffDays >= 0 && diffDays < 7) {
                            const id = `new-${asg._id}`;
                            list.push({
                                id,
                                type: 'created',
                                title: 'New Assignment Posted',
                                message: `Instructor published: "${asg.title}"`,
                                time: 'Recent',
                                read: readIds.includes(id)
                            });
                        }
                    });

                    setNotifications(list);
                } else {
                    // Fallback alerts
                    setNotifications([
                        {
                            id: 'fallback-1',
                            type: 'marks',
                            title: 'Marks Published',
                            message: 'Your submission for React Basics has been graded: 95/100.',
                            time: '20 mins ago',
                            read: readIds.includes('fallback-1')
                        },
                        {
                            id: 'fallback-2',
                            type: 'created',
                            title: 'New Assignment Posted',
                            message: 'Instructor published: Full-Stack Web Development',
                            time: '3 hours ago',
                            read: readIds.includes('fallback-2')
                        }
                    ]);
                }
            };

            loadStudentNotifications();
            const interval = setInterval(loadStudentNotifications, 4000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const markAllAsRead = () => {
        if (user && user.role === 'student') {
            const readIds = notifications.map(n => n.id);
            localStorage.setItem('student_read_notifications', JSON.stringify(readIds));
        }
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const handleNotifClick = (id) => {
        if (user && user.role === 'student') {
            const readIds = JSON.parse(localStorage.getItem('student_read_notifications') || '[]');
            if (!readIds.includes(id)) {
                readIds.push(id);
                localStorage.setItem('student_read_notifications', JSON.stringify(readIds));
            }
        }
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const teacherLinks = [
        { to: "/teacher/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/teacher/classes", label: "Classes", icon: School },
        { to: "/teacher/assignments", label: "Assignments", icon: BookOpen },
    ];

    const studentLinks = [
        { to: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/student/my-submissions", label: "My Work", icon: ClipboardList },
    ];

    const links = user?.role === 'teacher' ? teacherLinks : studentLinks;

    return (
        <div className="fixed top-3 sm:top-4 md:top-6 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-0.75rem)] sm:w-[calc(100%-1rem)] md:w-[calc(100%-2rem)] max-w-7xl animate-cinematic-in">
            <nav className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/40 dark:border-slate-800/40 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.4)] px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3.5 rounded-2xl md:rounded-[2rem] transition-all">
                <div className="flex justify-between items-center">

                    {/* Brand Logo */}
                    <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 dark:bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-all duration-500 group-hover:rotate-3">
                            <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">EduFlow</span>
                            <span className="text-[8px] sm:text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] leading-none">Management</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    {user && (
                        <div className="hidden lg:flex items-center gap-1 bg-slate-950/5 dark:bg-white/5 p-1 rounded-2xl border border-slate-100 dark:border-slate-800/40">
                            {links.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${isActive
                                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-md shadow-slate-900/10'
                                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-white/5'
                                        }`
                                    }
                                >
                                    <link.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                    <span className="hidden sm:inline">{link.label}</span>
                                </NavLink>
                            ))}
                        </div>
                    )}

                    {/* Action Section */}
                    <div className="flex items-center gap-1 sm:gap-2 relative">
                        
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 text-slate-500 dark:text-slate-300 rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-95"
                            title="Toggle Mode"
                        >
                            {theme === 'light' ? <Moon className="w-4 h-4 sm:w-5 sm:h-5" /> : <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />}
                        </button>

                        {user && (
                            <div className="relative flex-nowrap flex items-center gap-1 sm:gap-2">
                                
                                {/* Dynamic Notification Bell */}
                                <NotificationBell
                                    notifications={notifications}
                                    onMarkAsRead={handleNotifClick}
                                    onClearAll={markAllAsRead}
                                />

                                <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-0.5 sm:mx-1 hidden md:block"></div>

                                <Link
                                    to={user.role === 'student' ? "/student/profile" : "/profile"}
                                    className="hidden md:flex flex-col items-end mr-1 group/user"
                                >
                                    <span className="text-[10px] font-black text-slate-900 dark:text-white leading-none group-hover/user:text-indigo-600 dark:group-hover/user:text-indigo-400 transition-colors uppercase tracking-tight">{user.name}</span>
                                    <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-1">{user.role}</span>
                                </Link>

                                <Link
                                    to={user.role === 'student' ? "/student/profile" : "/profile"}
                                    className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 text-slate-400 dark:text-slate-350 rounded-xl flex items-center justify-center hover:bg-slate-950 hover:text-white dark:hover:bg-white dark:hover:text-slate-950 transition-all hover:scale-110 active:scale-95"
                                    title="Profile Settings"
                                >
                                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="w-9 h-9 sm:w-10 sm:h-10 bg-rose-50 dark:bg-rose-950/20 border border-rose-105 dark:border-rose-900/30 text-rose-450 dark:text-rose-400 rounded-xl flex items-center justify-center hover:bg-rose-550 dark:hover:bg-rose-500 hover:text-white transition-all hover:scale-110 active:scale-95 group cursor-pointer"
                                    title="Secure Logout"
                                >
                                    <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>

                                {/* Mobile Toggle */}
                                <button
                                    className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 bg-slate-950 dark:bg-slate-800 border border-slate-800 dark:border-slate-700 text-white rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
                                    onClick={() => { setIsMenuOpen(!isMenuOpen); }}
                                >
                                    {isMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
                                </button>
                            </div>
                        )}

                        {!user && (
                            <div className="flex items-center gap-2 sm:gap-4">
                                <Link
                                    to="/login"
                                    className="text-[10px] sm:text-xs font-black text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase tracking-widest"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-3 py-2 sm:px-5 sm:py-3 bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-[9px] sm:text-[10px] font-black rounded-xl hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white transition-all shadow-md flex items-center gap-1 sm:gap-2 group uppercase tracking-widest"
                                >
                                    <span className="hidden sm:inline">Join EduFlow</span>
                                    <span className="sm:hidden">Join</span>
                                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Drawer */}
                {isMenuOpen && user && (
                    <div className="lg:hidden mt-4 bg-white/80 dark:bg-slate-900/95 backdrop-blur-xl rounded-[1.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl p-4 animate-in slide-in-from-top-4 duration-300">
                        <div className="space-y-1">
                            {links.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center gap-4 p-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isActive
                                            ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-md shadow-slate-900/10'
                                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`
                                    }
                                >
                                    <link.icon className="w-4 h-4" />
                                    {link.label}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                )}
            </nav>
        </div>
    );
};

export default Navbar;
