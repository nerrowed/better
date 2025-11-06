import z from "zod";

export const formSchema = z.object({
  room_name: z.string().min(1, {
    message: "Room name must be at least 1 characters.",
  }),
});
