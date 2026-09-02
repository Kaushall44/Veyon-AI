import { apiClient } from './apiClient';

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
    const queryParams = { ...params };
    if (queryParams.status && !queryParams.item_status) {
      queryParams.item_status = queryParams.status;
    }
    const response = await apiClient.get<ItemListResponse>('/marketplace/items', { params: queryParams });
    return response.data;
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
    const response = await apiClient.post<MarketplaceItem>('/marketplace/items', payload);
    return response.data;
  },

  getItemDetail: async (itemId: string): Promise<MarketplaceItem> => {
    const response = await apiClient.get<MarketplaceItem>(`/marketplace/items/${itemId}`);
    return response.data;
  },

  updateItemStatus: async (itemId: string, status: 'ACTIVE' | 'SOLD' | 'RESERVED'): Promise<{ id: string; status: string; message: string }> => {
    const response = await apiClient.put<{ id: string; status: string; message: string }>(`/marketplace/items/${itemId}/status`, { status });
    return response.data;
  },

  reportItem: async (itemId: string, reason: string): Promise<{ status: string; report_id: string; message: string }> => {
    const response = await apiClient.post<{ status: string; report_id: string; message: string }>(`/marketplace/items/${itemId}/report`, { reason });
    return response.data;
  },
};
