import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Video, VideoStatus, SensitivityLevel, DashboardStats } from '@/types';

interface VideoContextType {
  videos: Video[];
  isLoading: boolean;
  uploadVideo: (file: File, title: string, description?: string) => Promise<string>;
  deleteVideo: (id: string) => Promise<void>;
  getVideo: (id: string) => Video | undefined;
  updateVideo: (id: string, updates: Partial<Video>) => void;
  filterVideos: (filters: VideoFilters) => Video[];
  stats: DashboardStats;
}

interface VideoFilters {
  status?: VideoStatus;
  sensitivity?: SensitivityLevel;
  search?: string;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

// Sample thumbnail URLs
const sampleThumbnails = [
  'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop',
  'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=400&h=225&fit=crop',
  'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=225&fit=crop',
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=225&fit=crop',
  'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=225&fit=crop',
];

// Initial mock videos
const initialVideos: Video[] = [
  {
    id: 'vid-1',
    title: 'Company Introduction Video',
    description: 'Official company introduction and overview of our services',
    filename: 'company-intro.mp4',
    originalName: 'company_introduction_2024.mp4',
    size: 156000000,
    duration: 180,
    thumbnailUrl: sampleThumbnails[0],
    status: 'completed',
    sensitivity: 'safe',
    processingProgress: 100,
    uploadProgress: 100,
    uploadedBy: '1',
    organizationId: 'org-1',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01'),
    views: 1250,
    metadata: { width: 1920, height: 1080, codec: 'H.264', bitrate: 8000 },
  },
  {
    id: 'vid-2',
    title: 'Product Demo - Q4 2024',
    description: 'Quarterly product demonstration and new features showcase',
    filename: 'product-demo-q4.mp4',
    originalName: 'Q4_product_demo.mp4',
    size: 245000000,
    duration: 420,
    thumbnailUrl: sampleThumbnails[1],
    status: 'completed',
    sensitivity: 'safe',
    processingProgress: 100,
    uploadProgress: 100,
    uploadedBy: '2',
    organizationId: 'org-1',
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2024-12-10'),
    views: 856,
    metadata: { width: 1920, height: 1080, codec: 'H.264', bitrate: 6000 },
  },
  {
    id: 'vid-3',
    title: 'Training Session - Compliance',
    description: 'Annual compliance training materials',
    filename: 'compliance-training.mp4',
    originalName: 'compliance_2024.mp4',
    size: 520000000,
    duration: 1800,
    thumbnailUrl: sampleThumbnails[2],
    status: 'completed',
    sensitivity: 'flagged',
    processingProgress: 100,
    uploadProgress: 100,
    uploadedBy: '1',
    organizationId: 'org-1',
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-15'),
    views: 423,
    metadata: { width: 1280, height: 720, codec: 'H.265', bitrate: 4000 },
  },
  {
    id: 'vid-4',
    title: 'Marketing Campaign Promo',
    description: 'Summer 2024 marketing campaign promotional video',
    filename: 'marketing-promo.mp4',
    originalName: 'summer_campaign_promo.mp4',
    size: 89000000,
    duration: 60,
    thumbnailUrl: sampleThumbnails[3],
    status: 'processing',
    sensitivity: 'unknown',
    processingProgress: 67,
    uploadProgress: 100,
    uploadedBy: '2',
    organizationId: 'org-1',
    createdAt: new Date('2024-12-28'),
    updatedAt: new Date('2024-12-28'),
    views: 0,
  },
  {
    id: 'vid-5',
    title: 'Customer Testimonial - Acme Corp',
    description: 'Video testimonial from our valued client Acme Corporation',
    filename: 'acme-testimonial.mp4',
    originalName: 'acme_corp_testimonial.mp4',
    size: 178000000,
    duration: 240,
    thumbnailUrl: sampleThumbnails[4],
    status: 'completed',
    sensitivity: 'safe',
    processingProgress: 100,
    uploadProgress: 100,
    uploadedBy: '1',
    organizationId: 'org-1',
    createdAt: new Date('2024-12-20'),
    updatedAt: new Date('2024-12-20'),
    views: 678,
    metadata: { width: 1920, height: 1080, codec: 'H.264', bitrate: 8000 },
  },
];

export function VideoProvider({ children }: { children: ReactNode }) {
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate processing progress for videos in processing state
  useEffect(() => {
    const interval = setInterval(() => {
      setVideos(prev => prev.map(video => {
        if (video.status === 'processing' && video.processingProgress < 100) {
          const newProgress = Math.min(video.processingProgress + Math.random() * 5, 100);
          if (newProgress >= 100) {
            return {
              ...video,
              processingProgress: 100,
              status: 'completed' as VideoStatus,
              sensitivity: Math.random() > 0.2 ? 'safe' as SensitivityLevel : 'flagged' as SensitivityLevel,
            };
          }
          return { ...video, processingProgress: newProgress };
        }
        return video;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const uploadVideo = useCallback(async (file: File, title: string, description?: string): Promise<string> => {
    setIsLoading(true);
    const videoId = `vid-${Date.now()}`;
    
    const newVideo: Video = {
      id: videoId,
      title,
      description,
      filename: `${videoId}.mp4`,
      originalName: file.name,
      size: file.size,
      duration: Math.floor(Math.random() * 600) + 60,
      thumbnailUrl: sampleThumbnails[Math.floor(Math.random() * sampleThumbnails.length)],
      status: 'uploading',
      sensitivity: 'unknown',
      processingProgress: 0,
      uploadProgress: 0,
      uploadedBy: '1',
      organizationId: 'org-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
    };

    setVideos(prev => [newVideo, ...prev]);

    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setVideos(prev => prev.map(v => 
        v.id === videoId ? { ...v, uploadProgress: progress } : v
      ));
    }

    // Set to processing
    setVideos(prev => prev.map(v => 
      v.id === videoId ? { ...v, status: 'processing', uploadProgress: 100 } : v
    ));

    setIsLoading(false);
    return videoId;
  }, []);

  const deleteVideo = useCallback(async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setVideos(prev => prev.filter(v => v.id !== id));
  }, []);

  const getVideo = useCallback((id: string) => {
    return videos.find(v => v.id === id);
  }, [videos]);

  const updateVideo = useCallback((id: string, updates: Partial<Video>) => {
    setVideos(prev => prev.map(v => 
      v.id === id ? { ...v, ...updates, updatedAt: new Date() } : v
    ));
  }, []);

  const filterVideos = useCallback((filters: VideoFilters) => {
    return videos.filter(video => {
      if (filters.status && video.status !== filters.status) return false;
      if (filters.sensitivity && video.sensitivity !== filters.sensitivity) return false;
      if (filters.search) {
        const search = filters.search.toLowerCase();
        return video.title.toLowerCase().includes(search) || 
               video.description?.toLowerCase().includes(search);
      }
      return true;
    });
  }, [videos]);

  const stats: DashboardStats = {
    totalVideos: videos.length,
    safeVideos: videos.filter(v => v.sensitivity === 'safe').length,
    flaggedVideos: videos.filter(v => v.sensitivity === 'flagged').length,
    processingVideos: videos.filter(v => v.status === 'processing').length,
    totalStorage: videos.reduce((acc, v) => acc + v.size, 0),
    totalViews: videos.reduce((acc, v) => acc + v.views, 0),
  };

  return (
    <VideoContext.Provider 
      value={{ 
        videos, 
        isLoading, 
        uploadVideo, 
        deleteVideo, 
        getVideo, 
        updateVideo,
        filterVideos,
        stats,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
}

export function useVideos() {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideos must be used within a VideoProvider');
  }
  return context;
}
