import { Filter, ChevronDown } from 'lucide-react';

const FilterDropdown = ({ value, onChange, options = [] }) => {
    return (
        <div className="relative w-full sm:w-48 shrink-0">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-405" />
            <select
                className="w-full pl-11 pr-10 py-3 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-105 dark:border-slate-800/80 rounded-2xl outline-none focus:border-indigo-650 dark:focus:border-indigo-500 font-black text-slate-700 dark:text-slate-300 uppercase text-[10px] tracking-widest appearance-none cursor-pointer"
                value={value}
                onChange={onChange}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
    );
};

export default FilterDropdown;
