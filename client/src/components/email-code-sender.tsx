import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Send } from "lucide-react";

export default function EmailCodeSender({ codeContent }: { codeContent: string }) {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  
  const sendCodeMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/send-code", { 
        email, 
        code: codeContent 
      });
      return await res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Code sent!",
          description: `The code has been sent to ${email}`,
        });
      } else {
        toast({
          title: "Failed to send code",
          description: data.error || "Something went wrong",
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send code",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    sendCodeMutation.mutate();
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-darklight border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-white">Send Code to Email</CardTitle>
        <CardDescription>
          Send the code updates to your email for later reference
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="pl-10 bg-dark border-gray-700"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={sendCodeMutation.isPending || !email}
          >
            {sendCodeMutation.isPending ? (
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                Sending...
              </div>
            ) : (
              <div className="flex items-center">
                <Send className="mr-2 h-4 w-4" /> Send Code
              </div>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}