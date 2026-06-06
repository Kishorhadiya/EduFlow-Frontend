import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = 'Search syllabus tasks...' }) => {
    return (
        <div className="relative flex-grow w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
                type="text"
                placeholder={placeholder}
                className="w-full pl-11 pr-4 py-3 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl outline-none focus:border-indigo-600 dark:focus:border-indigo-500 transition-all font-bold text-slate-705 dark:text-slate-350"
                value={value}
                onChange={onChange}
            />
        </div>
    );
};

export default SearchBar;
