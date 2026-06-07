import { useState, useContext, useEffect } from 'react';
import AuthContext from '../../context/AuthContext';
import ThemeContext from '../../context/ThemeContext';
import Swal from 'sweetalert2';
import { User, Mail, Lock, ShieldCheck, Key, ArrowRight, Save } from 'lucide-react';
import ProfileCard from '../../components/ProfileCard';

const StudentProfilePage = () => {
    const { user, login } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);
    const [profileData, setProfileData] = useState({ name: '', email: '', profilePicture: '' });
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [classInfo, setClassInfo] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture || ''
            });

            // Fetch class information dynamically
            if (user.classId) {
                fetch(`${API_URL}/classes`)
                    .then(res => res.json())
                    .then(data => {
                        const match = data.find(c => c._id === user.classId);
                        if (match) setClassInfo(match);
                    })
                    .catch(err => console.error('Error syncing academic unit:', err));
            }
        }
    }, [user, API_URL]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                Swal.fire({
                    icon: 'error',
                    title: 'Image Too Large',
                    text: 'Profile image must be less than 2MB.',
                    background: theme === 'dark' ? '#0f172a' : '#fff',
                    color: theme === 'dark' ? '#f8fafc' : '#1e293b'
                });
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileData(prev => ({ ...prev, profilePicture: reader.result }));
                // Auto-save picture
                saveProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const saveProfileImage = async (base64Image) => {
        try {
            const res = await fetch(`${API_URL}/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    name: profileData.name || user.name,
                    email: profileData.email || user.email,
                    profilePicture: base64Image
                })
            });
            const data = await res.json();
            if (res.ok) {
                login(data);
                Swal.fire({
                    icon: 'success',
                    title: 'Avatar Uploaded',
                    text: 'Your profile picture has been updated.',
                    timer: 1500,
                    showConfirmButton: false,
                    background: theme === 'dark' ? '#0f172a' : '#fff',
                    color: theme === 'dark' ? '#f8fafc' : '#1e293b'
                });
            }
        } catch (error) {
            console.error('Error saving avatar:', error);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
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
                    text: 'Your personal information has been saved.',
                    timer: 2000,
                    showConfirmButton: false,
                    background: theme === 'dark' ? '#0f172a' : '#fff',
                    color: theme === 'dark' ? '#f8fafc' : '#1e293b'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Update Failed',
                    text: data.message || 'Unable to update profile data.',
                    background: theme === 'dark' ? '#0f172a' : '#fff',
                    color: theme === 'dark' ? '#f8fafc' : '#1e293b'
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Network Error',
                text: 'Uplink transmission disrupted.',
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
                    title: 'Passkey Configured',
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
                    text: data.message || 'Invalid current password.',
                    background: theme === 'dark' ? '#0f172a' : '#fff',
                    color: theme === 'dark' ? '#f8fafc' : '#1e293b'
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Transmission Error',
                text: 'Connection to identity server failed.',
                background: theme === 'dark' ? '#0f172a' : '#fff',
                color: theme === 'dark' ? '#f8fafc' : '#1e293b'
            });
        } finally {
            setIsChangingPassword(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
            {/* Ambient Background decoration */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-20 -left-40 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-500/5 rounded-full blur-3xl animate-glow-pulse"></div>
                <div className="absolute bottom-20 -right-40 w-96 h-96 bg-purple-400/10 dark:bg-purple-500/5 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-5xl mx-auto animate-cinematic-in">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Reusable ProfileCard component in sidebar */}
                    <div className="lg:col-span-1">
                        <ProfileCard 
                            user={user} 
                            classInfo={classInfo} 
                            profileData={profileData} 
                            onImageChange={handleImageChange} 
                        />
                    </div>

                    {/* Settings Forms Column */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Profile Info Form */}
                        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800/60 overflow-hidden">
                            <div className="px-8 py-6 border-b border-slate-105 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-650 dark:bg-indigo-500 text-white rounded-xl flex items-center justify-center shadow-md">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white">Personal Information</h3>
                                </div>
                                <Save className="w-5 h-5 text-slate-350 dark:text-slate-655" />
                            </div>

                            <form onSubmit={handleProfileUpdate} className="p-8 sm:p-10 space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="text"
                                                value={profileData.name}
                                                onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50/50 dark:bg-slate-950/30 border-2 border-slate-50 dark:border-slate-800/50 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-600 dark:focus:border-indigo-500 outline-none transition-all font-bold text-slate-800 dark:text-slate-205"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest ml-1">Email System</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="email"
                                                value={profileData.email}
                                                onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50/50 dark:bg-slate-950/30 border-2 border-slate-50 dark:border-slate-800/50 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-600 dark:focus:border-indigo-500 outline-none transition-all font-bold text-slate-800 dark:text-slate-205"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={isUpdatingProfile}
                                        className="px-8 py-4 bg-slate-950 hover:bg-indigo-600 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-black rounded-2xl transition-all shadow-lg flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 group cursor-pointer"
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

                        {/* Password Form */}
                        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800/60 overflow-hidden">
                            <div className="px-8 py-6 border-b border-slate-105 dark:border-slate-800/60 bg-emerald-50/10 dark:bg-slate-900/30 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-500 dark:bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-md">
                                        <Key className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white">Security Vault</h3>
                                </div>
                                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                            </div>

                            <form onSubmit={handlePasswordChange} className="p-8 sm:p-10 space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest ml-1">Current Password</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-405 dark:text-slate-500 group-focus-within:text-emerald-500 transition-colors">
                                                <Lock className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="password"
                                                placeholder="Enter Current"
                                                value={passwordData.currentPassword}
                                                onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50/50 dark:bg-slate-950/30 border-2 border-slate-50 dark:border-slate-800/50 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 outline-none transition-all font-bold text-slate-805 dark:text-slate-205 placeholder:text-slate-350 dark:placeholder:text-slate-700"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest ml-1">New Access Protocol</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-405 dark:text-slate-505 group-focus-within:text-emerald-500 transition-colors">
                                                <Key className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="password"
                                                placeholder="Set New Password"
                                                value={passwordData.newPassword}
                                                onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50/50 dark:bg-slate-950/30 border-2 border-slate-50 dark:border-slate-800/50 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 outline-none transition-all font-bold text-slate-805 dark:text-slate-205 placeholder:text-slate-350 dark:placeholder:text-slate-700"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={isChangingPassword}
                                        className="px-8 py-4 bg-emerald-550 hover:bg-emerald-600 dark:bg-emerald-605 dark:hover:bg-emerald-500 text-white font-black rounded-2xl transition-all shadow-lg flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 group cursor-pointer"
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

export default StudentProfilePage;
