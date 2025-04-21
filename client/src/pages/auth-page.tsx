import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Lock, Mail, User } from "lucide-react";
import { SiGoogle } from "react-icons/si";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    registerMutation.mutate({ 
      username, 
      password, 
      email,
      display_name: username 
    });
  };

  const isLoginDisabled = loginMutation.isPending || !username || !password;
  const isRegisterDisabled = registerMutation.isPending || !username || !password || !email || password !== confirmPassword;

  if (loginMutation.isLoading || registerMutation.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Mobile header */}
      <div className="flex items-center justify-center h-14 border-b border-gray-800">
        <h1 className="text-xl font-semibold">
          {isLogin ? "Accesso" : "Crea Account"}
        </h1>
      </div>
      
      <div className="flex-1 flex flex-col p-5">
        {isLogin ? (
          /* Login Form */
          <div className="flex-1 flex flex-col">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Accesso</h2>
              <p className="text-gray-400">Accedi al tuo account DinoGames</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <Input 
                    placeholder="Username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-12 pl-10 bg-white border-gray-300 text-black"
                  />
                </div>
              </div>
              
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <Input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pl-10 bg-white border-gray-300 text-black"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-medium bg-black hover:bg-gray-900 border border-white"
                disabled={isLoginDisabled}
              >
                {loginMutation.isPending ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                    <span>Accedi...</span>
                  </div>
                ) : "Accedi"}
              </Button>
            </form>
            
            <div className="mt-6 relative flex items-center">
              <div className="flex-grow border-t border-gray-700"></div>
              <span className="flex-shrink mx-4 text-gray-500">oppure accedi con</span>
              <div className="flex-grow border-t border-gray-700"></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Button 
                variant="outline" 
                className="h-12 bg-transparent border border-gray-700 hover:bg-gray-800"
              >
                <Facebook className="mr-2 h-5 w-5 text-[#3B5998]" />
                Facebook
              </Button>
              <Button 
                variant="outline" 
                className="h-12 bg-transparent border border-gray-700 hover:bg-gray-800"
              >
                <SiGoogle className="mr-2 h-5 w-5 text-[#DB4437]" />
                Google
              </Button>
            </div>
            
            <div className="mt-auto pb-6 text-center">
              <p className="text-gray-400">
                Non hai un account?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-white hover:underline font-medium"
                >
                  Registrati
                </button>
              </p>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <div className="flex-1 flex flex-col">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Crea Account</h2>
              <p className="text-gray-400">Registrati a DinoGames</p>
            </div>
            
            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <Input 
                    placeholder="Username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-12 pl-10 bg-white border-gray-300 text-black"
                  />
                </div>
              </div>
              
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <Input 
                    type="email" 
                    placeholder="Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 pl-10 bg-white border-gray-300 text-black"
                  />
                </div>
              </div>
              
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <Input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pl-10 bg-white border-gray-300 text-black"
                  />
                </div>
              </div>
              
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <Input 
                    type="password" 
                    placeholder="Conferma Password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 pl-10 bg-white border-gray-300 text-black"
                  />
                </div>
                {password !== confirmPassword && confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">Le password non corrispondono</p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-medium bg-black hover:bg-gray-900 border border-white"
                disabled={isRegisterDisabled}
              >
                {registerMutation.isPending ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                    <span>Registrati...</span>
                  </div>
                ) : "Registrati"}
              </Button>
            </form>
            
            <div className="mt-6 relative flex items-center">
              <div className="flex-grow border-t border-gray-700"></div>
              <span className="flex-shrink mx-4 text-gray-500">oppure registrati con</span>
              <div className="flex-grow border-t border-gray-700"></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Button 
                variant="outline" 
                className="h-12 bg-transparent border border-gray-700 hover:bg-gray-800"
              >
                <Facebook className="mr-2 h-5 w-5 text-[#3B5998]" />
                Facebook
              </Button>
              <Button 
                variant="outline" 
                className="h-12 bg-transparent border border-gray-700 hover:bg-gray-800"
              >
                <SiGoogle className="mr-2 h-5 w-5 text-[#DB4437]" />
                Google
              </Button>
            </div>
            
            <div className="mt-auto pb-6 text-center">
              <p className="text-gray-400">
                Hai già un account?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-white hover:underline font-medium"
                >
                  Accedi
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}