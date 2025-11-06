import { zodResolver } from "@hookform/resolvers/zod";
import { get, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import usePocketbase from "@/hooks/use-pocketbase";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import type { StudentsRecord } from "@/types/pocketbase";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { formSchemaCreate, formSchemaEdit } from "./page-form.schema";

export default function FormAccountStudent() {
  const id = useParams().id as string;
  const navigate = useNavigate();
  const { updateRecord, getOneRecord, isLoading, createRecord } =
    usePocketbase("students");

  useEffect(() => {
    if (!id) return;
    getOneRecord(id).then((res) => {
      form.reset({
        name: get(res, "name", ""),
        nim: get(res, "nim", ""),
        email: get(res, "email", ""),
        password: "",
      });
    });
  }, [id]);

  const formSchema = !id ? formSchemaCreate : formSchemaEdit;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      nim: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const record: Partial<StudentsRecord & { passwordConfirm: string }> = {
        name: values.name,
        nim: values.nim,
        email: values.email,
        password: values.password ? values.password : undefined,
        passwordConfirm: values.password ? values.password : undefined, // Pocketbase requires passwordConfirm when setting password
        emailVisibility: true, // Set email visibility to true by default
      };

      if (!id) {
        await createRecord(record);
      } else {
        await updateRecord(id, record);
      }
      navigate(-1);
      toast.success("Student updated successfully");
    } catch (error) {
      toast.error(`Failed to update student. ${error}`);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h1 className="text-xl">{id ? "Edit" : "Create"} Student</h1>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name*</FormLabel>
              <FormControl>
                <Input placeholder="Student Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nim"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NIM*</FormLabel>
              <FormControl>
                <Input maxLength={12} placeholder="06XXXXXXXXXX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email*</FormLabel>
              <FormControl>
                <Input
                  disabled={!!id}
                  placeholder="yourrmail@mail.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password{!id && "*"}</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2Icon className="animate-spin" />
              Saving...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Form>
  );
}
