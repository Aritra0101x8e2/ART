import React from 'react';
import { MediaType } from '../../types';
import { FileText, Image, Film, Music } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MediaPreviewProps {
  file?: File;
  type: MediaType;
  title?: string;
  content?: string;
  className?: string;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({ 
  file, 
  type, 
  title, 
  content, 
  className 
}) => {
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (file && (type === 'photo' || type === 'video')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file, type]);

  const renderPreview = () => {
    switch (type) {
      case 'photo':
        return previewUrl ? (
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-secondary rounded-lg">
            <Image className="w-12 h-12 text-muted-foreground" />
          </div>
        );

      case 'video':
        return previewUrl ? (
          <video 
            src={previewUrl} 
            controls 
            className="w-full h-full rounded-lg"
            preload="metadata"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-secondary rounded-lg">
            <Film className="w-12 h-12 text-muted-foreground" />
          </div>
        );

      case 'audio':
        return (
          <div className="flex flex-col items-center justify-center h-full bg-secondary rounded-lg p-4">
            <Music className="w-12 h-12 text-muted-foreground mb-2" />
            {file && (
              <audio controls className="w-full">
                <source src={previewUrl || ''} type={file.type} />
                Your browser does not support the audio element.
              </audio>
            )}
          </div>
        );

      case 'journal':
        return (
          <div className="flex flex-col h-full bg-secondary rounded-lg p-4">
            <div className="flex items-center mb-3">
              <FileText className="w-5 h-5 text-muted-foreground mr-2" />
              <span className="font-medium text-foreground">{title || 'Journal Entry'}</span>
            </div>
            <div className="flex-1 overflow-auto">
              <p className="text-muted-foreground text-sm leading-relaxed">
                {content || 'No content yet...'}
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn('w-full h-64 border border-border rounded-lg overflow-hidden', className)}>
      {renderPreview()}
    </div>
  );
};