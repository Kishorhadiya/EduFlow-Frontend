import { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import ThemeContext from '../../context/ThemeContext';
import Swal from 'sweetalert2';
import {
    Send,
    Link as LinkIcon,
    ChevronLeft,
    FileText,
    Info,
    AlertCircle,
    CloudUpload,
    Shield,
    Zap
} from 'lucide-react';
import FileUploader from '../../components/FileUploader';

const SubmitAssignment = () => {
    const { id } = useParams();
    const [link, setLink] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [assignmentTitle, setAssignmentTitle] = useState('Assignment Submission');
    const [assignmentDue, setAssignmentDue] = useState(null);
    const { user } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const res = await fetch(`${API_URL}/assignments/${id}`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setAssignmentTitle(data.title || 'Assignment Submission');
                    if (data.dueDate) setAssignmentDue(data.dueDate);
                }
            } catch (err) {
                console.error('Failed to fetch assignment details', err);
            }
        };
        if (user?.token && id) fetchAssignment();
    }, [id, user?.token, API_URL]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!link) return;
        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_URL}/submissions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    assignmentId: id,
                    submissionLink: link
                })
            });

            if (res.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Work Dispatched!',
                    text: 'Your submission has been successfully queued for review.',
                    timer: 2000,
                    showConfirmButton: false,
                    background: theme === 'dark' ? '#1e293b' : '#fff',
                    color: theme === 'dark' ? '#e2e8f0' : '#1e293b'
                });
                navigate('/student/dashboard');
            } else {
                const errorData = await res.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Transmission Failed',
                    text: errorData.message || 'We could not process your submission. Please check the link and try again.',
                    background: theme === 'dark' ? '#1e293b' : '#fff',
                    color: theme === 'dark' ? '#e2e8f0' : '#1e293b'
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Network Interruption',
                text: 'Connection to the uplink failed. Please verify your internet and try again.',
                background: theme === 'dark' ? '#1e293b' : '#fff',
                color: theme === 'dark' ? '#e2e8f0' : '#1e293b'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
            {/* Background decoration */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-20 -left-40 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-500/5 rounded-full blur-3xl animate-glow-pulse"></div>
                <div className="absolute bottom-20 -right-40 w-96 h-96 bg-purple-400/10 dark:bg-purple-500/5 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-2xl mx-auto animate-cinematic-in">
                {/* Back Navigation */}
                <Link
                    to="/student/dashboard"
                    className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold text-sm mb-8 transition-colors group"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </Link>

                {/* Main Card */}
                <div className="glass-card rounded-3xl overflow-hidden">
                    <div className="p-6 sm:p-10">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <CloudUpload className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">Submit Work</h1>
                                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Upload your file or provide a submission link.</p>
                            </div>
                        </div>

                        {/* Assignment Context */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 mb-8 border border-dashed border-slate-200 dark:border-slate-700">
                            <div className="flex items-start gap-3">
                                <FileText className="w-5 h-5 text-indigo-500 dark:text-indigo-400 mt-0.5 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <span className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Target Assignment</span>
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 leading-tight truncate">{assignmentTitle}</h3>
                                    {assignmentDue && (
                                        <p className="text-xs text-slate-400 dark:text-slate-505 mt-1 font-semibold">
                                            Due: {new Date(assignmentDue).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Modular FileUploader Component */}
                        <div className="mb-8">
                            <FileUploader 
                                onUploadSuccess={simulatedLink => setLink(simulatedLink)} 
                                onRemoveFile={() => setLink('')}
                                theme={theme}
                                userName={user?.name || 'student'}
                            />
                        </div>

                        {/* Manual Link Input */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Or paste a link</span>
                            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="block text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest">Submission Link</label>
                                    <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-full">Required</span>
                                </div>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors pointer-events-none">
                                        <LinkIcon className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="url"
                                        placeholder="https://github.com/username/repo"
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 dark:text-slate-200 placeholder:text-slate-305 dark:placeholder:text-slate-600"
                                        required
                                        onChange={e => setLink(e.target.value)}
                                        value={link}
                                    />
                                </div>
                            </div>

                            {/* Guidelines */}
                            <div className="bg-amber-50/50 dark:bg-amber-500/5 rounded-2xl p-5 flex gap-4 border border-amber-100/60 dark:border-amber-500/20">
                                <Info className="w-6 h-6 text-amber-500 shrink-0" />
                                <div>
                                    <h4 className="text-amber-900 dark:text-amber-400 font-black text-xs uppercase tracking-wider mb-2">Submission Protocols</h4>
                                    <ul className="space-y-1.5 animate-in fade-in-50">
                                        <li className="text-amber-800/70 dark:text-amber-305/60 text-[11px] font-medium flex items-center gap-2">
                                            <span className="text-amber-500">✓</span> Ensure the repository is publicly accessible.
                                        </li>
                                        <li className="text-amber-800/70 dark:text-amber-305/60 text-[11px] font-medium flex items-center gap-2">
                                            <span className="text-amber-500">✓</span> Double-check for latest commits before submitting.
                                        </li>
                                        <li className="text-amber-805/70 dark:text-amber-305/60 text-[11px] font-medium flex items-center gap-2">
                                            <span className="text-amber-500">✓</span> Accepted file types: PDF, DOCX, ZIP (max 50MB).
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting || !link}
                                className="w-full py-5 bg-gradient-to-r from-indigo-650 to-purple-655 hover:from-indigo-555 hover:to-purple-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/30 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none group cursor-pointer"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Dispatch Submission <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 px-6 py-5 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                        <div className="flex items-center gap-2">
                            <Shield className="w-3.5 h-3.5 text-emerald-500" />
                            <p className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest">Encrypted Upload</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Zap className="w-3.5 h-3.5 text-amber-500" />
                            <p className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest">Instant Processing</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-3.5 h-3.5 text-slate-405 dark:text-slate-500" />
                            <p className="text-slate-400 dark:text-slate-505 font-bold text-[10px] uppercase tracking-widest">Timestamped</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmitAssignment;
