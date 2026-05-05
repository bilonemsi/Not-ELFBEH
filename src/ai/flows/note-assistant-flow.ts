'use server';
/**
 * @fileOverview Not asistanı AI akışları.
 * Not özetleme, iyileştirme ve başlık oluşturma işlemlerini yönetir.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const NoteAssistantInputSchema = z.object({
  content: z.string().describe('İşlem yapılacak not içeriği'),
  action: z.enum(['summarize', 'improve', 'fix_grammar', 'generate_title']).describe('Yapılacak işlem türü'),
});

const NoteAssistantOutputSchema = z.object({
  result: z.string().describe('AI tarafından üretilen sonuç metni'),
});

export type NoteAssistantInput = z.infer<typeof NoteAssistantInputSchema>;
export type NoteAssistantOutput = z.infer<typeof NoteAssistantOutputSchema>;

export async function processNoteWithAI(input: NoteAssistantInput): Promise<NoteAssistantOutput> {
  return noteAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'noteAssistantPrompt',
  input: { schema: NoteAssistantInputSchema },
  output: { schema: NoteAssistantOutputSchema },
  prompt: `Sen profesyonel bir metin editörü ve not asistanısın. 
Kullanıcının verdiği not içeriği üzerinde şu işlemi yap: {{action}}

İşlem Rehberi:
- summarize: İçeriği ana hatlarıyla kısa bir özet haline getir.
- improve: Metni daha akıcı ve profesyonel bir dile kavuştur, Markdown yapısını koru.
- fix_grammar: Sadece yazım ve imla hatalarını düzelt.
- generate_title: İçeriğe uygun, kısa ve etkileyici bir başlık öner (sadece başlığı dön).

Dili her zaman Türkçe kullan.

Not İçeriği:
{{{content}}}`,
});

const noteAssistantFlow = ai.defineFlow(
  {
    name: 'noteAssistantFlow',
    inputSchema: NoteAssistantInputSchema,
    outputSchema: NoteAssistantOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
