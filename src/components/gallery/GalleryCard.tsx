import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { MediaFile } from '../../types';
import { Calendar, User, Image, Film, Music, FileText } from 'lucide-react';
import { MotionDiv, fadeInScale } from '../ui/motion-wrapper';

interface GalleryCardProps {
  item: MediaFile;
  onClick?: () => void;
}

export const GalleryCard: React.FC<GalleryCardProps> = ({ item, onClick }) => {
  const getMediaIcon = () => {
    switch (item.type) {
      case 'photo':
        return <Image className="w-4 h-4" />;
      case 'video':
        return <Film className="w-4 h-4" />;
      case 'audio':
        return <Music className="w-4 h-4" />;
      case 'journal':
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = () => {
    switch (item.blockchainStatus) {
      case 'CONFIRMED':
        return 'bg-success text-white';
      case 'PENDING':
        return 'bg-warning text-warning-foreground';
      case 'REJECTED':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <MotionDiv
      {...fadeInScale}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className="cursor-pointer border border-border hover:border-primary/50 transition-all duration-300 overflow-hidden"
        onClick={onClick}
      >
        <div className="aspect-square bg-secondary relative overflow-hidden">
          {item.type === 'photo' && item.thumbnail ? (
            <img 
              src={item.thumbnail} 
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : item.type === 'journal' ? (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-secondary to-muted">
              <FileText className="w-12 h-12 text-muted-foreground" />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-secondary to-muted">
              {getMediaIcon()}
            </div>
          )}
          
          <div className="absolute top-2 right-2">
            <Badge className={getStatusColor()}>
              {item.blockchainStatus}
            </Badge>
          </div>
          
          <div className="absolute bottom-2 left-2">
            <Badge variant="secondary" className="flex items-center space-x-1">
              {getMediaIcon()}
              <span className="capitalize">{item.type}</span>
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-medium text-foreground truncate mb-2">
            {item.title}
          </h3>
          
          {item.description && (
            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
              {item.description}
            </p>
          )}

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Avatar className="w-5 h-5">
                <AvatarFallback className="text-xs">
                  {item.uploader.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="truncate max-w-20">{item.uploader}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(item.createdAt)}</span>
            </div>
          </div>

          {item.transactionHash && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Tx: {item.transactionHash.slice(0, 10)}...{item.transactionHash.slice(-6)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </MotionDiv>
  );
};