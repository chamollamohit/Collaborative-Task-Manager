export const TaskSkeleton = () => {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm animate-pulse">
            <div className="flex justify-between items-start mb-3">
                <div className="h-5 w-16 bg-slate-200 rounded"></div>
                <div className="h-5 w-5 bg-slate-200 rounded-full"></div>
            </div>
            <div className="h-6 w-3/4 bg-slate-200 rounded mb-2"></div>
            <div className="h-4 w-full bg-slate-200 rounded mb-2"></div>
            <div className="h-4 w-1/2 bg-slate-200 rounded mb-4"></div>
            <div className="pt-4 border-t border-slate-100 flex justify-between">
                <div className="h-4 w-20 bg-slate-200 rounded"></div>
                <div className="h-8 w-24 bg-slate-200 rounded"></div>
            </div>
        </div>
    );
};
