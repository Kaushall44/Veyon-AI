import { apiClient } from './apiClient';
import { supabase } from '../../lib/supabaseClient';

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
    try {
      const response = await apiClient.get<PostListResponse>('/community/posts', { params });
      return response.data;
    } catch (err) {
      console.warn('Backend proxy unavailable, falling back directly to Supabase cloud query...');
      if (supabase && supabase.from) {
        let query = supabase.from('community_posts').select('*', { count: 'exact' });
        if (params?.category && params.category !== 'ALL') {
          query = query.eq('category', params.category);
        }
        if (params?.sort_by === 'new') {
          query = query.order('created_at', { ascending: false });
        } else if (params?.sort_by === 'top') {
          query = query.order('upvotes', { ascending: false });
        } else {
          query = query.order('upvotes', { ascending: false }).order('created_at', { ascending: false });
        }
        const { data, count, error } = await query;
        if (!error && data) {
          return {
            posts: data as CommunityPost[],
            total: count || data.length,
            page: 1,
            limit: 20,
            total_pages: 1
          };
        }
      }
      return { posts: [], total: 0, page: 1, limit: 20, total_pages: 1 };
    }
  },

  createPost: async (payload: {
    title: string;
    content: string;
    category: string;
    tags?: string[];
  }): Promise<CommunityPost> => {
    try {
      const response = await apiClient.post<CommunityPost>('/community/posts', payload);
      return response.data;
    } catch (err) {
      console.warn('Backend proxy unavailable, inserting post directly into Supabase cloud...');
      if (supabase && supabase.from) {
        const newPost = {
          id: crypto.randomUUID(),
          title: payload.title,
          content: payload.content,
          category: payload.category || 'ACADEMIC',
          tags: payload.tags || [],
          author_id: '20000000-0000-0000-0000-000000000001',
          author_name: 'Rahul Sharma',
          author_role: 'Student',
          author_badge: '🎓 Student • 2023-CSE-042',
          upvotes: 1,
          view_count: 0,
          comment_count: 0,
        };
        const { data, error } = await supabase.from('community_posts').insert(newPost).select().single();
        if (error) {
          console.error('Supabase createPost error:', error);
        } else if (data) {
          return data as CommunityPost;
        }
        return newPost as CommunityPost;
      }
      throw err;
    }
  },

  getPostDetail: async (postId: string, userId?: string): Promise<{ post: CommunityPost; comments: CommunityComment[] }> => {
    try {
      const response = await apiClient.get<{ post: CommunityPost; comments: CommunityComment[] }>(`/community/posts/${postId}`, {
        params: { user_id: userId },
      });
      return response.data;
    } catch (err) {
      if (supabase && supabase.from) {
        const { data: post, error: postErr } = await supabase.from('community_posts').select('*').eq('id', postId).single();
        const { data: comments } = await supabase.from('community_comments').select('*').eq('post_id', postId).order('created_at', { ascending: true });
        if (post) {
          return {
            post: post as CommunityPost,
            comments: (comments || []) as CommunityComment[]
          };
        }
        console.error('Supabase getPostDetail error:', postErr);
      }
      throw err;
    }
  },

  createComment: async (
    postId: string,
    payload: { content: string; parent_comment_id?: string }
  ): Promise<CommunityComment> => {
    try {
      const response = await apiClient.post<CommunityComment>(`/community/posts/${postId}/comments`, payload);
      return response.data;
    } catch (err) {
      if (supabase && supabase.from) {
        const newComment = {
          id: crypto.randomUUID(),
          post_id: postId,
          author_id: '20000000-0000-0000-0000-000000000001',
          author_name: 'Rahul Sharma',
          author_role: 'Student',
          author_badge: '🎓 Student • 2023-CSE-042',
          content: payload.content,
          upvotes: 1,
          is_accepted: false,
        };
        const { data, error } = await supabase.from('community_comments').insert(newComment).select().single();
        if (error) {
          console.error('Supabase createComment error:', error);
        } else if (data) {
          return data as CommunityComment;
        }
        return newComment as CommunityComment;
      }
      throw err;
    }
  },

  votePost: async (postId: string, voteValue: number): Promise<{ upvotes: number; user_vote: number }> => {
    try {
      const response = await apiClient.post<{ upvotes: number; user_vote: number }>(`/community/posts/${postId}/vote`, {
        vote_value: voteValue,
      });
      return response.data;
    } catch {
      return { upvotes: voteValue > 0 ? 1 : 0, user_vote: voteValue };
    }
  },

  voteComment: async (commentId: string, voteValue: number): Promise<{ upvotes: number; user_vote: number }> => {
    try {
      const response = await apiClient.post<{ upvotes: number; user_vote: number }>(`/community/comments/${commentId}/vote`, {
        vote_value: voteValue,
      });
      return response.data;
    } catch {
      return { upvotes: voteValue > 0 ? 1 : 0, user_vote: voteValue };
    }
  },

  acceptComment: async (commentId: string): Promise<{ status: string; accepted_comment_id: string }> => {
    const response = await apiClient.post<{ status: string; accepted_comment_id: string }>(
      `/community/comments/${commentId}/accept`
    );
    return response.data;
  },
};
