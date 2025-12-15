import type { TaskCardProps } from "../types";
import clsx from "clsx";
import { useAuthStore } from "../store/useAuthStore";

export const TaskCard = ({ task, onDelete, onStatusChange }: TaskCardProps) => {
    const priorityColors = {
        LOW: "bg-blue-100 text-blue-700",
        MEDIUM: "bg-amber-100 text-amber-700",
        HIGH: "bg-orange-100 text-orange-700",
        URGENT: "bg-red-100 text-red-700",
    };
    const { user } = useAuthStore();

    const isOverdue =
        task.dueDate &&
        new Date(task.dueDate) < new Date() &&
        task.status !== "COMPLETED";

    return (
        <div
            className={clsx(
                "bg-surface border rounded-xl p-5 shadow-sm hover:shadow-md transition-all group",
                isOverdue ? "border-red-300" : "border-border"
            )}
        >
            <div className="flex justify-between items-start mb-3">
                <span
                    className={clsx(
                        "text-xs font-bold px-2 py-1 rounded uppercase tracking-wider",
                        priorityColors[task.priority]
                    )}
                >
                    {task.priority}
                </span>

                {user?.id === task.creatorId && (
                    <button
                        onClick={() => onDelete(task.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors cursor-pointer"
                        title="Delete Task"
                    >
                        🗑️
                    </button>
                )}
            </div>

            <h3 className="font-bold text-lg text-main mb-1 truncate">
                {task.title}
            </h3>
            <p
                className="text-sm text-muted mb-4 line-clamp-3 wrap-break-word"
                title={task.description}
            >
                {task.description || "No description provided."}
            </p>

            {/* Footer: Date & Status */}
            <div className="pt-4 border-t border-border flex flex-col gap-3">
                {/* Date Row */}
                <div className="flex justify-between items-center text-xs">
                    <span
                        className={clsx(
                            isOverdue ? "text-red-600 font-bold" : "text-muted"
                        )}
                    >
                        {task.dueDate
                            ? `Due: ${new Date(
                                  task.dueDate
                              ).toLocaleDateString()}`
                            : "No Due Date"}
                    </span>
                    {task.assignedTo ? (
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                            @{task.assignedTo.name}
                        </span>
                    ) : (
                        <span className="text-slate-400 italic">
                            Unassigned
                        </span>
                    )}
                </div>

                {/* Status Dropdown */}
                <select
                    value={task.status}
                    onChange={(e) =>
                        onStatusChange(task.id, e.target.value as any)
                    }
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2 text-main focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="REVIEW">In Review</option>
                    <option value="COMPLETED">Completed</option>
                </select>
            </div>
        </div>
    );
};
