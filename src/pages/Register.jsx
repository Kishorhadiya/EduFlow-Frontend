import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import ThemeContext from '../context/ThemeContext';
import Swal from 'sweetalert2';
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
    ShieldCheck,
    BookOpen,
    Users,
    Star
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
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-sans p-4 py-8">

            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-400/10 dark:bg-indigo-600/8 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-violet-400/10 dark:bg-violet-600/8 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 w-full max-w-4xl">
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl dark:shadow-black/40 overflow-hidden flex flex-col lg:flex-row border border-slate-100 dark:border-slate-800/60">

                    {/* ── Left Brand Panel ── */}
                    <div className="lg:w-2/5 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 p-10 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -mr-36 -mt-36" />
                        <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full -ml-28 -mb-28" />

                        <div className="relative z-10">
                            {/* Logo */}
                            <div className="w-14 h-14 bg-white/15 backdrop-blur rounded-2xl flex items-center justify-center mb-8 border border-white/20">
                                <GraduationCap className="w-7 h-7 text-white" />
                            </div>

                            <h1 className="text-3xl xl:text-4xl font-black mb-3 leading-tight tracking-tight">
                                Join<br />
                                <span className="text-indigo-200">EduFlow</span>
                            </h1>
                            <p className="text-indigo-200/70 text-sm font-medium leading-relaxed">
                                Create your academic profile and become part of our growing educational community.
                            </p>
                        </div>

                        {/* Feature Points */}
                        <div className="relative z-10 mt-10 space-y-4">
                            {[
                                { icon: BookOpen, text: 'Submit & Track Assignments' },
                                { icon: Users, text: 'Join Academic Classes' },
                                { icon: Star, text: 'View Grades & Feedback' },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                                        <item.icon className="w-4 h-4 text-indigo-200" />
                                    </div>
                                    <span className="text-indigo-100 text-xs font-semibold">{item.text}</span>
                                </div>
                            ))}
                        </div>

                        <div className="relative z-10 mt-8 pt-6 border-t border-white/10">
                            <p className="text-indigo-300/60 text-[10px] font-bold uppercase tracking-[0.3em]">SECURE REGISTRATION · v2.6</p>
                        </div>
                    </div>

                    {/* ── Right Form Panel ── */}
                    <div className="lg:w-3/5 p-8 md:p-12 flex flex-col justify-center bg-white dark:bg-slate-900">
                        <div className="max-w-sm mx-auto w-full">
                            {/* Header */}
                            <div className="mb-7">
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-1">Create Account</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Fill in your details to get started.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">

                                {/* Name + Role Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Full Name */}
                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors pointer-events-none">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <input
                                                type="text"
                                                id="register-name"
                                                placeholder="Your Full Name"
                                                className="w-full pl-11 pr-3 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700/60 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition-all font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 text-sm"
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                autoComplete="off"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Portal Role */}
                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Portal Role</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors pointer-events-none">
                                                <UserCircle className="w-4 h-4" />
                                            </div>
                                            <select
                                                id="register-role"
                                                className="w-full pl-11 pr-9 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700/60 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition-all font-bold text-slate-800 dark:text-slate-100 appearance-none cursor-pointer text-sm"
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
                                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors pointer-events-none">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="email"
                                            id="register-email"
                                            placeholder="your@email.com"
                                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700/60 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition-all font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 text-sm"
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            autoComplete="off"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Password</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors pointer-events-none">
                                            <KeyRound className="w-4 h-4" />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="register-password"
                                            placeholder="Min. 6 characters"
                                            className="w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700/60 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition-all font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 text-sm"
                                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                                            autoComplete="new-password"
                                            minLength={6}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Class Assignment — Student Only */}
                                {formData.role === 'student' && (
                                    <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                                        <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                                            Class Assignment
                                            <span className="ml-2 text-indigo-500 normal-case font-semibold tracking-normal">(required)</span>
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors pointer-events-none">
                                                <School className="w-4 h-4" />
                                            </div>
                                            <select
                                                id="register-class"
                                                className="w-full pl-11 pr-9 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700/60 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition-all font-semibold text-slate-800 dark:text-slate-100 appearance-none cursor-pointer text-sm"
                                                onChange={e => setFormData({ ...formData, classId: e.target.value })}
                                                value={formData.classId}
                                                required
                                            >
                                                <option value="">Select Academic Unit</option>
                                                {classes.map(cls => (
                                                    <option key={cls._id} value={cls._id}>{cls.className}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
                                        </div>
                                        {classes.length === 0 && (
                                            <p className="text-xs text-amber-500 dark:text-amber-400 ml-1 mt-1">
                                                ⚠️ Loading classes... If empty, contact your teacher.
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    id="register-submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 flex items-center justify-center gap-2.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed group mt-3 cursor-pointer"
                                >
                                    {isSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <ShieldCheck className="w-4 h-4" />
                                            <span>Create Account</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Footer Link */}
                            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                                    Already a member?{' '}
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
