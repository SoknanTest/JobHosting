export type Role = 'SEEKER' | 'EMPLOYER' | 'ADMIN';
export type JobType = 'FULL_TIME' | 'PART_TIME' | 'FREELANCE' | 'INTERNSHIP';
export type ApplicationStatus = 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED';

export interface User {
  id: string;
  email: string;
  role: Role;
  isVerified: boolean;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
  profile?: Profile;
  company?: Company;
}

export interface Profile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  avatar?: string | null;
  bio?: string | null;
  location?: string | null;
  skills: string[];
  cvUrl?: string | null;
  updatedAt: string;
}

export interface Company {
  id: string;
  userId: string;
  name: string;
  logo?: string | null;
  description?: string | null;
  website?: string | null;
  location?: string | null;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  type: JobType;
  category: string;
  location: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  deadline?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  employerId: string;
  employer?: User;
  companyId?: string | null;
  company?: Company | null;
}

export interface Application {
  id: string;
  status: ApplicationStatus;
  coverNote?: string | null;
  createdAt: string;
  updatedAt: string;
  jobId: string;
  job?: Job;
  seekerId: string;
  seeker?: User;
}

export interface Conversation {
  id: string;
  createdAt: string;
  participants: ConversationParticipant[];
  messages?: Message[];
}

export interface ConversationParticipant {
  userId: string;
  conversationId: string;
  user?: User;
}

export interface Message {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  sender?: User;
  conversationId: string;
}

export interface Notification {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  userId: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
