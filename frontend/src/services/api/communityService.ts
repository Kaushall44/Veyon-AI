import { apiClient } from './apiClient';

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  author_id: string;
  author_name: string;
  author_role: string;
  author_badge: string;
  upvotes: number;
  view_count: number;
  comment_count: number;
  accepted_comment_id?: string | null;
  created_at?: string;
  updated_at?: string;
  user_vote?: number;
}

export interface CommunityComment {
  id: string;
  post_id: string;
  author_id: string;
  author_name: string;
  author_role: string;
  author_badge: string;
  content: string;
  upvotes: number;
  is_accepted: boolean;
  parent_comment_id?: string | null;
  created_at?: string;
  user_vote?: number;
}

export interface PostListResponse {
  posts: CommunityPost[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export const communityService = {
  fetchPosts: async (params?: {
    category?: string;
    tag?: string;
    sort_by?: 'hot' | 'new' | 'top' | 'unanswered';
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<PostListResponse> => {
    const response = await apiClient.get<PostListResponse>('/community/posts', { params });
    return response.data;
  },

  createPost: async (payload: {
    title: string;
    content: string;
    category: string;
    tags: string[];
  }): Promise<CommunityPost> => {
    const response = await apiClient.post<CommunityPost>('/community/posts', payload);
    return response.data;
  },

  getPostDetail: async (postId: string, userId?: string): Promise<{ post: CommunityPost; comments: CommunityComment[] }> => {
    const response = await apiClient.get<{ post: CommunityPost; comments: CommunityComment[] }>(`/community/posts/${postId}`, {
      params: userId ? { user_id: userId } : undefined,
    });
    return response.data;
  },

  createComment: async (postId: string, payload: { content: string; parent_comment_id?: string }): Promise<CommunityComment> => {
    const response = await apiClient.post<CommunityComment>(`/community/posts/${postId}/comments`, payload);
    return response.data;
  },

  votePost: async (postId: string, voteValue: number): Promise<{ target_id: string; upvotes: number; user_vote: number }> => {
    const response = await apiClient.post<{ target_id: string; upvotes: number; user_vote: number }>(`/community/posts/${postId}/vote`, {
      vote_value: voteValue,
    });
    return response.data;
  },

  voteComment: async (commentId: string, voteValue: number): Promise<{ target_id: string; upvotes: number; user_vote: number }> => {
    const response = await apiClient.post<{ target_id: string; upvotes: number; user_vote: number }>(`/community/comments/${commentId}/vote`, {
      vote_value: voteValue,
    });
    return response.data;
  },

  acceptComment: async (commentId: string): Promise<{ status: string; accepted_comment_id: string; message: string }> => {
    const response = await apiClient.post<{ status: string; accepted_comment_id: string; message: string }>(`/community/comments/${commentId}/accept`);
    return response.data;
  },
};
