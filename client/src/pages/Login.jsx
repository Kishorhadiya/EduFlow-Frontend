import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import ThemeContext from '../context/ThemeContext';
import Swal from 'sweetalert2';
import {
    Mail,
    ArrowRight,
    GraduationCap,
    KeyRound
} from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
                Swal.fire({
                    icon: 'success',
                    title: 'Welcome Back!',
                    text: 'Establishing secure link...',
                    timer: 1500,
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
                text: 'Connection failed.',
                background: theme === 'dark' ? '#0f172a' : '#fff',
                color: theme === 'dark' ? '#f8fafc' : '#1e293b'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 relative overflow-hidden font-sans transition-colors duration-300">

            {/* Subtle Gradient Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900"></div>
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-200/10 dark:bg-indigo-500/5 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200/10 dark:bg-blue-500/5 rounded-full blur-[100px] animate-pulse"></div>
            </div>

            <div className="relative z-10 w-full max-w-[400px] sm:max-w-[440px]">
                {/* Branding */}
                <div className="flex flex-col items-center mb-6 sm:mb-8">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-indigo-600 dark:bg-indigo-500 rounded-2xl flex items-center justify-center shadow-xl mb-3 sm:mb-4 group hover:scale-105 transition-transform duration-300 cursor-pointer">
                        <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Welcome to EduFlow</h1>
                    <p className="text-slate-400 dark:text-slate-500 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em] mt-1.5">MERN Management Suite</p>
                </div>

                {/* Glassmorphic Login Card */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] p-6 sm:p-8 md:p-10 lg:p-12 border border-slate-100/50 dark:border-slate-800/50">
                    <div className="mb-6 sm:mb-8 text-center">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-850 dark:text-white mb-2 tracking-tight">Sign In</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium">Please enter your credentials.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors pointer-events-none">
                                    <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-3 sm:py-4 bg-slate-50/50 dark:bg-slate-950/30 border-2 border-slate-100 dark:border-slate-800/60 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-600 dark:focus:border-indigo-500 outline-none transition-all font-bold text-slate-805 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-700 text-sm"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    autoComplete="off"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-end mr-1">
                                <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Password</label>
                                <a href="#" className="text-[9px] sm:text-[10px] font-black text-slate-405 dark:text-slate-500 uppercase tracking-widest hover:text-slate-950 dark:hover:text-white transition-colors">Forgot Pwd?</a>
                            </div>
                            <div className="relative group">
                                <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors pointer-events-none">
                                    <KeyRound className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                                <input
                                    type="password"
                                    placeholder="••••••••••••"
                                    className="w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-3 sm:py-4 bg-slate-50/50 dark:bg-slate-950/30 border-2 border-slate-100 dark:border-slate-800/60 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-600 dark:focus:border-indigo-500 outline-none transition-all font-bold text-slate-805 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-700 text-sm"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3.5 sm:py-4.5 bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white font-black text-xs sm:text-sm rounded-2xl transition-all shadow-lg shadow-indigo-600/10 dark:shadow-indigo-500/10 hover:shadow-indigo-600/20 dark:hover:shadow-indigo-500/20 flex items-center justify-center gap-2 sm:gap-3 active:scale-[0.98] disabled:opacity-70 group mt-2 cursor-pointer"
                        >
                            {isSubmitting ? (
                                <div className="w-4 h-4 sm:w-5 sm:h-5 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>Log In</span>
                                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-100 dark:border-slate-800/60 text-center">
                        <p className="text-slate-400 dark:text-slate-500 font-bold text-[10px] sm:text-xs tracking-tight">
                            Don't have an account? <Link to="/register" className="text-indigo-600 dark:text-indigo-450 hover:underline font-black ml-1">Register now</Link>
                        </p>
                    </div>
                </div>

                <div className="mt-6 sm:mt-8 text-center text-slate-300 dark:text-slate-700 text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.5em]">
                    SECURE ACCESS • v2.6
                </div>
            </div>
        </div>
    );
};

export default Login;
