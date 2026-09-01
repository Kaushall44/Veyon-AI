import { apiClient } from './apiClient';

export interface NotificationItem {
  id: string;
  user_id?: string;
  title: string;
  message: string;
  type?: string;
  category?: string;
  is_read: boolean;
  created_at: string;
  link_path?: string;
  targetUrl?: string;
}

export interface NotificationResponse {
  unread_count: number;
  notifications: NotificationItem[];
}

export const notificationsService = {
  async getNotifications(): Promise<NotificationResponse> {
    const response = await apiClient.get<NotificationResponse>('/notifications');
    return response.data;
  },

  async markAsRead(notificationIds?: string[]): Promise<{ status: string; unread_count: number }> {
    const response = await apiClient.post('/notifications/mark-read', {
      notification_ids: notificationIds
    });
    return response.data;
  },

  async clearAll(): Promise<{ status: string; unread_count: number }> {
    const response = await apiClient.post('/notifications/clear-all');
    return response.data;
  },

  async createNotification(payload: {
    title: string;
    message: string;
    type?: string;
    category?: string;
    link_path?: string;
    user_id?: string;
  }): Promise<NotificationItem> {
    const response = await apiClient.post<NotificationItem>('/notifications/create', payload);
    return response.data;
  },

  subscribeToSSE(onNotification: (notif: NotificationItem) => void): () => void {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/notifications/stream');

      eventSource.addEventListener('notification', (e) => {
        try {
          const data = JSON.parse(e.data);
          onNotification(data);
        } catch (err) {
          console.error('Failed to parse SSE notification data:', err);
        }
      });

      eventSource.addEventListener('ping', (e) => {
        console.log('[SSE] Live Notification Stream connected:', e.data);
      });

      eventSource.onerror = (err) => {
        console.warn('[SSE] Notification stream reconnecting...', err);
      };
    } catch (e) {
      console.warn('EventSource initialization notice:', e);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }
};
