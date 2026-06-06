import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer text-slate-500 dark:text-slate-350"
                    title="Previous Page"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Page Number Buttons */}
                <div className="flex gap-1">
                    {pageNumbers.map(page => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`w-10 h-10 rounded-xl font-black text-[10px] transition-all cursor-pointer ${
                                currentPage === page
                                ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-md'
                                : 'bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-750'
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                {/* Next Button */}
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer text-slate-500 dark:text-slate-350"
                    title="Next Page"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
