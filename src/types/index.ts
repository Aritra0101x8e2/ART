export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export type MediaType = 'photo' | 'video' | 'audio' | 'journal';

export interface MediaFile {
  id: string;
  file?: File;
  type: MediaType;
  title: string;
  description?: string;
  content?: string;
  date?: string;
  uploader: string;
  uploaderId: string;
  createdAt: string;
  blockchainStatus: 'PENDING' | 'CONFIRMED' | 'REJECTED';
  transactionHash?: string;
  thumbnail?: string;
}

export interface VerificationResult {
  isDuplicate: boolean;
  similarityScore: number;
  matchedRecordId?: string;
  analysisSummary: string;
}

export interface GalleryFilters {
  mediaType?: MediaType;
  dateFrom?: string;
  dateTo?: string;
  uploader?: string;
  search?: string;
}

export interface GalleryResponse {
  items: MediaFile[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface SignupResponse {
  message: string;
  requiresLogin: boolean;
}