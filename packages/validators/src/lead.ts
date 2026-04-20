import { z } from 'zod';

export const createLeadSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number required'),
  email: z.string().email().optional().or(z.literal('')),
  source: z.enum(['website','whatsapp','phone','referral','social','manual']),
  notes: z.string().optional(),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;