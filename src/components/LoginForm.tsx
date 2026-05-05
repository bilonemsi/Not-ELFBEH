
"use client"

import React, { useState } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Lock, Mail, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({ title: "Kayıt Başarılı", description: "Hesabınız oluşturuldu ve giriş yapıldı." });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Hoş Geldiniz", description: "Başarıyla giriş yapıldı." });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Giriş bilgileri hatalı veya bir sorun oluştu."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl border-primary/10">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl shadow-lg">
              E
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Not-ELFBEH</CardTitle>
          <CardDescription>
            {isRegistering ? 'Yeni bir hesap oluşturun' : 'Notlarınıza erişmek için giriş yapın'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleAuth}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="ad@ornek.com" 
                  className="pl-10" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isRegistering ? 'Kayıt Ol' : 'Giriş Yap'}
            </Button>
            <Button 
              variant="ghost" 
              className="w-full text-xs" 
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? 'Zaten hesabınız var mı? Giriş yapın' : 'Hesabınız yok mu? Kayıt olun'}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <div className="fixed bottom-8 text-center text-xs text-muted-foreground">
        <p className="flex items-center gap-1 justify-center">
          <Sparkles className="h-3 w-3" /> Güvenli Markdown Deneyimi
        </p>
      </div>
    </div>
  );
}
