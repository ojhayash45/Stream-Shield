import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Share2, Flag, Clock, Eye, Calendar, HardDrive } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { useVideos } from '@/context/VideoContext';
import { Button } from '@/components/ui/button';
import { formatDuration, formatFileSize, formatDate } from '@/utils/formatters';

export default function PlayerPage() {
  const { id } = useParams();
  const { getVideo, videos } = useVideos();
  const video = getVideo(id || '');

  if (!video) {
    return (
      <MainLayout>
        <div className="p-8">
          <div className="glass-card rounded-2xl p-12 text-center">
            <h2 className="text-xl font-semibold mb-2">Video not found</h2>
            <p className="text-muted-foreground mb-6">
              The video you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/library">
              <Button>Back to Library</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const relatedVideos = videos
    .filter(v => v.id !== video.id && v.status === 'completed')
    .slice(0, 4);

  return (
    <MainLayout>
      <div className="p-8">
        {/* Back button */}
        <Link 
          to="/library" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Library
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <VideoPlayer video={video} />

            {/* Video Info */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl font-bold">{video.title}</h1>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {video.views} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(video.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                {video.sensitivity === 'safe' ? (
                  <span className="status-badge status-safe">
                    <span className="h-2 w-2 rounded-full bg-success" />
                    Safe
                  </span>
                ) : (
                  <span className="status-badge status-flagged">
                    <span className="h-2 w-2 rounded-full bg-destructive" />
                    Flagged
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                <Button variant="outline" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Flag className="h-4 w-4" />
                  Report
                </Button>
              </div>

              {/* Description */}
              {video.description && (
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{video.description}</p>
                </div>
              )}

              {/* Metadata */}
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="font-semibold mb-4">Video Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-medium">{formatDuration(video.duration)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <HardDrive className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Size</p>
                      <p className="font-medium">{formatFileSize(video.size)}</p>
                    </div>
                  </div>
                  {video.metadata?.width && (
                    <div>
                      <p className="text-sm text-muted-foreground">Resolution</p>
                      <p className="font-medium">{video.metadata.width}x{video.metadata.height}</p>
                    </div>
                  )}
                  {video.metadata?.codec && (
                    <div>
                      <p className="text-sm text-muted-foreground">Codec</p>
                      <p className="font-medium">{video.metadata.codec}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Related Videos */}
          <div className="space-y-4">
            <h2 className="font-semibold">Related Videos</h2>
            {relatedVideos.map(v => (
              <Link 
                key={v.id} 
                to={`/player/${v.id}`}
                className="block glass-card rounded-xl overflow-hidden hover:ring-2 ring-primary/50 transition-all"
              >
                <div className="flex gap-3 p-3">
                  <div className="relative w-32 aspect-video rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={v.thumbnailUrl || '/placeholder.svg'} 
                      alt={v.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-xs">
                      {formatDuration(v.duration)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium line-clamp-2">{v.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {v.views} views • {formatDate(v.createdAt)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}

            {relatedVideos.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                No related videos found
              </p>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
