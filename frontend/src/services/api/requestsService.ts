import { apiClient } from './apiClient';

export interface ServiceRequestItem {
  id: string;
  tracking_code: string;
  request_type: string;
  status: string;
  risk_level: string;
  student_id?: string;
  assigned_approver_id?: string;
  is_anonymous: boolean;
  payload: Record<string, any>;
  resolution_notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateRequestPayload {
  request_type: string;
  payload: Record<string, any>;
  risk_level?: string;
  is_anonymous?: boolean;
}

const STORAGE_KEY = 'soa_nexus_persistent_requests';

function getStoredRequests(): ServiceRequestItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Ignore
  }
  return defaultRequests;
}

function saveStoredRequests(items: ServiceRequestItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore
  }
}

export const requestsService = {
  async getRequests(type?: string, status?: string): Promise<ServiceRequestItem[]> {
    let localItems = getStoredRequests();
    try {
      const res = await apiClient.get<ServiceRequestItem[]>('/requests', {
        params: {
          type: type && type !== 'ALL' ? type : undefined,
          status: status && status !== 'ALL' ? status : undefined,
        },
      });
      if (Array.isArray(res.data) && res.data.length > 0) {
        // Merge with local items
        const merged = [...res.data];
        for (const local of localItems) {
          if (!merged.find(m => m.id === local.id || m.tracking_code === local.tracking_code)) {
            merged.unshift(local);
          }
        }
        localItems = merged;
        saveStoredRequests(merged);
      }
    } catch {
      // Use local stored items
    }

    let filtered = localItems;
    if (type && type !== 'ALL') {
      filtered = filtered.filter(r => r.request_type.toUpperCase() === type.toUpperCase());
    }
    if (status && status !== 'ALL') {
      filtered = filtered.filter(r => r.status.toUpperCase() === status.toUpperCase());
    }
    return filtered;
  },

  async getRequestById(id: string): Promise<ServiceRequestItem | null> {
    const local = getStoredRequests().find(r => r.id === id || r.tracking_code === id);
    try {
      const res = await apiClient.get<ServiceRequestItem>(`/requests/${id}`);
      if (res.data) return res.data;
    } catch {
      // Ignore
    }
    return local || null;
  },

  async createRequest(payload: CreateRequestPayload): Promise<ServiceRequestItem> {
    const trackingCode = `#${payload.request_type === 'LAB_BOOKING' ? 'LB' : payload.request_type === 'CERTIFICATE' ? 'CERT' : payload.request_type === 'MAINTENANCE' ? 'MT' : 'GR'}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRecord: ServiceRequestItem = {
      id: `req-${Date.now()}`,
      tracking_code: trackingCode,
      request_type: payload.request_type,
      status: 'WAITING_FOR_APPROVAL',
      risk_level: payload.risk_level || 'HIGH',
      is_anonymous: payload.is_anonymous || false,
      payload: payload.payload || {},
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    try {
      const res = await apiClient.post<ServiceRequestItem>('/requests', payload);
      if (res.data && res.data.tracking_code) {
        newRecord.id = res.data.id;
        newRecord.tracking_code = res.data.tracking_code;
      }
    } catch {
      // Local creation
    }

    const current = getStoredRequests();
    const updated = [newRecord, ...current];
    saveStoredRequests(updated);
    return newRecord;
  },

  async updateStatus(idOrCode: string, newStatus: string, notes?: string, extraPayload?: Record<string, any>): Promise<ServiceRequestItem | null> {
    const current = getStoredRequests();
    let updatedItem: ServiceRequestItem | null = null;

    const updated = current.map(item => {
      if (item.id === idOrCode || item.tracking_code === idOrCode || item.request_type === idOrCode) {
        const itemPayload = { ...(item.payload || {}), ...(extraPayload || {}) };
        updatedItem = {
          ...item,
          status: newStatus,
          resolution_notes: notes || item.resolution_notes,
          payload: itemPayload,
          updated_at: new Date().toISOString().replace('T', ' ').slice(0, 16)
        };
        return updatedItem;
      }
      return item;
    });

    saveStoredRequests(updated);

    try {
      if (updatedItem && (updatedItem as ServiceRequestItem).id) {
        await apiClient.patch(`/requests/${(updatedItem as ServiceRequestItem).id}/status`, {
          status: newStatus,
          resolution_notes: notes,
        });
      }
    } catch {
      // Local fallback
    }

    return updatedItem;
  },
};

const defaultRequests: ServiceRequestItem[] = [
  {
    id: '50000000-0000-0000-0000-000000000001',
    tracking_code: '#LB-9021',
    request_type: 'LAB_BOOKING',
    status: 'WAITING_FOR_APPROVAL',
    risk_level: 'HIGH',
    is_anonymous: false,
    payload: {
      lab_id: 'LAB-AI-101',
      lab_name: 'Advanced AI & GPU Computing Lab (Room C-204)',
      workstation_no: 14,
      date: '2026-08-24',
      slot: '14:00 - 16:00',
      purpose: 'B.Tech Capstone Project Work (Deep Learning Training)',
      approver_name: 'Prof. A. K. Samanta',
    },
    created_at: '2026-08-24 14:30',
  },
  {
    id: '50000000-0000-0000-0000-000000000002',
    tracking_code: '#CERT-4019',
    request_type: 'CERTIFICATE',
    status: 'COMPLETED',
    risk_level: 'LOW',
    is_anonymous: false,
    payload: {
      certificate_type: 'BONAFIDE',
      purpose: 'Passport Application & Visa Verification',
    },
    created_at: '2026-08-23 10:15',
  },
  {
    id: '50000000-0000-0000-0000-000000000003',
    tracking_code: '#MT-8842',
    request_type: 'MAINTENANCE',
    status: 'IN_PROGRESS',
    risk_level: 'MEDIUM',
    is_anonymous: false,
    payload: {
      location: 'C-Block Room 302',
      category: 'HVAC',
      issue: 'Air conditioning water leakage and noise',
    },
    created_at: '2026-08-24 09:00',
  },
  {
    id: '50000000-0000-0000-0000-000000000004',
    tracking_code: '#GRV-1049',
    request_type: 'GRIEVANCE',
    status: 'IN_PROGRESS',
    risk_level: 'HIGH',
    is_anonymous: true,
    payload: {
      category: 'ACADEMIC',
      department: 'Computer Science & Engineering',
      issue: 'Lab equipment non-functional in Lab 4',
    },
    created_at: '2026-08-23 16:00',
  },
];
