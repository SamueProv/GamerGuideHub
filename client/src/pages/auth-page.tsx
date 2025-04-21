import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Lock, Mail, User, Home } from "lucide-react";
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
      email
    });
  };

  const isLoginDisabled = loginMutation.isPending || !username || !password;
  const isRegisterDisabled = registerMutation.isPending || !username || !password || !email || password !== confirmPassword;

  if (loginMutation.isPending || registerMutation.isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Mobile header */}
      <div className="flex items-center justify-between h-14 border-b border-gray-800 bg-gray-900 px-4">
        <Button 
          variant="ghost" 
          onClick={() => setLocation("/")}
          className="flex items-center p-0"
        >
          <svg 
            className="h-8 w-8 text-red-600 mr-1" 
            viewBox="0 0 24 24" 
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
          </svg>
          <h1 className="text-xl font-bold">
            <span className="text-white">Dino</span>
            <span className="text-red-600">Games</span>
          </h1>
        </Button>
        <h1 className="text-xl font-semibold text-white">
          {isLogin ? "Accesso" : "Crea Account"}
        </h1>
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="text-white"
        >
          <Home className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex-1 flex flex-col p-5">
        {isLogin ? (
          /* Login Form */
          <div className="flex-1 flex flex-col">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2 text-white">Accesso</h2>
              <p className="text-white">Accedi al tuo account DinoGames</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-white font-bold mb-2">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-700" />
                  <Input 
                    placeholder="Inserisci il tuo username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-12 pl-10 bg-white border-gray-500 text-black font-medium"
                    style={{ color: 'black' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-bold mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-700" />
                  <Input 
                    type="password" 
                    placeholder="Inserisci la tua password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pl-10 bg-white border-gray-500 text-black font-medium"
                    style={{ color: 'black' }}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-medium bg-black hover:bg-gray-900 border border-white text-white"
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
              <span className="flex-shrink mx-4 text-white">oppure accedi con</span>
              <div className="flex-grow border-t border-gray-700"></div>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-6">
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/auth/github'}
                className="h-12 bg-transparent border border-gray-700 hover:bg-gray-800 text-white"
              >
                <svg viewBox="0 0 24 24" className="mr-2 h-5 w-5" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Continue with GitHub
              </Button>
              <Button 
                variant="outline" 
                className="h-12 bg-transparent border border-gray-700 hover:bg-gray-800 text-white"
              >
                <Facebook className="mr-2 h-5 w-5 text-[#3B5998]" />
                Facebook
              </Button>
              <Button 
                variant="outline" 
                className="h-12 bg-transparent border border-gray-700 hover:bg-gray-800 text-white"
              >
                <SiGoogle className="mr-2 h-5 w-5 text-[#DB4437]" />
                Google
              </Button>
            </div>

            <div className="mt-auto pb-6 text-center">
              <p className="text-white">
                Non hai un account?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-white hover:underline font-bold"
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
              <h2 className="text-2xl font-bold mb-2 text-white">Crea Account</h2>
              <p className="text-white">Registrati a DinoGames</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label className="block text-white font-bold mb-2">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-700" />
                  <Input 
                    placeholder="Scegli un username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-12 pl-10 bg-white border-gray-500 text-black font-medium"
                    style={{ color: 'black' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-bold mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-700" />
                  <Input 
                    type="email" 
                    placeholder="Inserisci la tua email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 pl-10 bg-white border-gray-500 text-black font-medium"
                    style={{ color: 'black' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-bold mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-700" />
                  <Input 
                    type="password" 
                    placeholder="Crea una password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pl-10 bg-white border-gray-500 text-black font-medium"
                    style={{ color: 'black' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-bold mb-2">Conferma Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-700" />
                  <Input 
                    type="password" 
                    placeholder="Ripeti la password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 pl-10 bg-white border-gray-500 text-black font-medium"
                    style={{ color: 'black' }}
                  />
                </div>
                {password !== confirmPassword && confirmPassword && (
                  <p className="text-red-500 text-sm mt-1 font-bold">Le password non corrispondono</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-medium bg-black hover:bg-gray-900 border border-white text-white"
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
              <span className="flex-shrink mx-4 text-white">oppure registrati con</span>
              <div className="flex-grow border-t border-gray-700"></div>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-6">
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/auth/github'}
                className="h-12 bg-transparent border border-gray-700 hover:bg-gray-800 text-white"
              >
                <svg viewBox="0 0 24 24" className="mr-2 h-5 w-5" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Continue with GitHub
              </Button>
              <Button 
                variant="outline" 
                className="h-12 bg-transparent border border-gray-700 hover:bg-gray-800 text-white"
              >
                <Facebook className="mr-2 h-5 w-5 text-[#3B5998]" />
                Facebook
              </Button>
              <Button 
                variant="outline" 
                className="h-12 bg-transparent border border-gray-700 hover:bg-gray-800 text-white"
              >
                <SiGoogle className="mr-2 h-5 w-5 text-[#DB4437]" />
                Google
              </Button>
            </div>

            <div className="mt-auto pb-6 text-center">
              <p className="text-white">
                Hai già un account?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-white hover:underline font-bold"
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