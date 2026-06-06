import { Link } from 'react-router-dom';
import { Calendar, BookOpen, CheckCircle2, MessageSquare, ArrowRight, Award } from 'lucide-react';
import CountdownTimer from './CountdownTimer';

const AssignmentCard = ({ assignment, status, onSubmitLink }) => {
    return (
        <div className="group bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all border border-slate-100 dark:border-slate-805/50 flex flex-col justify-between relative overflow-hidden min-h-[340px]">
            <div>
                {/* Header Badge + Icon */}
                <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${status.color}`}>
                        {status.icon && <status.icon className="w-3.5 h-3.5" />}
                        {status.label}
                    </span>
                    <div className="w-9 h-9 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                        <BookOpen className="w-4.5 h-4.5" />
                    </div>
                </div>

                {/* Subject and Title */}
                <div className="mb-2">
                    <span className="text-[8px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block mb-0.5">
                        {assignment.classId?.className || 'General Curriculum'}
                    </span>
                    <h3 className="text-lg font-black text-slate-850 dark:text-white group-hover:text-indigo-650 dark:group-hover:text-indigo-400 transition-colors leading-tight line-clamp-2">
                        {assignment.title}
                    </h3>
                </div>

                {/* Description */}
                <p className="text-slate-500 dark:text-slate-450 text-xs leading-relaxed line-clamp-3 mb-6">
                    {assignment.description}
                </p>
            </div>

            <div className="mt-auto space-y-4">
                {/* Countdown Timer for Pending/Late tasks */}
                {status.type === 'pending' && (
                    <div className="bg-slate-50 dark:bg-slate-950/40 p-3.5 rounded-xl border border-slate-100/80 dark:border-slate-800/60 mb-2">
                        <CountdownTimer dueDate={assignment.dueDate} />
                    </div>
                )}

                {/* Reviewed Marks & Feedback preview if reviewed */}
                {status.type === 'reviewed' && status.submission && (
                    <div className="bg-emerald-50/20 dark:bg-emerald-950/5 p-3 rounded-xl border border-emerald-100/30 dark:border-emerald-900/20 mb-2 flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                            <span className="text-[7px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                <MessageSquare className="w-3 h-3 text-indigo-400" /> Faculty Insights
                            </span>
                            <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium italic truncate mt-0.5">
                                "{status.submission.feedback || 'Excellent execution.'}"
                            </p>
                        </div>
                        <div className="shrink-0 text-right">
                            <span className="text-[7px] font-bold text-slate-405 dark:text-slate-500 uppercase tracking-widest block leading-none mb-1">Score</span>
                            <span className="text-sm font-black text-emerald-500 dark:text-emerald-450 flex items-center justify-end leading-none gap-0.5">
                                <Award className="w-3.5 h-3.5" />
                                {status.submission.marks}/100
                            </span>
                        </div>
                    </div>
                )}

                {/* Submitted status note */}
                {status.type === 'submitted' && status.submission && (
                    <div className="bg-indigo-50/10 dark:bg-indigo-950/5 p-3 rounded-xl border border-indigo-100/20 dark:border-indigo-900/10 mb-2">
                        <span className="text-[7px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-0.5">Submitted link</span>
                        <p className="text-[10px] text-indigo-555 dark:text-indigo-400 font-mono truncate">
                            {status.submission.submissionLink}
                        </p>
                    </div>
                )}

                {/* Card Footer: Due date and action button */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-800">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-rose-500" />
                        Due: {new Date(assignment.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>

                    {status.type === 'pending' || status.type === 'late' ? (
                        <Link
                            to={`/student/submit/${assignment._id}`}
                            className="px-4 py-2 bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white font-black text-[10px] uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-all duration-300 cursor-pointer shadow-sm"
                        >
                            Submit <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    ) : (
                        <span className="text-emerald-500 dark:text-emerald-450 font-black text-[10px] uppercase tracking-wider flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Handed In
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AssignmentCard;
