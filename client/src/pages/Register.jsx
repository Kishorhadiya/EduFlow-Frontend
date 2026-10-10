import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import ThemeContext from '../context/ThemeContext';
import Swal from 'sweetalert2';
import classroomImg from '../assets/classroom.jpg';
import {
    User,
    Mail,
    UserCircle,
    School,
    ArrowRight,
    GraduationCap,
    KeyRound,
    ChevronDown,
    Eye,
    EyeOff,
    ShieldCheck
} from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student',
        classId: ''
    });
    const [classes, setClasses] = useState([]);
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

    useEffect(() => {
        if (formData.role === 'student') {
            fetch(`${API_URL}/classes`)
                .then(res => res.json())
                .then(data => {
                    setClasses(Array.isArray(data) ? data : []);
                    // Auto-select first class if available
                    if (Array.isArray(data) && data.length > 0 && !formData.classId) {
                        setFormData(prev => ({ ...prev, classId: data[0]._id }));
                    }
                })
                .catch(err => console.error(err));
        }
    }, [formData.role, API_URL]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                login(data);
                const roleLabel = data.role === 'teacher' ? '👨‍🏫 Teacher' : '🎓 Student';
                Swal.fire({
                    icon: 'success',
                    title: `Welcome, ${data.name}!`,
                    html: `<div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-top:4px;">
                        <span style="background:${data.role === 'teacher' ? '#6366f1' : '#10b981'};color:#fff;padding:3px 12px;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:0.05em;">${roleLabel}</span>
                    </div>
                    <p style="margin-top:10px;font-size:13px;color:#64748b;">Your account has been created successfully!</p>`,
                    timer: 2000,
                    showConfirmButton: false,
                    background: theme === 'dark' ? '#0f172a' : '#fff',
                    color: theme === 'dark' ? '#f8fafc' : '#1e293b'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Registration Failed',
                    text: data.message || 'Validation error. Please check your details.',
                    background: theme === 'dark' ? '#0f172a' : '#fff',
                    color: theme === 'dark' ? '#f8fafc' : '#1e293b'
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Network Error',
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
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl dark:shadow-black/60 overflow-hidden flex flex-col lg:flex-row border border-slate-200/80 dark:border-slate-800/80 min-h-[620px]">

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
                            <div className="mb-7">
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
                                    Create Account
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                                    Fill in your academic profile details to get started.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">

                                {/* Name + Role Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Full Name */}
                                    <div className="space-y-1.5">
                                        <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                                            Full Name
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors pointer-events-none">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <input
                                                type="text"
                                                id="register-name"
                                                placeholder="e.g. Alex Johnson"
                                                className="w-full pl-11 pr-3 py-3.5 bg-slate-50 dark:bg-slate-800/70 border-2 border-slate-200 dark:border-slate-700/70 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-600 dark:focus:border-indigo-400 outline-none transition-all font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm shadow-sm"
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                autoComplete="off"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Portal Role */}
                                    <div className="space-y-1.5">
                                        <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                                            Portal Role
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors pointer-events-none">
                                                <UserCircle className="w-4 h-4" />
                                            </div>
                                            <select
                                                id="register-role"
                                                className="w-full pl-11 pr-9 py-3.5 bg-slate-50 dark:bg-slate-800/70 border-2 border-slate-200 dark:border-slate-700/70 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-600 dark:focus:border-indigo-400 outline-none transition-all font-bold text-slate-800 dark:text-slate-100 appearance-none cursor-pointer text-sm shadow-sm"
                                                onChange={e => setFormData({ ...formData, role: e.target.value, classId: '' })}
                                                value={formData.role}
                                            >
                                                <option value="student">🎓 Student</option>
                                                <option value="teacher">👨‍🏫 Teacher</option>
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>

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
                                            id="register-email"
                                            placeholder="your@institution.edu"
                                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/70 border-2 border-slate-200 dark:border-slate-700/70 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-600 dark:focus:border-indigo-400 outline-none transition-all font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm shadow-sm"
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            autoComplete="off"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="space-y-1.5">
                                    <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                                        Password
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors pointer-events-none">
                                            <KeyRound className="w-4 h-4" />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="register-password"
                                            placeholder="Min. 6 characters"
                                            className="w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-slate-800/70 border-2 border-slate-200 dark:border-slate-700/70 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-600 dark:focus:border-indigo-400 outline-none transition-all font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm shadow-sm"
                                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                                            autoComplete="new-password"
                                            minLength={6}
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

                                {/* Class Assignment — Student Only */}
                                {formData.role === 'student' && (
                                    <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                                        <div className="flex items-center justify-between ml-1">
                                            <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                Class Assignment
                                            </label>
                                            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">Required</span>
                                        </div>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors pointer-events-none">
                                                <School className="w-4 h-4" />
                                            </div>
                                            <select
                                                id="register-class"
                                                className="w-full pl-11 pr-9 py-3.5 bg-slate-50 dark:bg-slate-800/70 border-2 border-slate-200 dark:border-slate-700/70 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-600 dark:focus:border-indigo-400 outline-none transition-all font-semibold text-slate-800 dark:text-slate-100 appearance-none cursor-pointer text-sm shadow-sm"
                                                onChange={e => setFormData({ ...formData, classId: e.target.value })}
                                                value={formData.classId}
                                                required
                                            >
                                                <option value="">Select Academic Unit / Class</option>
                                                {classes.map(cls => (
                                                    <option key={cls._id} value={cls._id}>{cls.className}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
                                        </div>
                                        {classes.length === 0 && (
                                            <p className="text-xs text-amber-600 dark:text-amber-400 ml-1 mt-1 font-medium">
                                                ⏳ Loading classes... If none appear, contact your instructor.
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    id="register-submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/35 flex items-center justify-center gap-2.5 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed group mt-3 cursor-pointer"
                                >
                                    {isSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <ShieldCheck className="w-4 h-4" />
                                            <span>Create Academic Account</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Footer Link */}
                            <div className="mt-7 pt-5 border-t border-slate-100 dark:border-slate-800/80 text-center">
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                                    Already have an account?{' '}
                                    <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-black hover:underline ml-1">
                                        Sign in here
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

export default Register;

