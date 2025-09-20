import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { MediaType } from '../../types';
import { MediaPreview } from '../media/MediaPreview';
import { VerificationResultCard } from './VerificationResultCard';
import { SaveToBlockchainButton } from './SaveToBlockchainButton';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/use-toast';
import { postVerify } from '../../config/api';
import { Upload, Calendar } from 'lucide-react';
import { MotionDiv, fadeInUp } from '../ui/motion-wrapper';

export const UploadForm: React.FC = () => {
  const [mediaType, setMediaType] = useState<MediaType>('photo');
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [canSaveToBlockchain, setCanSaveToBlockchain] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const acceptedTypes = {
    photo: '.jpeg,.jpg,.png',
    video: '.mp4',
    audio: '.mp3,.mp4',
    journal: '',
  };

  const maxSizes = {
    photo: 10 * 1024 * 1024, // 10MB
    video: 100 * 1024 * 1024, // 100MB
    audio: 50 * 1024 * 1024, // 50MB
    journal: 0,
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > maxSizes[mediaType]) {
      toast({
        variant: 'destructive',
        title: 'File too large',
        description: `Maximum file size for ${mediaType} is ${maxSizes[mediaType] / (1024 * 1024)}MB`,
      });
      return;
    }

    setFile(selectedFile);
    setVerificationResult(null);
    setCanSaveToBlockchain(false);
  };

  const handleVerify = async () => {
    if (!user) return;

    const formData = new FormData();
    
    if (mediaType === 'journal') {
      formData.append('content', content);
      formData.append('title', title);
    } else if (file) {
      formData.append('file', file);
    } else {
      toast({
        variant: 'destructive',
        title: 'No content to verify',
        description: 'Please select a file or enter journal content.',
      });
      return;
    }

    formData.append('uploaderId', user.id);
    formData.append('mediaType', mediaType);
    formData.append('createdAt', new Date().toISOString());

    setIsVerifying(true);
    try {
      const result = await postVerify(formData);
      setVerificationResult(result);
      
      if (result.isDuplicate && result.similarityScore > 0.8) {
        setCanSaveToBlockchain(false);
        toast({
          variant: 'destructive',
          title: 'Duplicate detected',
          description: `Content is ${(result.similarityScore * 100).toFixed(1)}% similar to existing record.`,
        });
      } else {
        setCanSaveToBlockchain(true);
        toast({
          title: 'Verification complete',
          description: 'Content verified successfully. You can now save to blockchain.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Verification failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSuccess = () => {
    toast({
      title: 'Success!',
      description: 'Your content has been saved to the blockchain.',
    });
    navigate('/dashboard');
  };

  const isFormValid = () => {
    if (!title.trim()) return false;
    if (mediaType === 'journal') {
      return content.trim().length > 0;
    }
    return file !== null;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <MotionDiv {...fadeInUp} className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Upload to Art Chain</h1>
        <p className="text-muted-foreground">
          Secure your digital creations on the blockchain with AI-powered verification
        </p>
      </MotionDiv>

      <MotionDiv 
        {...fadeInUp}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-lg p-6 space-y-6"
      >
        <div className="space-y-2">
          <Label htmlFor="mediaType">Content Type</Label>
          <Select 
            value={mediaType} 
            onValueChange={(value: MediaType) => {
              setMediaType(value);
              setFile(null);
              setVerificationResult(null);
              setCanSaveToBlockchain(false);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="photo">Photo</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
              <SelectItem value="journal">Journal Entry</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for your content"
            className="bg-input"
          />
        </div>

        {mediaType === 'journal' ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your journal entry here..."
                rows={8}
                className="bg-input resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <div className="relative">
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-input pl-10"
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="file">Select File</Label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="file"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-input hover:bg-secondary/50 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {file ? file.name : `Click to upload ${mediaType}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Max size: {maxSizes[mediaType] / (1024 * 1024)}MB
                  </p>
                </div>
                <input
                  id="file"
                  type="file"
                  className="hidden"
                  accept={acceptedTypes[mediaType]}
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description..."
            rows={3}
            className="bg-input resize-none"
          />
        </div>

        <MediaPreview
          file={file || undefined}
          type={mediaType}
          title={title}
          content={content}
        />

        <Button
          onClick={handleVerify}
          disabled={!isFormValid() || isVerifying}
          className="w-full"
        >
          {isVerifying ? 'Verifying with Gemini...' : 'Verify Content'}
        </Button>

        {verificationResult && (
          <VerificationResultCard result={verificationResult} />
        )}

        {canSaveToBlockchain && (
          <SaveToBlockchainButton
            formData={{
              file: file || undefined,
              title,
              description,
              content,
              date,
              mediaType,
              uploaderId: user?.id || '',
            }}
            onSuccess={handleSuccess}
          />
        )}
      </MotionDiv>
    </div>
  );
};