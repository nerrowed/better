// src/app/dashboard/account/lecturer/page-form.schema.tsx
import z from "zod";

export const formSchemaCreate = z.object({
  name: z.string().min(1, {
    message: "Username must be at least 1 characters.",
  }),
  nip: z.string().min(12, {
    message: "Username must be at least 12 characters.",
  }),
  nidn: z.string(),
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});

export const formSchemaEdit = z.object({
  name: z.string().min(1, {
    message: "Username must be at least 1 characters.",
  }),
  nip: z.string().min(12, {
    message: "Username must be at least 12 characters.",
  }),
  nidn: z.string(),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string(),
});
