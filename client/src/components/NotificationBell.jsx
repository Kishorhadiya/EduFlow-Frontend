import { useState, useEffect, useRef } from 'react';
import { Bell, Award, FileText, AlertCircle, ClipboardList, CheckCircle2 } from 'lucide-react';

const NotificationBell = ({ notifications = [], onMarkAsRead, onClearAll }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    // Handle clicking outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getIcon = (type) => {
        switch (type) {
            case 'marks':
            case 'grade':
                return Award;
            case 'created':
            case 'new':
                return FileText;
            case 'deadline':
            case 'warning':
                return AlertCircle;
            default:
                return ClipboardList;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Notification Bell Icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all active:scale-95 relative cursor-pointer ${
                    isOpen 
                    ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-650 dark:text-indigo-400 border-indigo-200 dark:border-indigo-850' 
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700/50 text-slate-505 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
                title="Notifications"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-bounce shadow-md">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Dropdown */}
            {isOpen && (
                <div className="absolute right-0 top-14 w-80 sm:w-96 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-100 dark:border-slate-800 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] rounded-2xl p-4 animate-in fade-in-50 slide-in-from-top-3 duration-250 z-[110]">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-105 dark:border-slate-800 mb-3">
                        <div>
                            <h4 className="text-sm font-black text-slate-900 dark:text-white">EduFlow Inbox</h4>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-0.5">Alert Protocols</p>
                        </div>
                        {unreadCount > 0 && onClearAll && (
                            <button
                                onClick={() => {
                                    onClearAll();
                                    setIsOpen(false);
                                }}
                                className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 hover:underline uppercase tracking-wider cursor-pointer"
                            >
                                Clear All
                            </button>
                        )}
                    </div>

                    <div className="max-h-[300px] overflow-y-auto space-y-2.5 pr-1">
                        {notifications.length === 0 ? (
                            <div className="py-8 text-center text-slate-400 dark:text-slate-500 text-xs font-semibold">
                                No notifications reported
                            </div>
                        ) : (
                            notifications.map((notif) => {
                                const IconComponent = getIcon(notif.type);
                                return (
                                    <div
                                        key={notif.id}
                                        onClick={() => {
                                            if (onMarkAsRead) onMarkAsRead(notif.id);
                                        }}
                                        className={`p-3 rounded-xl border flex gap-3 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                                            notif.read
                                            ? 'bg-transparent border-slate-100 dark:border-slate-800/50 opacity-60'
                                            : 'bg-indigo-50/20 dark:bg-indigo-950/5 border-indigo-100/30 dark:border-indigo-900/20 shadow-sm'
                                        }`}
                                    >
                                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                                            notif.type === 'marks' || notif.type === 'grade'
                                            ? 'text-emerald-505 bg-emerald-50 dark:bg-emerald-950/30'
                                            : notif.type === 'deadline' || notif.type === 'warning'
                                            ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/30'
                                            : 'text-indigo-650 bg-indigo-50 dark:bg-indigo-950/30'
                                        }`}>
                                            <IconComponent className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex justify-between items-start">
                                                <h5 className="text-xs font-black text-slate-850 dark:text-slate-205 truncate">{notif.title}</h5>
                                                <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 shrink-0 ml-2">{notif.time}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-450 font-medium leading-normal mt-0.5">{notif.message}</p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
