export type UserRole = 'viewer' | 'editor' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId: string;
  avatar?: string;
  createdAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  createdAt: Date;
}

export type VideoStatus = 'pending' | 'uploading' | 'processing' | 'completed' | 'failed';
export type SensitivityLevel = 'safe' | 'flagged' | 'unknown';

export interface Video {
  id: string;
  title: string;
  description?: string;
  filename: string;
  originalName: string;
  size: number;
  duration: number;
  thumbnailUrl?: string;
  videoUrl?: string;
  status: VideoStatus;
  sensitivity: SensitivityLevel;
  processingProgress: number;
  uploadProgress: number;
  uploadedBy: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  metadata?: {
    width?: number;
    height?: number;
    codec?: string;
    bitrate?: number;
  };
}

export interface UploadProgress {
  videoId: string;
  stage: 'uploading' | 'validating' | 'analyzing' | 'optimizing' | 'complete';
  progress: number;
  message: string;
}

export interface DashboardStats {
  totalVideos: number;
  safeVideos: number;
  flaggedVideos: number;
  processingVideos: number;
  totalStorage: number;
  totalViews: number;
}
