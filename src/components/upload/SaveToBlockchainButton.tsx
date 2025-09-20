import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Loading } from '../ui/loading';
import { saveToBlockchainPlaceholder } from '../../config/api';
import { MediaType } from '../../types';
import { useToast } from '../../hooks/use-toast';
import { Blocks, Check, X, Clock } from 'lucide-react';
import { MotionDiv, fadeInScale } from '../ui/motion-wrapper';

interface SaveToBlockchainButtonProps {
  formData: {
    file?: File;
    title: string;
    description: string;
    content: string;
    date: string;
    mediaType: MediaType;
    uploaderId: string;
  };
  onSuccess: () => void;
}

type BlockchainStatus = 'idle' | 'saving' | 'success' | 'error';

export const SaveToBlockchainButton: React.FC<SaveToBlockchainButtonProps> = ({
  formData,
  onSuccess,
}) => {
  const [status, setStatus] = useState<BlockchainStatus>('idle');
  const [transactionHash, setTransactionHash] = useState<string>('');
  const [recordId, setRecordId] = useState<string>('');
  const { toast } = useToast();

  const handleSave = async () => {
    setStatus('saving');

    try {
      const form = new FormData();
      
      if (formData.file) {
        form.append('file', formData.file);
      }
      
      form.append('title', formData.title);
      form.append('description', formData.description);
      form.append('content', formData.content);
      form.append('date', formData.date);
      form.append('mediaType', formData.mediaType);
      form.append('uploaderId', formData.uploaderId);

      const result = await saveToBlockchainPlaceholder(form);
      
      setTransactionHash(result.transactionHash);
      setRecordId(result.recordId);
      setStatus('success');
      
      toast({
        title: 'Blockchain save successful!',
        description: 'Your content has been permanently stored on the blockchain.',
      });
      
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error) {
      setStatus('error');
      toast({
        variant: 'destructive',
        title: 'Blockchain save failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'saving':
        return <Clock className="w-5 h-5 text-warning" />;
      case 'success':
        return <Check className="w-5 h-5 text-success" />;
      case 'error':
        return <X className="w-5 h-5 text-destructive" />;
      default:
        return <Blocks className="w-5 h-5" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'saving':
        return 'Saving to blockchain...';
      case 'success':
        return 'Successfully saved!';
      case 'error':
        return 'Save failed';
      default:
        return 'Save to Blockchain';
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'saving':
        return <Badge className="bg-warning text-warning-foreground">PENDING</Badge>;
      case 'success':
        return <Badge className="bg-success text-white">CONFIRMED</Badge>;
      case 'error':
        return <Badge variant="destructive">REJECTED</Badge>;
      default:
        return null;
    }
  };

  return (
    <MotionDiv {...fadeInScale} className="space-y-4">
      <Button
        onClick={handleSave}
        disabled={status === 'saving' || status === 'success'}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        size="lg"
      >
        <div className="flex items-center space-x-2">
          {status === 'saving' ? (
            <Loading size="sm" />
          ) : (
            getStatusIcon()
          )}
          <span>{getStatusText()}</span>
        </div>
      </Button>

      {status !== 'idle' && (
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <span>Blockchain Status</span>
              {getStatusBadge()}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {transactionHash && (
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Transaction Hash</p>
                <code className="text-xs bg-secondary p-2 rounded block break-all">
                  {transactionHash}
                </code>
              </div>
            )}
            {recordId && (
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Record ID</p>
                <code className="text-xs bg-secondary p-2 rounded block">
                  {recordId}
                </code>
              </div>
            )}
            {status === 'saving' && (
              <p className="text-muted-foreground text-sm">
                Your content is being processed and saved to the blockchain. This may take a few moments...
              </p>
            )}
            {status === 'success' && (
              <p className="text-muted-foreground text-sm">
                Your content has been successfully verified and stored on the blockchain with permanent immutable proof.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </MotionDiv>
  );
};