import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/useAuthStore";
import {
    getTasksRequest,
    deleteTaskRequest,
    updateTaskRequest,
    createTaskRequest,
} from "../api/task.api";
import { logoutRequest } from "../api/auth.api";
import { TaskCard } from "../components/TaskCard";
import { TaskSkeleton } from "../components/TaskSkeleton";
import { useSocket } from "../hooks/useSocket"; // Custom hook for real-time
import type { CreateTaskData } from "../types";
import { useUsers } from "../hooks/useUsers";

export const Dashboard = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user, logout } = useAuthStore();
    const [isCreating, setIsCreating] = useState(false);
    const { data: users = [], isLoading: isLoadingUsers } = useUsers();
    const [activeTab, setActiveTab] = useState<
        "ALL" | "ASSIGNED" | "CREATED" | "OVERDUE"
    >("ALL");
    const [filterStatus, setFilterStatus] = useState<string>("ALL");
    const [filterPriority, setFilterPriority] = useState<string>("ALL");
    const [sortBy, setSortBy] = useState<string>("NEWEST");

    // 1. Enable Real-Time Updates
    useSocket();

    // 2. React Hook Form Setup
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateTaskData>({
        defaultValues: {
            priority: "MEDIUM",
            status: "TODO",
        },
    });

    // 3. Fetch Tasks (React Query)
    const {
        data: tasks = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["tasks"],
        queryFn: async () => {
            const res = await getTasksRequest();
            return res.data.data;
        },
    });

    // 4. Mutations (Create, Update, Delete)

    const createTaskMutation = useMutation({
        mutationFn: (data: CreateTaskData) => {
            // Data transformation before sending to API
            return createTaskRequest({
                ...data,
                dueDate: data.dueDate
                    ? new Date(data.dueDate).toISOString()
                    : undefined,
                assignedToId: data.assignedToId
                    ? Number(data.assignedToId)
                    : undefined,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Refetch immediately
            reset(); // Clear form
            setIsCreating(false); // Close modal
        },
        onError: () => alert("Failed to create task"),
    });

    const updateTaskMutation = useMutation({
        mutationFn: ({ id, status }: { id: number; status: any }) =>
            updateTaskRequest(id, { status }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
        onError: () => alert("Failed to update status"),
    });

    const deleteTaskMutation = useMutation({
        mutationFn: deleteTaskRequest,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
        onError: () => alert("Failed to delete task"),
    });

    // 5. Handlers
    const handleLogout = async () => {
        try {
            await logoutRequest();
            logout();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const onSubmit = (data: CreateTaskData) => {
        createTaskMutation.mutate(data);
    };

    // Filter and Sort the tasks
    const filteredTasks = tasks
        .filter((task: any) => {
            // 1. Tab Views
            if (activeTab === "ASSIGNED") {
                // Show only tasks assigned to ME
                if (task.assignedToId !== user?.id) return false;
            }
            if (activeTab === "CREATED") {
                // Show only tasks created by ME
                if (task.creatorId !== user?.id) return false;
            }
            if (activeTab === "OVERDUE") {
                // Show only incomplete tasks where due date is in the past and Task is assigned to user
                const isOverdue =
                    task.dueDate &&
                    new Date(task.dueDate) < new Date() &&
                    task.status !== "COMPLETED" &&
                    task.assignedToId == user?.id;
                if (!isOverdue) return false;
            }

            // 2. Toolbar Filters (The "Micro" Filter)
            if (filterStatus !== "ALL" && task.status !== filterStatus)
                return false;
            if (filterPriority !== "ALL" && task.priority !== filterPriority)
                return false;

            return true;
        })
        .sort((a: any, b: any) => {
            // 3. Sorting Logic
            if (sortBy === "DUE_DATE") {
                // Put tasks without due dates at the bottom
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                // Sort ascending (Earliest date first)
                return (
                    new Date(a.dueDate).getTime() -
                    new Date(b.dueDate).getTime()
                );
            }
            // Default: Sort by ID descending (Newest created first)
            return b.id - a.id;
        });

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* --- Navbar --- */}
            <nav className="bg-surface border-b border-border px-6 py-4 bg-white flex justify-between items-center shadow-sm sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-black font-bold">
                        TM
                    </div>
                    <h1 className="text-xl font-bold text-main tracking-tight">
                        TaskMaster
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full">
                        <div className="w-6 h-6 rounded-full bg-primary text-gray-400 flex items-center justify-center text-xs font-bold">
                            {user?.name?.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-main">
                            <button
                                className="hover:underline cursor-pointer"
                                onClick={() => {
                                    navigate("/profile");
                                }}
                            >
                                {user?.name}
                            </button>
                        </span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-sm font-medium text-muted hover:text-red-600 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-6">
                {/* --- Header Section --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-main">
                            Project Board
                        </h2>
                        <p className="text-muted mt-1">
                            Real-time collaboration with your team
                        </p>
                    </div>
                    <button
                        onClick={() => setIsCreating(!isCreating)}
                        className="bg-primary hover:bg-primary-hover text-black px-5 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-primary/20 flex items-center gap-2 active:scale-95"
                    >
                        {isCreating ? (
                            <>
                                <span>✖</span> Close Form
                            </>
                        ) : (
                            <>
                                <span>+</span> New Task
                            </>
                        )}
                    </button>
                </div>

                {/* --- View Tabs --- */}
                <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl mb-6 border border-slate-200 w-fit">
                    <button
                        onClick={() => setActiveTab("ALL")}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                            activeTab === "ALL"
                                ? "bg-white text-primary shadow-sm"
                                : "text-muted hover:text-main hover:bg-slate-200/50"
                        }`}
                    >
                        All Tasks
                    </button>

                    <button
                        onClick={() => setActiveTab("ASSIGNED")}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                            activeTab === "ASSIGNED"
                                ? "bg-white text-primary shadow-sm"
                                : "text-muted hover:text-main hover:bg-slate-200/50"
                        }`}
                    >
                        Assigned to Me
                    </button>

                    <button
                        onClick={() => setActiveTab("CREATED")}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                            activeTab === "CREATED"
                                ? "bg-white text-primary shadow-sm"
                                : "text-muted hover:text-main hover:bg-slate-200/50"
                        }`}
                    >
                        Created by Me
                    </button>

                    <button
                        onClick={() => setActiveTab("OVERDUE")}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                            activeTab === "OVERDUE"
                                ? "bg-red-50 text-red-600 shadow-sm ring-1 ring-red-100"
                                : "text-muted hover:text-red-500 hover:bg-red-50"
                        }`}
                    >
                        Overdue for Me
                    </button>
                </div>

                {/* --- Filter & Sort Toolbar --- */}
                <div className="flex flex-wrap gap-4 mb-6 bg-surface p-4 rounded-xl border border-border shadow-sm items-center">
                    <span className="text-sm font-bold text-muted uppercase tracking-wider">
                        Filters:
                    </span>

                    {/* Status Filter */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-border bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="REVIEW">In Review</option>
                        <option value="COMPLETED">Completed</option>
                    </select>

                    {/* Priority Filter */}
                    <select
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-border bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="ALL">All Priorities</option>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="URGENT">Urgent</option>
                    </select>

                    <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block"></div>

                    <span className="text-sm font-bold text-muted uppercase tracking-wider">
                        Sort:
                    </span>

                    {/* Sort Control */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-border bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="NEWEST">✨ Newest First</option>
                        <option value="DUE_DATE">
                            📅 Due Date (Sooner first)
                        </option>
                    </select>

                    {/* Reset Button (Only show if filters are active) */}
                    {(filterStatus !== "ALL" ||
                        filterPriority !== "ALL" ||
                        sortBy !== "NEWEST") && (
                        <button
                            onClick={() => {
                                setFilterStatus("ALL");
                                setFilterPriority("ALL");
                                setSortBy("NEWEST");
                            }}
                            className="ml-auto text-sm text-red-500 hover:text-red-700 hover:underline px-2"
                        >
                            Reset Filters
                        </button>
                    )}
                </div>

                {/* --- Create Task Form  --- */}
                {isCreating && (
                    <div className="bg-surface p-6 rounded-xl border border-border mb-8 shadow-sm animate-fade-in-down">
                        <h3 className="text-lg font-bold text-main mb-4">
                            Create New Task
                        </h3>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            {/* Left Column */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium block mb-1.5 text-main">
                                        Task Title
                                    </label>
                                    <input
                                        {...register("title", {
                                            required: "Title is required",
                                        })}
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-slate-50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        placeholder="e.g. Redesign Homepage"
                                    />
                                    {errors.title && (
                                        <span className="text-red-500 text-xs mt-1 block">
                                            {errors.title.message}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <label className="text-sm font-medium block mb-1.5 text-main">
                                        Description
                                    </label>
                                    <textarea
                                        {...register("description")}
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-slate-50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all h-32 resize-none"
                                        placeholder="Add details about this task..."
                                    />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium block mb-1.5 text-main">
                                            Status
                                        </label>
                                        <select
                                            {...register("status")}
                                            className="w-full px-3 py-2 border border-border rounded-lg bg-slate-50 focus:ring-2 focus:ring-primary/20 outline-none"
                                        >
                                            <option value="TODO">To Do</option>
                                            <option value="IN_PROGRESS">
                                                In Progress
                                            </option>
                                            <option value="REVIEW">
                                                In Review
                                            </option>
                                            <option value="COMPLETED">
                                                Completed
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium block mb-1.5 text-main">
                                            Priority
                                        </label>
                                        <select
                                            {...register("priority")}
                                            className="w-full px-3 py-2 border border-border rounded-lg bg-slate-50 focus:ring-2 focus:ring-primary/20 outline-none"
                                        >
                                            <option value="LOW">Low</option>
                                            <option value="MEDIUM">
                                                Medium
                                            </option>
                                            <option value="HIGH">High</option>
                                            <option value="URGENT">
                                                Urgent
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium block mb-1.5 text-main">
                                            Due Date
                                        </label>
                                        <input
                                            type="date"
                                            {...register("dueDate", {
                                                required:
                                                    "Due Date is required",
                                                validate: (value) => {
                                                    if (!value) return true;
                                                    const selectedDate =
                                                        new Date(value);
                                                    const today = new Date();
                                                    today.setHours(0, 0, 0, 0); // Reset time to midnight (00:00:00) so we only compare dates

                                                    return (
                                                        selectedDate >= today ||
                                                        "Date cannot be in the past"
                                                    );
                                                },
                                            })}
                                            className={`w-full px-3 py-2 border rounded-lg bg-slate-50 focus:ring-2 outline-none ${
                                                errors.dueDate
                                                    ? "border-red-500 ring-red-200"
                                                    : "border-border focus:ring-primary/20"
                                            }`}
                                        />
                                        {errors.dueDate && (
                                            <span className="text-red-500 text-xs mt-1 block">
                                                {errors.dueDate.message}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium block mb-1.5 text-main">
                                            Assignee ID
                                        </label>
                                        <div className="relative">
                                            <select
                                                {...register("assignedToId", {
                                                    required:
                                                        "Please assign a user",
                                                })}
                                                className={`w-full px-3 py-2 border rounded-lg bg-slate-50 focus:ring-2 outline-none appearance-none ${
                                                    errors.assignedToId
                                                        ? "border-red-500 ring-red-200"
                                                        : "border-border focus:ring-primary/20"
                                                }`}
                                            >
                                                <option value="">
                                                    Unassigned
                                                </option>
                                                {users.map((u) => (
                                                    <option
                                                        key={u.id}
                                                        value={u.id}
                                                    >
                                                        {u.name} ({u.email})
                                                    </option>
                                                ))}
                                            </select>

                                            {/* Loading Indicator for the dropdown */}
                                            {isLoadingUsers && (
                                                <div className="absolute right-3 top-2.5">
                                                    <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                                                </div>
                                            )}
                                        </div>
                                        {errors.assignedToId && (
                                            <span className="text-red-500 text-xs mt-1 block">
                                                {errors.assignedToId.message}
                                            </span>
                                        )}
                                        <p className="text-xs text-muted mt-1">
                                            Assign this task to a team member.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={createTaskMutation.isPending}
                                        className="w-full md:w-auto bg-primary text-black px-8 py-2.5 rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {createTaskMutation.isPending
                                            ? "Creating..."
                                            : "Create Task"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}

                {/* --- Error State --- */}
                {isError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-center gap-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <div>
                            <p className="font-bold">Connection Error</p>
                            <p className="text-sm">
                                Could not fetch tasks. Please check your
                                internet or backend server.
                            </p>
                        </div>
                    </div>
                )}

                {/* --- Task Grid --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* Loading Skeletons */}
                    {isLoading && (
                        <>
                            <TaskSkeleton />
                            <TaskSkeleton />
                            <TaskSkeleton />
                            <TaskSkeleton />
                        </>
                    )}

                    {/* Actual Data */}
                    {!isLoading &&
                        filteredTasks.map((task: any) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onDelete={(id) => deleteTaskMutation.mutate(id)}
                                onStatusChange={(id, status) =>
                                    updateTaskMutation.mutate({ id, status })
                                }
                            />
                        ))}

                    {/* Empty State */}
                    {!isLoading && tasks.length === 0 && (
                        <div className="col-span-full py-16 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-3xl">
                                📝
                            </div>
                            <h3 className="text-lg font-bold text-main">
                                No tasks found
                            </h3>
                            <p className="text-muted max-w-sm mt-2">
                                Your board is empty. Click the "New Task" button
                                above to get started.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
