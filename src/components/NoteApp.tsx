
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
  Menu, 
  ChevronLeft, 
  Sidebar as SidebarIcon,
  Save,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
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

export function NoteApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    setNotes(getLocalNotes());
  }, []);

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

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out flex flex-col",
        sidebarOpen ? "w-80" : "w-0 opacity-0 -translate-x-full pointer-events-none"
      )}>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
              E
            </div>
            <h1 className="font-headline font-bold text-xl tracking-tight text-primary">Not-ELFBEH</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>

        <div className="px-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search notes..." 
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
                <p className="text-sm">No notes found.</p>
              </div>
            ) : (
              filteredNotes.map(note => (
                <button
                  key={note.id}
                  onClick={() => setActiveNoteId(note.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-md transition-all group",
                    activeNoteId === note.id 
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "hover:bg-sidebar-accent text-sidebar-foreground"
                  )}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium line-clamp-1">{note.title || 'Untitled'}</h3>
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
            className="w-full h-11 font-medium shadow-sm hover:shadow-md transition-shadow gap-2"
            onClick={handleCreateNote}
          >
            <Plus className="h-5 w-5" />
            New Note
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Toggle Sidebar Button (when closed) */}
        {!sidebarOpen && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute left-4 top-4 z-50 bg-background/80 backdrop-blur shadow-sm border"
            onClick={() => setSidebarOpen(true)}
          >
            <SidebarIcon className="h-5 w-5" />
          </Button>
        )}

        {activeNote ? (
          <>
            {/* Toolbar */}
            <header className="h-16 border-b bg-background/50 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
              <div className="flex items-center gap-4 flex-1">
                {!sidebarOpen && <div className="w-10" />} {/* Spacer for toggle button */}
                <input 
                  className="bg-transparent border-none focus:outline-none text-xl font-headline font-semibold text-primary w-full max-w-md"
                  value={activeNote.title}
                  placeholder="Note Title"
                  onChange={(e) => handleUpdateNote(activeNote.id, { title: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex bg-muted rounded-lg p-1 mr-2">
                  <Button 
                    variant={isEditing ? 'secondary' : 'ghost'} 
                    size="sm" 
                    className="h-8 gap-2 rounded-md"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button 
                    variant={!isEditing ? 'secondary' : 'ghost'} 
                    size="sm" 
                    className="h-8 gap-2 rounded-md"
                    onClick={() => setIsEditing(false)}
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete your note "{activeNote.title || 'Untitled'}". This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteNote(activeNote.id)} className="bg-destructive text-destructive-foreground">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </header>

            {/* Editor/Preview Container */}
            <div className="flex-1 relative overflow-hidden flex flex-col md:flex-row">
              {/* Editor */}
              <div className={cn(
                "flex-1 h-full flex flex-col bg-background transition-all duration-300",
                isEditing ? "block" : "hidden md:hidden"
              )}>
                <Textarea
                  className="flex-1 p-8 text-lg font-mono border-none focus-visible:ring-0 resize-none bg-transparent"
                  placeholder="Start typing your Markdown here..."
                  value={activeNote.content}
                  onChange={(e) => handleUpdateNote(activeNote.id, { content: e.target.value })}
                />
              </div>

              {/* Real-time Preview */}
              <div className={cn(
                "flex-1 h-full flex flex-col bg-background/30 transition-all duration-300 border-l",
                !isEditing ? "block" : "hidden md:flex"
              )}>
                <ScrollArea className="flex-1 p-8 md:p-12">
                  <div className="max-w-3xl mx-auto">
                    {activeNote.content ? (
                      <MarkdownRenderer content={activeNote.content} />
                    ) : (
                      <div className="text-muted-foreground italic flex flex-col items-center justify-center py-20 opacity-50">
                        <Book className="h-12 w-12 mb-4" />
                        <p>No content to preview yet.</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
            <div className="relative w-64 h-64 bg-accent/10 rounded-full flex items-center justify-center">
              <Book className="w-32 h-32 text-primary opacity-20" />
              <div className="absolute -bottom-2 -right-2 bg-background p-4 rounded-xl shadow-lg border">
                 <Plus className="h-8 w-8 text-primary animate-pulse" />
              </div>
            </div>
            <div className="max-w-md space-y-2">
              <h2 className="text-2xl font-headline font-bold text-primary">Your Workspace is Empty</h2>
              <p className="text-muted-foreground">Select a note from the sidebar or create a new one to get started with your ideas.</p>
            </div>
            <Button size="lg" onClick={handleCreateNote} className="px-10 h-12 text-lg font-medium shadow-lg hover:translate-y-[-2px] transition-all">
              Create First Note
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
