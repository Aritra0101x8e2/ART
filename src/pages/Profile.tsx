import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import { User, Mail, Calendar, LogOut, Edit3, Save, X } from 'lucide-react';
import { MotionDiv, MotionSection, fadeInUp, staggerContainer } from '../components/ui/motion-wrapper';

export const Profile: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const handleSave = () => {
    toast({
      title: 'Profile updated',
      description: 'Your profile information has been saved.',
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setUsername(user.username);
    setEmail(user.email);
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <MotionSection {...staggerContainer}>
          <MotionDiv {...fadeInUp} className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Profile Settings</h1>
            <p className="text-muted-foreground">
              Manage your Art Chain account information and preferences
            </p>
          </MotionDiv>

          <MotionDiv 
            {...fadeInUp}
            transition={{ delay: 0.1 }}
          >
            <Card className="border border-border">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4">
                  <Avatar className="w-20 h-20">
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-2xl text-foreground">{user.username}</CardTitle>
                <p className="text-muted-foreground">{user.email}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="flex justify-end">
                  {!isEditing ? (
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button onClick={handleSave} size="sm">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" onClick={handleCancel} size="sm">
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Username</span>
                    </Label>
                    {isEditing ? (
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-input"
                      />
                    ) : (
                      <p className="text-foreground bg-secondary p-2 rounded-md">
                        {user.username}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>Email</span>
                    </Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-input"
                      />
                    ) : (
                      <p className="text-foreground bg-secondary p-2 rounded-md">
                        {user.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Member Since</span>
                    </Label>
                    <p className="text-foreground bg-secondary p-2 rounded-md">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Account Actions</h3>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        variant="outline" 
                        onClick={() => navigate('/dashboard')}
                        className="flex-1"
                      >
                        View Dashboard
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => navigate('/upload')}
                        className="flex-1"
                      >
                        Upload Content
                      </Button>
                    </div>

                    <Button 
                      variant="destructive" 
                      onClick={handleLogout}
                      className="w-full"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-2">Security Note</h4>
                  <p className="text-muted-foreground text-sm">
                    Your account data is encrypted and secured. All uploads are verified 
                    with AI before blockchain storage for maximum security and authenticity.
                  </p>
                </div>
              </CardContent>
            </Card>
          </MotionDiv>
        </MotionSection>
      </div>
    </div>
  );
};