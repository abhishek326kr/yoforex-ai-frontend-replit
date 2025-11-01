import apiClient from './client';

export type CreateTicketPayload = {
  department?: string; // e.g. 'Billing', 'Technical Support', 'Account'
  related_service?: string; // must match department mapping if provided
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  subject: string;
  message: string;
  attachments?: File[];
  // Optional user identity fields if backend supports them
  name?: string;
  email?: string;
};

export async function createTicket(payload: CreateTicketPayload) {
  // Always use multipart/form-data so backend persists file attachments and metadata reliably
  const form = new FormData();
  if (payload.department) form.append('department', payload.department);
  if (payload.related_service) form.append('related_service', payload.related_service);
  form.append('priority', payload.priority || 'low');
  form.append('subject', payload.subject);
  form.append('message', payload.message);
  if (payload.name) form.append('name', payload.name);
  if (payload.email) form.append('email', payload.email);
  for (const file of (payload.attachments || [])) {
    form.append('attachments', file, file.name);
  }
  const res = await apiClient.post('/support/tickets', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

// --- Support metadata ---
export type DepartmentServices = {
  department: string;
  services: string[];
};

export type SupportMetadata = {
  departments: DepartmentServices[];
};

export async function fetchSupportMetadata(): Promise<SupportMetadata> {
  const res = await apiClient.get('/support/metadata');
  return res.data;
}

// --- Tickets ---
export type TicketDTO = {
  id: number | string;
  subject: string;
  message?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent' | string;
  status?: 'open' | 'in_progress' | 'closed' | string;
  created_at?: string;
  department?: string;
  related_service?: string;
};

export async function fetchMyTickets(): Promise<TicketDTO[]> {
  const res = await apiClient.get('/support/tickets/my');
  const payload = res.data as any;
  // Unwrap common response shapes
  const top = Array.isArray(payload)
    ? payload
    : (payload?.tickets || payload?.items || payload?.results || payload?.data || payload?.records || []);
  const arr = Array.isArray(top) ? top : (top?.items || top?.results || []);
  return (Array.isArray(arr) ? arr : []) as TicketDTO[];
}

export async function fetchTicketById(ticketId: string | number): Promise<TicketDTO> {
  const res = await apiClient.get(`/support/tickets/${ticketId}`);
  const payload = res.data as any;
  const obj = (payload?.ticket || payload?.data || payload) as TicketDTO;
  return obj;
}

// --- Ticket comments ---
export type TicketCommentDTO = {
  id: number | string;
  ticket_id?: number | string;
  author?: string;
  role?: 'user' | 'admin' | string;
  message: string;
  created_at?: string;
  attachments?: string[];
};

export async function createTicketComment(ticketId: string | number, message: string): Promise<{ id: number | string } & Record<string, any>> {
  const res = await apiClient.post(`/support/tickets/${ticketId}/comments`, { message });
  const payload = res.data as any;
  const id = payload?.id ?? payload?.comment_id ?? payload?.data?.id ?? payload?.data?.comment_id;
  return { id, ...(payload || {}) } as any;
}

export async function fetchTicketComment(ticketId: string | number, commentId: string | number): Promise<TicketCommentDTO> {
  const res = await apiClient.get(`/support/tickets/${ticketId}/comments/${commentId}`);
  const payload = res.data as any;
  const obj = (payload?.comment || payload?.data || payload) as TicketCommentDTO;
  return obj;
}

