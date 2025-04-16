import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRightCircle, AtSign, Lock, User } from "lucide-react";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const { user, loginMutation, registerMutation } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Redirect to home if already logged in
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ username, password });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate({ username, password, email });
  };

  const isLoginDisabled = loginMutation.isPending || !username || !password;
  const isRegisterDisabled = registerMutation.isPending || !username || !password;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-dark">
      {/* Left column (form) */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Tabs 
            defaultValue="login" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login" className="text-lg">Login</TabsTrigger>
              <TabsTrigger value="register" className="text-lg">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card className="border-none bg-darklight shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Welcome Back!</CardTitle>
                  <CardDescription>
                    Sign in to your DinoGames account to continue
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-username" className="text-white">Username</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-username"
                          placeholder="username"
                          className="pl-10 bg-dark border-gray-700"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-white">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10 bg-dark border-gray-700"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={isLoginDisabled}
                    >
                      {loginMutation.isPending ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                          Signing In...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          Sign In <ArrowRightCircle className="ml-2 h-4 w-4" />
                        </div>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card className="border-none bg-darklight shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Create Account</CardTitle>
                  <CardDescription>
                    Join DinoGames to get access to all features
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleRegister}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-username" className="text-white">Username</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-username"
                          placeholder="Choose a username"
                          className="pl-10 bg-dark border-gray-700"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-email" className="text-white">Email (optional)</Label>
                      <div className="relative">
                        <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="your@email.com"
                          className="pl-10 bg-dark border-gray-700"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-password" className="text-white">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-password"
                          type="password"
                          placeholder="Create a password"
                          className="pl-10 bg-dark border-gray-700"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={isRegisterDisabled}
                    >
                      {registerMutation.isPending ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                          Creating Account...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          Create Account <ArrowRightCircle className="ml-2 h-4 w-4" />
                        </div>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Right column (hero) */}
      <div className="hidden md:block md:flex-1 bg-gradient-to-b from-indigo-800 to-purple-900 p-8 flex flex-col justify-center">
        <div className="max-w-lg mx-auto">
          <h1 className="text-4xl font-bold text-white mb-6">
            DinoGames
          </h1>
          <h2 className="text-2xl font-semibold text-white mb-4">
            The Ultimate Gaming Guide Platform
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Discover guides, tutorials, and gameplay videos for all your favorite games. 
            Level up your gaming experience with professional tips from top players.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="text-white font-semibold mb-2">Trending Games</h3>
              <p className="text-white/70">Find the most popular game guides all in one place</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="text-white font-semibold mb-2">Pro Tips</h3>
              <p className="text-white/70">Learn advanced strategies from professional gamers</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="text-white font-semibold mb-2">Game Categories</h3>
              <p className="text-white/70">Browse videos by your favorite game categories</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="text-white font-semibold mb-2">Save & Share</h3>
              <p className="text-white/70">Create playlists and share your favorite guides</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}