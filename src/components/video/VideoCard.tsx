import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock, Eye, MoreVertical, Trash2, Edit2, Loader2 } from 'lucide-react';
import { Video } from '@/types';
import { formatDuration, formatFileSize, formatDate } from '@/utils/formatters';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useVideos } from '@/context/VideoContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  const { deleteVideo } = useVideos();
  const { user } = useAuth();
  const canEdit = user?.role === 'admin' || user?.role === 'editor';
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteVideo(video.id);
      toast.success('Video deleted successfully');
    } catch (error) {
      toast.error('Failed to delete video');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const getStatusBadge = () => {
    switch (video.status) {
      case 'processing':
        return (
          <span className="status-badge status-processing">
            <span className="h-1.5 w-1.5 rounded-full bg-warning animate-pulse" />
            Processing {Math.round(video.processingProgress)}%
          </span>
        );
      case 'completed':
        return video.sensitivity === 'safe' ? (
          <span className="status-badge status-safe">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Safe
          </span>
        ) : (
          <span className="status-badge status-flagged">
            <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
            Flagged
          </span>
        );
      case 'failed':
        return (
          <span className="status-badge status-flagged">
            <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
            Failed
          </span>
        );
      default:
        return (
          <span className="status-badge status-pending">
            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
            Pending
          </span>
        );
    }
  };

  return (
    <>
      <div className="video-card group">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={video.thumbnailUrl || '/placeholder.svg'} 
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Play button */}
          {video.status === 'completed' && (
            <Link 
              to={`/player/${video.id}`}
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <div className="h-14 w-14 rounded-full bg-primary/90 flex items-center justify-center glow-effect transform scale-75 group-hover:scale-100 transition-transform duration-300">
                <Play className="h-6 w-6 text-primary-foreground fill-current ml-1" />
              </div>
            </Link>
          )}

          {/* Processing overlay */}
          {video.status === 'processing' && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
              <div className="w-16 h-16 relative">
                <svg className="w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                  <circle
                    className="text-secondary stroke-current"
                    strokeWidth="8"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-primary stroke-current"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                    strokeDasharray={`${video.processingProgress * 2.51} 251`}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
                  {Math.round(video.processingProgress)}%
                </span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">Analyzing content...</p>
            </div>
          )}

          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-xs font-medium">
            {formatDuration(video.duration)}
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <Link 
                to={video.status === 'completed' ? `/player/${video.id}` : '#'}
                className="text-sm font-semibold hover:text-primary transition-colors line-clamp-2"
              >
                {video.title}
              </Link>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                {video.description}
              </p>
            </div>
            
            {canEdit && (
              <DropdownMenu>
                <DropdownMenuTrigger className="p-1 rounded-lg hover:bg-secondary transition-colors">
                  <MoreVertical className="h-4 w-4 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem className="gap-2">
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="gap-2 text-destructive focus:text-destructive"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between">
            {getStatusBadge()}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {video.views}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formatDate(video.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Video</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{video.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
