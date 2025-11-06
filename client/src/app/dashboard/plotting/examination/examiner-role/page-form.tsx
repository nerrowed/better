import { zodResolver } from '@hookform/resolvers/zod';
import { get, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import usePocketbase from '@/hooks/use-pocketbase';
import { useNavigate, useParams } from 'react-router';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Loader2Icon } from 'lucide-react';
import { formSchema } from './page-form.schema';
import type { FinaleExamExaminerRoleRecord } from '@/types/pocketbase';

export default function FormFinaleExamExaminerRole() {
  const id = useParams().id as string;
  const navigate = useNavigate();
  const { updateRecord, getOneRecord, isLoading, createRecord } = usePocketbase(
    'finale_exam_examiner_role'
  );

  useEffect(() => {
    if (!id) return;
    getOneRecord(id).then(res => {
      form.reset({
        role: get(res, 'role', ''),
      });
    });
  }, [id]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const record: Partial<FinaleExamExaminerRoleRecord> = {
        role: values.role,
      };

      if (!id) {
        await createRecord(record);
      } else {
        await updateRecord(id, record);
      }
      navigate(-1);
      toast.success('Student updated successfully');
    } catch (error) {
      toast.error(`Failed to update student. ${error}`);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h1 className="text-xl">{id ? 'Edit' : 'Create'} Peran Penguji</h1>
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Peran Penguji*</FormLabel>
              <FormControl>
                <Input placeholder="Peran Penguji" {...field} />
              </FormControl>
              <FormDescription>
                Buat sependek mungkin agar form <b>plotting jadwal sidang</b> tetap rapi.
              </FormDescription>
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
            'Submit'
          )}
        </Button>
      </form>
    </Form>
  );
}
