
"use client"

import React from 'react';
import { NoteApp } from "@/components/NoteApp";
import { LoginForm } from "@/components/LoginForm";
import { useUser } from '@/firebase/provider';
import { Loader2 } from 'lucide-react';
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
