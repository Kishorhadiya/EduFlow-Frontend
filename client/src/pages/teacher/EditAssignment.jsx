import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import ThemeContext from '../../context/ThemeContext';
import Swal from 'sweetalert2';
import {
    Edit,
    ChevronLeft,
    FileText,
    Calendar,
    Users,
    Edit3,
    CheckCircle2,
    Save,
    RotateCcw
} from 'lucide-react';

const EditAssignment = () => {
    const { id } = useParams();
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
            .then(data => setClasses(data));

        const fetchAssignment = async () => {
            try {
                const res = await fetch(`${API_URL}/assignments/${id}`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setFormData({
                        title: data.title,
                        description: data.description,
                        dueDate: data.dueDate.split('T')[0],
                        classId: typeof data.classId === 'object' ? (data.classId?._id || '') : data.classId
                    });
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchAssignment();
    }, [id, user.token, API_URL]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_URL}/assignments/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Updates Saved!',
                    text: 'The assignment has been updated successfully.',
                    timer: 1500,
                    showConfirmButton: false,
                    background: theme === 'dark' ? '#0f172a' : '#fff',
                    color: theme === 'dark' ? '#f8fafc' : '#1e293b'
                });
                navigate('/teacher/dashboard');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Update Failed',
                    text: 'Please check the details and try again.',
                    background: theme === 'dark' ? '#0f172a' : '#fff',
                    color: theme === 'dark' ? '#f8fafc' : '#1e293b'
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 lg:p-12 font-sans transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                {/* Navigation Back */}
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold mb-8 transition-colors group bg-transparent border-none cursor-pointer text-xs uppercase tracking-widest"
                >
                    <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
                    Discard Changes
                </button>

                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl dark:shadow-none overflow-hidden border border-slate-100 dark:border-slate-805/50">
                    <div className="grid grid-cols-1 lg:grid-cols-5 h-full">

                        {/* Summary Side (Left) */}
                        <div className="lg:col-span-2 bg-slate-900 p-8 md:p-12 text-white flex flex-col justify-between">
                            <div>
                                <div className="w-14 h-14 bg-amber-500 rounded-[1.2rem] flex items-center justify-center mb-8 shadow-md shadow-amber-500/20">
                                    <Edit className="w-7 h-7 text-white" />
                                </div>
                                <h1 className="text-3xl font-black mb-6 leading-tight tracking-tight">Edit Assignment</h1>
                                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                                    Refining your content ensures student clarity. You can update titles, requirements, and deadlines anytime.
                                </p>
                            </div>

                            <div className="mt-12 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-amber-400 shrink-0">
                                        <CheckCircle2 className="w-4.5 h-4.5" />
                                    </div>
                                    <span className="text-slate-350 font-black text-[10px] uppercase tracking-wider">Real-time updates</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-amber-400 shrink-0">
                                        <CheckCircle2 className="w-4.5 h-4.5" />
                                    </div>
                                    <span className="text-slate-350 font-black text-[10px] uppercase tracking-wider">Status preservation</span>
                                </div>
                            </div>
                        </div>

                        {/* Form Side (Right) */}
                        <div className="lg:col-span-3 p-8 md:p-12">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <section className="space-y-6">
                                    <h3 className="text-xs font-black text-amber-600 dark:text-amber-500 uppercase tracking-[0.2em] mb-4 flex items-center">
                                        <span className="w-6 h-px bg-amber-600 dark:bg-amber-500 mr-2.5"></span>
                                        Update Content
                                    </h3>

                                    <div className="space-y-5">
                                        <div className="space-y-1.5">
                                            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Assignment Title</label>
                                            <div className="relative group">
                                                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-550 group-focus-within:text-amber-500 transition-colors pointer-events-none" />
                                                <input
                                                    type="text"
                                                    className="w-full pl-12 pr-4 py-4 bg-slate-50/50 dark:bg-slate-955/30 border-2 border-slate-50 dark:border-slate-800/80 rounded-2xl focus:bg-white dark:focus:bg-slate-905 focus:border-amber-500 outline-none transition-all font-bold text-slate-800 dark:text-slate-300"
                                                    required
                                                    value={formData.title}
                                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Detailed Description</label>
                                            <div className="relative group">
                                                <Edit3 className="absolute left-4 top-4 w-5 h-5 text-slate-400 dark:text-slate-550 group-focus-within:text-amber-500 transition-colors pointer-events-none" />
                                                <textarea
                                                    className="w-full pl-12 pr-4 py-4 bg-slate-50/50 dark:bg-slate-955/30 border-2 border-slate-50 dark:border-slate-800/80 rounded-2xl focus:bg-white dark:focus:bg-slate-905 focus:border-amber-500 outline-none transition-all font-medium text-slate-805 dark:text-slate-300 min-h-[140px] resize-none"
                                                    required
                                                    value={formData.description}
                                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-6 border-t border-slate-100 dark:border-slate-800/60 pt-8">
                                    <h3 className="text-xs font-black text-amber-600 dark:text-amber-500 uppercase tracking-[0.2em] mb-4 flex items-center">
                                        <span className="w-6 h-px bg-amber-600 dark:bg-amber-500 mr-2.5"></span>
                                        Logistics Hook
                                    </h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Change Class</label>
                                            <div className="relative group">
                                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-550 pointer-events-none" />
                                                <select
                                                    className="w-full pl-12 pr-10 py-4 bg-slate-50/50 dark:bg-slate-955/30 border-2 border-slate-50 dark:border-slate-800/80 rounded-2xl focus:bg-white dark:focus:bg-slate-905 focus:border-amber-500 outline-none transition-all font-bold text-slate-800 dark:text-slate-300 appearance-none cursor-pointer uppercase text-[10px] tracking-widest"
                                                    required
                                                    value={formData.classId}
                                                    onChange={e => setFormData({ ...formData, classId: e.target.value })}
                                                >
                                                    <option value="">Select Class</option>
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
                                            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Adjust Deadline</label>
                                            <div className="relative group">
                                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-550 pointer-events-none" />
                                                <input
                                                    type="date"
                                                    className="w-full pl-12 pr-4 py-4 bg-slate-50/50 dark:bg-slate-955/30 border-2 border-slate-50 dark:border-slate-800/80 rounded-2xl focus:bg-white dark:focus:bg-slate-905 focus:border-amber-500 outline-none transition-all font-bold text-slate-800 dark:text-slate-300 cursor-pointer"
                                                    required
                                                    value={formData.dueDate}
                                                    onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-5 bg-amber-500 hover:bg-amber-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-75 flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        {isSubmitting ? "Saving..." : (
                                            <>
                                                <span>Save Changes</span>
                                                <Save className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditAssignment;
