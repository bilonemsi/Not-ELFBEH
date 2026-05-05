
"use client"

import React, { useEffect, useState } from 'react';
import { NoteApp } from "@/components/NoteApp";
import { LoginForm } from "@/components/LoginForm";
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Toaster } from "@/components/ui/toaster";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [configError, setConfigError] = useState(false);

  useEffect(() => {
    if (!auth) {
      setConfigError(true);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (configError) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Yapılandırma Hatası</AlertTitle>
          <AlertDescription>
            Firebase API anahtarları bulunamadı. Lütfen Docker veya .env dosyanızda 
            <code className="mx-1 px-1 bg-muted rounded text-xs">NEXT_PUBLIC_FIREBASE_API_KEY</code> 
            değişkeninin tanımlı olduğundan emin olun.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {user ? <NoteApp /> : <LoginForm />}
      <Toaster />
    </main>
  );
}
