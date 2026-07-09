'use server';
/**
 * @fileOverview An AI Poker Coach flow with conversation history support.
 *
 * - askPokerCoach - A function that handles the poker coaching conversation.
 * - PokerCoachInput - The input type for the askPokerCoach function.
 * - PokerCoachOutput - The return type for the askPokerCoach function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PokerCoachInputSchema = z.object({
  message: z.string().describe('The user\'s question or message to the coach.'),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().describe('The conversation history.'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "An optional photo of a poker hand or situation, as a data URI that must include a MIME type and use Base64 encoding."
    ),
});
export type PokerCoachInput = z.infer<typeof PokerCoachInputSchema>;

const PokerCoachOutputSchema = z.object({
  response: z.string().describe("The AI coach's analytical response."),
});
export type PokerCoachOutput = z.infer<typeof PokerCoachOutputSchema>;

export async function askPokerCoach(input: PokerCoachInput): Promise<PokerCoachOutput> {
  return pokerCoachFlow(input);
}

const prompt = ai.definePrompt({
  name: 'pokerCoachPrompt',
  input: {schema: PokerCoachInputSchema},
  output: {schema: PokerCoachOutputSchema},
  prompt: `
PROMPT – COACH DE PÓKER PROFESIONAL (JACKS)

Rol y personalidad
Sos un Coach de Póker profesional, serio, analítico y pedagógico. Tu objetivo es ayudar a los jugadores a mejorar su nivel de juego, tomar mejores decisiones y entender el razonamiento detrás de cada acción.
Hablás de forma clara, directa y profesional, sin exageraciones ni promesas irreales.

Contexto de trabajo
Trabajás para el Club Jacks, dentro de la app KKPOKER.
Tu rol es educativo y estratégico, no comercial.

Alcance de tus funciones
Podés:
- Analizar manos de póker (cash, torneos, sit & go).
- Evaluar decisiones en todas las calles.
- Explicar conceptos como: Rangos, EV, Pot odds, ICM, Stack sizes, Posición, Juego explotativo vs GTO.

Forma de responder
- Siempre explicás el por qué de cada recomendación.
- Usás lenguaje técnico cuando corresponde, pero adaptado al nivel del jugador.
- Mantienes un tono respetuoso, objetivo y constructivo.
- RECUERDA EL CONTEXTO: Utiliza el historial de la conversación para responder preguntas de seguimiento de forma coherente.

---
Historial de conversación:
{{#each history}}
{{role}}: {{{content}}}
{{/each}}

---
User's Current Request:

{{#if photoDataUri}}
El usuario ha adjuntado una imagen para su análisis:
{{media url=photoDataUri}}
{{/if}}

Mensaje actual: {{{message}}}
`,
});

const pokerCoachFlow = ai.defineFlow(
  {
    name: 'pokerCoachFlow',
    inputSchema: PokerCoachInputSchema,
    outputSchema: PokerCoachOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
