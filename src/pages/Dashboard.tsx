import { useState, useRef } from 'react';
import { 
  Film, 
  ShieldCheck, 
  AlertTriangle, 
  Loader2, 
  HardDrive, 
  Eye,
  TrendingUp,
  Upload,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { VideoCard } from '@/components/video/VideoCard';
import { useVideos } from '@/context/VideoContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatFileSize, formatNumber } from '@/utils/formatters';
import { toast } from 'sonner';

const statCards = [
  { 
    key: 'totalVideos',
    label: 'Total Videos', 
    icon: Film, 
    color: 'from-primary to-purple-400',
    bgColor: 'bg-primary/10',
  },
  { 
    key: 'safeVideos',
    label: 'Safe Videos', 
    icon: ShieldCheck, 
    color: 'from-success to-emerald-400',
    bgColor: 'bg-success/10',
  },
  { 
    key: 'flaggedVideos',
    label: 'Flagged', 
    icon: AlertTriangle, 
    color: 'from-destructive to-red-400',
    bgColor: 'bg-destructive/10',
  },
  { 
    key: 'processingVideos',
    label: 'Processing', 
    icon: Loader2, 
    color: 'from-warning to-amber-400',
    bgColor: 'bg-warning/10',
  },
];

export default function Dashboard() {
  const { videos, stats, uploadVideo } = useVideos();
  const { user } = useAuth();
  const recentVideos = videos.slice(0, 4);
  const canUpload = user?.role === 'admin' || user?.role === 'editor';
  
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleQuickUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast.error('Please select a valid video file');
      return;
    }

    setIsUploading(true);
    try {
      const title = file.name.replace(/\.[^/.]+$/, '');
      await uploadVideo(file, title);
      toast.success('Video uploaded successfully! Processing started.');
    } catch (error) {
      toast.error('Failed to upload video');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <MainLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.name}
            </p>
          </div>
          {canUpload && (
            <Link to="/upload">
              <Button className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Video
              </Button>
            </Link>
          )}
        </div>

        {/* Quick Upload Section */}
        {canUpload && (
          <div className="glass-card rounded-2xl p-6 mb-8 fade-in">
            <div className="flex items-center gap-4">
              <div 
                className="flex-1 border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleQuickUpload}
                  className="hidden"
                  disabled={isUploading}
                />
                <div className="flex items-center justify-center gap-3">
                  {isUploading ? (
                    <>
                      <Loader2 className="h-6 w-6 text-primary animate-spin" />
                      <span className="text-muted-foreground">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-6 w-6 text-muted-foreground" />
                      <span className="text-muted-foreground">Quick Upload - Click or drag a video file here</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            const value = stats[stat.key as keyof typeof stats];
            
            return (
              <div 
                key={stat.key}
                className="glass-card rounded-2xl p-6 fade-in"
                style={{ animationDelay: `${statCards.indexOf(stat) * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-12 w-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} 
                      style={{ 
                        color: stat.key === 'safeVideos' ? 'hsl(var(--success))' : 
                               stat.key === 'flaggedVideos' ? 'hsl(var(--destructive))' :
                               stat.key === 'processingVideos' ? 'hsl(var(--warning))' :
                               'hsl(var(--primary))'
                      }}
                    />
                  </div>
                  <TrendingUp className="h-4 w-4 text-success" />
                </div>
                <p className="text-3xl font-bold">{value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-accent/10 flex items-center justify-center">
                <HardDrive className="h-7 w-7 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatFileSize(stats.totalStorage)}</p>
                <p className="text-sm text-muted-foreground">Total Storage Used</p>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <Eye className="h-7 w-7 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatNumber(stats.totalViews)}</p>
                <p className="text-sm text-muted-foreground">Total Views</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Videos */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Recent Videos</h2>
            <Link to="/library" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          
          {recentVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentVideos.map((video, index) => (
                <div 
                  key={video.id} 
                  className="fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <VideoCard video={video} />
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-12 text-center">
              <Film className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No videos yet</h3>
              <p className="text-muted-foreground mb-6">
                Start by uploading your first video
              </p>
              {canUpload && (
                <Link to="/upload">
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Video
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}