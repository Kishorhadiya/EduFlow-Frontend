import { useState, useEffect, useContext, useCallback } from 'react';
import AuthContext from '../../context/AuthContext';
import ThemeContext from '../../context/ThemeContext';
import Swal from 'sweetalert2';
import {
    Plus,
    Edit2,
    Trash2,
    BookOpen,
    Layers,
    X,
    Save,
    Search,
    GraduationCap,
    MoreVertical,
    Users,
    Activity,
    FolderPlus,
    LayoutGrid,
    Archive
} from 'lucide-react';

const ClassManagement = () => {
    const [classes, setClasses] = useState([]);
    const [formData, setFormData] = useState({ className: '', department: '' });
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const fetchClasses = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/classes`);
            const data = await res.json();
            setClasses(data);
        } catch (error) {
            console.error(error);
        }
    }, [API_URL]);

    useEffect(() => {
        fetchClasses();
    }, [fetchClasses]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const url = editingId ? `${API_URL}/classes/${editingId}` : `${API_URL}/classes`;
        const method = editingId ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setFormData({ className: '', department: '' });
                setEditingId(null);
                fetchClasses();
                Swal.fire({
                    icon: 'success',
                    title: editingId ? 'Protocol Updated' : 'Unit Established',
                    text: editingId ? 'Academic structure has been successfully reconfigured.' : 'New academic unit successfully integrated into the system.',
                    timer: 2000,
                    showConfirmButton: false,
                    background: theme === 'dark' ? '#0f172a' : '#fff',
                    color: theme === 'dark' ? '#f8fafc' : '#1e293b'
                });
            } else {
                const data = await res.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Authority Error',
                    text: data.message || 'Operation failed under current security cleared.',
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

    const handleEdit = (cls) => {
        setFormData({ className: cls.className, department: cls.department });
        setEditingId(cls._id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Decommission Unit?',
            text: "All associated student records will be archived in the legacy database.",
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
                    const res = await fetch(`${API_URL}/classes/${id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${user.token}` }
                    });
                    if (res.ok) {
                        fetchClasses();
                        Swal.fire({
                            title: 'Decommissioned',
                            text: 'The academic unit has been removed from active duty.',
                            icon: 'success',
                            background: theme === 'dark' ? '#0f172a' : '#fff',
                            color: theme === 'dark' ? '#f8fafc' : '#1e293b'
                        });
                    } else {
                        const data = await res.json();
                        Swal.fire({
                            icon: 'error',
                            title: 'Access Restricted',
                            text: data.message || 'Unable to delete',
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

    const filteredClasses = classes.filter(cls =>
        cls.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-10 font-sans transition-colors duration-300">
            <div className="max-w-7xl mx-auto space-y-10">

                {/* Header: Cinematic Title */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 rounded-full">
                            <Activity className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Infrastructure Mgmt</span>
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-4">
                            Academic Unit <span className="text-indigo-600 dark:text-indigo-400">Control</span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-405 font-medium max-w-xl">
                            Configure and organize high-level academic structures, department protocols, and class identifiers within the EduFlow ecosystem.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800/80 flex items-center gap-4">
                            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">Total Active</p>
                                <p className="text-lg font-black text-slate-700 dark:text-slate-300 leading-tight">{classes.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Control Panel: Form */}
                    <div className="lg:col-span-4">
                        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none p-8 sticky top-10 border border-slate-100 dark:border-slate-805/50 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-950/20 rounded-full blur-[60px] -mr-16 -mt-16"></div>

                            <div className="flex items-center gap-4 mb-8 relative z-10">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-colors ${editingId ? 'bg-amber-500 text-white' : 'bg-indigo-600 text-white'}`}>
                                    {editingId ? <Edit2 className="w-5 h-5" /> : <FolderPlus className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white leading-none mb-1">
                                        {editingId ? 'Modify Unit' : 'New Structure'}
                                    </h3>
                                    <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Specify protocol parameters</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Class Protocol ID</label>
                                    <div className="relative group">
                                        <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors pointer-events-none" />
                                        <input
                                            type="text"
                                            value={formData.className}
                                            placeholder="e.g. CS - 2024"
                                            onChange={e => setFormData({ ...formData, className: e.target.value })}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50/50 dark:bg-slate-950/40 border-2 border-slate-50 dark:border-slate-800/80 rounded-2xl focus:bg-white focus:border-indigo-600 dark:focus:bg-slate-900 dark:focus:border-indigo-500 outline-none transition-all font-bold text-slate-705 dark:text-slate-300 placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Department Sector</label>
                                    <div className="relative group">
                                        <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors pointer-events-none" />
                                        <input
                                            type="text"
                                            value={formData.department}
                                            placeholder="e.g. Engineering"
                                            onChange={e => setFormData({ ...formData, department: e.target.value })}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50/50 dark:bg-slate-950/40 border-2 border-slate-50 dark:border-slate-800/80 rounded-2xl focus:bg-white focus:border-indigo-600 dark:focus:bg-slate-900 dark:focus:border-indigo-500 outline-none transition-all font-bold text-slate-705 dark:text-slate-300 placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-full py-4.5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-lg active:scale-[0.98] cursor-pointer ${editingId ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white'}`}
                                    >
                                        {isSubmitting ? "Processing..." : (
                                            <>
                                                {editingId ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                                {editingId ? 'Confirm Update' : 'Initialize Unit'}
                                            </>
                                        )}
                                    </button>

                                    {editingId && (
                                        <button
                                            type="button"
                                            onClick={() => { setEditingId(null); setFormData({ className: '', department: '' }); }}
                                            className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-black flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
                                        >
                                            <X className="w-5 h-5" /> Abort Reconfig
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Operational Registry: List */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden border border-slate-100 dark:border-slate-805/60 transition-all">
                            {/* Registry Header */}
                            <div className="p-8 border-b border-slate-100 dark:border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/30 dark:bg-slate-900/30">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white leading-none mb-1">Operational Registry</h3>
                                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Master record of all academic units</p>
                                </div>
                                <div className="relative max-w-sm w-full">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                                    <input
                                        type="text"
                                        placeholder="Search by ID or Sector..."
                                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800/80 rounded-2xl text-sm outline-none focus:border-indigo-600 dark:focus:border-indigo-500 transition-all font-bold text-slate-600 dark:text-slate-300 placeholder:text-slate-300 dark:placeholder:text-slate-700 shadow-inner"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Data Grid */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800/80">
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Deployment Info</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Sector Assignment</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] text-right">Operations</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                        {filteredClasses.length === 0 ? (
                                            <tr>
                                                <td colSpan="3" className="px-8 py-20 text-center">
                                                    <div className="flex flex-col items-center gap-4">
                                                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-slate-200 dark:text-slate-700">
                                                            <Archive className="w-8 h-8" />
                                                        </div>
                                                        <div>
                                                            <p className="text-slate-500 dark:text-slate-400 font-black text-lg">No Matching Records</p>
                                                            <p className="text-slate-400 dark:text-slate-500 font-medium">Clear search parameters to see all units.</p>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredClasses.map(cls => (
                                                <tr key={cls._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors group">
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl font-black shadow-inner">
                                                                {cls.className.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <span className="block font-black text-slate-850 dark:text-slate-200 text-lg leading-none mb-1">{cls.className}</span>
                                                                <span className="text-[10px] font-bold text-indigo-400 dark:text-indigo-500 uppercase tracking-widest flex items-center gap-1.5">
                                                                    <LayoutGrid className="w-3 h-3" /> System Verified
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-655 dark:text-slate-400 rounded-xl">
                                                            <GraduationCap className="w-3.5 h-3.5" />
                                                            <span className="text-[10px] font-black uppercase tracking-wider">
                                                                {cls.department}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                            <button
                                                                onClick={() => handleEdit(cls)}
                                                                className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-indigo-650 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 rounded-xl hover:shadow-lg transition-all cursor-pointer"
                                                                title="Reconfigure"
                                                            >
                                                                <Edit2 className="w-5 h-5" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(cls._id)}
                                                                className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-white dark:hover:bg-slate-800 rounded-xl hover:shadow-lg transition-all cursor-pointer"
                                                                title="Decommission"
                                                            >
                                                                <Trash2 className="w-5 h-5" />
                                                            </button>
                                                            <button className="w-10 h-10 flex items-center justify-center text-slate-300 dark:text-slate-700 cursor-not-allowed">
                                                                <MoreVertical className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* List Footer */}
                            <div className="p-6 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-805/50 flex items-center justify-between">
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                    Showing {filteredClasses.length} of {classes.length} active units
                                </p>
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-350 hover:text-indigo-650 dark:hover:text-indigo-400 transition-colors cursor-pointer">Export .CSV</button>
                                    <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-350 hover:text-indigo-655 dark:hover:text-indigo-400 transition-colors cursor-pointer">Print Registry</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassManagement;
