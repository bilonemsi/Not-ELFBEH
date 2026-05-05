
"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { Note, getLocalNotes, saveLocalNotes, createEmptyNote } from '@/lib/notes-store';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  Book, 
  Search, 
  ChevronLeft, 
  PanelLeft,
  Clock,
  X,
  Sparkles,
  Loader2,
  Check,
  Type,
  Settings,
  AlertCircle,
  ExternalLink,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MarkdownRenderer } from './MarkdownRenderer';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useIsMobile } from '@/hooks/use-mobile';
import { processNoteWithAI } from '@/ai/flows/note-assistant-flow';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export function NoteApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const currentUser = auth.currentUser;

  useEffect(() => {
    // Notları kullanıcıya özel bir anahtarla saklamak daha güvenlidir.
    // Şimdilik genel localStorage kullanılıyor ancak login şartı eklendi.
    setNotes(getLocalNotes());
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  const activeNote = useMemo(() => 
    notes.find(n => n.id === activeNoteId) || null
  , [notes, activeNoteId]);

  const filteredNotes = useMemo(() => {
    return notes
      .filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        n.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes, searchQuery]);

  const handleCreateNote = () => {
    const newNote = createEmptyNote();
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    saveLocalNotes(updatedNotes);
    setActiveNoteId(newNote.id);
    setIsEditing(true);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    const updatedNotes = notes.map(n => 
      n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n
    );
    setNotes(updatedNotes);
    saveLocalNotes(updatedNotes);
  };

  const handleDeleteNote = (id: string) => {
    const updatedNotes = notes.filter(n => n.id !== id);
    setNotes(updatedNotes);
    saveLocalNotes(updatedNotes);
    if (activeNoteId === id) {
      setActiveNoteId(null);
    }
  };

  const handleNoteSelect = (id: string) => {
    setActiveNoteId(id);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: "Çıkış Yapıldı", description: "Güvenle çıkış yaptınız." });
    } catch (error) {
      toast({ variant: "destructive", title: "Hata", description: "Çıkış yapılırken bir sorun oluştu." });
    }
  };

  const runAiAction = async (action: 'summarize' | 'improve' | 'fix_grammar' | 'generate_title') => {
    if (!activeNote || !activeNote.content) return;
    
    setIsAiProcessing(true);
    try {
      const response = await processNoteWithAI({
        content: activeNote.content,
        action: action
      });

      if (action === 'generate_title') {
        handleUpdateNote(activeNote.id, { title: response.result });
      } else {
        handleUpdateNote(activeNote.id, { content: response.result });
      }
      
      toast({
        title: "Başarılı!",
        description: "AI işlemini tamamladı.",
      });
    } catch (error: any) {
      console.error(error);
      const isApiKeyError = error?.message?.includes('API_KEY_INVALID') || error?.message?.includes('API key not found');
      
      toast({
        variant: "destructive",
        title: "AI İşlemi Başarısız",
        description: isApiKeyError 
          ? "Google AI API Anahtarı bulunamadı veya geçersiz."
          : "Bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
      });
    } finally {
      setIsAiProcessing(false);
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden safe-area-inset">
      {/* Sidebar */}
      <aside className={cn(
        "bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out flex flex-col z-40 shrink-0",
        isMobile 
          ? (sidebarOpen ? "fixed inset-0 w-full" : "fixed inset-0 w-0 -translate-x-full opacity-0 pointer-events-none")
          : (sidebarOpen ? "w-80" : "w-0 opacity-0 -translate-x-full pointer-events-none")
      )}>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
              E
            </div>
            <h1 className="font-headline font-bold text-xl tracking-tight text-primary">Not-ELFBEH</h1>
          </div>
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Kullanıcı</p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {currentUser?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Çıkış Yap</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
              {isMobile ? <X className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <div className="px-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Notlarda ara..." 
              className="pl-9 bg-background/50 border-none focus-visible:ring-1 focus-visible:ring-primary/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1 py-2">
            {filteredNotes.length === 0 ? (
              <div className="text-center py-10 px-4 text-muted-foreground">
                <p className="text-sm">Not bulunamadı.</p>
              </div>
            ) : (
              filteredNotes.map(note => (
                <button
                  key={note.id}
                  onClick={() => handleNoteSelect(note.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-md transition-all group",
                    activeNoteId === note.id 
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "hover:bg-sidebar-accent text-sidebar-foreground"
                  )}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium line-clamp-1">{note.title || 'Adsız Not'}</h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs opacity-70">
                    <Clock className="h-3 w-3" />
                    <span>{format(note.updatedAt, 'MMM d, h:mm a')}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-sidebar-border">
          <Button 
            className="w-full h-12 font-medium shadow-sm hover:shadow-md transition-shadow gap-2 rounded-xl"
            onClick={handleCreateNote}
          >
            <Plus className="h-5 w-5" />
            Yeni Not
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-background">
        {!sidebarOpen && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute left-4 top-4 z-50 bg-background/80 backdrop-blur shadow-sm border rounded-full h-10 w-10"
            onClick={() => setSidebarOpen(true)}
          >
            <PanelLeft className="h-5 w-5" />
          </Button>
        )}

        {activeNote ? (
          <>
            <header className="h-16 border-b bg-background/50 backdrop-blur-md flex items-center justify-between px-4 md:px-6 shrink-0 pt-safe">
              <div className="flex items-center gap-2 flex-1 ml-10 md:ml-0 overflow-hidden">
                <input 
                  className="bg-transparent border-none focus:outline-none text-lg md:text-xl font-headline font-semibold text-primary w-full truncate"
                  value={activeNote.title}
                  placeholder="Not Başlığı"
                  onChange={(e) => handleUpdateNote(activeNote.id, { title: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-1 md:gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={cn(
                        "h-9 px-3 gap-2 rounded-full transition-all",
                        isAiProcessing && "opacity-70"
                      )}
                      disabled={isAiProcessing || !activeNote.content}
                    >
                      {isAiProcessing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4 text-amber-500" />
                      )}
                      <span className="hidden sm:inline">AI Asistan</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Zekice İşlemler</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => runAiAction('generate_title')}>
                      <Type className="mr-2 h-4 w-4" />
                      <span>Başlık Öner</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => runAiAction('summarize')}>
                      <Book className="mr-2 h-4 w-4" />
                      <span>Özet Çıkar</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => runAiAction('improve')}>
                      <Sparkles className="mr-2 h-4 w-4 text-amber-500" />
                      <span>Metni Güzelleştir</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => runAiAction('fix_grammar')}>
                      <Check className="mr-2 h-4 w-4" />
                      <span>Hataları Düzelt</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex bg-muted rounded-lg p-0.5 md:p-1 mr-1">
                  <Button 
                    variant={isEditing ? 'secondary' : 'ghost'} 
                    size="sm" 
                    className="h-8 md:h-9 px-2 md:px-3 gap-1 md:gap-2 rounded-md"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit3 className="h-4 w-4" />
                    <span className="hidden xs:inline">Yaz</span>
                  </Button>
                  <Button 
                    variant={!isEditing ? 'secondary' : 'ghost'} 
                    size="sm" 
                    className="h-8 md:h-9 px-2 md:px-3 gap-1 md:gap-2 rounded-md"
                    onClick={() => setIsEditing(false)}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="hidden xs:inline">Gör</span>
                  </Button>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full h-9 w-9">
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                      <AlertDialogDescription>
                        "{activeNote.title || 'Adsız Not'}" kalıcı olarak silinecektir. Bu işlem geri alınamaz.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Vazgeç</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteNote(activeNote.id)} className="bg-destructive text-destructive-foreground">
                        Sil
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </header>

            <div className="flex-1 relative overflow-hidden flex flex-col md:flex-row">
              <div className={cn(
                "flex-1 h-full flex flex-col bg-background transition-all duration-300",
                isEditing ? "block" : "hidden md:hidden"
              )}>
                <Textarea
                  className="flex-1 p-4 md:p-8 text-base md:text-lg font-mono border-none focus-visible:ring-0 resize-none bg-transparent"
                  placeholder="Markdown yazmaya başlayın..."
                  value={activeNote.content}
                  onChange={(e) => handleUpdateNote(activeNote.id, { content: e.target.value })}
                />
              </div>

              <div className={cn(
                "flex-1 h-full flex flex-col bg-background/30 transition-all duration-300 border-l",
                !isEditing ? "block" : "hidden md:flex"
              )}>
                <ScrollArea className="flex-1 p-4 md:p-12">
                  <div className="max-w-3xl mx-auto">
                    {activeNote.content ? (
                      <MarkdownRenderer content={activeNote.content} />
                    ) : (
                      <div className="text-muted-foreground italic flex flex-col items-center justify-center py-20 opacity-50">
                        <Book className="h-12 w-12 mb-4" />
                        <p>Henüz içerik yok.</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
            <div className="relative w-48 h-48 md:w-64 md:h-64 bg-accent/10 rounded-full flex items-center justify-center">
              <Book className="w-24 h-24 md:w-32 md:h-32 text-primary opacity-20" />
              <div className="absolute -bottom-2 -right-2 bg-background p-3 md:p-4 rounded-xl shadow-lg border">
                 <Plus className="h-6 w-6 md:h-8 md:w-8 text-primary animate-pulse" />
              </div>
            </div>
            <div className="max-w-md space-y-2">
              <h2 className="text-xl md:text-2xl font-headline font-bold text-primary">Çalışma Alanınız Boş</h2>
              <p className="text-muted-foreground text-sm md:text-base">Fikirlerinizi kaydetmek için yan menüden bir not seçin veya yeni bir tane oluşturun.</p>
            </div>
            <Button size="lg" onClick={handleCreateNote} className="px-10 h-12 text-lg font-medium shadow-lg hover:translate-y-[-2px] transition-all rounded-xl">
              İlk Notu Oluştur
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
