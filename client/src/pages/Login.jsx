import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import ThemeContext from '../context/ThemeContext';
import Swal from 'sweetalert2';
import classroomImg from '../assets/classroom.jpg';
import {
    Mail,
    ArrowRight,
    GraduationCap,
    KeyRound,
    Eye,
    EyeOff,
    ShieldCheck
} from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, user } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        if (user) {
            if (user.role === 'teacher') {
                navigate('/teacher/dashboard');
            } else if (user.role === 'student') {
                navigate('/student/dashboard');
            }
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                login(data);
                const roleLabel = data.role === 'teacher' ? '👨‍🏫 Teacher' : '🎓 Student';
                Swal.fire({
                    icon: 'success',
                    title: `Welcome Back, ${data.name}!`,
                    html: `<div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-top:4px;">
                        <span style="background:${data.role === 'teacher' ? '#6366f1' : '#10b981'};color:#fff;padding:3px 12px;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:0.05em;">${roleLabel}</span>
                    </div>
                    <p style="margin-top:10px;font-size:13px;color:#64748b;">Redirecting to your dashboard...</p>`,
                    timer: 2000,
                    showConfirmButton: false,
                    background: theme === 'dark' ? '#0f172a' : '#fff',
                    color: theme === 'dark' ? '#f8fafc' : '#1e293b'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Access Denied',
                    text: data.message || 'Invalid credentials.',
                    background: theme === 'dark' ? '#0f172a' : '#fff',
                    color: theme === 'dark' ? '#f8fafc' : '#1e293b'
                });
            }
        } catch (error) {
            console.error('Fetch error:', error);
            Swal.fire({
                icon: 'error',
                title: 'System Offline',
                text: 'Connection failed. Please try again.',
                background: theme === 'dark' ? '#0f172a' : '#fff',
                color: theme === 'dark' ? '#f8fafc' : '#1e293b'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 dark:bg-slate-950 transition-colors duration-300 font-sans p-3 sm:p-6 lg:p-8">

            {/* Ambient Background Glows */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-15%] right-[-10%] w-[550px] h-[550px] bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-[130px]" />
                <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] bg-violet-500/10 dark:bg-violet-600/15 rounded-full blur-[130px]" />
            </div>

            <div className="relative z-10 w-full max-w-5xl">
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl dark:shadow-black/60 overflow-hidden flex flex-col lg:flex-row border border-slate-200/80 dark:border-slate-800/80 min-h-[580px]">

                    {/* ── Left Hero Panel (Vibrant Classroom Image with Gloss & Shine) ── */}
                    <div className="h-56 sm:h-72 lg:h-auto lg:w-1/2 relative overflow-hidden shrink-0 group">
                        {/* High-definition vibrant image with sharp clarity */}
                        <img
                            src={classroomImg}
                            alt="Classroom Education"
                            className="w-full h-full object-cover object-center filter brightness-[1.05] contrast-[1.08] saturate-[1.18] transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        {/* Glossy specular shine reflection */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-white/25 pointer-events-none" />
                        {/* Top-right ambient light flare */}
                        <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/20 rounded-full blur-2xl pointer-events-none" />
                        {/* Subtle bottom shadow vignette for depth */}
                        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/40 to-transparent pointer-events-none" />
                        {/* Fine inner border ring for a polished glass frame look */}
                        <div className="absolute inset-0 ring-1 ring-inset ring-white/15 pointer-events-none" />
                    </div>

                    {/* ── Right Form Panel ── */}
                    <div className="lg:w-1/2 p-8 sm:p-10 md:p-12 flex flex-col justify-center bg-white dark:bg-slate-900 transition-colors">
                        <div className="max-w-md mx-auto w-full">
                            
                            {/* Header & Logo */}
                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-11 h-11 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                                        <GraduationCap className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                            EduFlow
                                        </h1>
                                        <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                            Academic Management Suite
                                        </p>
                                    </div>
                                </div>

                                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                                    Sign In
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                                    Welcome back! Enter your credentials to access your dashboard.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Email */}
                                <div className="space-y-1.5">
                                    <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                                        Email Address
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors pointer-events-none">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="email"
                                            id="login-email"
                                            placeholder="your@institution.edu"
                                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/70 border-2 border-slate-200 dark:border-slate-700/70 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-600 dark:focus:border-indigo-400 outline-none transition-all font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm shadow-sm"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            autoComplete="email"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center ml-1 mr-1">
                                        <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Password
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => Swal.fire({
                                                icon: 'info',
                                                title: 'Password Recovery',
                                                text: 'Please contact your institution administrator or teacher to reset your password.',
                                                background: theme === 'dark' ? '#0f172a' : '#fff',
                                                color: theme === 'dark' ? '#f8fafc' : '#1e293b'
                                            })}
                                            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors pointer-events-none">
                                            <KeyRound className="w-4 h-4" />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="login-password"
                                            placeholder="••••••••••••"
                                            className="w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-slate-800/70 border-2 border-slate-200 dark:border-slate-700/70 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-600 dark:focus:border-indigo-400 outline-none transition-all font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm shadow-sm"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            autoComplete="current-password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer p-1"
                                            tabIndex={-1}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    id="login-submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/35 flex items-center justify-center gap-2.5 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed group mt-2 cursor-pointer"
                                >
                                    {isSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <ShieldCheck className="w-4 h-4" />
                                            <span>Sign In to Dashboard</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Footer Link */}
                            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 text-center">
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                                    Don&apos;t have an account yet?{' '}
                                    <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-black hover:underline ml-1">
                                        Create one now
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

