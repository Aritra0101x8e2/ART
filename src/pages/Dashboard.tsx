import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { GalleryCard } from '../components/gallery/GalleryCard';
import { Loading } from '../components/ui/loading';
import { useAuth } from '../context/AuthContext';
import { MediaFile } from '../types';
import { getUserUploads } from '../config/api';
import { useToast } from '../hooks/use-toast';
import { 
  Upload, 
  Image, 
  Film, 
  Music, 
  FileText, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { MotionDiv, MotionSection, fadeInUp, staggerContainer } from '../components/ui/motion-wrapper';

const StatsCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color?: string;
}> = ({ title, value, icon, trend, color = 'primary' }) => (
  <MotionDiv {...fadeInUp}>
    <Card className="border border-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {trend && (
              <p className="text-success text-sm flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                {trend}
              </p>
            )}
          </div>
          <div className={`w-12 h-12 bg-${color}/20 rounded-lg flex items-center justify-center`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  </MotionDiv>
);

export const Dashboard: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [uploads, setUploads] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUploads = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const userUploads = await getUserUploads(user.id);
        setUploads(userUploads);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Failed to load uploads',
          description: error instanceof Error ? error.message : 'Unknown error occurred',
        });
        
        const mockUploads: MediaFile[] = [
          {
            id: '1',
            type: 'photo',
            title: 'My Latest Artwork',
            description: 'Digital painting created yesterday',
            uploader: user.username,
            uploaderId: user.id,
            createdAt: '2024-01-15T10:00:00Z',
            blockchainStatus: 'CONFIRMED',
            transactionHash: '0x1234567890abcdef',
            thumbnail: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
          },
          {
            id: '2',
            type: 'journal',
            title: 'Creative Process Notes',
            description: 'Documenting my artistic journey',
            content: 'Today I experimented with new techniques...',
            uploader: user.username,
            uploaderId: user.id,
            createdAt: '2024-01-14T14:30:00Z',
            blockchainStatus: 'PENDING',
          },
          {
            id: '3',
            type: 'video',
            title: 'Studio Tour',
            description: 'A look inside my creative space',
            uploader: user.username,
            uploaderId: user.id,
            createdAt: '2024-01-13T09:15:00Z',
            blockchainStatus: 'REJECTED',
          },
        ];
        setUploads(mockUploads);
      } finally {
        setLoading(false);
      }
    };

    fetchUploads();
  }, [user]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const getUploadStats = () => {
    const confirmed = uploads.filter(u => u.blockchainStatus === 'CONFIRMED').length;
    const pending = uploads.filter(u => u.blockchainStatus === 'PENDING').length;
    const rejected = uploads.filter(u => u.blockchainStatus === 'REJECTED').length;
    
    const typeCount = uploads.reduce((acc, upload) => {
      acc[upload.type] = (acc[upload.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { confirmed, pending, rejected, typeCount };
  };

  const stats = getUploadStats();

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <MotionSection {...staggerContainer}>
          <MotionDiv {...fadeInUp} className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Welcome back, {user?.username}!
                </h1>
                <p className="text-muted-foreground">
                  Manage your digital assets and track blockchain confirmations
                </p>
              </div>
              <Button onClick={() => navigate('/upload')} className="mt-4 sm:mt-0">
                <Upload className="w-4 h-4 mr-2" />
                Upload New Content
              </Button>
            </div>
          </MotionDiv>

          <MotionDiv 
            {...staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <StatsCard
              title="Total Uploads"
              value={uploads.length}
              icon={<Upload className="w-6 h-6 text-primary" />}
              trend="+12% this month"
            />
            <StatsCard
              title="Confirmed"
              value={stats.confirmed}
              icon={<CheckCircle className="w-6 h-6 text-success" />}
              color="success"
            />
            <StatsCard
              title="Pending"
              value={stats.pending}
              icon={<Clock className="w-6 h-6 text-warning" />}
              color="warning"
            />
            <StatsCard
              title="Photos"
              value={stats.typeCount.photo || 0}
              icon={<Image className="w-6 h-6 text-primary" />}
            />
          </MotionDiv>

          <MotionDiv {...fadeInUp} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Recent Uploads</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <Loading size="lg" />
                    </div>
                  ) : uploads.length === 0 ? (
                    <div className="text-center py-8">
                      <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">
                        You haven't uploaded any content yet.
                      </p>
                      <Button onClick={() => navigate('/upload')}>
                        Upload Your First Item
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {uploads.slice(0, 4).map((upload) => (
                        <GalleryCard 
                          key={upload.id} 
                          item={upload}
                          onClick={() => console.log('View upload details:', upload.id)}
                        />
                      ))}
                    </div>
                  )}
                  
                  {uploads.length > 4 && (
                    <div className="text-center mt-6">
                      <Button variant="outline" onClick={() => navigate('/gallery')}>
                        View All Uploads
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Content Types</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Image className="w-4 h-4 text-primary" />
                      <span className="text-foreground">Photos</span>
                    </div>
                    <Badge variant="secondary">{stats.typeCount.photo || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Film className="w-4 h-4 text-primary" />
                      <span className="text-foreground">Videos</span>
                    </div>
                    <Badge variant="secondary">{stats.typeCount.video || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Music className="w-4 h-4 text-primary" />
                      <span className="text-foreground">Audio</span>
                    </div>
                    <Badge variant="secondary">{stats.typeCount.audio || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="text-foreground">Journals</span>
                    </div>
                    <Badge variant="secondary">{stats.typeCount.journal || 0}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Blockchain Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-foreground">Confirmed</span>
                    </div>
                    <Badge className="bg-success text-white">{stats.confirmed}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-warning" />
                      <span className="text-foreground">Pending</span>
                    </div>
                    <Badge className="bg-warning text-warning-foreground">{stats.pending}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <XCircle className="w-4 h-4 text-destructive" />
                      <span className="text-foreground">Rejected</span>
                    </div>
                    <Badge variant="destructive">{stats.rejected}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </MotionDiv>
        </MotionSection>
      </div>
    </div>
  );
};