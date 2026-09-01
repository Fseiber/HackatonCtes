import { z } from 'zod';

export const createTramiteSchema = z.object({
  titulo: z
    .string({ message: 'El título es obligatorio' })
    .min(3, 'El título debe tener al menos 3 caracteres'),
  categoria: z
    .string({ message: 'La categoría es obligatoria' })
    .min(2, 'La categoría debe tener al menos 2 caracteres'),
  descripcion: z.string().optional(),
  jurisdiccion: z.enum(['Municipal', 'Provincial', 'Mixto']).optional().default('Municipal'),
  costo: z.number().nonnegative().optional().default(0),
  tiempo_estimado: z.string().optional().default('24 hs'),
});

export const updateTramiteSchema = createTramiteSchema.partial();

export type CreateTramiteInput = z.infer<typeof createTramiteSchema>;
export type UpdateTramiteInput = z.infer<typeof updateTramiteSchema>;