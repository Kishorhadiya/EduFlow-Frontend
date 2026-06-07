import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

const calculateTimeLeft = (dueDate) => {
    const difference = +new Date(dueDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
        timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
        };
    }
    return timeLeft;
};

const CountdownTimer = ({ dueDate }) => {
    const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(dueDate));

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(dueDate));
        }, 1000);
        return () => clearInterval(timer);
    }, [dueDate]);

    const isExpired = Object.keys(timeLeft).length === 0;

    if (isExpired) {
        return (
            <div className="flex items-center gap-1.5 text-rose-500 font-black text-[10px] uppercase tracking-wider">
                <AlertCircle className="w-3.5 h-3.5" /> Late Submission
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-1 text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest leading-none">
            <span>Assignment Due In:</span>
            <div className="flex gap-2 text-slate-800 dark:text-slate-200 mt-1">
                <div className="flex flex-col items-center">
                    <span className="text-base font-black text-indigo-600 dark:text-indigo-400">{timeLeft.days}</span>
                    <span className="text-[7px] text-slate-400 font-bold uppercase tracking-tight">Days</span>
                </div>
                <span className="text-slate-300 dark:text-slate-700">:</span>
                <div className="flex flex-col items-center">
                    <span className="text-base font-black text-indigo-600 dark:text-indigo-400">{timeLeft.hours}</span>
                    <span className="text-[7px] text-slate-400 font-bold uppercase tracking-tight">Hours</span>
                </div>
                <span className="text-slate-300 dark:text-slate-700">:</span>
                <div className="flex flex-col items-center">
                    <span className="text-base font-black text-indigo-600 dark:text-indigo-400">{timeLeft.minutes}</span>
                    <span className="text-[7px] text-slate-400 font-bold uppercase tracking-tight">Mins</span>
                </div>
                <span className="text-slate-300 dark:text-slate-700">:</span>
                <div className="flex flex-col items-center">
                    <span className="text-base font-black text-indigo-600 dark:text-indigo-400">{timeLeft.seconds}</span>
                    <span className="text-[7px] text-slate-400 font-bold uppercase tracking-tight">Secs</span>
                </div>
            </div>
        </div>
    );
};

export default CountdownTimer;
