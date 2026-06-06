import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeContext from '../../context/ThemeContext';
import AuthContext from '../../context/AuthContext';
import Swal from 'sweetalert2';
import { Settings, Sun, Moon, Bell, Shield, User, ArrowRight, Save, Key } from 'lucide-react';

const StudentSettingsPage = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Notification Preferences state (persisted to LocalStorage)
    const [preferences, setPreferences] = useState(() => {
        const savedPrefs = localStorage.getItem('student_notification_preferences');
        return savedPrefs ? JSON.parse(savedPrefs) : {
            newAssignment: true,
            deadlineWarning: true,
            assignmentReviewed: true,
            marksPublished: true,
            newsletter: false
        };
    });

    const handlePreferenceChange = (key) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSavePreferences = () => {
        localStorage.setItem('student_notification_preferences', JSON.stringify(preferences));
        Swal.fire({
            icon: 'success',
            title: 'Preferences Saved',
            text: 'Your system notifications preferences have been updated.',
            timer: 1500,
            showConfirmButton: false,
            background: theme === 'dark' ? '#0f172a' : '#fff',
            color: theme === 'dark' ? '#f8fafc' : '#1e293b'
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
            {/* Ambient Background decoration */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-20 -left-40 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-500/5 rounded-full blur-3xl animate-glow-pulse"></div>
                <div className="absolute bottom-20 -right-40 w-96 h-96 bg-purple-400/10 dark:bg-purple-500/5 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-4xl mx-auto animate-cinematic-in space-y-8">
                {/* Title Header */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 dark:bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                        <Settings className="w-6 h-6 animate-spin duration-[8s]" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">Portal Settings</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Configure your theme, security options, and inbox preferences.</p>
                    </div>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Quick Shortcuts */}
                    <div className="md:col-span-4 space-y-6">
                        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-xl space-y-4">
                            <h3 className="text-xs font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">Shortcuts</h3>
                            
                            <button
                                onClick={() => navigate('/student/profile')}
                                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left text-xs font-bold text-slate-655 dark:text-slate-300 group cursor-pointer"
                            >
                                <span className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-indigo-500" /> Personal Details
                                </span>
                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </button>

                            <button
                                onClick={() => navigate('/student/profile')}
                                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left text-xs font-bold text-slate-655 dark:text-slate-300 group cursor-pointer"
                            >
                                <span className="flex items-center gap-2">
                                    <Key className="w-4 h-4 text-emerald-500" /> Security Vault
                                </span>
                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </button>
                        </div>

                        {/* Security Policy Badge */}
                        <div className="bg-slate-900 dark:bg-slate-900/60 rounded-3xl p-6 text-white border border-slate-850 dark:border-slate-800/50 relative overflow-hidden shadow-xl">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/20 rounded-full blur-[30px] -mr-12 -mt-12"></div>
                            <h4 className="text-sm font-black mb-2 flex items-center gap-2">
                                <Shield className="w-4 h-4 text-indigo-400" /> Privacy Protocol
                            </h4>
                            <p className="text-indigo-200/60 text-[11px] font-medium leading-relaxed">
                                EduFlow does not track your location. Preferences are stored locally on this terminal.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Settings Sections */}
                    <div className="md:col-span-8 space-y-8">
                        
                        {/* Theme Configuration */}
                        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800/60 overflow-hidden">
                            <div className="px-8 py-6 border-b border-slate-105 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
                                    {theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-amber-400" />}
                                </div>
                                <h3 className="text-base font-black text-slate-905 dark:text-white">Theme Customization</h3>
                            </div>

                            <div className="p-8 sm:p-10 space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Dark Interface Mode</h4>
                                        <p className="text-xs text-slate-400 dark:text-slate-505 font-medium mt-0.5">Toggle high-contrast dark theme mode.</p>
                                    </div>

                                    {/* Toggle Switch */}
                                    <button
                                        onClick={toggleTheme}
                                        className={`w-14 h-8 rounded-full p-1 transition-all duration-350 cursor-pointer ${
                                            theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-200'
                                        }`}
                                    >
                                        <div
                                            className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-350 flex items-center justify-center ${
                                                theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
                                            }`}
                                        >
                                            {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-indigo-600" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Notification Preferences */}
                        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800/60 overflow-hidden">
                            <div className="px-8 py-6 border-b border-slate-105 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
                                        <Bell className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-base font-black text-slate-900 dark:text-white">Notification Center</h3>
                                </div>
                                <Save className="w-5 h-5 text-slate-350 dark:text-slate-600" />
                            </div>

                            <div className="p-8 sm:p-10 space-y-6">
                                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Select which events trigger terminal alerts.</p>
                                
                                <div className="space-y-4">
                                    {[
                                        { key: 'newAssignment', label: 'New Assignment Posted', desc: 'Alert when a teacher publishes coursework.' },
                                        { key: 'deadlineWarning', label: 'Assignment Deadline Near', desc: 'Warn when an assignment is due in less than 24 hours.' },
                                        { key: 'assignmentReviewed', label: 'Assignment Evaluated', desc: 'Notify when teacher feedback is submitted.' },
                                        { key: 'marksPublished', label: 'Marks Published', desc: 'Alert when grade is posted to portfolio.' }
                                    ].map((item) => (
                                        <div key={item.key} className="flex items-start justify-between gap-4 p-3 rounded-2xl hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-850">
                                            <div className="min-w-0 flex-1">
                                                <label htmlFor={item.key} className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">{item.label}</label>
                                                <p className="text-[10px] text-slate-405 dark:text-slate-500 font-medium mt-0.5">{item.desc}</p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                id={item.key}
                                                checked={preferences[item.key]}
                                                onChange={() => handlePreferenceChange(item.key)}
                                                className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700 cursor-pointer mt-1"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800/80">
                                    <button
                                        type="button"
                                        onClick={handleSavePreferences}
                                        className="px-8 py-4 bg-slate-950 hover:bg-indigo-600 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-black rounded-2xl transition-all shadow-lg flex items-center justify-center gap-3 active:scale-[0.98] group cursor-pointer"
                                    >
                                        Save Preferences <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentSettingsPage;
