import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, 
  Zap, 
  Image, 
  Film, 
  Music, 
  FileText, 
  ArrowRight,
  Upload,
  Search,
  Lock
} from 'lucide-react';
import { MotionDiv, MotionSection, fadeInUp, staggerContainer } from '../components/ui/motion-wrapper';

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <MotionDiv {...fadeInUp}>
    <Card className="h-full border border-border hover:border-primary/50 transition-all duration-300">
      <CardContent className="p-6 text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  </MotionDiv>
);

const MediaTypeCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <MotionDiv {...fadeInUp} className="text-center">
    <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
      {icon}
    </div>
    <h3 className="font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm">{description}</p>
  </MotionDiv>
);

export const Landing: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <MotionSection 
        {...staggerContainer}
        className="relative py-20 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20" />
        <div className="absolute top-10 left-10 w-2 h-16 bg-primary/20 rotate-12 float-animation" />
        <div className="absolute bottom-20 right-20 w-8 h-8 border border-primary/30 rotate-45 infinite-spin" />
        
        <div className="container mx-auto px-4 text-center relative">
          <MotionDiv {...fadeInUp}>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
              Art <span className="text-primary">Chain</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Secure your digital creations forever with blockchain technology and AI-powered verification
            </p>
          </MotionDiv>

          <MotionDiv 
            {...fadeInUp}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Button 
              size="lg" 
              onClick={() => navigate(isAuthenticated ? '/upload' : '/signup')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Upload className="w-5 h-5 mr-2" />
              Start Uploading
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/gallery')}
            >
              <Search className="w-5 h-5 mr-2" />
              Explore Gallery
            </Button>
          </MotionDiv>

          <MotionDiv 
            {...fadeInUp}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto"
          >
            <MediaTypeCard
              icon={<Image className="w-8 h-8 text-primary" />}
              title="Photos"
              description="JPEG, PNG formats supported"
            />
            <MediaTypeCard
              icon={<Film className="w-8 h-8 text-primary" />}
              title="Videos"
              description="MP4 format with preview"
            />
            <MediaTypeCard
              icon={<Music className="w-8 h-8 text-primary" />}
              title="Audio"
              description="MP3, MP4 audio files"
            />
            <MediaTypeCard
              icon={<FileText className="w-8 h-8 text-primary" />}
              title="Journals"
              description="Text entries with dates"
            />
          </MotionDiv>
        </div>
      </MotionSection>

      <MotionSection 
        {...staggerContainer}
        className="py-20 bg-secondary/50"
      >
        <div className="container mx-auto px-4">
          <MotionDiv {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why Choose Art Chain?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced technology meets user-friendly design for the ultimate content protection platform
            </p>
          </MotionDiv>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-primary" />}
              title="AI Verification"
              description="Powered by Gemini AI to detect duplicates and ensure content originality before blockchain storage"
            />
            <FeatureCard
              icon={<Lock className="w-6 h-6 text-primary" />}
              title="Blockchain Security"
              description="Immutable storage on blockchain with cryptographic proof of ownership and timestamp"
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-primary" />}
              title="Lightning Fast"
              description="Optimized upload process with real-time verification and instant blockchain confirmation"
            />
          </div>
        </div>
      </MotionSection>

      <MotionSection 
        {...staggerContainer}
        className="py-20"
      >
        <div className="container mx-auto px-4 text-center">
          <MotionDiv {...fadeInUp}>
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Ready to Secure Your Art?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of creators protecting their digital assets with Art Chain
            </p>
          </MotionDiv>

          <MotionDiv 
            {...fadeInUp}
            transition={{ delay: 0.2 }}
          >
            <Button 
              size="lg"
              onClick={() => navigate(isAuthenticated ? '/upload' : '/signup')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isAuthenticated ? 'Upload Now' : 'Get Started Free'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </MotionDiv>
        </div>
      </MotionSection>
    </div>
  );
};