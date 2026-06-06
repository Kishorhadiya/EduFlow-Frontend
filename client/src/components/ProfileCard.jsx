import { Camera, UserCircle2, BadgeCheck, Mail, School, Bell } from 'lucide-react';

const ProfileCard = ({ user, classInfo, profileData, onImageChange }) => {
    return (
        <div className="bg-white/85 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl border border-slate-100 dark:border-slate-800/60 text-center relative overflow-hidden h-full">
            {/* Top decorative stripe */}
            <div className="absolute top-0 left-0 w-full h-24 bg-indigo-600/5 dark:bg-indigo-550/5"></div>

            {/* Avatar Section with camera hover */}
            <div className="relative mb-6 mt-4 flex justify-center">
                <div className="relative">
                    <div className="w-28 h-28 bg-indigo-600 dark:bg-indigo-500 rounded-3xl flex items-center justify-center shadow-lg overflow-hidden border-4 border-white dark:border-slate-800">
                        {profileData.profilePicture ? (
                            <img src={profileData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <UserCircle2 className="w-16 h-16 text-white" />
                        )}
                    </div>
                    {onImageChange && (
                        <label className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-10 h-10 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-350 hover:text-indigo-650 dark:hover:text-indigo-400 hover:shadow-md transition-all cursor-pointer">
                            <Camera className="w-5 h-5" />
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={onImageChange}
                            />
                        </label>
                    )}
                </div>
            </div>

            {/* Name and Role Badge */}
            <div className="mb-8">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-2">{profileData.name || user?.name}</h2>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-55 dark:bg-indigo-950/40 text-indigo-655 dark:text-indigo-400 rounded-full">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{user?.role || 'student'}</span>
                </div>
            </div>

            {/* Details List */}
            <div className="space-y-4 text-left border-t border-slate-100 dark:border-slate-800/80 pt-8">
                {/* Email */}
                <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                    <Mail className="w-5 h-5 opacity-50 shrink-0" />
                    <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-black text-slate-300 dark:text-slate-605 uppercase tracking-widest leading-none mb-1">Email Address</p>
                        <p className="text-sm font-bold text-slate-705 dark:text-slate-300 truncate">{profileData.email || user?.email}</p>
                    </div>
                </div>

                {/* Class & Department (only for students) */}
                {classInfo && (
                    <>
                        {/* Department */}
                        <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                            <School className="w-5 h-5 opacity-50 shrink-0" />
                            <div className="min-w-0 flex-1">
                                <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest leading-none mb-1">Academic Department</p>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">{classInfo.department || 'General Science'}</p>
                            </div>
                        </div>
                        {/* Class */}
                        <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                            <School className="w-5 h-5 opacity-50 shrink-0" />
                            <div className="min-w-0 flex-1">
                                <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest leading-none mb-1">Class Registry</p>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">{classInfo.className || 'CS - 2024'}</p>
                            </div>
                        </div>
                    </>
                )}

                {/* Status */}
                <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                    <Bell className="w-5 h-5 opacity-50 shrink-0" />
                    <div>
                        <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest leading-none mb-1">Status</p>
                        <p className="text-sm font-bold text-emerald-500 dark:text-emerald-450 flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-emerald-550 dark:bg-emerald-400 rounded-full animate-pulse"></span>
                            Active Academic Unit
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
