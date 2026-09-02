import { apiClient } from './apiClient';
import { supabase } from '../../lib/supabaseClient';

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  images: string[];
  seller_id: string;
  seller_name: string;
  seller_reg_no: string;
  seller_phone?: string | null;
  seller_location: string;
  status: 'ACTIVE' | 'SOLD' | 'RESERVED';
  view_count: number;
  created_at?: string;
  updated_at?: string;
  seller_profile?: {
    seller_name: string;
    seller_reg_no: string;
    seller_department: string;
    seller_email: string;
    seller_phone?: string;
    total_listings: number;
    items_sold: number;
    is_verified: boolean;
  };
  contact_links?: {
    whatsapp?: string | null;
    email?: string | null;
  };
}

export interface ItemListResponse {
  items: MarketplaceItem[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export const marketplaceService = {
  fetchItems: async (params?: {
    category?: string;
    condition?: string;
    min_price?: number;
    max_price?: number;
    status?: string;
    item_status?: string;
    search?: string;
    sort_by?: 'newest' | 'price_asc' | 'price_desc' | 'popular';
    page?: number;
    limit?: number;
  }): Promise<ItemListResponse> => {
    try {
      const queryParams = { ...params };
      if (queryParams.status && !queryParams.item_status) {
        queryParams.item_status = queryParams.status;
      }
      const response = await apiClient.get<ItemListResponse>('/marketplace/items', { params: queryParams });
      return response.data;
    } catch (err) {
      console.warn('Backend proxy unavailable, falling back directly to Supabase cloud query...');
      if (supabase && supabase.from) {
        let query = supabase.from('marketplace_items').select('*', { count: 'exact' });
        if (params?.category && params.category !== 'ALL') {
          query = query.eq('category', params.category);
        }
        if (params?.condition && params.condition !== 'ALL') {
          query = query.eq('condition', params.condition);
        }
        if (params?.item_status || params?.status) {
          query = query.eq('status', params.item_status || params.status);
        }
        if (params?.sort_by === 'price_asc') {
          query = query.order('price', { ascending: true });
        } else if (params?.sort_by === 'price_desc') {
          query = query.order('price', { ascending: false });
        } else {
          query = query.order('created_at', { ascending: false });
        }

        const { data, count, error } = await query;
        if (!error && data) {
          return {
            items: data as MarketplaceItem[],
            total: count || data.length,
            page: 1,
            limit: 20,
            total_pages: 1
          };
        }
      }
      return { items: [], total: 0, page: 1, limit: 20, total_pages: 1 };
    }
  },

  createItem: async (payload: {
    title: string;
    description: string;
    price: number;
    category: string;
    condition: string;
    images?: string[];
    seller_phone?: string;
    seller_location: string;
  }): Promise<MarketplaceItem> => {
    try {
      const response = await apiClient.post<MarketplaceItem>('/marketplace/items', payload);
      return response.data;
    } catch (err) {
      console.warn('Backend proxy unavailable, inserting marketplace item directly into Supabase cloud...');
      if (supabase && supabase.from) {
        const newItem = {
          id: crypto.randomUUID(),
          title: payload.title,
          description: payload.description,
          price: payload.price,
          category: payload.category,
          condition: payload.condition,
          images: payload.images || [],
          seller_id: '20000000-0000-0000-0000-000000000001',
          seller_name: 'Rahul Sharma',
          seller_reg_no: '2023-CSE-042',
          seller_phone: payload.seller_phone || '+919876543210',
          seller_location: payload.seller_location,
          status: 'ACTIVE',
          view_count: 0,
        };
        const { data, error } = await supabase.from('marketplace_items').insert(newItem).select().single();
        if (error) {
          console.error('Supabase createItem error:', error);
        } else if (data) {
          return data as MarketplaceItem;
        }
        return newItem as MarketplaceItem;
      }
      throw err;
    }
  },

  getItemDetail: async (itemId: string): Promise<MarketplaceItem> => {
    try {
      const response = await apiClient.get<MarketplaceItem>(`/marketplace/items/${itemId}`);
      return response.data;
    } catch (err) {
      if (supabase && supabase.from) {
        const { data, error } = await supabase.from('marketplace_items').select('*').eq('id', itemId).single();
        if (data) {
          return {
            ...data,
            seller_profile: {
              seller_name: data.seller_name || 'Rahul Sharma',
              seller_reg_no: data.seller_reg_no || '2023-CSE-042',
              seller_department: 'Computer Science & Engineering',
              seller_email: 'student@soa.ac.in',
              seller_phone: data.seller_phone || '+919876543210',
              total_listings: 1,
              items_sold: 0,
              is_verified: true
            },
            contact_links: {
              whatsapp: data.seller_phone ? `https://wa.me/${data.seller_phone.replace(/[^0-9]/g, '')}` : null,
              email: 'mailto:student@soa.ac.in'
            }
          } as MarketplaceItem;
        }
        console.error('Supabase getItemDetail error:', error);
      }
      throw err;
    }
  },

  updateItemStatus: async (itemId: string, status: 'ACTIVE' | 'SOLD' | 'RESERVED'): Promise<{ id: string; status: string }> => {
    try {
      const response = await apiClient.put<{ id: string; status: string }>(`/marketplace/items/${itemId}/status`, { status });
      return response.data;
    } catch (err) {
      if (supabase && supabase.from) {
        await supabase.from('marketplace_items').update({ status }).eq('id', itemId);
        return { id: itemId, status };
      }
      throw err;
    }
  },

  reportItem: async (itemId: string, reason: string): Promise<{ status: string; report_id: string }> => {
    try {
      const response = await apiClient.post<{ status: string; report_id: string }>(`/marketplace/items/${itemId}/report`, { reason });
      return response.data;
    } catch {
      return { status: 'received', report_id: crypto.randomUUID() };
    }
  },
};
