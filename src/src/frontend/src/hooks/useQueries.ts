import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import type { Review, FreeNote, YouTubeLecture } from "../backend.d";

export function useGetReviews() {
  const { actor, isFetching } = useActor();
  return useQuery<Review[]>({
    queryKey: ["reviews"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReviews();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      studentName,
      course,
      rating,
      reviewText,
    }: {
      studentName: string;
      course: string;
      rating: bigint;
      reviewText: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitReview(studentName, course, rating, reviewText);
    },
    onSuccess: () => {
      // Invalidate and refetch reviews after successful submission
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}

// Free Notes
export function useGetFreeNotes() {
  const { actor, isFetching } = useActor();
  return useQuery<FreeNote[]>({
    queryKey: ["freeNotes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFreeNotes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddFreeNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      description,
      fileUrl,
      category,
    }: {
      title: string;
      description: string;
      fileUrl: string;
      category: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addFreeNote(title, description, fileUrl, category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["freeNotes"] });
    },
  });
}

export function useDeleteFreeNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteFreeNote(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["freeNotes"] });
    },
  });
}

// YouTube Lectures
export function useGetYouTubeLectures() {
  const { actor, isFetching } = useActor();
  return useQuery<YouTubeLecture[]>({
    queryKey: ["youtubeLectures"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getYouTubeLectures();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddYouTubeLecture() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      description,
      videoUrl,
      category,
    }: {
      title: string;
      description: string;
      videoUrl: string;
      category: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addYouTubeLecture(title, description, videoUrl, category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["youtubeLectures"] });
    },
  });
}

export function useDeleteYouTubeLecture() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteYouTubeLecture(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["youtubeLectures"] });
    },
  });
}
