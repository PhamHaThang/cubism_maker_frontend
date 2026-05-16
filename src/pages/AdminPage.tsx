import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import {
    Shield,
    Users,
    Search,
    Ban,
    UserCheck,
    Trash2,
    Eye,
    CheckCircle2,
    XCircle,
    Download,
    Layers,
    Grid3X3,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import { api, buildApiUrl } from "../services/api";
import { Level, LevelPagination } from "../types";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { LevelPreview3D } from "../components/community/LevelPreview3D";
import { Pagination } from "../components/ui/Pagination";

interface AdminUser {
    _id: string;
    username: string;
    email: string;
    isAdmin?: boolean;
    isBanned?: boolean;
    createdAt?: string;
}

interface AdminUserDetail {
    user: AdminUser;
    stats: {
        totalLevels: number;
        publicLevels: number;
        pendingLevels: number;
        rejectedLevels: number;
        favorites: number;
    };
}

const AdminPage: React.FC = () => {
    const { user } = useAuthStore();
    const [tab, setTab] = useState<"levels" | "all-levels" | "users">(
        "all-levels",
    );

    const [users, setUsers] = useState<AdminUser[]>([]);
    const [usersLoading, setUsersLoading] = useState(true);
    const [userSearchInput, setUserSearchInput] = useState("");
    const [userSearch, setUserSearch] = useState("");
    const [usersPagination, setUsersPagination] = useState<LevelPagination>({
        page: 1,
        limit: 12,
        total: 0,
        pages: 0,
    });
    const [selectedUser, setSelectedUser] = useState<AdminUserDetail | null>(
        null,
    );
    const [userModalOpen, setUserModalOpen] = useState(false);
    const [userModalLoading, setUserModalLoading] = useState(false);
    const [userActionId, setUserActionId] = useState<string | null>(null);

    const [levels, setLevels] = useState<Level[]>([]);
    const [levelsLoading, setLevelsLoading] = useState(true);
    const [levelSearchInput, setLevelSearchInput] = useState("");
    const [levelSearch, setLevelSearch] = useState("");
    const [reviewStatus, setReviewStatus] = useState<
        "pending" | "approved" | "rejected" | "all"
    >("pending");
    const [levelsPagination, setLevelsPagination] = useState<LevelPagination>({
        page: 1,
        limit: 12,
        total: 0,
        pages: 0,
    });
    const [levelActionId, setLevelActionId] = useState<string | null>(null);

    const [allLevels, setAllLevels] = useState<Level[]>([]);
    const [allLevelsLoading, setAllLevelsLoading] = useState(true);
    const [allLevelsSearchInput, setAllLevelsSearchInput] = useState("");
    const [allLevelsSearch, setAllLevelsSearch] = useState("");
    const [allLevelsStatus, setAllLevelsStatus] = useState<
        "all" | "public" | "private"
    >("all");
    const [allLevelsReview, setAllLevelsReview] = useState<
        "all" | "approved" | "pending" | "rejected"
    >("all");
    const [allLevelsDifficulty, setAllLevelsDifficulty] =
        useState<string>("all");
    const [allLevelsMainMenu, setAllLevelsMainMenu] = useState<
        "all" | "true" | "false"
    >("all");
    const [allLevelsPagination, setAllLevelsPagination] =
        useState<LevelPagination>({
            page: 1,
            limit: 12,
            total: 0,
            pages: 0,
        });
    const [allLevelsActionId, setAllLevelsActionId] = useState<string | null>(
        null,
    );
    const [editLevelOpen, setEditLevelOpen] = useState(false);
    const [editLevelLoading, setEditLevelLoading] = useState(false);
    const [editLevelTarget, setEditLevelTarget] = useState<Level | null>(null);
    const [editName, setEditName] = useState("");
    const [editDifficulty, setEditDifficulty] = useState("medium");
    const [editTimeSeconds, setEditTimeSeconds] = useState("0");
    const [editStatus, setEditStatus] = useState<"public" | "private">(
        "public",
    );
    const [editReviewStatus, setEditReviewStatus] = useState<
        "approved" | "pending" | "rejected"
    >("pending");

    useEffect(() => {
        const timer = window.setTimeout(() => {
            const next = userSearchInput.trim();
            setUserSearch((prev) => (prev === next ? prev : next));
        }, 350);
        return () => window.clearTimeout(timer);
    }, [userSearchInput]);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            const next = levelSearchInput.trim();
            setLevelSearch((prev) => (prev === next ? prev : next));
        }, 350);
        return () => window.clearTimeout(timer);
    }, [levelSearchInput]);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            const next = allLevelsSearchInput.trim();
            setAllLevelsSearch((prev) => (prev === next ? prev : next));
        }, 350);
        return () => window.clearTimeout(timer);
    }, [allLevelsSearchInput]);

    const fetchUsers = useCallback(
        async (page = 1) => {
            setUsersLoading(true);
            try {
                const res = await api.get("/api/admin/users", {
                    params: {
                        page,
                        limit: 12,
                        search: userSearch || undefined,
                    },
                });
                setUsers(res.data.users ?? []);
                if (res.data.pagination) {
                    setUsersPagination(res.data.pagination);
                }
            } catch (error: any) {
                setUsers([]);
                toast.error(
                    error.response?.data?.message || "Failed to load users",
                );
            } finally {
                setUsersLoading(false);
            }
        },
        [userSearch],
    );

    const fetchReviewLevels = useCallback(
        async (page = 1) => {
            setLevelsLoading(true);
            try {
                const res = await api.get("/api/admin/levels", {
                    params: {
                        page,
                        limit: 9,
                        search: levelSearch || undefined,
                        status: reviewStatus,
                    },
                });
                setLevels(res.data.levels ?? []);
                if (res.data.pagination) {
                    setLevelsPagination(res.data.pagination);
                }
            } catch (error: any) {
                setLevels([]);
                toast.error(
                    error.response?.data?.message ||
                        "Failed to load review levels",
                );
            } finally {
                setLevelsLoading(false);
            }
        },
        [levelSearch, reviewStatus],
    );

    const fetchAllLevels = useCallback(
        async (page = 1) => {
            setAllLevelsLoading(true);
            try {
                const res = await api.get("/api/admin/levels/all", {
                    params: {
                        page,
                        limit: 6,
                        search: allLevelsSearch || undefined,
                        status: allLevelsStatus,
                        reviewStatus: allLevelsReview,
                        difficulty: allLevelsDifficulty,
                        isMainMenu: allLevelsMainMenu,
                    },
                });
                setAllLevels(res.data.levels ?? []);
                if (res.data.pagination) {
                    setAllLevelsPagination(res.data.pagination);
                }
            } catch (error: any) {
                setAllLevels([]);
                toast.error(
                    error.response?.data?.message || "Failed to load levels",
                );
            } finally {
                setAllLevelsLoading(false);
            }
        },
        [
            allLevelsSearch,
            allLevelsStatus,
            allLevelsReview,
            allLevelsDifficulty,
            allLevelsMainMenu,
        ],
    );

    useEffect(() => {
        if (tab === "users") {
            fetchUsers(1);
        }
    }, [tab, fetchUsers]);

    useEffect(() => {
        if (tab === "levels") {
            fetchReviewLevels(1);
        }
    }, [tab, fetchReviewLevels]);

    useEffect(() => {
        if (tab === "all-levels") {
            fetchAllLevels(1);
        }
    }, [tab, fetchAllLevels]);

    if (!user) return <Navigate to="/login" />;
    if (!user.isAdmin) return <Navigate to="/" />;

    const handleViewUser = async (userId: string) => {
        setUserModalLoading(true);
        setUserModalOpen(true);
        try {
            const res = await api.get(`/api/admin/users/${userId}`);
            setSelectedUser(res.data as AdminUserDetail);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to load user");
            setUserModalOpen(false);
        } finally {
            setUserModalLoading(false);
        }
    };

    const handleToggleBan = async (target: AdminUser) => {
        const nextState = !target.isBanned;
        const confirmMessage = nextState
            ? `Ban ${target.username}? They will be blocked from signing in.`
            : `Unban ${target.username}? They will regain access.`;
        if (!window.confirm(confirmMessage)) return;

        setUserActionId(target._id);
        try {
            await api.patch(`/api/admin/users/${target._id}`, {
                isBanned: nextState,
            });
            toast.success(nextState ? "User banned" : "User unbanned");
            fetchUsers(usersPagination.page);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            setUserActionId(null);
        }
    };

    const handleDeleteUser = async (target: AdminUser) => {
        const confirmed = window.confirm(
            `Delete ${target.username}? This will remove their levels and favorites.`,
        );
        if (!confirmed) return;

        setUserActionId(target._id);
        try {
            await api.delete(`/api/admin/users/${target._id}`);
            toast.success("User deleted");
            fetchUsers(usersPagination.page);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Delete failed");
        } finally {
            setUserActionId(null);
        }
    };

    const handleReviewLevel = async (
        levelId: string,
        status: "approved" | "rejected",
    ) => {
        setLevelActionId(levelId);
        try {
            await api.patch(`/api/admin/levels/${levelId}/review`, {
                reviewStatus: status,
            });
            toast.success(
                status === "approved" ? "Level approved" : "Level rejected",
            );
            fetchReviewLevels(levelsPagination.page);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            setLevelActionId(null);
        }
    };

    const handleReviewLevelAll = async (
        levelId: string,
        status: "approved" | "rejected",
    ) => {
        setAllLevelsActionId(levelId);
        try {
            await api.patch(`/api/admin/levels/${levelId}/review`, {
                reviewStatus: status,
            });
            toast.success(
                status === "approved" ? "Level approved" : "Level rejected",
            );
            fetchAllLevels(allLevelsPagination.page);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            setAllLevelsActionId(null);
        }
    };

    const handleDeleteLevel = async (level: Level) => {
        const confirmed = window.confirm(
            `Delete ${level.meta?.name || "Untitled Level"}? This cannot be undone.`,
        );
        if (!confirmed) return;

        setAllLevelsActionId(level._id);
        try {
            await api.delete(`/api/admin/levels/${level._id}`);
            toast.success("Level deleted");
            fetchAllLevels(allLevelsPagination.page);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Delete failed");
        } finally {
            setAllLevelsActionId(null);
        }
    };

    const openEditLevel = (level: Level) => {
        setEditLevelTarget(level);
        setEditName(level.meta?.name || "Untitled Level");
        setEditDifficulty(level.meta?.difficulty || "medium");
        setEditTimeSeconds(String(level.meta?.timeLimitSeconds ?? 0));
        setEditStatus(level.status === "private" ? "private" : "public");
        setEditReviewStatus(
            (level.reviewStatus || "pending") as
                | "approved"
                | "pending"
                | "rejected",
        );
        setEditLevelOpen(true);
    };

    const handleUpdateLevel = async () => {
        if (!editLevelTarget) return;
        const parsedTimeSeconds = Number(editTimeSeconds);
        if (
            Number.isNaN(parsedTimeSeconds) ||
            parsedTimeSeconds < 0 ||
            !Number.isFinite(parsedTimeSeconds)
        ) {
            toast.error("Time must be a non-negative number of seconds");
            return;
        }

        setEditLevelLoading(true);
        try {
            const payload = {
                name: editName.trim(),
                difficulty: editDifficulty,
                timeLimitSeconds: Math.floor(parsedTimeSeconds),
                status: editStatus,
                reviewStatus: editReviewStatus,
            };
            await api.patch(
                `/api/admin/levels/${editLevelTarget._id}`,
                payload,
            );
            toast.success("Level updated");
            setEditLevelOpen(false);
            fetchAllLevels(allLevelsPagination.page);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            setEditLevelLoading(false);
        }
    };

    const tabs = useMemo(
        () => [
            {
                key: "all-levels",
                label: "All Levels",
                icon: <Grid3X3 size={14} />,
            },
            {
                key: "levels",
                label: "Review Levels",
                icon: <Layers size={14} />,
            },
            { key: "users", label: "Users", icon: <Users size={14} /> },
        ],
        [],
    );

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
            <div className="mb-6 md:mb-7 rounded-2xl border border-neutral-200 bg-white/90 backdrop-blur-sm px-5 py-5 md:px-6 md:py-6">
                <div className="flex items-center gap-2 mb-1">
                    <Shield size={18} className="text-black" />
                    <h1 className="text-2xl font-bold tracking-tight text-black">
                        Admin Console
                    </h1>
                </div>
                <p className="text-sm text-neutral-500">
                    Manage community accounts and approve user-created levels.
                </p>
            </div>

            <div className="mb-5 flex flex-wrap gap-2 rounded-2xl border border-neutral-200 bg-white/80 p-2">
                {tabs.map((item) => (
                    <button
                        key={item.key}
                        onClick={() =>
                            setTab(
                                item.key as "levels" | "all-levels" | "users",
                            )
                        }
                        className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                            tab === item.key
                                ? "bg-black text-white"
                                : "bg-white text-neutral-600 border border-neutral-200 hover:text-black"
                        }`}>
                        {item.icon}
                        {item.label}
                    </button>
                ))}
            </div>

            {tab === "users" ? (
                <div className="space-y-5">
                    <div className="flex flex-col lg:flex-row gap-2.5 rounded-2xl border border-neutral-200 bg-white/80 p-3 md:p-4">
                        <div className="relative flex-1">
                            <Search
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                            />
                            <input
                                value={userSearchInput}
                                onChange={(event) =>
                                    setUserSearchInput(event.target.value)
                                }
                                placeholder="Search users by name or email"
                                className="w-full pl-10 pr-4 py-2.5 md:py-3 text-sm bg-white border border-neutral-200 rounded-xl outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all"
                            />
                        </div>
                    </div>

                    {usersLoading ? (
                        <div className="flex items-center justify-center py-24 rounded-2xl border border-dashed border-neutral-200 bg-white/75">
                            <span className="text-sm text-neutral-400">
                                Loading users...
                            </span>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-24 rounded-2xl border border-dashed border-neutral-200 bg-white/75">
                            <div className="text-4xl mb-3">👤</div>
                            <p className="text-sm text-neutral-500">
                                No users found
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 gap-3">
                                {users.map((entry) => (
                                    <div
                                        key={entry._id}
                                        className="flex flex-col md:flex-row md:items-center gap-3 md:gap-5 rounded-2xl border border-neutral-200 bg-white px-4 py-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold text-black">
                                                    {entry.username}
                                                </span>
                                                {entry.isAdmin && (
                                                    <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                                                        Admin
                                                    </span>
                                                )}
                                                {entry.isBanned && (
                                                    <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700">
                                                        Banned
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-xs text-neutral-500">
                                                {entry.email}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() =>
                                                    handleViewUser(entry._id)
                                                }>
                                                <Eye size={14} />
                                                View
                                            </Button>
                                            <Button
                                                variant={
                                                    entry.isBanned
                                                        ? "secondary"
                                                        : "danger"
                                                }
                                                size="sm"
                                                isLoading={
                                                    userActionId === entry._id
                                                }
                                                onClick={() =>
                                                    handleToggleBan(entry)
                                                }>
                                                {entry.isBanned ? (
                                                    <UserCheck size={14} />
                                                ) : (
                                                    <Ban size={14} />
                                                )}
                                                {entry.isBanned
                                                    ? "Unban"
                                                    : "Ban"}
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                isLoading={
                                                    userActionId === entry._id
                                                }
                                                onClick={() =>
                                                    handleDeleteUser(entry)
                                                }>
                                                <Trash2 size={14} />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Pagination
                                currentPage={usersPagination.page}
                                totalPages={usersPagination.pages}
                                totalItems={usersPagination.total}
                                itemsPerPage={usersPagination.limit}
                                onPageChange={(page) => fetchUsers(page)}
                                type="users"
                            />
                        </>
                    )}
                </div>
            ) : tab === "levels" ? (
                <div className="space-y-5">
                    <div className="flex flex-col lg:flex-row gap-2.5 rounded-2xl border border-neutral-200 bg-white/80 p-3 md:p-4">
                        <div className="relative flex-1">
                            <Search
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                            />
                            <input
                                value={levelSearchInput}
                                onChange={(event) =>
                                    setLevelSearchInput(event.target.value)
                                }
                                placeholder="Search levels by name or code"
                                className="w-full pl-10 pr-4 py-2.5 md:py-3 text-sm bg-white border border-neutral-200 rounded-xl outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all"
                            />
                        </div>
                        <select
                            value={reviewStatus}
                            onChange={(event) =>
                                setReviewStatus(
                                    event.target.value as
                                        | "pending"
                                        | "approved"
                                        | "rejected"
                                        | "all",
                                )
                            }
                            className="w-full lg:w-auto px-3.5 py-2.5 md:py-3 text-xs bg-white border border-neutral-200 rounded-xl outline-none focus:border-black focus:ring-2 focus:ring-black/10 cursor-pointer">
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="all">All</option>
                        </select>
                    </div>

                    {levelsLoading ? (
                        <div className="flex items-center justify-center py-24 rounded-2xl border border-dashed border-neutral-200 bg-white/75">
                            <span className="text-sm text-neutral-400">
                                Loading levels...
                            </span>
                        </div>
                    ) : levels.length === 0 ? (
                        <div className="text-center py-24 rounded-2xl border border-dashed border-neutral-200 bg-white/75">
                            <div className="text-4xl mb-3">🧩</div>
                            <p className="text-sm text-neutral-500">
                                No levels to review
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                {levels.map((level) => (
                                    <article
                                        key={level._id}
                                        className="group bg-white border border-neutral-200 rounded-2xl overflow-hidden hover:border-black hover:shadow-[0_24px_48px_-30px_rgba(0,0,0,0.85)] transition-all duration-150 ease-in-out">
                                        <div className="relative h-44 bg-linear-to-b from-neutral-50 to-white overflow-hidden flex items-center justify-center">
                                            <LevelPreview3D level={level} />
                                            <div className="absolute top-3 left-3 flex gap-2">
                                                <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
                                                    {level.meta?.difficulty ||
                                                        "medium"}
                                                </span>
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full border ${
                                                        level.reviewStatus ===
                                                        "approved"
                                                            ? "text-emerald-700 border-emerald-200 bg-emerald-50"
                                                            : level.reviewStatus ===
                                                                "rejected"
                                                              ? "text-rose-700 border-rose-200 bg-rose-50"
                                                              : "text-amber-700 border-amber-200 bg-amber-50"
                                                    }`}>
                                                    {level.reviewStatus ||
                                                        "pending"}
                                                </span>
                                            </div>
                                            <div className="absolute top-3 right-3">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        window.open(
                                                            buildApiUrl(
                                                                `/api/levels/vr/download/${level.code}`,
                                                            ),
                                                            "_blank",
                                                        )
                                                    }
                                                    className="p-2 rounded-full bg-white/90 border border-neutral-200 text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                                                    title="Download">
                                                    <Download size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-4 md:p-5">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <div>
                                                    <h2 className="text-sm font-semibold text-black truncate">
                                                        {level.meta?.name ||
                                                            "Untitled Level"}
                                                    </h2>
                                                    <p className="text-xs text-neutral-500">
                                                        By{" "}
                                                        {typeof level.author ===
                                                            "object" &&
                                                        level.author
                                                            ? (
                                                                  level.author as any
                                                              ).username
                                                            : "Unknown"}
                                                    </p>
                                                </div>
                                                <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 rounded-full border border-neutral-200 px-2 py-0.5">
                                                    {level.code}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 pt-3 border-t border-neutral-100">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    isLoading={
                                                        levelActionId ===
                                                        level._id
                                                    }
                                                    onClick={() =>
                                                        handleReviewLevel(
                                                            level._id,
                                                            "approved",
                                                        )
                                                    }>
                                                    <CheckCircle2 size={14} />
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    isLoading={
                                                        levelActionId ===
                                                        level._id
                                                    }
                                                    onClick={() =>
                                                        handleReviewLevel(
                                                            level._id,
                                                            "rejected",
                                                        )
                                                    }>
                                                    <XCircle size={14} />
                                                    Reject
                                                </Button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                            <Pagination
                                currentPage={levelsPagination.page}
                                totalPages={levelsPagination.pages}
                                totalItems={levelsPagination.total}
                                itemsPerPage={levelsPagination.limit}
                                onPageChange={(page) => fetchReviewLevels(page)}
                            />
                        </>
                    )}
                </div>
            ) : (
                <div className="space-y-5">
                    <div className="flex flex-col lg:flex-row gap-2.5 rounded-2xl border border-neutral-200 bg-white/80 p-3 md:p-4">
                        <div className="relative flex-1">
                            <Search
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                            />
                            <input
                                value={allLevelsSearchInput}
                                onChange={(event) =>
                                    setAllLevelsSearchInput(event.target.value)
                                }
                                placeholder="Search levels by name or code"
                                className="w-full pl-10 pr-4 py-2.5 md:py-3 text-sm bg-white border border-neutral-200 rounded-xl outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all"
                            />
                        </div>
                        <select
                            value={allLevelsStatus}
                            onChange={(event) =>
                                setAllLevelsStatus(
                                    event.target.value as
                                        | "all"
                                        | "public"
                                        | "private",
                                )
                            }
                            className="w-full lg:w-auto px-3.5 py-2.5 md:py-3 text-xs bg-white border border-neutral-200 rounded-xl outline-none focus:border-black focus:ring-2 focus:ring-black/10 cursor-pointer">
                            <option value="all">All Statuses</option>
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </select>
                        <select
                            value={allLevelsReview}
                            onChange={(event) =>
                                setAllLevelsReview(
                                    event.target.value as
                                        | "all"
                                        | "approved"
                                        | "pending"
                                        | "rejected",
                                )
                            }
                            className="w-full lg:w-auto px-3.5 py-2.5 md:py-3 text-xs bg-white border border-neutral-200 rounded-xl outline-none focus:border-black focus:ring-2 focus:ring-black/10 cursor-pointer">
                            <option value="all">All Reviews</option>
                            <option value="approved">Approved</option>
                            <option value="pending">Pending</option>
                            <option value="rejected">Rejected</option>
                        </select>
                        <select
                            value={allLevelsDifficulty}
                            onChange={(event) =>
                                setAllLevelsDifficulty(event.target.value)
                            }
                            className="w-full lg:w-auto px-3.5 py-2.5 md:py-3 text-xs bg-white border border-neutral-200 rounded-xl outline-none focus:border-black focus:ring-2 focus:ring-black/10 cursor-pointer">
                            <option value="all">All Difficulties</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                            <option value="expert">Expert</option>
                        </select>
                        <select
                            value={allLevelsMainMenu}
                            onChange={(event) =>
                                setAllLevelsMainMenu(
                                    event.target.value as
                                        | "all"
                                        | "true"
                                        | "false",
                                )
                            }
                            className="w-full lg:w-auto px-3.5 py-2.5 md:py-3 text-xs bg-white border border-neutral-200 rounded-xl outline-none focus:border-black focus:ring-2 focus:ring-black/10 cursor-pointer">
                            <option value="all">All Types</option>
                            <option value="true">Main Menu</option>
                            <option value="false">Custom Level</option>
                        </select>
                    </div>

                    {allLevelsLoading ? (
                        <div className="flex items-center justify-center py-24 rounded-2xl border border-dashed border-neutral-200 bg-white/75">
                            <span className="text-sm text-neutral-400">
                                Loading levels...
                            </span>
                        </div>
                    ) : allLevels.length === 0 ? (
                        <div className="text-center py-24 rounded-2xl border border-dashed border-neutral-200 bg-white/75">
                            <div className="text-4xl mb-3">🧊</div>
                            <p className="text-sm text-neutral-500">
                                No levels found
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                {allLevels.map((level) => (
                                    <article
                                        key={level._id}
                                        className="group bg-white border border-neutral-200 rounded-2xl overflow-hidden hover:border-black hover:shadow-[0_24px_48px_-30px_rgba(0,0,0,0.85)] transition-all duration-150 ease-in-out">
                                        <div className="relative h-44 bg-linear-to-b from-neutral-50 to-white overflow-hidden flex items-center justify-center">
                                            <LevelPreview3D level={level} />
                                            <div className="absolute top-3 left-3 flex gap-2">
                                                <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
                                                    {level.meta?.difficulty ||
                                                        "medium"}
                                                </span>
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full border ${
                                                        level.reviewStatus ===
                                                        "approved"
                                                            ? "text-emerald-700 border-emerald-200 bg-emerald-50"
                                                            : level.reviewStatus ===
                                                                "rejected"
                                                              ? "text-rose-700 border-rose-200 bg-rose-50"
                                                              : "text-amber-700 border-amber-200 bg-amber-50"
                                                    }`}>
                                                    {level.reviewStatus ||
                                                        "pending"}
                                                </span>
                                            </div>
                                            <div className="absolute top-3 right-3">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        window.open(
                                                            buildApiUrl(
                                                                `/api/levels/vr/download/${level.code}`,
                                                            ),
                                                            "_blank",
                                                        )
                                                    }
                                                    className="p-2 rounded-full bg-white/90 border border-neutral-200 text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                                                    title="Download">
                                                    <Download size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-4 md:p-5">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <div>
                                                    <h2 className="text-sm font-semibold text-black truncate">
                                                        {level.meta?.name ||
                                                            "Untitled Level"}
                                                    </h2>
                                                    <p className="text-xs text-neutral-500">
                                                        By{" "}
                                                        {typeof level.author ===
                                                            "object" &&
                                                        level.author
                                                            ? (
                                                                  level.author as any
                                                              ).username
                                                            : "Unknown"}
                                                    </p>
                                                </div>
                                                <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 rounded-full border border-neutral-200 px-2 py-0.5">
                                                    {level.code}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 pt-3 border-t border-neutral-100">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    isLoading={
                                                        allLevelsActionId ===
                                                        level._id
                                                    }
                                                    onClick={() =>
                                                        handleReviewLevelAll(
                                                            level._id,
                                                            "approved",
                                                        )
                                                    }>
                                                    <CheckCircle2 size={14} />
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    isLoading={
                                                        allLevelsActionId ===
                                                        level._id
                                                    }
                                                    onClick={() =>
                                                        handleReviewLevelAll(
                                                            level._id,
                                                            "rejected",
                                                        )
                                                    }>
                                                    <XCircle size={14} />
                                                    Reject
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() =>
                                                        openEditLevel(level)
                                                    }>
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() =>
                                                        window.open(
                                                            buildApiUrl(
                                                                `/api/levels/vr/download/${level.code}`,
                                                            ),
                                                            "_blank",
                                                        )
                                                    }>
                                                    <Download size={14} />
                                                    Download
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    isLoading={
                                                        allLevelsActionId ===
                                                        level._id
                                                    }
                                                    onClick={() =>
                                                        handleDeleteLevel(level)
                                                    }>
                                                    <Trash2 size={14} />
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                            <Pagination
                                currentPage={allLevelsPagination.page}
                                totalPages={allLevelsPagination.pages}
                                totalItems={allLevelsPagination.total}
                                itemsPerPage={allLevelsPagination.limit}
                                onPageChange={(page) => fetchAllLevels(page)}
                            />
                        </>
                    )}
                </div>
            )}

            <Modal
                isOpen={userModalOpen}
                onClose={() => setUserModalOpen(false)}
                title="User Details"
                maxWidth="max-w-xl">
                {userModalLoading || !selectedUser ? (
                    <div className="text-sm text-neutral-500">Loading...</div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <div className="text-sm font-semibold text-black">
                                {selectedUser.user.username}
                            </div>
                            <div className="text-xs text-neutral-500">
                                {selectedUser.user.email}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
                                <div className="text-[10px] uppercase tracking-wider text-neutral-500">
                                    Total Levels
                                </div>
                                <div className="text-sm font-semibold text-black">
                                    {selectedUser.stats.totalLevels}
                                </div>
                            </div>
                            <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
                                <div className="text-[10px] uppercase tracking-wider text-neutral-500">
                                    Public Levels
                                </div>
                                <div className="text-sm font-semibold text-black">
                                    {selectedUser.stats.publicLevels}
                                </div>
                            </div>
                            <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
                                <div className="text-[10px] uppercase tracking-wider text-neutral-500">
                                    Pending Levels
                                </div>
                                <div className="text-sm font-semibold text-black">
                                    {selectedUser.stats.pendingLevels}
                                </div>
                            </div>
                            <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
                                <div className="text-[10px] uppercase tracking-wider text-neutral-500">
                                    Rejected Levels
                                </div>
                                <div className="text-sm font-semibold text-black">
                                    {selectedUser.stats.rejectedLevels}
                                </div>
                            </div>
                            <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
                                <div className="text-[10px] uppercase tracking-wider text-neutral-500">
                                    Favorites
                                </div>
                                <div className="text-sm font-semibold text-black">
                                    {selectedUser.stats.favorites}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal
                isOpen={editLevelOpen}
                onClose={() => setEditLevelOpen(false)}
                title="Edit Level"
                maxWidth="max-w-xl">
                {!editLevelTarget ? (
                    <div className="text-sm text-neutral-500">
                        No level selected.
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-[0.14em]">
                                Level Name
                            </label>
                            <input
                                value={editName}
                                onChange={(event) =>
                                    setEditName(event.target.value)
                                }
                                className="w-full px-3.5 py-3 text-sm bg-white border border-neutral-200 rounded-xl outline-none focus:border-black focus:ring-2 focus:ring-black/10"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-[0.14em]">
                                    Difficulty
                                </label>
                                <select
                                    value={editDifficulty}
                                    onChange={(event) =>
                                        setEditDifficulty(event.target.value)
                                    }
                                    className="w-full px-3.5 py-3 text-sm bg-white border border-neutral-200 rounded-xl outline-none focus:border-black focus:ring-2 focus:ring-black/10 cursor-pointer">
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                    <option value="expert">Expert</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-[0.14em]">
                                    Time (seconds)
                                </label>
                                <input
                                    type="number"
                                    min={0}
                                    step={1}
                                    value={editTimeSeconds}
                                    onChange={(event) =>
                                        setEditTimeSeconds(event.target.value)
                                    }
                                    className="w-full px-3.5 py-3 text-sm bg-white border border-neutral-200 rounded-xl outline-none focus:border-black focus:ring-2 focus:ring-black/10"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-[0.14em]">
                                    Status
                                </label>
                                <select
                                    value={editStatus}
                                    onChange={(event) =>
                                        setEditStatus(
                                            event.target.value as
                                                | "public"
                                                | "private",
                                        )
                                    }
                                    className="w-full px-3.5 py-3 text-sm bg-white border border-neutral-200 rounded-xl outline-none focus:border-black focus:ring-2 focus:ring-black/10 cursor-pointer">
                                    <option value="public">Public</option>
                                    <option value="private">Private</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-[0.14em]">
                                    Review Status
                                </label>
                                <select
                                    value={editReviewStatus}
                                    onChange={(event) =>
                                        setEditReviewStatus(
                                            event.target.value as
                                                | "approved"
                                                | "pending"
                                                | "rejected",
                                        )
                                    }
                                    className="w-full px-3.5 py-3 text-sm bg-white border border-neutral-200 rounded-xl outline-none focus:border-black focus:ring-2 focus:ring-black/10 cursor-pointer">
                                    <option value="approved">Approved</option>
                                    <option value="pending">Pending</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-2.5">
                            <Button
                                variant="secondary"
                                onClick={() => setEditLevelOpen(false)}
                                className="flex-1">
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleUpdateLevel}
                                isLoading={editLevelLoading}
                                className="flex-1">
                                Save Changes
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AdminPage;
