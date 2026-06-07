import { useState, useEffect, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import ThemeContext from '../../context/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
    PlusCircle,
    ChevronLeft,
    FileText,
    Calendar,
    Users,
    Edit3,
    CheckCircle2,
    ArrowRight,
    Trophy,
    Target,
    Zap,
    Rocket
} from 'lucide-react';

const CreateAssignment = () => {
    const [classes, setClasses] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        classId: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        fetch(`${API_URL}/classes`)
            .then(res => res.json())
            .then(data => setClasses(data))
            .catch(err => console.error(err));
    }, [API_URL]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_URL}/assignments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Curriculum Published!',
                    text: 'The academic challenge has been dispatched to all enrolled students.',
                    timer: 2000,
                    showConfirmButton: false,
                    background: theme === 'dark' ? '#0f172a' : '#fff',
                    color: theme === 'dark' ? '#f8fafc' : '#1e293b'
                });
                navigate('/teacher/dashboard');
            } else {
                const data = await res.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Publishing Failed',
                    text: data.message || 'Validation protocol error.',
                    background: theme === 'dark' ? '#0f172a' : '#fff',
                    color: theme === 'dark' ? '#f8fafc' : '#1e293b'
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Network Interruption',
                text: 'Could not establish connection to the curriculum server.',
                background: theme === 'dark' ? '#0f172a' : '#fff',
                color: theme === 'dark' ? '#f8fafc' : '#1e293b'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-10 font-sans transition-colors duration-300">
            <div className="max-w-5xl mx-auto">
                {/* Navigation Back */}
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-black text-xs uppercase tracking-widest mb-10 transition-colors group cursor-pointer bg-transparent border-none"
                >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Workspace
                </button>

                <div className="bg-white/85 dark:bg-slate-900/80 backdrop-blur-xl rounded-[3rem] shadow-xl dark:shadow-none overflow-hidden border border-slate-100 dark:border-slate-805/60 min-h-[580px] flex flex-col lg:flex-row transition-all">

                    {/* Visual Brand Side (Left) */}
                    <div className="lg:w-2/5 bg-slate-900 p-10 md:p-14 text-white flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500 rounded-full blur-[80px] -ml-24 -mb-24"></div>
                        </div>

                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-lg shadow-indigo-500/40">
                                <Rocket className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-3xl xl:text-4xl font-black mb-6 leading-tight tracking-tight">
                                Design Your <br />
                                <span className="text-indigo-400 italic">Curriculum</span>.
                            </h1>
                            <p className="text-indigo-100/60 text-base font-medium leading-relaxed max-w-xs">
                                Orchestrate high-level academic challenges and push them to your specific academic units.
                            </p>
                        </div>

                        <div className="relative z-10 mt-12 space-y-6">
                            {[
                                { icon: Target, text: "Precise Student Targeting" },
                                { icon: Trophy, text: "Achievement-ready formats" },
                                { icon: Zap, text: "Instant Real-time Dispatch" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:bg-white group-hover:text-indigo-600 transition-all shrink-0">
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-slate-100 font-black text-[10px] uppercase tracking-widest">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Designer Workspace (Right) */}
                    <div className="lg:w-3/5 p-8 md:p-14 bg-white dark:bg-slate-900 overflow-y-auto">
                        <form onSubmit={handleSubmit} className="space-y-8">

                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="w-2.5 h-2.5 bg-indigo-600 dark:bg-indigo-500 rounded-full"></span>
                                    <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">Core Parameters</h3>
                                </div>

                                <div className="space-y-5">
                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Curriculum Title</label>
                                        <div className="relative group">
                                            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-550 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors pointer-events-none" />
                                            <input
                                                type="text"
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50/50 dark:bg-slate-950/30 border-2 border-slate-50 dark:border-slate-800/80 rounded-2xl focus:bg-white dark:focus:bg-slate-905 focus:border-indigo-600 dark:focus:border-indigo-500 outline-none transition-all font-bold text-slate-800 dark:text-slate-250 placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                                required
                                                placeholder="e.g. Advanced System Architecture"
                                                value={formData.title}
                                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Mission briefing</label>
                                        <div className="relative group">
                                            <Edit3 className="absolute left-4 top-5 w-5 h-5 text-slate-400 dark:text-slate-550 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors pointer-events-none" />
                                            <textarea
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50/50 dark:bg-slate-950/30 border-2 border-slate-50 dark:border-slate-800/80 rounded-2xl focus:bg-white dark:focus:bg-slate-905 focus:border-indigo-600 dark:focus:border-indigo-500 outline-none transition-all font-medium text-slate-800 dark:text-slate-300 placeholder:text-slate-300 dark:placeholder:text-slate-700 min-h-[140px] resize-none"
                                                required
                                                placeholder="Outline the operational requirements for this challenge..."
                                                value={formData.description}
                                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 border-t border-slate-100 dark:border-slate-800/60 pt-8">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="w-2.5 h-2.5 bg-indigo-600 dark:bg-indigo-500 rounded-full"></span>
                                    <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">Deployment Logistics</h3>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Target Academic Unit</label>
                                        <div className="relative group">
                                            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-550 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors pointer-events-none" />
                                            <select
                                                className="w-full pl-12 pr-10 py-4 bg-slate-50/50 dark:bg-slate-950/30 border-2 border-slate-50 dark:border-slate-800/80 rounded-2xl focus:bg-white dark:focus:bg-slate-905 focus:border-indigo-600 dark:focus:border-indigo-500 outline-none transition-all font-black text-slate-700 dark:text-slate-300 appearance-none cursor-pointer uppercase text-xs tracking-widest"
                                                required
                                                value={formData.classId}
                                                onChange={e => setFormData({ ...formData, classId: e.target.value })}
                                            >
                                                <option value="">Select Target Unit</option>
                                                {classes.map(cls => (
                                                    <option key={cls._id} value={cls._id}>{cls.className}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <ChevronLeft className="w-4 h-4 text-slate-405 -rotate-90" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Submission Deadline</label>
                                        <div className="relative group">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-550 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors pointer-events-none" />
                                            <input
                                                type="date"
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50/50 dark:bg-slate-950/30 border-2 border-slate-50 dark:border-slate-800/80 rounded-2xl focus:bg-white dark:focus:bg-slate-905 focus:border-indigo-600 dark:focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                                                required
                                                value={formData.dueDate}
                                                onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white font-black text-sm uppercase tracking-widest rounded-2xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-70 group flex items-center justify-center gap-3 cursor-pointer"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-3 border-white/30 border-t-white dark:border-slate-950/20 dark:border-t-slate-950 rounded-full animate-spin"></div>
                                            Publishing...
                                        </>
                                    ) : (
                                        <>
                                            <span>Establish Assignment</span>
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateAssignment;
