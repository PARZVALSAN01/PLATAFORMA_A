export interface Announcement {
  id: number;
  title: string;
  content: string;
  target: string;
  priority: string;
  image?: string;
  expiresAt?: string;
  createdAt?: string;
}

export interface News {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  image?: string;
  category: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt?: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  category: string;
  createdAt?: string;
}

export interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  type: string;
  color?: string;
  createdAt?: string;
}

export interface Message {
  id: number;
  subject: string;
  content: string;
  isRead: boolean;
  readAt?: string;
  createdAt?: string;
}

export interface ContactRequest {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: string;
  replyMessage?: string;
  createdAt?: string;
}
