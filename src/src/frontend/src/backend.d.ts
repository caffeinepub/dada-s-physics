import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface YouTubeLecture {
    id: bigint;
    title: string;
    description: string;
    uploadTimestamp: bigint;
    category: string;
    videoUrl: string;
}
export interface Review {
    id: bigint;
    studentName: string;
    reviewText: string;
    rating: bigint;
    course: string;
}
export interface FreeNote {
    id: bigint;
    title: string;
    description: string;
    uploadTimestamp: bigint;
    category: string;
    fileUrl: string;
}
export interface backendInterface {
    addFreeNote(title: string, description: string, fileUrl: string, category: string): Promise<void>;
    addYouTubeLecture(title: string, description: string, videoUrl: string, category: string): Promise<void>;
    deleteFreeNote(id: bigint): Promise<boolean>;
    deleteYouTubeLecture(id: bigint): Promise<boolean>;
    getFreeNotes(): Promise<Array<FreeNote>>;
    getReviews(): Promise<Array<Review>>;
    getYouTubeLectures(): Promise<Array<YouTubeLecture>>;
    submitReview(studentName: string, course: string, rating: bigint, reviewText: string): Promise<void>;
}
