import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { VerificationResult } from '../../types';
import { AlertTriangle, CheckCircle, Flag } from 'lucide-react';
import { MotionDiv, fadeInScale } from '../ui/motion-wrapper';

interface VerificationResultCardProps {
  result: VerificationResult;
}

export const VerificationResultCard: React.FC<VerificationResultCardProps> = ({ result }) => {
  const [disputeReason, setDisputeReason] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDispute = () => {
    console.log('Dispute submitted:', disputeReason);
    setIsDialogOpen(false);
    setDisputeReason('');
  };

  const similarityPercentage = (result.similarityScore * 100).toFixed(1);
  const isDuplicate = result.isDuplicate && result.similarityScore > 0.8;

  return (
    <MotionDiv {...fadeInScale}>
      <Card className={`border-2 ${isDuplicate ? 'border-destructive' : 'border-success'}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            {isDuplicate ? (
              <AlertTriangle className="w-5 h-5 text-destructive" />
            ) : (
              <CheckCircle className="w-5 h-5 text-success" />
            )}
            <span>{isDuplicate ? 'Duplicate Detected' : 'Verification Passed'}</span>
            <Badge variant={isDuplicate ? 'destructive' : 'secondary'}>
              {similarityPercentage}% similarity
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-foreground mb-2">Analysis Summary</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {result.analysisSummary}
            </p>
          </div>

          {result.matchedRecordId && (
            <div>
              <h4 className="font-medium text-foreground mb-2">Matched Record</h4>
              <p className="text-muted-foreground text-sm">
                Record ID: <code className="bg-secondary px-1 rounded">{result.matchedRecordId}</code>
              </p>
            </div>
          )}

          {isDuplicate && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Flag className="w-4 h-4 mr-2" />
                  Request Review
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Manual Review</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    If you believe this detection is incorrect, please provide a reason for manual review.
                  </p>
                  <Textarea
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    placeholder="Explain why you think this is not a duplicate..."
                    rows={4}
                    className="resize-none"
                  />
                  <div className="flex space-x-2">
                    <Button onClick={handleDispute} disabled={!disputeReason.trim()}>
                      Submit Review Request
                    </Button>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </CardContent>
      </Card>
    </MotionDiv>
  );
};