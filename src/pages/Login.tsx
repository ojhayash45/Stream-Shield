import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Mail, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
      navigate('/dashboard');
    } catch {
      toast({
        title: 'Login failed',
        description: 'Invalid email or password. Try demo accounts below.',
        variant: 'destructive',
      });
    }
  };

  const demoLogin = async (email: string) => {
    setEmail(email);
    setPassword('password123');
    try {
      await login(email, 'password123');
      navigate('/dashboard');
    } catch {
      toast({
        title: 'Login failed',
        description: 'Something went wrong.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div 
          className="absolute inset-0 opacity-30"
          style={{ background: 'var(--gradient-glow)' }}
        />
        <div className="relative z-10 flex flex-col justify-center px-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center glow-effect">
              <Play className="h-6 w-6 text-primary-foreground fill-current" />
            </div>
            <span className="text-2xl font-bold gradient-text">VideoStream</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Secure Video Processing <br />
            <span className="gradient-text">& Streaming Platform</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-md">
            Upload, analyze, and stream your video content with real-time sensitivity detection and role-based access control.
          </p>
          
          {/* Feature highlights */}
          <div className="mt-12 space-y-4">
            {[
              'Automated content sensitivity analysis',
              'Real-time processing progress',
              'Multi-tenant architecture',
              'Role-based access control',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-primary" />
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center glow-effect">
              <Play className="h-5 w-5 text-primary-foreground fill-current" />
            </div>
            <span className="text-xl font-bold gradient-text">VideoStream</span>
          </div>

          <div className="glass-card rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">Welcome back</h2>
              <p className="text-muted-foreground mt-2">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign in
              </Button>
            </form>

            <div className="mt-6">
              <p className="text-center text-sm text-muted-foreground mb-4">
                Quick demo access:
              </p>
              <div className="grid gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => demoLogin('admin@example.com')}
                  disabled={isLoading}
                >
                  Login as Admin
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => demoLogin('editor@example.com')}
                  disabled={isLoading}
                >
                  Login as Editor
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => demoLogin('viewer@example.com')}
                  disabled={isLoading}
                >
                  Login as Viewer
                </Button>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
