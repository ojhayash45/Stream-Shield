import { useState, useCallback, useRef } from 'react';
import { Upload as UploadIcon, Film, X, FileVideo, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { UploadProgress } from '@/components/video/UploadProgress';
import { useVideos } from '@/context/VideoContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { formatFileSize } from '@/utils/formatters';
import { cn } from '@/lib/utils';

type UploadStage = 'idle' | 'uploading' | 'validating' | 'analyzing' | 'optimizing' | 'complete';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStage, setUploadStage] = useState<UploadStage>('idle');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { uploadVideo } = useVideos();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('video/')) {
      setFile(droppedFile);
      if (!title) {
        setTitle(droppedFile.name.replace(/\.[^/.]+$/, ''));
      }
    } else {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a video file.',
        variant: 'destructive',
      });
    }
  }, [title, toast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const simulateUpload = async () => {
    if (!file || !title) return;

    const stages: UploadStage[] = ['uploading', 'validating', 'analyzing', 'optimizing', 'complete'];
    
    for (const stage of stages) {
      setUploadStage(stage);
      
      // Simulate progress for each stage
      for (let p = 0; p <= 100; p += 5) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setProgress(p);
      }
    }

    // Actually add to context
    await uploadVideo(file, title, description);
    
    toast({
      title: 'Upload complete!',
      description: 'Your video is now being processed.',
    });

    setTimeout(() => {
      navigate('/library');
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;
    simulateUpload();
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <MainLayout>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Upload Video</h1>
          <p className="text-muted-foreground mt-1">
            Upload your video for sensitivity analysis and streaming
          </p>
        </div>

        {uploadStage !== 'idle' ? (
          <UploadProgress 
            stage={uploadStage as 'uploading' | 'validating' | 'analyzing' | 'optimizing' | 'complete'}
            progress={progress}
            filename={file?.name || 'video.mp4'}
          />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Drop Zone */}
            <div
              className={cn(
                'upload-zone',
                isDragOver && 'drag-over',
                file && 'border-success'
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !file && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {file ? (
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-xl bg-success/10 flex items-center justify-center">
                    <FileVideo className="h-8 w-8 text-success" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(file.size)} • {file.type}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <UploadIcon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Drag and drop your video here
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    or click to browse files
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supported formats: MP4, MOV, AVI, MKV • Max size: 2GB
                  </p>
                </div>
              )}
            </div>

            {/* Video Details */}
            <div className="glass-card rounded-2xl p-6 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <Film className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Video Details</h2>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter video title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter video description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!file || !title} className="gap-2">
                <UploadIcon className="h-4 w-4" />
                Upload Video
              </Button>
            </div>
          </form>
        )}
      </div>
    </MainLayout>
  );
}
