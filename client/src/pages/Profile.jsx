import { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import ThemeContext from '../context/ThemeContext';
import Swal from 'sweetalert2';
import {
    User,
    Mail,
    Lock,
    ShieldCheck,
    Key,
    UserCircle2,
    BadgeCheck,
    ArrowRight,
    Camera,
    Bell,
    Save
} from 'lucide-react';

const Profile = () => {
    const { user, login } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);
    const [profileData, setProfileData] = useState({ name: '', email: '', profilePicture: '' });
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture || ''
            });
        }
    }, [user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileData(prev => ({ ...prev, profilePicture: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileUpdate = async (e) => {
        if (e) e.preventDefault();
        setIsUpdatingProfile(true);
        try {
            const res = await fetch(`${API_URL}/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(profileData)
            });
            const data = await res.json();
            if (res.ok) {
                login(data);
                Swal.fire({
                    icon: 'success',
                    title: 'Profile Updated',
                    text: 'Your profile information has been saved.',
                    timer: 2000,
                    showConfirmButton: false,
                    background: theme === 'dark' ? '#0f172a' : '#fff',
                    color: theme === 'dark' ? '#f8fafc' : '#1e293b'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Update Failed',
                    text: data.message,
                    background: theme === 'dark' ? '#0f172a' : '#fff',
                    color: theme === 'dark' ? '#f8fafc' : '#1e293b'
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Network Error',
                text: 'Could not connect to the server.',
                background: theme === 'dark' ? '#0f172a' : '#fff',
                color: theme === 'dark' ? '#f8fafc' : '#1e293b'
            });
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setIsChangingPassword(true);
        try {
            const res = await fetch(`${API_URL}/auth/change-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(passwordData)
            });
            const data = await res.json();
            if (res.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Security Updated',
                    text: 'Your password has been changed successfully.',
                    timer: 2000,
                    showConfirmButton: false,
                    background: theme === 'dark' ? '#0f172a' : '#fff',
                    color: theme === 'dark' ? '#f8fafc' : '#1e293b'
                });
                setPasswordData({ currentPassword: '', newPassword: '' });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Change Failed',
                    text: data.message,
                    background: theme === 'dark' ? '#0f172a' : '#fff',
                    color: theme === 'dark' ? '#f8fafc' : '#1e293b'
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Connection error.',
                background: theme === 'dark' ? '#0f172a' : '#fff',
                color: theme === 'dark' ? '#f8fafc' : '#1e293b'
            });
        } finally {
            setIsChangingPassword(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
            <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Sidebar / User Info */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800/60 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-24 bg-indigo-600/5 dark:bg-indigo-500/5"></div>

                            <div className="relative mb-6 mt-4">
                                <div className="w-28 h-28 bg-indigo-600 dark:bg-indigo-500 rounded-3xl mx-auto flex items-center justify-center shadow-lg overflow-hidden border-4 border-white dark:border-slate-800">
                                    {profileData.profilePicture ? (
                                        <img src={profileData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <UserCircle2 className="w-16 h-16 text-white" />
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-1/4 translate-x-1/2 translate-y-1/2 w-10 h-10 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-350 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-md transition-all cursor-pointer">
                                    <Camera className="w-5 h-5" />
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            </div>

                            <div className="mb-8">
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-2">{user?.name}</h2>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 rounded-full">
                                    <BadgeCheck className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{user?.role}</span>
                                </div>
                            </div>

                            <div className="space-y-4 text-left border-t border-slate-100 dark:border-slate-800/80 pt-8">
                                <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                                    <Mail className="w-5 h-5 opacity-50" />
                                    <div>
                                        <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest leading-none mb-1">Email Address</p>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">{user?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                                    <Bell className="w-5 h-5 opacity-50" />
                                    <div>
                                        <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest leading-none mb-1">Status</p>
                                        <p className="text-sm font-bold text-emerald-500 dark:text-emerald-450 flex items-center gap-1.5">
                                            <span className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-pulse"></span>
                                            Active Academic Unit
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 dark:bg-slate-900/60 rounded-[2rem] p-8 text-white border border-slate-850 dark:border-slate-800/50 relative overflow-hidden shadow-xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-[40px] -mr-16 -mt-16"></div>
                            <h3 className="text-xl font-black mb-4 relative z-10">Security Center</h3>
                            <p className="text-indigo-200/60 text-sm font-medium mb-6 relative z-10 leading-relaxed">
                                Your account is protected by industry-standard encryption protocols. Change your password regularly to maintain peak safety.
                            </p>
                            <div className="inline-flex items-center gap-2 text-indigo-400 font-black text-xs uppercase tracking-widest relative z-10 cursor-help">
                                <ShieldCheck className="w-4 h-4" /> System Verified
                            </div>
                        </div>
                    </div>

                    {/* Main Settings Area */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Profile Update Section */}
                        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800/60 overflow-hidden">
                            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-650 dark:bg-indigo-555 text-white rounded-xl flex items-center justify-center">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white">Personal Information</h3>
                                </div>
                                <Save className="w-5 h-5 text-slate-350 dark:text-slate-600" />
                            </div>

                            <form onSubmit={handleProfileUpdate} className="p-8 sm:p-10 space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-650 dark:group-focus-within:text-indigo-400 transition-colors">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="text"
                                                value={profileData.name}
                                                onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50/50 dark:bg-slate-950/30 border-2 border-slate-50 dark:border-slate-805/50 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-600 dark:focus:border-indigo-500 outline-none transition-all font-bold text-slate-800 dark:text-slate-200"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email System</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-650 dark:group-focus-within:text-indigo-400 transition-colors">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="email"
                                                value={profileData.email}
                                                onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50/50 dark:bg-slate-950/30 border-2 border-slate-50 dark:border-slate-805/50 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-600 dark:focus:border-indigo-500 outline-none transition-all font-bold text-slate-800 dark:text-slate-200"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={isUpdatingProfile}
                                        className="px-8 py-4 bg-slate-900 hover:bg-indigo-600 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-black rounded-2xl transition-all shadow-lg hover:shadow-indigo-500/15 dark:hover:shadow-none flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 group cursor-pointer"
                                    >
                                        {isUpdatingProfile ? "Syncing..." : (
                                            <>
                                                Save Changes <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Password Section */}
                        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800/60 overflow-hidden">
                            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800/60 bg-emerald-50/20 dark:bg-slate-900/30 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-500 dark:bg-emerald-600 text-white rounded-xl flex items-center justify-center">
                                        <Key className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white">Security Vault</h3>
                                </div>
                                <ShieldCheck className="w-5 h-5 text-emerald-400 dark:text-emerald-500" />
                            </div>

                            <form onSubmit={handlePasswordChange} className="p-8 sm:p-10 space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Current Password</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500 transition-colors">
                                                <Lock className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="password"
                                                placeholder="Enter Current"
                                                value={passwordData.currentPassword}
                                                onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50/50 dark:bg-slate-950/30 border-2 border-slate-50 dark:border-slate-805/50 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 outline-none transition-all font-bold text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">New Access Protocol</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500 transition-colors">
                                                <Key className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="password"
                                                placeholder="Set New Password"
                                                value={passwordData.newPassword}
                                                onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50/50 dark:bg-slate-950/30 border-2 border-slate-50 dark:border-slate-805/50 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 outline-none transition-all font-bold text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={isChangingPassword}
                                        className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-555 text-white font-black rounded-2xl transition-all shadow-lg hover:shadow-emerald-500/15 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 group cursor-pointer"
                                    >
                                        {isChangingPassword ? "Verifying..." : (
                                            <>
                                                Secure Account <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
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

export default Profile;
