export interface User {
    _id: string;
    id: string;
    username: string;
    email: string;
    isAdmin?: boolean;
}

export interface PieceMeta {
    name: string;
    id: string;
    difficulty: "easy" | "medium" | "hard" | "expert";
    timeLimitSeconds?: number;
    puzzleFormatVersion: number;
    angle: number;
    created: string;
    author: string;
    miniatureType: number;
}

export interface BlueprintPiece {
    color: string;
    segments: number[][];
}

export interface Level {
    _id: string;
    code: string;
    status: "public" | "private";
    meta: PieceMeta;
    grid: number[][];
    pieces: BlueprintPiece[];
    author: User | string;
    thumbnailData?: string;
    downloads: number;
    favorites: number;
    favoriteCount?: number;
    downloadCount?: number;
    publishedAt: string;
    createdAt: string;
    isMainMenu?: boolean;
}

export interface Voxel {
    position: [number, number, number];
    color: string;
}

export interface EditorPiece {
    color: string;
    positions: [number, number, number][];
}

export interface LevelPagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}
