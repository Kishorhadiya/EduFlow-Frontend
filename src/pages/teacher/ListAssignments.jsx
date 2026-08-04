import { useState, useEffect, useContext, useMemo } from 'react';
import AuthContext from '../../context/AuthContext';
import ThemeContext from '../../context/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
    Plus,
    Search,
    Filter,
    Calendar,
    Trash2,
    Edit2,
    BookOpen,
    Clock,
    LayoutGrid,
    SearchX,
    ChevronLeft
} from 'lucide-react';

const ListAssignments = () => {
    const [allAssignments, setAllAssignments] = useState([]);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const classRes = await fetch(`${API_URL}/classes`);
                const classData = await classRes.json();
                setClasses(classData);

                const assRes = await fetch(`${API_URL}/assignments/created-by-me`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                const assData = await assRes.json();
                setAllAssignments(assData);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [API_URL, user.token]);

    const filteredAssignments = useMemo(() => {
        let result = allAssignments;

        if (selectedClass) {
            result = result.filter(a => {
                const id = typeof a.classId === 'object' ? a.classId?._id : a.classId;
                return id === selectedClass;
            });
        }

        if (searchQuery) {
            result = result.filter(a =>
                a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (typeof a.classId === 'object' && a.classId?.className?.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        return result;
    }, [selectedClass, searchQuery, allAssignments]);

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Delete Assignment?',
            text: "This action cannot be undone. All related submissions will be also affected.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, delete it',
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
                        const updatedList = allAssignments.filter(a => a._id !== id);
                        setAllAssignments(updatedList);
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'The assignment has been removed.',
                            icon: 'success',
                            background: theme === 'dark' ? '#0f172a' : '#fff',
                            color: theme === 'dark' ? '#f8fafc' : '#1e293b',
                            timer: 1500,
                            showConfirmButton: false
                        });
                    } else {
                        const data = await res.json();
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: data.message || 'Delete failed',
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

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 lg:p-12 font-sans transition-colors duration-300">
            <div className="max-w-7xl mx-auto">

                {/* Back button */}
                <button
                    onClick={() => navigate('/teacher/dashboard')}
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-black text-xs uppercase tracking-widest mb-6 transition-colors bg-transparent border-none cursor-pointer"
                >
                    <ChevronLeft className="w-5 h-5" />
                    Back to Dashboard
                </button>

                {/* Top Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                            <BookOpen className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                            Assignments
                        </h2>
                    </div>
                    <Link
                        to="/teacher/create-assignment"
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                        <Plus className="w-5 h-5" />
                        Create New Assignment
                    </Link>
                </div>

                {/* Filter / Search Bar */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-150 dark:border-slate-800/85 mb-8 flex flex-col lg:flex-row items-center gap-4">
                    <div className="relative flex-grow w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by title or class..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/50 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-600 dark:focus:border-indigo-505 outline-none transition-all font-bold text-slate-700 dark:text-slate-300 placeholder:text-slate-350"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-4 w-full lg:w-auto shrink-0">
                        <div className="relative w-full lg:w-64">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <select
                                className="w-full pl-11 pr-10 py-3 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/50 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-600 dark:focus:border-indigo-505 outline-none font-black text-slate-700 dark:text-slate-300 uppercase text-[10px] tracking-widest appearance-none cursor-pointer"
                                value={selectedClass}
                                onChange={e => setSelectedClass(e.target.value)}
                            >
                                <option value="">All Academic Units</option>
                                {classes.map(cls => (
                                    <option key={cls._id} value={cls._id}>{cls.className}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <Clock className="w-4 h-4 text-slate-405 -rotate-90" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Assignment Cards */}
                {filteredAssignments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800">
                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                            <SearchX className="w-10 h-10 text-slate-300 dark:text-slate-650" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white">No assignments found</h3>
                        <p className="text-slate-400 mt-2 font-medium">Try adjusting your filters or search query.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {filteredAssignments.map(asg => (
                            <div key={asg._id} className="group bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl dark:shadow-none transition-all duration-300 border border-slate-100 dark:border-slate-805/50 border-t-8 border-t-indigo-650 dark:border-t-indigo-500 relative overflow-hidden">

                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 rounded-2xl flex items-center justify-center shadow-inner">
                                        <LayoutGrid className="w-7 h-7" />
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            to={`/teacher/edit-assignment/${asg._id}`}
                                            className="w-9 h-9 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-indigo-650 dark:hover:text-indigo-400 rounded-full flex items-center justify-center border border-slate-100 dark:border-slate-700/60 shadow-sm"
                                            title="Edit Assignment"
                                        >
                                            <Edit2 className="w-4.5 h-4.5" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(asg._id)}
                                            className="w-9 h-9 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-500 rounded-full flex items-center justify-center border border-slate-100 dark:border-slate-700/60 shadow-sm cursor-pointer"
                                            title="Delete Assignment"
                                        >
                                            <Trash2 className="w-4.5 h-4.5" />
                                        </button>
                                    </div>
                                </div>

                                <h4 className="text-xl font-black text-slate-850 dark:text-white mb-4 group-hover:text-indigo-655 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
                                    {asg.title}
                                </h4>

                                <div className="space-y-3 mt-auto pt-6 border-t border-slate-50 dark:border-slate-805/50">
                                    <div className="flex items-center gap-3">
                                        <div className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-wider">
                                            {asg.classId?.className || 'General'}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 font-bold text-xs">
                                        <Calendar className="w-4 h-4 text-rose-500" />
                                        <span>Due {new Date(asg.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                </div>

                                {/* Abstract background decoration */}
                                <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-600/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListAssignments;
