import z from 'zod';

export const formSchema = z.object({
  role: z.string().min(1, {
    message: 'Room name must be at least 1 characters.',
  }),
});
