import { CheckCircle2, Loader2, Upload, Shield, Zap, Film } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadProgressProps {
  stage: 'uploading' | 'validating' | 'analyzing' | 'optimizing' | 'complete';
  progress: number;
  filename: string;
}

const stages = [
  { id: 'uploading', label: 'Uploading', icon: Upload },
  { id: 'validating', label: 'Validating', icon: Shield },
  { id: 'analyzing', label: 'Analyzing Sensitivity', icon: Shield },
  { id: 'optimizing', label: 'Optimizing', icon: Zap },
  { id: 'complete', label: 'Complete', icon: Film },
];

export function UploadProgress({ stage, progress, filename }: UploadProgressProps) {
  const currentIndex = stages.findIndex(s => s.id === stage);

  return (
    <div className="glass-card rounded-2xl p-6 fade-in">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Film className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">{filename}</h3>
          <p className="text-sm text-muted-foreground">Processing your video</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">{stages[currentIndex].label}</span>
          <span className="font-mono text-primary">{Math.round(progress)}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stage indicators */}
      <div className="flex justify-between">
        {stages.map((s, index) => {
          const isCompleted = index < currentIndex || stage === 'complete';
          const isCurrent = index === currentIndex;
          const Icon = s.icon;

          return (
            <div 
              key={s.id}
              className={cn(
                'flex flex-col items-center gap-2',
                isCompleted && 'text-success',
                isCurrent && 'text-primary',
                !isCompleted && !isCurrent && 'text-muted-foreground'
              )}
            >
              <div className={cn(
                'h-10 w-10 rounded-full flex items-center justify-center transition-all',
                isCompleted && 'bg-success/20',
                isCurrent && 'bg-primary/20 animate-pulse-glow',
                !isCompleted && !isCurrent && 'bg-muted'
              )}>
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : isCurrent ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>
              <span className="text-xs font-medium text-center hidden sm:block">{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
