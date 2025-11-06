import z from "zod";

export const formSchemaCreate = z.object({
  name: z.string().min(1, {
    message: "Username must be at least 1 characters.",
  }),
  nim: z
    .string()
    .min(12, {
      message: "NIM must be at least 12 characters.",
    })
    .max(12, { error: "Maksimal 12" }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});

export const formSchemaEdit = z.object({
  name: z.string().min(1, {
    message: "Username must be at least 1 characters.",
  }),
  nim: z.string().min(12, {
    message: "Username must be at least 12 characters.",
  }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string(),
});
