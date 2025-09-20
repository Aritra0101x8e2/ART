import React, { useState, useEffect } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { GalleryCard } from '../components/gallery/GalleryCard';
import { Pagination } from '../components/gallery/Pagination';
import { Loading } from '../components/ui/loading';
import { MediaFile, GalleryFilters } from '../types';
import { getGallery } from '../config/api';
import { useToast } from '../hooks/use-toast';
import { Search, Filter, Grid, List } from 'lucide-react';
import { MotionDiv, MotionSection, fadeInUp, staggerContainer } from '../components/ui/motion-wrapper';

export const Gallery: React.FC = () => {
  const [items, setItems] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [filters, setFilters] = useState<GalleryFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { toast } = useToast();

  const fetchGallery = async (page: number = 1, newFilters: GalleryFilters = {}) => {
    setLoading(true);
    try {
      const filterParams = {
        ...newFilters,
        search: searchTerm || undefined,
      };
      
      const response = await getGallery(page, 12, filterParams);
      setItems(response.items);
      setCurrentPage(response.page);
      setTotalPages(Math.ceil(response.total / response.limit));
      setHasMore(response.hasMore);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to load gallery',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery(1, filters);
  }, [filters, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchGallery(1, filters);
  };

  const handleFilterChange = (key: keyof GalleryFilters, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value || undefined,
    };
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setCurrentPage(1);
  };

  const mockItems: MediaFile[] = [
    {
      id: '1',
      type: 'photo',
      title: 'Sunset Landscape',
      description: 'Beautiful sunset over mountains',
      uploader: 'Alice',
      uploaderId: 'user1',
      createdAt: '2024-01-15T10:00:00Z',
      blockchainStatus: 'CONFIRMED',
      transactionHash: '0x1234567890abcdef',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    },
    {
      id: '2',
      type: 'journal',
      title: 'Travel Memories',
      description: 'My thoughts on recent travels',
      content: 'Today I discovered an amazing hidden waterfall...',
      uploader: 'Bob',
      uploaderId: 'user2',
      createdAt: '2024-01-14T14:30:00Z',
      blockchainStatus: 'PENDING',
    },
    {
      id: '3',
      type: 'video',
      title: 'Art Tutorial',
      description: 'Digital painting techniques',
      uploader: 'Carol',
      uploaderId: 'user3',
      createdAt: '2024-01-13T09:15:00Z',
      blockchainStatus: 'CONFIRMED',
      transactionHash: '0xfedcba0987654321',
    },
    {
      id: '4',
      type: 'audio',
      title: 'Morning Meditation',
      description: 'Peaceful sounds for relaxation',
      uploader: 'David',
      uploaderId: 'user4',
      createdAt: '2024-01-12T07:00:00Z',
      blockchainStatus: 'CONFIRMED',
      transactionHash: '0x1122334455667788',
    },
    {
      id: '5',
      type: 'photo',
      title: 'City Architecture',
      description: 'Modern building design',
      uploader: 'Eve',
      uploaderId: 'user5',
      createdAt: '2024-01-11T16:45:00Z',
      blockchainStatus: 'REJECTED',
      thumbnail: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=400&fit=crop',
    },
    {
      id: '6',
      type: 'journal',
      title: 'Recipe Collection',
      description: 'My grandmother\'s secret recipes',
      content: 'Here are the traditional family recipes...',
      uploader: 'Frank',
      uploaderId: 'user6',
      createdAt: '2024-01-10T12:20:00Z',
      blockchainStatus: 'CONFIRMED',
      transactionHash: '0x9988776655443322',
    },
  ];

  const displayItems = loading ? [] : (items.length > 0 ? items : mockItems);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <MotionSection {...staggerContainer}>
          <MotionDiv {...fadeInUp} className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Art Gallery</h1>
            <p className="text-muted-foreground">
              Discover and explore verified digital creations from our community
            </p>
          </MotionDiv>

          <MotionDiv 
            {...fadeInUp}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-lg p-6 mb-8"
          >
            <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, description, or uploader..."
                  className="pl-10 bg-input"
                />
              </div>
              <Button type="submit" disabled={loading}>
                Search
              </Button>
            </form>

            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-4">
                <Select 
                  value={filters.mediaType || ''} 
                  onValueChange={(value) => handleFilterChange('mediaType', value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Media Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    <SelectItem value="photo">Photos</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="journal">Journals</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="w-40"
                  placeholder="From date"
                />

                <Input
                  type="date"
                  value={filters.dateTo || ''}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="w-40"
                  placeholder="To date"
                />

                <Button variant="outline" onClick={clearFilters}>
                  <Filter className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </MotionDiv>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loading size="lg" />
            </div>
          ) : displayItems.length === 0 ? (
            <MotionDiv {...fadeInUp} className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No items found matching your criteria.
              </p>
            </MotionDiv>
          ) : (
            <>
              <MotionDiv 
                {...staggerContainer}
                className={`grid gap-6 mb-8 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
                }`}
              >
                {displayItems.map((item) => (
                  <GalleryCard 
                    key={item.id} 
                    item={item}
                    onClick={() => console.log('Open item details:', item.id)}
                  />
                ))}
              </MotionDiv>

              <MotionDiv {...fadeInUp}>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    fetchGallery(page, filters);
                  }}
                  hasMore={hasMore}
                />
              </MotionDiv>
            </>
          )}
        </MotionSection>
      </div>
    </div>
  );
};